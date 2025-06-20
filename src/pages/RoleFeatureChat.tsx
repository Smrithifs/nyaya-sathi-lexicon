import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, Plus } from "lucide-react";
import Flashcard from "@/components/Flashcard";
import DocumentUpload from "@/components/DocumentUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { askPuter } from "@/utils/openaiApi";

// Maps for system prompts per-feature:
const systemPrompts: Record<string, string> = {
  "Contract Generator": "You are LegalOps AI. Guide an Indian lawyer to generate a professional contract using Mixtral/Mistral. Ask for contract type, parties' names, date, jurisdiction, clauses, then output a legally formatted doc. End with the legal disclaimer.",
  "Legal Q&A (NyayaBot)": "You are LegalOps AI, an expert in Indian law with document analysis capabilities. When users reference uploaded documents (like 'document 1', 'first document', etc.), analyze the provided document content. You can summarize, explain legal terms, compare documents, and answer questions about their legal implications. Always cite applicable Indian law sections and provide examples. End with legal disclaimer: 'This is an AI-generated legal response and not a substitute for professional legal advice.'",
  "Case Law Finder": "🔍 You are a senior legal researcher trained in Indian jurisprudence. Generate landmark Indian case law summaries for Supreme Court or High Court judgments. Follow the exact structure: Case Title, Citation (AIR/SCC/SCR), Date, Court & Bench, then 5 sections: Summary of Facts (300+ words), Legal Issues (200+ words), Judgment & Holding (400+ words), Ratio Decidendi (300+ words), Legal Significance (200+ words). Each case minimum 1200 words. Only Indian-origin judgments. Academic/textbook format. End with disclaimer.",
  "Case Brief Generator": "🔍 You are a senior legal researcher trained in Indian jurisprudence. Generate comprehensive Indian case briefs following this EXACT structure: ▶ CASE TITLE, ▶ CITATION (AIR/SCC/SCR), ▶ DATE OF JUDGMENT, ▶ COURT & BENCH, then 5 numbered sections: 1. SUMMARY OF FACTS (300+ words), 2. LEGAL ISSUES INVOLVED (200+ words), 3. JUDGMENT & HOLDING (400+ words), 4. RATIO DECIDENDI (300+ words), 5. LEGAL SIGNIFICANCE (200+ words). Minimum 1200 words per case. Only verified Indian constitutional/statutory references. Academic textbook style. End with disclaimer.",
  "Section Explainer": "You are LegalOps AI. Explain any IPC/CrPC/CPC/etc. section in simple English, including punishment, example, and related sections. End with legal disclaimer.",
  "Bare Act Navigator": "You are LegalOps AI. Let users jump to any section/chapter, show collapsible summaries/internal links. End with disclaimer.",
  "Legal Draft Templates": "You are LegalOps AI. Ask for doc type (Affidavit, Will, Notice, etc.), parties, and autofill details. Output editable legal draft. End with disclaimer.",
  "Voice Dictation → Legal Format": "You are LegalOps AI. Take raw voice transcription and output a legally formatted, grammatical statement. End with disclaimer.",
  "Multi-Language Support": "You are LegalOps AI. Translate legal answers or documents into Hindi/Kannada/Tamil/Telugu/Marathi, retaining tone. Ask for language if needed. End with disclaimer.",
  "Citation Checker": "You are LegalOps AI with document analysis capabilities. Check Indian case citation/title for status and analyze uploaded documents for citation validity. When users reference uploaded documents, verify citations within them and provide status reports. Simulate Overruled/Followed/Valid if not verifiable. End with disclaimer.",
  "Client Brief Summary Tool": "You are LegalOps AI with document analysis capabilities. Accept facts/PDF/Word digest from uploaded documents and return a 5-line summary of Facts, Issues, Defense, Judgment, Relevance. When users reference uploaded documents, analyze and summarize their content. Flag if document unclear. End with disclaimer.",
  "Hearing/Deadline Tracker": "You are LegalOps AI. Accept court date/case name, return a reminder and a Google Calendar format string. End with disclaimer.",
  // Student tools:
  "Topic-Wise Quiz Generator": "You are LegalOps AI. Ask for legal subject/topic. Output 5 MCQs with answers and brief explanations for each. End with disclaimer.",
  "Case Brief Generator_student": "🔍 You are a senior legal researcher trained in Indian jurisprudence, explaining to law students. Generate student-friendly Indian case briefs following this EXACT structure: ▶ CASE TITLE, ▶ CITATION (AIR/SCC/SCR), ▶ DATE OF JUDGMENT, ▶ COURT & BENCH, then 5 numbered sections: 1. SUMMARY OF FACTS (300+ words with simple explanations), 2. LEGAL ISSUES INVOLVED (200+ words with analogies), 3. JUDGMENT & HOLDING (400+ words with step-by-step reasoning), 4. RATIO DECIDENDI (300+ words with examples), 5. LEGAL SIGNIFICANCE (200+ words with exam relevance). Minimum 1200 words per case. Use simple language while maintaining legal accuracy. Academic textbook style suitable for students. End with disclaimer.",
  "Flashcards (Legal Terms)": "You are LegalOps AI. Ask for a topic, return 5 flashcards as Q&A. End with disclaimer.",
  "Syllabus Tracker": "You are LegalOps AI. Ask for subjects and semester duration, output a weekly study plan with checkboxes for status. End with disclaimer.",
  "Law News Digest": "You are LegalOps AI. Output a weekly digest of top 5 legal news in India, under 50 words per item, source links (mock OK). End with disclaimer.",
  "Doubt Forum (Ask Senior)": "You are LegalOps AI, simulating a senior law student mentor. Accept question, mentor with sections/examples and encouragement. End with disclaimer.",
  "Mock Test Generator": "You are LegalOps AI. Ask for topic/subject. Output 10-20 MCQs/short Qs, provide answer key at end. End with disclaimer.",
  "Study Plan Generator": "You are LegalOps AI. Ask for weeks till exam and subjects, return weekly plan. Add motivational quotes. End with disclaimer.",
  "Legal Q&A (NyayaBot)_student": "You are LegalOps AI in student mode with document analysis capabilities. When users reference uploaded documents, provide simplified explanations using analogies and step-by-step breakdowns. Analyze document content for legal terms, explain concepts in simple language, and help with document comprehension. End with disclaimer.",
  "Case Explainer": "You are LegalOps AI. Ask case name, produce diagram/flow summary, key points, and exam tips. End with disclaimer.",
};

const FLASHCARD_FEATURE = "Flashcards (Legal Terms)";

interface UploadedDocument {
  id: string;
  filename: string;
  type: string;
  content: string;
  size: number;
  uploadedAt: string;
}

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
  const [showUpload, setShowUpload] = useState(false);

  // Document upload states
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const { toast } = useToast();

  // Check if this feature supports document upload
  const supportsDocumentUpload = ["Legal Q&A (NyayaBot)", "Citation Checker", "Client Brief Summary Tool"].includes(featureName);

  function getSystemPrompt() {
    if (featureName === "Legal Q&A (NyayaBot)" && role === "student") {
      return systemPrompts["Legal Q&A (NyayaBot)_student"];
    }
    if (featureName === "Case Brief Generator" && role === "student") {
      return systemPrompts["Case Brief Generator_student"];
    }
    return systemPrompts[featureName] || "You are LegalOps AI.";
  }

  // Handle document uploads
  const handleDocumentsUploaded = (documents: UploadedDocument[]) => {
    setUploadedDocuments(prev => [...prev, ...documents]);
    setShowUpload(false);
  };

  const handleRemoveDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast({
      title: "Document removed",
      description: "Document has been removed from this session",
    });
  };

  // Create document context for AI
  const createDocumentContext = () => {
    if (uploadedDocuments.length === 0) return "";
    
    const documentInfo = uploadedDocuments.map((doc, index) => {
      return `Document ${index + 1} (${doc.filename}):\n${doc.content}\n---\n`;
    }).join("\n");

    return `\n\nUploaded Documents Context:\n${documentInfo}`;
  };

  // *** FLASHCARD PARSER ***
  function parseFlashcards(aiText: string): { question: string, answer: string }[] | null {
    if (featureName !== FLASHCARD_FEATURE) return null;
    const parts = aiText.split(/\*\*Flashcard \d+\*\*/).filter(Boolean);
    if (!parts.length) return null;
    const flashcards = parts.map(block => {
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

  // Simple markdown-like converter for AI (code block, bold, list, line breaks)
  function renderAiMarkup(text: string) {
    // Add safety check for undefined or null text
    if (!text || typeof text !== 'string') {
      return '';
    }

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
    if (!input.trim() || loading) return;
    
    // Add document context to the user input if documents are uploaded
    let userInput = input;
    const documentContext = createDocumentContext();
    if (documentContext && supportsDocumentUpload) {
      userInput += documentContext;
    }
    
    const newMsg: Message = { sender: "user", text: input }; // Display only the user's actual input
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    setLoading(true);
    
    try {
      const context = messages
        .map(m => (m.sender === "user" ? `User: ${m.text}` : `AI: ${m.text}`))
        .join("\n") + `\nUser: ${userInput}`; // Include document context in AI context

      const systemPrompt = getSystemPrompt();
      const fullPrompt = `${systemPrompt}\n\nConversation Context:\n${context}`;

      const result = await askPuter(fullPrompt);

      setMessages((msgs) => [...msgs, { sender: "ai", text: result }]);
    } catch (err: any) {
      console.error('Chat error:', err);
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
    const lastUser = [...messages].reverse().find(m => m.sender === "user");
    if (!lastUser) return;
    setRegenerating(true);
    setLoading(true);
    try {
      const context = messages
        .filter((_, i, arr) => i < arr.lastIndexOf(lastUser))
        .map(m => (m.sender === "user" ? `User: ${m.text}` : `AI: ${m.text}`))
        .join("\n") + `\nUser: ${lastUser.text}`;
      
      const systemPrompt = getSystemPrompt();
      const fullPrompt = `${systemPrompt}\n\nConversation Context:\n${context}`;

      const result = await askPuter(fullPrompt);

      const baseMsgs = messages.slice(0, messages.lastIndexOf(lastUser) + 1);
      setMessages([...baseMsgs, { sender: "ai", text: result }]);
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
          {supportsDocumentUpload && (
            <div className="text-xs text-blue-600">📄 Document analysis enabled</div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto flex flex-col px-2 md:px-0 pb-36"
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

      {/* Document Upload Modal */}
      {showUpload && supportsDocumentUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Documents</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpload(false)}
                >
                  ✕
                </Button>
              </div>
              <DocumentUpload
                onDocumentsUploaded={handleDocumentsUploaded}
                uploadedDocuments={uploadedDocuments}
                onRemoveDocument={handleRemoveDocument}
              />
            </div>
          </div>
        </div>
      )}

      {/* Input box */}
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
            placeholder={
              supportsDocumentUpload && uploadedDocuments.length > 0
                ? "Ask about your documents: 'Summarize document 1', 'Compare doc 1 and 2'..."
                : "Type your query or details here…"
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          {supportsDocumentUpload && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(true)}
              className="px-3 py-2.5 rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl mt-2 md:mt-0"
          >
            {loading ? (regenerating ? "Regenerating..." : "Send") : "Send"}
          </Button>
        </div>
      </form>

      {/* Regenerate/Back actions */}
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
    return "You are using LegalOps AI — a highly responsive legal assistant for Indian law students with document analysis capabilities. Click the + button to upload documents (PDF, DOCX, TXT, images) for AI-powered summaries, explanations, and legal insights. Ask questions like 'Summarize document 1' or 'Explain the legal terms in document 2'.";
  }
  if (feature === "Legal Q&A (NyayaBot)" && role === "lawyer") {
    return "You are using LegalOps AI — a highly responsive legal assistant for Indian lawyers with advanced document analysis. Click the + button to upload multiple documents for AI-powered analysis, summarization, and legal insights. Reference documents in your queries for detailed analysis and comparisons.";
  }
  if (feature === "Citation Checker") {
    return "You are using the Citation Checker tool. Click the + button to upload legal documents to verify citations within them, or simply enter case citations to check their current legal status.";
  }
  if (feature === "Client Brief Summary Tool") {
    return "You are using the Client Brief Summary Tool. Click the + button to upload case documents, briefs, or legal files for AI-powered analysis and summarization into clear, structured summaries.";
  }
  if (feature === "Case Brief Generator") {
    return `🔍 You are using the Case Brief Generator - designed for ${role === "lawyer" ? "practicing advocates and legal professionals" : "law students and judiciary aspirants"}. Generate comprehensive Indian Supreme Court/High Court case briefs following textbook format: Case Title, Citation (AIR/SCC/SCR), Facts (300+ words), Legal Issues (200+ words), Judgment (400+ words), Ratio Decidendi (300+ words), Legal Significance (200+ words). Minimum 1200 words per case. Input examples: "Kesavananda Bharati case", "Article 21 cases 2020", "Triple Talaq judgment".`;
  }
  return `You are using the feature: ${feature}. Please provide input to proceed.`;
}

export default RoleFeatureChat;
