import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Gavel, Scale, Book, Badge, Users } from "lucide-react";
import OpenAIKeyInput from "../components/OpenAIKeyInput";
import { marked } from "marked";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

async function fetchQAAIAnswer(question: string, lang: string, openaiKey: string) {
  const prompt = `
Question: ${question}
Language: ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Kannada"}
Respond as a professional Indian law assistant. Clearly: 1) state the relevant law/section, 2) give an in-depth but clear explanation grounded in statutes, 3) provide an example with citation if possible, 4) always display a disclaimer that it is not legal advice. Respond in markdown, use bulleting/sections if necessary.
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are NyayaBot, an Indian law professional answering queries in a friendly, clear, and citation-based manner.",
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!res.ok) throw new Error("Failed to get answer from OpenAI. Please check your API key or try again.");

  const data = await res.json();
  return data.choices[0].message.content as string;
}

const QABot = () => {
  const [question, setQuestion] = useState("");
  const [lang, setLang] = useState("en");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyModal, setKeyModal] = useState(false);
  const { toast } = useToast();

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAnswer(null);
    const openaiKey = localStorage.getItem("openaiKey") || "";
    if (!openaiKey) {
      setKeyModal(true);
      setLoading(false);
      return;
    }
    try {
      const out = await fetchQAAIAnswer(question, lang, openaiKey);
      setAnswer(out);
      toast({ title: "Answer ready!", description: `The response is in ${languages.find(l => l.code === lang)?.label}` });
    } catch (err: any) {
      toast({ title: "OpenAI Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-0 min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-50 dark:from-blue-950 dark:via-gray-900 dark:to-yellow-900 transition-colors duration-500">
      <OpenAIKeyInput open={keyModal} onClose={() => setKeyModal(false)} />
      {/* Law/justice theme decorative SVGs (top left, bottom right) */}
      <div className="absolute left-0 top-0 opacity-20 text-blue-200 dark:text-blue-800 pointer-events-none select-none z-0 w-60 -rotate-12">
        <svg viewBox="0 0 120 120" fill="none">
          <Gavel size={80} className="mx-auto my-8 text-blue-300 dark:text-blue-800" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 opacity-20 text-yellow-200 dark:text-yellow-700 pointer-events-none select-none z-0 w-60 rotate-12">
        <svg viewBox="0 0 120 120" fill="none">
          <Book size={85} className="mx-auto my-8 text-yellow-300 dark:text-yellow-800" />
        </svg>
      </div>

      <main className="w-full max-w-2xl mx-auto relative z-10">
        {/* Legal theme header */}
        <header className="mb-7 flex flex-col items-center gap-2 animate-fade-in">
          <div className="flex flex-row items-center gap-2">
            <span className="rounded-full border-2 border-yellow-400 dark:border-yellow-700 bg-gradient-to-tr from-blue-50 via-yellow-100 to-yellow-300 dark:from-blue-950 dark:via-blue-700 dark:to-yellow-900 p-3 shadow-lg">
              <Scale size={38} className="text-yellow-500 dark:text-yellow-300" strokeWidth={2.2} />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-yellow-100 font-serif tracking-tight bg-gradient-to-r from-blue-800 via-yellow-800 to-yellow-600 bg-clip-text text-transparent">
              NyayaBot Q&amp;A
            </h1>
          </div>
          <p className="text-lg text-blue-700 dark:text-yellow-100 mt-2 font-medium text-center max-w-[24rem]">
            <span className="inline-flex items-center gap-1">
              <Badge size={20} className="inline-block text-yellow-500" />
              Friendly Indian Law Assistant &ndash; ask your legal question!
            </span>
          </p>
          <div className="flex flex-row gap-2 mt-1">
            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg px-3 py-1 text-xs font-bold uppercase shadow-sm">
              IPC
            </span>
            <span className="bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 rounded-lg px-3 py-1 text-xs font-bold uppercase shadow-sm">
              CrPC
            </span>
            <span className="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 rounded-lg px-3 py-1 text-xs font-bold uppercase shadow-sm">
              Contract Act
            </span>
          </div>
        </header>

        <Card className="w-full shadow-2xl border-2 border-blue-400 dark:border-blue-900 backdrop-blur bg-white/90 dark:bg-blue-950/90 relative z-10 rounded-2xl">
          <CardHeader className="pb-2 relative">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-blue-800 dark:text-blue-200">
              <Gavel size={28} className="text-blue-600 dark:text-blue-300" />
              Ask a Legal Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAsk} className="space-y-5">
              <Textarea
                className="w-full min-h-[70px] bg-blue-50/50 dark:bg-blue-900/30 focus:bg-blue-100/80 dark:focus:bg-blue-900/60 rounded border-2 border-blue-200 dark:border-blue-700 placeholder:text-blue-400/70 text-lg"
                placeholder='e.g., "What is theft under IPC?"'
                value={question}
                onChange={e => setQuestion(e.target.value)}
                required
                disabled={loading}
                maxLength={512}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <label htmlFor="qa-lang" className="font-medium text-sm text-blue-800 dark:text-blue-200">Output Language:</label>
                <select
                  id="qa-lang"
                  className="border rounded px-2 py-1 bg-blue-50 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-700 font-medium"
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  disabled={loading}
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 rounded shadow transition-all"
                >
                  <Scale className="w-5 h-5 inline-block -ml-1" />
                  {loading ? "Thinking..." : "Get NyayaBot's Answer"}
                </Button>
              </div>
            </form>
            {answer && (
              <div className="mt-10 animate-fade-in" key={answer}>
                <div className="mb-2 flex items-center gap-2">
                  <Book className="w-5 h-5 text-yellow-700 dark:text-yellow-200" />
                  <span className="font-semibold text-blue-900 dark:text-yellow-100 italic">NyayaBot’s Official Response</span>
                </div>
                <div className="rounded-xl py-6 px-7 bg-gradient-to-br from-yellow-50 via-blue-50 to-yellow-100 dark:from-blue-900 dark:via-blue-950 dark:to-yellow-900 border-2 border-yellow-300 dark:border-yellow-800 shadow-inner leading-relaxed space-y-2 text-base whitespace-pre-line text-blue-900 dark:text-yellow-100 font-serif relative prose prose-base max-w-none">
                  {/* Markdown render of answer */}
                  <div dangerouslySetInnerHTML={{ __html: marked(answer) }} />
                  <div className="absolute -right-7 -bottom-5 rotate-12">
                    <Gavel size={30} className="text-blue-400 dark:text-blue-300 opacity-60" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="mt-10 text-center text-blue-600 dark:text-blue-200 text-xs opacity-70 animate-fade-in">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100/60 dark:bg-blue-900/50">
            <Users size={14} className="inline" />
            NyayaBot: For educational and informational use only. Not personal legal advice.
          </span>
        </footer>
      </main>
    </div>
  );
};

export default QABot;
