import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Gavel, Scale, Book, Badge, Users } from "lucide-react";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" }
];

// Persona-based answer template for NyayaBot, with provided prompt:
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
    en: `👩‍⚖️ Hi, I am NyayaBot — a friendly, knowledgeable legal assistant trained in Indian laws such as the IPC, CrPC, and Indian Contract Act.`,
    hi: "👩‍⚖️ नमस्ते, मैं NyayaBot हूँ — एक मित्रवत और जानकार कानूनी सहायक जो IPC, CrPC और भारतीय अनुबंध अधिनियम जैसे भारतीय कानूनों में प्रशिक्षित है।",
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
    en: "*(This is for educational purposes only and is not personal legal advice or interpretation. For specific situations, consult a qualified lawyer.)*",
    hi: "*(यह केवल शैक्षिक उद्देश्य हेतु है, व्यक्तिगत कानूनी सलाह या व्याख्या नहीं। कृपया अपनी स्थिति के लिए योग्य वकील से परामर्श करे।)*",
    kn: "*(ಇದು ಆಶಯಾತ್ಮಕ ಉತ್ತಮಿಕೆಗಾಗಿ ಮಾತ್ರ ಮತ್ತು ವೈಯಕ್ತಿಕ ಕಾನೂನು ಸಲಹೆ ಅಥವಾ ವಿವರಣೆ ಅಲ್ಲ. ನಿಮ್ಮ ಸಂದರ್ಭದಲ್ಲಿ ದಯವಿಟ್ಟು ಯೋಗ್ಯವಾದ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.)*"
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
    <div className="relative z-0 min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-50 dark:from-blue-950 dark:via-gray-900 dark:to-yellow-900 transition-colors duration-500">
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
                <div className="rounded-xl py-6 px-7 bg-gradient-to-br from-yellow-50 via-blue-50 to-yellow-100 dark:from-blue-900 dark:via-blue-950 dark:to-yellow-900 border-2 border-yellow-300 dark:border-yellow-800 shadow-inner leading-relaxed space-y-2 text-base whitespace-pre-line text-blue-900 dark:text-yellow-100 font-serif relative">
                  <div className="absolute -left-5 -top-4 rotate-6">
                    <Scale size={32} className="text-yellow-400 dark:text-yellow-700 opacity-75" />
                  </div>
                  <span className="block">{answer}</span>
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
