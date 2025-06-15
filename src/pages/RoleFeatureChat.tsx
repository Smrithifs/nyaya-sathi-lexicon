import React, { useState, useRef, useEffect } from "react";
import { groqCompletion } from "@/utils/groqApi";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  function getSystemPrompt() {
    if (featureName === "Legal Q&A (NyayaBot)" && role === "student") {
      return systemPrompts["Legal Q&A (NyayaBot)_student"];
    }
    return systemPrompts[featureName] || "You are LegalOps AI.";
  }

  function getWelcomePrompt(feature: string, role: "lawyer" | "student") {
    return `You are using LegalOps AI — a highly responsive legal assistant for Indian ${role === "lawyer" ? "lawyers" : "law students"}.
This feature: ${feature}. Please provide your input, or ask a question.`;
  }

  // Utility to render markdown and highlight important sections (bold headings) in AI responses
  function renderMessage(text: string) {
    // Remove ** syntax and render pseudo-markdown headings and bolds
    let html = text
      // Replace **Title:** or **Section X** with <b>Title:</b>
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      // Headings: "Facts:", "Issues:", "Judgment:" etc. (if starts line), make bold
      .replace(/^([A-Z][\w\s/]+:)/gm, "<b>$1</b>")
      // List formatting
      .replace(/\n\* (.+?)(?=\n|$)/g, "<li>$1</li>")
      // Double newline = paragraph
      .replace(/\n{2,}/g, "<br/><br/>")
      // Single newline = line break
      .replace(/\n/g, "<br/>");
    // Wrap lists in <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="pl-4 list-disc">$1</ul>');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: Message = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    setLoading(true);
    try {
      const context = messages
        .map(m => (m.sender === "user" ? `User: ${m.text}` : `AI: ${m.text}`))
        .join("\n")
        + `\nUser: ${input}`;

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

  // Scroll to bottom on new message
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight + 40;
    }
  }, [messages.length]);

  // Handle copy to clipboard for AI message
  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\*\*/g, "")); // remove markdown bold
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1400);
    } catch (e) {
      // Ignore for now
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full min-h-screen">
      {/* Back Button */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 bg-white/95 shadow-sm min-h-[60px]">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-gray-700 font-medium px-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <span className="ml-2 text-lg font-bold text-gray-800 font-serif">{featureName}</span>
      </div>

      {/* Chat Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-0 py-6 bg-white"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="relative w-full group">
              <div
                className={
                  msg.sender === "ai"
                    ? "bg-white text-gray-900 font-medium px-5 py-4 rounded-xl rounded-tl-md shadow-sm border border-gray-200 text-left"
                    : "bg-blue-50 text-blue-900 font-medium px-5 py-4 rounded-xl rounded-tr-md shadow-sm border border-blue-200 text-right"
                }
                style={msg.sender === "user"
                  ? { background: "#f5f7ff", color: "#114088" }
                  : {}
                }
              >
                {msg.sender === "ai"
                  ? renderMessage(msg.text)
                  : <span className="font-semibold">{msg.text}</span>
                }
              </div>
              {/* Show Copy Button for AI messages only */}
              {msg.sender === "ai" && (
                <button
                  className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 shadow group/copy text-gray-500 transition-all"
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
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="bg-white border-t border-gray-200 px-4 py-4 flex gap-2 items-center shadow"
        style={{ minHeight: "64px" }}
      >
        <input
          className="w-full bg-white text-gray-950 rounded-md px-3 py-2 border border-gray-300 focus:outline-none"
          placeholder="Type your query or details here…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <Button type="submit" disabled={loading || !input.trim()} className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700">
          {loading ? "Thinking..." : "Send"}
        </Button>
      </form>
    </div>
  );
}

function getWelcomePrompt(feature: string, role: "lawyer" | "student") {
  // Used on init/new feature select
  if (feature === "Legal Q&A (NyayaBot)" && role === "student") {
    return "You are using LegalOps AI (Law Student Mode): Ask any law question, and I’ll reply in simple language and analogies. Please enter your question below.";
  }
  if (feature === "Legal Q&A (NyayaBot)" && role === "lawyer") {
    return "You are using LegalOps AI (Lawyer Mode): Enter any legal query, and get authoritative answers with sections and Indian law context. Please enter your question below.";
  }
  // Custom per-feature
  return `You are using the feature: ${feature}. Please provide input to proceed.`;
}

export default RoleFeatureChat;
