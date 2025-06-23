
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import DocumentUploader from "@/components/legal/DocumentUploader";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

const Summarizer = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();

  const handleDocumentUploaded = (extractedText: string) => {
    setInput(extractedText);
    setShowUploader(false);
    toast({
      title: "Document Uploaded",
      description: "Text has been extracted and added for summarization."
    });
  };

  async function handleSummarize(e: React.FormEvent) {
    e.preventDefault();
    
    if (!geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key to use this feature.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setOutput(null);
    try {
      const langStr = lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Kannada";
      const prompt = `You are a professional legal AI assistant for India. Respond in clear, well-formatted markdown.

Summarize the following legal document into concise bullet points (6-8), identify at least 3 key clauses with brief explanations, and provide a plain-language summary for a layperson.

- The plain-language summary should be up to 200 words.
- If the user requests a non-English language, translate all outputs accordingly.
- Make the summary strictly relevant, actionable, and never hallucinate information.

LANGUAGE: ${langStr}

DOCUMENT:
${input}`;

      const summary = await callGeminiAPI(prompt, geminiKey);
      setOutput(summary);
      toast({ title: "Summarization complete!", description: `Your summary is available in ${languages.find(l => l.code === lang)?.label}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 min-h-screen" style={{ background: 'var(--ivo-background)' }}>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")} className="ivo-btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>
        <h1 className="ivo-text-heading">Legal Document Summarizer</h1>
      </div>

      <Card className="ivo-card w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: 'var(--ivo-primary)' }}>Legal Document Summarizer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSummarize} className="space-y-6">
            <div className="flex justify-between items-center">
              <label htmlFor="document-input" className="text-sm font-medium">Legal Document Text</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowUploader(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            
            <Textarea
              id="document-input"
              className="w-full min-h-[150px] rounded-2xl border-2"
              style={{ borderColor: 'var(--ivo-gray-200)' }}
              placeholder="Paste contract, policy, or other legal text here..."
              value={input}
              onChange={e => setInput(e.target.value)}
              required
              disabled={loading}
            />
            
            <div className="flex items-center gap-6">
              <label htmlFor="lang" className="font-semibold" style={{ color: 'var(--ivo-primary)' }}>Output Language:</label>
              <select
                id="lang"
                className="border-2 rounded-xl px-4 py-2"
                style={{ borderColor: 'var(--ivo-gray-200)' }}
                value={lang}
                onChange={e => setLang(e.target.value)}
                disabled={loading}
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <Button type="submit" disabled={loading} className="ivo-btn-primary">
                {loading ? "Summarizing..." : "Summarize Document"}
              </Button>
            </div>
          </form>
          
          {showUploader && (
            <div className="mt-6">
              <DocumentUploader
                onDocumentProcessed={handleDocumentUploaded}
                onClose={() => setShowUploader(false)}
              />
            </div>
          )}
          
          {output && (
            <div className="mt-8 space-y-6 border-t pt-8 prose prose-lg max-w-none break-words" style={{ borderColor: 'var(--ivo-gray-200)' }}>
              <div dangerouslySetInnerHTML={{ __html: marked(output) }} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Summarizer;
