
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

// Simple bullet-point generator simulating AI
function makeBulletSummary(text: string, lang: string): string[] {
  // Use text length, presence of keywords, etc. to generate dummy data.
  let baseBullets = [
    "You have certain obligations outlined in this document.",
    "You have specific rights you may exercise.",
    "Be aware of key deadlines and time limits.",
    "You may face risks or penalties for non-compliance.",
    "Contact the other party in writing if you have concerns.",
    "Keep a record of all relevant documents and agreements."
  ];

  // Demo translation
  if (lang === "hi") {
    baseBullets = [
      "इस दस्तावेज़ में आपके कुछ दायित्व निर्धारित किए गए हैं।",
      "आपको कुछ विशिष्ट अधिकार दिए गए हैं।",
      "मुख्य समय सीमाओं और डेडलाइनों का ध्यान रखें।",
      "अनुचित व्यवहार या उल्लंघन पर जोखिम या दंड हो सकता है।",
      "यदि कोई चिंता है तो लिखित में संपर्क करें।",
      "सभी दस्तावेज़ और समझौतों की प्रतिलिपि रखें।",
    ];
  } else if (lang === "kn") {
    baseBullets = [
      "ಈ ದಾಖಲೆಗಳಲ್ಲಿ ನಿಮ್ಮಕೊಂದಿಗೆ ಕೆಲವು ಕಟುಬದ್ಧತೆಗಳು ಒಳಗೊಂಡಿವೆ.",
      "ನಿಮ್ಮಗೆ ಕೆಲವು ನಿರ್ದಿಷ್ಟ ಹಕ್ಕುಗಳು ಕಲ್ಪಿಸಲಾಗಿದೆ.",
      "ಪ್ರಮುಖ ಸಮಯ ಮಿತಿ ಮತ್ತು ಗಡುವುಗಳನ್ನು ಗಮನಿಸಿ.",
      "ಮಿತವ್ಯಯ ಪಾಲಿಸದಿದ್ದರೆ ಅಪಾಯಗಳು ಅಥವಾ ದಂಡಗಳಿರಬಹುದು.",
      "ಯಾವುದೇ ತೊಂದರೆ ಇದ್ದರೆ ಬರವಣಿಗೆಯಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ.",
      "ಎಲ್ಲ ದಾಖಲೆಗಳು ಮತ್ತು ಒಪ್ಪಂದಗಳ ನಕಲು ಹುದ್ದಿಸಿ.",
    ];
  }

  // Always return 4-6 random bullet points for demo.
  const numBullets = Math.floor(Math.random() * 3) + 4; // 4-6
  // Shuffle & slice
  const shuffled = baseBullets.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numBullets);
}

// Dummy clause and explanation translation
function fakeTranslate(text: string, lang: string) {
  if (lang === "hi") return "यह डेमो हिंदी में अनुवाद है: " + text.slice(0, 80) + "...";
  if (lang === "kn") return "ಇದು ಕನ್ನಡದಲ್ಲಿ ಡೆಮೋ ಅನುವಾದ: " + text.slice(0, 80) + "...";
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
      setBullets(makeBulletSummary(input, lang));
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
