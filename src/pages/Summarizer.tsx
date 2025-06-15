
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

function fakeTranslate(text: string, lang: string) {
  if (lang === "hi") return "यह डेमो हिंदी में अनुवाद है: " + text.slice(0, 80) + "...";
  if (lang === "kn") return "ಇದು ಕನ್ನಡದಲ್ಲಿ ಡೆಮೋ ಅನುವಾದ: " + text.slice(0, 80) + "...";
  return text;
}

const Summarizer = () => {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [clauses, setClauses] = useState<string[] | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSummary(fakeTranslate("This is a summary of your document.", lang));
      setClauses([
        fakeTranslate("Clause 1: Example Clause Text.", lang),
        fakeTranslate("Clause 2: Another Key Point.", lang),
      ]);
      setExplanation(fakeTranslate("This explanation breaks down your legal document in easy terms.", lang));
      setLoading(false);
      toast({ title: "Summarization complete!", description: `Your summary is available in ${languages.find(l => l.code===lang)?.label}` });
    }, 1250);
  };

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
              {loading ? "Summarizing..." : "Get Summary"}
            </Button>
          </div>
        </form>
        {summary && (
          <div className="mt-8 space-y-6 border-t pt-6">
            <div>
              <h3 className="font-semibold mb-1">Summary</h3>
              <div className="text-muted-foreground">{summary}</div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Key Clauses</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {clauses?.map((clause, idx) => <li key={idx}>{clause}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Explanation</h3>
              <div className="text-muted-foreground">{explanation}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Summarizer;

