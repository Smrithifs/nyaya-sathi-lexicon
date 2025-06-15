import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Gavel, Scale } from "lucide-react";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

// New persona-based answer template for NyayaBot
function fakeNyayaBotAnswer(question: string, lang: string) {
  // Define sections and examples by question keyword
  let answerPart = {
    section: "",
    explanation: "",
    example: ""
  };

  if (/divorce/i.test(question)) {
    answerPart = {
      section: "Section 13, Hindu Marriage Act, 1955",
      explanation:
        "This section provides the grounds for seeking divorce in India, such as cruelty, adultery, desertion, conversion, mental disorder, etc.",
      example:
        "For example: If a spouse has deserted the other for a continuous period of not less than two years, a divorce can be sought under this act."
    };
  } else if (/theft|steal|stealing/i.test(question)) {
    answerPart = {
      section: "Section 378, Indian Penal Code (IPC)",
      explanation: "This section defines theft and specifies the punishment for stealing movable property with intent to take it dishonestly.",
      example:
        "For example: If someone takes your mobile phone without your consent and intends to keep it, they may be charged under Section 378 IPC."
    };
  } else if (/arrest/i.test(question)) {
    answerPart = {
      section: "Section 41, Criminal Procedure Code (CrPC)",
      explanation: "Section 41 CrPC outlines when a police officer may arrest a person without a warrant, such as when a cognizable offence is suspected.",
      example: "For example: If someone is found committing a theft, police can arrest without a warrant under Section 41."
    };
  } else {
    answerPart = {
      section: "Section 10, Indian Contract Act (1872)",
      explanation: "This section specifies the conditions for a valid contract in India, such as free consent, lawful consideration, and competent parties.",
      example: "For example: If two adults freely agree to exchange goods for money, it is generally a valid contract under this law."
    };
  }

  // Multi-language friendly greetings and templates
  const botName = {
    en: "NyayaBot",
    hi: "NyayaBot",
    kn: "NyayaBot"
  };

  const intro = {
    en: `👩‍⚖️ Hi, I am NyayaBot—a friendly, knowledgeable assistant trained in Indian laws such as the IPC, CrPC, and Indian Contract Act.`,
    hi: "👩‍⚖️ नमस्ते, मैं NyayaBot हूँ — एक मित्रवत और जानकार सहायक जो IPC, CrPC और भारतीय अनुबंध अधिनियम जैसे भारतीय कानूनों में प्रशिक्षित है।",
    kn: "👩‍⚖️ ನಮಸ್ಕಾರ, ನಾನು NyayaBot — IPC, CrPC ಮತ್ತು ಭಾರತೀಯ ಒಪ್ಪಂದ ಕಾಯ್ದೆಯಂತಹ ಭಾರತೀಯ ಕಾನೂನುಗಳಲ್ಲಿ ಪರಿಣತ ಸಹಾಯಕರಾಗಿದ್ದೇನೆ."
  };

  const citation = {
    en: `**Relevant Law Section:** ${answerPart.section}`,
    hi: `**प्रासंगिक कानूनी खंड:** ${answerPart.section}`,
    kn: `**ಸಂಬಂಧಿತ ಕಾನೂನು ವಿಭಾಗ:** ${answerPart.section}`
  };

  const explain = {
    en: `**Explanation:** ${answerPart.explanation}`,
    hi: `**स्पष्टीकरण:** ${answerPart.explanation}`,
    kn: `**ವಿವರಣೆ:** ${answerPart.explanation}`
  };

  const eg = {
    en: `**Example:** ${answerPart.example}`,
    hi: `**उदाहरण:** ${answerPart.example}`,
    kn: `**ಉದಾಹರಣೆ:** ${answerPart.example}`
  };

  const disclaimer = {
    en: "*(This is for educational purposes only and is not personal legal advice. For specific situations, consult a qualified lawyer.)*",
    hi: "*(यह केवल शैक्षिक उद्देश्य हेतु है, व्यक्तिगत कानूनी सलाह नहीं। कृपया अपनी स्थिति के लिए योग्य वकील से परामर्श करे।)*",
    kn: "*(ಇದು ಆಶಯಾತ್ಮಕ ಉತ್ತಮಿಕೆಗಾಗಿ ಮಾತ್ರ ಮತ್ತು ವೈಯಕ್ತಿಕ ಕಾನೂನು ಸಲಹೆ ಅಲ್ಲ. ನಿಮ್ಮ ಸಂದರ್ಭದಲ್ಲಿ ದಯವಿಟ್ಟು ಯೋಗ್ಯವಾದ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.)*"
  };

  // Compose answer presentation, keeping markdown style (simulate)
  let fullAnswer = `
${intro[lang]}

${citation[lang]}
${explain[lang]}
${eg[lang]}

${disclaimer[lang]}
  `;

  return fullAnswer;
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
    setAnswer(null);
    setTimeout(() => {
      setAnswer(fakeNyayaBotAnswer(question, lang));
      setLoading(false);
      toast({ title: "Answer ready!", description: `The response is in ${languages.find(l=>l.code===lang)?.label}` });
    }, 1100);
  };

  return (
    <div className="relative z-0">
      {/* Law gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          background: "radial-gradient(ellipse 95% 55% at 80% 20%, #60a5fa22 0%, #e0e7ef00 100%)"
        }}
      ></div>
      <Card className="w-full max-w-2xl mx-auto shadow-xl border border-blue-200 dark:border-primary relative z-10 backdrop-blur bg-white/90 dark:bg-card/95">
        <CardHeader className="pb-2 relative">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 border border-blue-200 shadow-sm dark:bg-blue-900 dark:border-blue-800 flex-shrink-0 animate-fade-in">
              <Gavel size={28} className="text-blue-600 dark:text-blue-300" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200 flex-1">
              <span>NyayaBot</span>
              <span className="block text-base font-normal text-muted-foreground mt-1">
                Indian Legal Q&amp;A Chatbot
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAsk} className="space-y-4">
            <Textarea
              className="w-full min-h-[70px] bg-blue-50/40 dark:bg-blue-900/30 focus:bg-blue-100/70 dark:focus:bg-blue-900/60 rounded border-2 border-blue-200 dark:border-blue-800 placeholder:text-blue-400/60 text-lg"
              placeholder='Ask about Indian law... e.g., "What is theft under IPC?"'
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
                className="border rounded px-2 py-1 bg-blue-50 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800 font-medium"
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
            <div className="mt-8 animate-fade-in">
              <div className="mb-2 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                <span className="font-medium text-blue-800 dark:text-blue-200">NyayaBot’s Response</span>
              </div>
              <div className="rounded-xl p-5 bg-blue-50/90 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 shadow-inner text-base leading-relaxed space-y-1 whitespace-pre-line text-blue-950 dark:text-blue-100">
                {answer}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QABot;
