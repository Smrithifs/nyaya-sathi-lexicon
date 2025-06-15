
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

function fakeAnswer(question: string, lang: string) {
  let ans = "This is a sample legal answer. Section 10 of XYZ Act: Example content for your query.";
  if (/divorce/i.test(question)) {
    ans = "Section 13, Hindu Marriage Act: Divorce can be sought on grounds of ...";
  }
  if (lang === "hi") return "डेमो हिंदी उत्तर: " + ans;
  if (lang === "kn") return "ಡೆಮೋ ಕನ್ನಡ ಉತ್ತರ: " + ans;
  return ans;
}

const QABot = () => {
  const [question, setQuestion] = useState("");
  const [lang, setLang] = useState("en");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setAnswer(fakeAnswer(question, lang));
      setLoading(false);
      toast({ title: "Answer ready!", description: `The response is in ${languages.find(l=>l.code===lang)?.label}` });
    }, 1100);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border border-input">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Legal Q&amp;A Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAsk} className="space-y-4">
          <Textarea
            className="w-full min-h-[60px]"
            placeholder="Ask any Indian law question: e.g., 'What is the process for divorce?'"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            required
            disabled={loading}
          />
          <div className="flex items-center gap-4 mt-2">
            <label htmlFor="qa-lang" className="font-medium text-sm">Output Language:</label>
            <select
              id="qa-lang"
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
              {loading ? "Thinking..." : "Get Answer"}
            </Button>
          </div>
        </form>
        {answer && (
          <div className="mt-8 border-t pt-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">Answer:</div>
            <div className="text-base">{answer}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QABot;

