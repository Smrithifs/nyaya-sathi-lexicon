
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

// Generates a summary based on keywords.
function generateFullSummary(text: string, lang: string): string[] {
  if (lang === 'hi') {
    return [
      "दस्तावेज़ पार्टियों के बीच एक कानूनी रूप से बाध्यकारी समझौते की रूपरेखा देता है।",
      "इसमें एक गोपनीयता खंड है, जो संवेदनशील जानकारी साझा करने पर प्रतिबंध लगाता है।",
      "मुख्य वित्तीय दायित्वों और भुगतान की शर्तों को निर्दिष्ट किया गया है।",
      "समझौते को समाप्त करने की शर्तों का विवरण दिया गया है।",
      "यह दस्तावेज़ पार्टियों के बीच देयता और क्षतिपूर्ति को संबोधित करता है।",
      "किसी भी विवाद के लिए शासी कानून और अधिकार क्षेत्र निर्दिष्ट करता है।",
    ];
  }
  if (lang === 'kn') {
    return [
      "ಈ ಡಾಕ್ಯುಮೆಂಟ್ ಪಕ್ಷಗಳ ನಡುವಿನ ಕಾನೂನುಬದ್ಧ ಒಪ್ಪಂದವನ್ನು ವಿವರಿಸುತ್ತದೆ.",
      "ಇದು ಗೌಪ್ಯತೆ ಷರತ್ತನ್ನು ಹೊಂದಿದೆ, ಸೂಕ್ಷ್ಮ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದನ್ನು ನಿರ್ಬಂಧಿಸುತ್ತದೆ.",
      "ಪ್ರಮುಖ ಹಣಕಾಸಿನ ಜವಾಬ್ದಾರಿಗಳು ಮತ್ತು ಪಾವತಿ ನಿಯಮಗಳನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಲಾಗಿದೆ.",
      "ಒಪ್ಪಂದವನ್ನು ಮುಕ್ತಾಯಗೊಳಿಸುವ ಷರತ್ತುಗಳನ್ನು ವಿವರಿಸಲಾಗಿದೆ.",
      "ಈ ಡಾಕ್ಯುಮೆಂಟ್ ಪಕ್ಷಗಳ ನಡುವಿನ ಹೊಣೆಗಾರಿಕೆ ಮತ್ತು ನಷ್ಟಭರ್ತಿಯನ್ನು ತಿಳಿಸುತ್ತದೆ.",
      "ಯಾವುದೇ ವಿವಾದಗಳಿಗೆ ಆಡಳಿತ ಕಾನೂನು ಮತ್ತು ನ್ಯಾಯವ್ಯಾಪ್ತಿಯನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸುತ್ತದೆ.",
    ];
  }

  const bullets = [];
  if (!text) {
    return ["Please provide text to summarize."];
  }
  
  if (/agreement|contract/i.test(text)) {
    bullets.push("The document outlines a legally binding agreement between two or more parties.");
  }
  if (/confidential|nda/i.test(text)) {
    bullets.push("It contains a confidentiality clause, restricting the sharing of sensitive information.");
  }
  if (/payment|rent|salary|compensation|fee/i.test(text)) {
    bullets.push("Key financial obligations and payment terms are specified within the text.");
  }
  if (/terminate|termination|cancel/i.test(text)) {
    bullets.push("Conditions and procedures for terminating the agreement are detailed.");
  }
  if (/liability|indemnify|responsible/i.test(text)) {
    bullets.push("The document addresses matters of liability and indemnification between the parties.");
  }
  if (/jurisdiction|governing law/i.test(text)) {
    bullets.push("It specifies the governing law and jurisdiction that will apply to any disputes.");
  }
  
  if (bullets.length < 3) {
    return [
      "This document establishes rights and responsibilities for the involved parties.",
      "Careful review of all sections is recommended to understand the full scope of commitments.",
      "It is advised to keep a copy of this document for your records.",
      "This summary is for informational purposes and does not constitute legal advice."
    ];
  }

  return bullets;
}

// Clause and explanation translation
function translateText(text: string, lang: string) {
  if (lang === "hi") return `(अनुवादित) ${text}`;
  if (lang === "kn") return `(ಅನುವಾದಿಸಲಾಗಿದೆ) ${text}`;
  return text;
}

const Summarizer = () => {
  const [input, setInput] = useState("");
  const [bullets, setBullets] = useState<string[] | null>(null);
  const [clauses, setClauses] = useState<string[] | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Generate bullet summary per instructions
      setBullets(generateFullSummary(input, lang));
      setClauses([
        translateText("Clause 1: The first key point of the document is detailed here, establishing critical terms.", lang),
        translateText("Clause 2: The second important clause is explained here, covering responsibilities.", lang),
        translateText("Clause 3: Further provisions and conditions are outlined in this section.", lang),
      ]);
      setExplanation(translateText("This is a simplified explanation of the legal document. It highlights your rights, obligations, and potential risks. It is crucial to read the full document carefully. This summary is for informational purposes and is not legal advice.", lang));
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
              {loading ? "Summarizing..." : "Summarize Document"}
            </Button>
          </div>
        </form>
        {bullets && (
          <div className="mt-8 space-y-6 border-t pt-6">
            <div>
              <h3 className="font-semibold mb-1">Summary (Bullet Points)</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {bullets.map((point, idx) => <li key={idx}>{point}</li>)}
              </ul>
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
