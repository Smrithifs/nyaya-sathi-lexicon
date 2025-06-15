import React, { useState, useRef, useEffect } from "react";
import { groqCompletion } from "@/utils/groqApi";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft } from "lucide-react";
import Flashcard from "@/components/Flashcard";
import { useToast } from "@/hooks/use-toast";

// Define the GROQ API key as requested
const GROQ_API_KEY = "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";

// Maps for system prompts per-feature:
const systemPrompts: Record<string, string> = {
  "Contract Generator": "You are LegalOps AI. Guide an Indian lawyer to generate a professional contract using Mixtral/Mistral. Ask for contract type, parties’ names, date, jurisdiction, clauses, then output a legally formatted doc. End with the legal disclaimer.",
  "Legal Q&A (NyayaBot)": "You are LegalOps AI. Answer Indian legal questions citing applicable law/sections and examples, never giving personal advice. End with legal disclaimer: 'This is an AI-generated legal response and not a substitute for professional legal advice.'",
  "Case Law Finder": "You are LegalOps AI. Ask for case law keywords or section numbers, output simulated results: case name, year, court, and 1-line summary. End with legal disclaimer.",
  "Section Explainer": "You are LegalOps AI. Explain any IPC/CrPC/CPC/etc. section in simple English, including punishment, example, and related sections. End with legal disclaimer.",
  "Bare Act Navigator": "You are LegalOps AI. Let users jump to any section/chapter, show collapsible summaries/internal links. End with disclaimer.",
  "Legal Draft Templates": "You are LegalOps AI. Ask for doc type (Affidavit, Will, Notice, etc.), parties, and autofill details. Output editable legal draft. End with disclaimer.",
  "Voice Dictation → Legal Format": "You are LegalOps AI. Take raw voice transcription and output a legally formatted, grammatical statement. End with disclaimer.",
  "Multi-Language Support": "You are LegalOps AI. Translate legal answers or documents into Hindi/Kannada/Tamil/Telugu/Marathi, retaining tone. Ask for language if needed. End with disclaimer.",
  "Citation Checker": "You are LegalOps AI. Check Indian case citation/title for status. Simulate Overruled/Followed/Valid if not verifiable. End with disclaimer.",
  "Client Brief Summary Tool": "You are LegalOps AI. Accept facts/PDF/Word digest and return a 5-line summary of Facts, Issues, Defense, Judgment, Relevance. Flag if document unclear. End with disclaimer.",
  "Hearing/Deadline Tracker": "You are LegalOps AI. Accept court date/case name, return a reminder and a Google Calendar format string. End with disclaimer.",
  // Student tools:
  "Topic-Wise Quiz Generator": "You are LegalOps AI. Ask for legal subject/topic. Output 5 MCQs with answers and brief explanations for each. End with disclaimer.",
  "Case Brief Generator": "You are LegalOps AI. Accept a case name, output: Facts, Issues, Judgment, Ratio, Exam importance. End with disclaimer.",
  "Flashcards (Legal Terms)": "You are LegalOps AI. Ask for a topic, return 5 flashcards as Q&A. End with disclaimer.",
  "Syllabus Tracker": "You are LegalOps AI. Ask for subjects and semester duration, output a weekly study plan with checkboxes for status. End with disclaimer.",
  "Law News Digest": "You are LegalOps AI. Output a weekly digest of top 5 legal news in India, under 50 words per item, source links (mock OK). End with disclaimer.",
  "Doubt Forum (Ask Senior)": "You are LegalOps AI, simulating a senior law student mentor. Accept question, mentor with sections/examples and encouragement. End with disclaimer.",
  "Mock Test Generator": "You are LegalOps AI. Ask for topic/subject. Output 10-20 MCQs/short Qs, provide answer key at end. End with disclaimer.",
  "Study Plan Generator": "You are LegalOps AI. Ask for weeks till exam and subjects, return weekly plan. Add motivational quotes. End with disclaimer.",
  "Legal Q&A (NyayaBot)_student": "You are LegalOps AI. Indian student mode: Answer legal queries with simplified language, analogies, and stepwise explanations, avoiding jargon. End with disclaimer.",
  "Case Explainer": "You are LegalOps AI. Ask case name, produce diagram/flow summary, key points, and exam tips. End with disclaimer.",
};
const FLASHCARD_FEATURE = "Flashcards (Legal Terms)";

interface RoleFeatureChatProps {
  featureName: string;
  role: "lawyer" | "student";
  onBack: () => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

const RoleFeatureChat: React.FC<RoleFeatureChatProps> = ({ featureName, role, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: getWelcomePrompt(featureName, role) }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // New state for file upload
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const { toast } = useToast();

  // Supported features for document upload
  const supportsDocumentUpload =
    featureName === "Legal Q&A (NyayaBot)" && role === "lawyer";

  function getSystemPrompt() {
    if (featureName === "Legal Q&A (NyayaBot)" && role === "student") {
      return systemPrompts["Legal Q&A (NyayaBot)_student"];
    }
    return systemPrompts[featureName] || "You are LegalOps AI.";
  }

  // *** FLASHCARD PARSER ***
  // Only for Flashcards feature and AI message
  function parseFlashcards(aiText: string): { question: string, answer: string }[] | null {
    // Look for "**Flashcard" or "Flashcard X" blocks
    if (featureName !== FLASHCARD_FEATURE) return null;
    const parts = aiText.split(/\*\*Flashcard \d+\*\*/).filter(Boolean);
    if (!parts.length) return null;
    const flashcards = parts.map(block => {
      // Look for Q: ...\nA: ...
      const qMatch = block.match(/Q:\s?([^\n]+)\n?/);
      const aMatch = block.match(/A:\s?([\s\S]+)/);
      if (!qMatch || !aMatch) return null;
      return {
        question: qMatch[1].trim(),
        answer: aMatch[1].trim().replace(/^<\/ul>/, "").replace(/<br\s*\/?>/g, "\n"),
      };
    }).filter(Boolean) as { question: string, answer: string }[];
    return flashcards.length ? flashcards : null;
  }

  // Markup for messages – chat bubbles (user right, ai left, visually distinct)
  function renderMessage(msg: Message, idx: number) {
    const isAi = msg.sender === "ai";
    const isWelcome = idx === 0 && isAi;

    // Only for Flashcard feature and AI msg (not welcome)
    if (
      featureName === FLASHCARD_FEATURE &&
      isAi &&
      !isWelcome &&
      parseFlashcards(msg.text)
    ) {
      const flashcards = parseFlashcards(msg.text)!;
      return (
        <div key={idx} className="flex flex-wrap gap-4 w-full justify-center py-4 animate-fade-in">
          {flashcards.map((f, i) => (
            <Flashcard
              key={i}
              question={f.question}
              answer={f.answer}
              colorIdx={i}
            />
          ))}
        </div>
      );
    }

    // Markup for messages – chat bubbles (user right, ai left, visually distinct)
    return (
      <div key={idx} className={`flex w-full ${isAi ? "justify-start" : "justify-end"}`}>
        <div
          className={
            "relative group max-w-[90vw] md:max-w-2xl w-fit break-words shadow border " +
            (isAi
              ? "bg-[#f7f7fa] text-gray-900 border-gray-200 ml-0 mr-auto rounded-2xl rounded-bl-md"
              : "bg-blue-600 text-white border-blue-100 ml-auto mr-0 rounded-2xl rounded-br-md"
            )
          }
          style={{
            padding: "1.1rem 1.3rem",
            marginTop: idx === 0 ? "0.4rem" : "0.8rem",
            fontSize: "1.13rem",
            position: "relative",
            minWidth: isAi ? 200 : 120,
          }}
        >
          {isAi ? (
            <span dangerouslySetInnerHTML={{ __html: renderAiMarkup(msg.text) }} />
          ) : (
            <span>{msg.text}</span>
          )}
          {isAi && !isWelcome && (
            <button
              className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 rounded-lg p-1 shadow text-gray-500 transition-all opacity-100"
              title={copiedIdx === idx ? "Copied" : "Copy"}
              onClick={() => handleCopy(msg.text, idx)}
            >
              {copiedIdx === idx ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Read file contents
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);

    const fileType = file.type;
    if (
      fileType === "application/pdf" ||
      file.name.endsWith(".pdf")
    ) {
      // PDF parsing (lazy-load pdfjs)
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      setFileContent(text);
      toast({ title: "PDF loaded", description: "Document is ready to send." });
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      // Word docx parsing (lazy-load mammoth)
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.convertToHtml({ arrayBuffer });
      setFileContent(value.replace(/<[^>]*>/g, "")); // Strip HTML to plain text
      toast({ title: "Word document loaded", description: "Document is ready to send." });
    } else if (
      fileType.startsWith("text/") ||
      file.name.endsWith(".txt")
    ) {
      // Plain text file
      const text = await file.text();
      setFileContent(text);
      toast({ title: "Text file loaded", description: "Document is ready to send." });
    } else {
      setAttachedFile(null);
      setFileContent(null);
      toast({ title: "Unsupported file", description: "Please upload PDF, DOCX, or TXT files.", variant: "destructive" });
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileContent(null);
  };

  // Simple markdown-like converter for AI (code block, bold, list, line breaks)
  function renderAiMarkup(text: string) {
    let html = text
      // basic bold
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      // code blocks
      .replace(/```([\s\S]+?)```/g, '<pre class="bg-gray-950 text-green-200 rounded-md overflow-x-auto p-3 my-2 text-sm">$1</pre>')
      // inline code
      .replace(/`([^`]+?)`/g, '<code class="bg-gray-200 text-gray-900 rounded px-1.5 py-0.5 text-xs">$1</code>')
      // section header
      .replace(/^([A-Z][\w\s/]+:)/gm, '<b>$1</b>')
      // unordered list items
      .replace(/\n\* (.+?)(?=\n|$)/g, "<li>$1</li>")
      // double newlines = break
      .replace(/\n{2,}/g, "<br/><br/>")
      // single newline
      .replace(/\n/g, "<br/>");
    // Wrap <li> in <ul> if any
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="pl-6 list-disc mb-1">$1</ul>');
    return html;
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if ((!input.trim() && !fileContent) || loading) return;
    let userInput = input;
    if (fileContent) {
      userInput += `\n\n---\nAttached Document Content (for summarization/explanation):\n${fileContent}\n---\n`;
    }
    const newMsg: Message = { sender: "user", text: userInput };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    setLoading(true);
    setAttachedFile(null);
    setFileContent(null);
    try {
      const context = messages
        .map(m => (m.sender === "user" ? `User: ${m.text}` : `AI: ${m.text}`))
        .join("\n") + `\nUser: ${userInput}`;

      const aiReply = await groqCompletion({
        apiKey: GROQ_API_KEY,
        prompt: context,
        systemInstruction: getSystemPrompt(),
        language: "English"
      });
      setMessages((msgs) => [...msgs, { sender: "ai", text: aiReply }]);
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: "Sorry, I couldn't process your request. Please try again!" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Regenerate (repeat last user input)
  async function handleRegenerate() {
    // Only allow if not currently generating and there is a user message to regen
    const lastUser = [...messages].reverse().find(m => m.sender === "user");
    if (!lastUser) return;
    setRegenerating(true);
    setLoading(true);
    try {
      const context = messages
        .filter((_, i, arr) => i < arr.lastIndexOf(lastUser)) // cut at previous user input
        .map(m => (m.sender === "user" ? `User: ${m.text}` : `AI: ${m.text}`))
        .join("\n") + `\nUser: ${lastUser.text}`;
      const aiReply = await groqCompletion({
        apiKey: GROQ_API_KEY,
        prompt: context,
        systemInstruction: getSystemPrompt(),
        language: "English"
      });
      // slice to just before last user, replay to that point then new user message, then new AI answer
      const baseMsgs = messages.slice(0, messages.lastIndexOf(lastUser) + 1);
      setMessages([...baseMsgs, { sender: "ai", text: aiReply }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: "Sorry, regeneration failed. Please try again!" }
      ]);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }

  // Scroll to bottom on new message
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight + 180;
    }
  }, [messages.length, loading]);

  // Copy button for AI message (no copy for welcome)
  const handleCopy = async (text: string, idx: number) => {
    try {
      // Remove markdown for clipboard
      await navigator.clipboard.writeText(text.replace(/\*\*/g, ""));
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1300);
    } catch (e) {}
  };

  // Copy/call logic – user can't copy welcome
  const isWelcomeMessage = (msg: Message, idx: number) =>
    idx === 0 && msg.sender === "ai";

  // Only show Regenerate/Back buttons if there's at least one AI response (not just welcome)
  const aiRespCount = messages.filter(
    (m, idx) => m.sender === "ai" && !isWelcomeMessage(m, idx)
  ).length;
  const canRegenerate = messages.some((m, i) => m.sender === "user" && (i <= messages.length - 2));

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white flex flex-col z-[100]">
      {/* Header */}
      <div className="sticky top-0 left-0 w-full z-20 bg-white/95 backdrop-blur flex items-center px-2 py-2 border-b border-gray-100" style={{ minHeight: 60 }}>
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-base font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <div className="ml-3">
          <div className="text-xl md:text-2xl font-bold text-gray-800 font-serif">{featureName}</div>
          {/* Short description placeholder; you can add if needed */}
        </div>
      </div>
      {/* Main chat area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto flex flex-col px-2 md:px-0 pb-36"
        // Increased bottom padding (pb-36) ensures input/actions never cover last message
        style={{
          minHeight: 0,
          background: "#fff",
          width: "100vw",
          maxWidth: "100vw",
          margin: 0,
        }}
      >
        <div className="flex flex-col justify-end w-full items-center md:items-center py-5">
          <div className="w-full max-w-2xl flex flex-col">
            {messages.map(renderMessage)}
          </div>
        </div>
      </div>
      {/* Input box (always visible, sticky bottom, above action buttons; z-30 ensures priority) */}
      <form
        onSubmit={handleSend}
        className="fixed bottom-[56px] left-0 w-full flex flex-col md:flex-row items-end gap-2 px-2 py-4 border-t bg-white z-30"
        style={{
          minHeight: 88,
          maxWidth: "100vw",
        }}
      >
        <div className="flex-1 flex flex-col">
          <input
            className="w-full h-[52px] max-h-[90px] text-lg bg-[#f7f7fa] text-gray-950 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none transition mb-2"
            placeholder="Type your query or details here…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          {/* Show attach file only for supported feature */}
          {supportsDocumentUpload && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium block">
                Attach a document
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="block mt-1"
                  onChange={handleFileChange}
                  disabled={loading || !!attachedFile}
                />
              </label>
              {attachedFile && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-700 font-bold">
                    {attachedFile.name}
                  </span>
                  <Button type="button" size="sm" variant="ghost" onClick={handleRemoveFile}>
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading || (!input.trim() && !fileContent)}
          className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl mt-2 md:mt-0"
        >
          {loading ? (regenerating ? "Regenerating..." : "Send") : "Send"}
        </Button>
      </form>

      {/* Regenerate/Back actions: now sticky at bottom, never overlaps input */}
      {aiRespCount > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-20 flex flex-row items-center justify-center gap-4 py-3 border-t bg-white shadow-2xl">
          <Button
            type="button"
            variant="outline"
            className="text-blue-700 font-bold"
            disabled={!canRegenerate || regenerating || loading}
            onClick={handleRegenerate}
          >
            🔁 Regenerate Response
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-gray-700 font-bold"
            onClick={onBack}
          >
            🔙 Back to Feature List
          </Button>
        </div>
      )}
    </div>
  );
}

function getWelcomePrompt(feature: string, role: "lawyer" | "student") {
  if (feature === "Legal Q&A (NyayaBot)" && role === "student") {
    return "You are using LegalOps AI — a highly responsive legal assistant for Indian law students. This feature: Legal Q&A (NyayaBot). Please provide your input, or ask a question.";
  }
  if (feature === "Legal Q&A (NyayaBot)" && role === "lawyer") {
    return "You are using LegalOps AI — a highly responsive legal assistant for Indian lawyers. This feature: Legal Q&A (NyayaBot). Please provide your input, or ask a question.";
  }
  return `You are using the feature: ${feature}. Please provide input to proceed.`;
}

export default RoleFeatureChat;
