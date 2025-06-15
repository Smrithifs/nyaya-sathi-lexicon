
import React, { useState, useRef, useEffect } from "react";
import { groqCompletion } from "@/utils/groqApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: Message = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    setLoading(true);
    try {
      // Concat last few exchanges to build context.
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
      // scroll to bottom for new message
      setTimeout(() => {
        containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      }, 100);
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight + 40;
    }
  }, [messages.length]);

  return (
    <Card className="w-full max-w-xl mx-auto bg-black/30 border-white/15 p-0 mb-7">
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/10">
        <span className="font-bold text-white/90">{featureName}</span>
        <Button variant="ghost" size="sm" className="text-blue-300 underline" onClick={onBack}>← Back to Features</Button>
      </div>
      <div
        ref={containerRef}
        className="px-4 py-4 max-h-[390px] min-h-[300px] overflow-y-auto space-y-4 bg-transparent"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.sender === "ai"
                ? "text-left bg-blue-50/10 text-blue-100 px-4 py-3 rounded-lg mb-2 whitespace-pre-line"
                : "text-right bg-yellow-100/20 text-yellow-200 px-4 py-3 rounded-lg mb-2 whitespace-pre-line"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 px-4 pb-4 pt-1 border-t border-white/10 items-center">
        <input
          className="w-full bg-gray-900/80 text-white rounded-md px-3 py-2 border border-white/10 focus:outline-none"
          placeholder="Type your query or details here…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <Button type="submit" disabled={loading || !input.trim()} className="px-4 py-2">
          {loading ? "Thinking..." : "Send"}
        </Button>
      </form>
    </Card>
  );
};

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
