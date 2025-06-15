
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";
import { groqSummarize } from "@/utils/groqApi";

// Static Groq API key as supplied by user. Only use in frontend for demo/testing.
const GROQ_API_KEY = "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";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

const Summarizer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSummarize(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    try {
      const langStr = lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Kannada";
      const prompt = `
Summarize the following legal document into concise bullet points (6-8), identify at least 3 key clauses with brief explanations, and provide a plain-language summary for a layperson.
If the user requests a non-English language, translate all outputs accordingly. Make the summary strictly relevant, actionable, and never hallucinate information.
LANGUAGE: ${langStr}

DOCUMENT:
${input}
      `.trim();

      const summary = await groqSummarize({
        apiKey: GROQ_API_KEY,
        prompt,
        systemInstruction: "You are a professional legal AI assistant for India. Respond in clear, well-formatted markdown."
      });
      setOutput(summary);
      toast({ title: "Summarization complete!", description: `Your summary is available in ${languages.find(l => l.code === lang)?.label}` });
    } catch (err: any) {
      toast({ title: "Groq Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
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
            <div dangerouslySetInnerHTML={{ __html: marked(output) }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Summarizer;
