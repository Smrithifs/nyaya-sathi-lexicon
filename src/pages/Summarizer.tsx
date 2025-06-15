
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import OpenAIKeyInput from "../components/OpenAIKeyInput";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

async function summarizeWithOpenAI(text: string, lang: string, openaiKey: string) {
  const prompt = `
Summarize the following legal document into concise bullet points (6-8), identify at least 3 key clauses with brief explanations, and provide a plain-language summary for a layperson.
If the user requests a non-English language, translate all outputs accordingly. Make the summary strictly relevant, actionable, and never hallucinate information. 
LANGUAGE: ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Kannada"}

DOCUMENT:
${text}
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
          content: "You are a professional legal AI assistant for India. Respond in clear, well-formatted markdown.",
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 1200,
    }),
  });

  if (!res.ok) throw new Error("Failed to get summary from OpenAI. Please check your API key or try again.");

  const data = await res.json();
  return data.choices[0].message.content as string;
}

const Summarizer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [keyModal, setKeyModal] = useState(false);
  const { toast } = useToast();

  async function handleSummarize(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    const openaiKey = localStorage.getItem("openaiKey") || "";
    if (!openaiKey) {
      setKeyModal(true);
      setLoading(false);
      return;
    }
    try {
      const res = await summarizeWithOpenAI(input, lang, openaiKey);
      setOutput(res);
      toast({ title: "Summarization complete!", description: `Your summary is available in ${languages.find(l => l.code === lang)?.label}` });
    } catch (err: any) {
      toast({ title: "OpenAI Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <OpenAIKeyInput open={keyModal} onClose={() => setKeyModal(false)} />
      <Card className="w-full max-w-2xl mx-auto shadow-lg border border-input">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Legal Document Summarizer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSummarize} className="space-y-4">
            <Textarea
              className="w-full min-h-[120px]"
              placeholder="Paste contract, policy, or other legal text here..."
              value={input}
              onChange={e => setInput(e.target.value)}
              required
              disabled={loading}
            />
            <div className="flex items-center gap-4 mt-2">
              <label htmlFor="lang" className="font-medium text-sm">Output Language:</label>
              <select
                id="lang"
                className="border rounded px-2 py-1"
                value={lang}
                onChange={e => setLang(e.target.value)}
                disabled={loading}
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <Button type="submit" disabled={loading}>
                {loading ? "Summarizing..." : "Summarize Document"}
              </Button>
            </div>
          </form>
          {output && (
            <div className="mt-8 space-y-6 border-t pt-6 prose prose-base max-w-none break-words">
              {/* Renders markdown output from OpenAI */}
              <div dangerouslySetInnerHTML={{ __html: window.marked ? (window as any).marked(output) : output.replace(/\n/g, "<br/>") }} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Summarizer;
