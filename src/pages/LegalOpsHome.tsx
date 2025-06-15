
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Gavel, BookOpen, Users, Brain, Landmark, Layers, Wand2, AudioLines, Languages, Search, FileEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleOptions = [
  { label: "Practicing Lawyer", value: "lawyer" },
  { label: "Law Student", value: "student" }
];

const lawyerTools = [
  {
    name: "Contract Generator",
    icon: <FileEdit className="w-7 h-7 text-blue-600" />,
    description: "Draft NDAs, Rental and Employment Contracts.",
    route: "/contract-generator"
  },
  {
    name: "Legal Q&A (NyayaBot)",
    icon: <Gavel className="w-7 h-7 text-yellow-700" />,
    description: "Ask legal questions. Cites laws & gives detailed reply.",
    route: "/qabot"
  },
  {
    name: "Case Law Finder",
    icon: <Search className="w-7 h-7 text-green-600" />,
    description: "Find judgments by keyword/section.",
    comingSoon: true
  },
  {
    name: "Section Explainer",
    icon: <Landmark className="w-7 h-7 text-gray-600" />,
    description: "Get breakdowns of IPC, CrPC, CPC.",
    comingSoon: true
  },
  {
    name: "Bare Act Navigator",
    icon: <BookOpen className="w-7 h-7 text-amber-700" />,
    description: "Navigate legal acts easily.",
    comingSoon: true
  },
  {
    name: "Legal Draft Templates",
    icon: <Layers className="w-7 h-7 text-purple-600" />,
    description: "Editable affidavits, notices & more.",
    comingSoon: true
  },
  {
    name: "Voice Dictation → Legal Format",
    icon: <AudioLines className="w-7 h-7 text-pink-600" />,
    description: "Convert audio to formatted legal documents.",
    comingSoon: true
  },
  {
    name: "Citation Checker",
    icon: <Wand2 className="w-7 h-7 text-lime-700" />,
    description: "Check case law status.",
    comingSoon: true
  },
  {
    name: "Client Brief Summary Tool",
    icon: <Brain className="w-7 h-7 text-indigo-700" />,
    description: "Get digests for meeting prep.",
    route: "/summarizer" // Reuse summarizer for now
  },
  {
    name: "Hearing/Deadline Tracker",
    icon: <Users className="w-7 h-7 text-orange-700" />,
    description: "Add court reminders, link docs.",
    comingSoon: true
  },
];

const studentTools = [
  {
    name: "Topic-Wise Quiz Generator",
    icon: <Brain className="w-7 h-7 text-blue-600" />,
    description: "Auto-generate MCQs & quizzes.",
    comingSoon: true
  },
  {
    name: "Case Brief Generator",
    icon: <Layers className="w-7 h-7 text-gray-700" />,
    description: "Get briefs: facts, issues, ratio.",
    comingSoon: true
  },
  {
    name: "Flashcards (Legal Terms)",
    icon: <Wand2 className="w-7 h-7 text-yellow-700" />,
    description: "Learn legal maxims & terms.",
    comingSoon: true
  },
  {
    name: "Syllabus Tracker",
    icon: <BookOpen className="w-7 h-7 text-purple-600" />,
    description: "Generate weekly study plan.",
    comingSoon: true
  },
  {
    name: "Law News Digest",
    icon: <Landmark className="w-7 h-7 text-green-700" />,
    description: "Latest legal news, weekly/daily.",
    comingSoon: true
  },
  {
    name: "Doubt Forum (Ask Senior)",
    icon: <Users className="w-7 h-7 text-pink-700" />,
    description: "Post doubts, get mentor replies.",
    comingSoon: true
  },
  {
    name: "Mock Test Generator",
    icon: <FileEdit className="w-7 h-7 text-indigo-700" />,
    description: "Full mock tests by topic.",
    comingSoon: true
  },
  {
    name: "Legal Q&A (NyayaBot)",
    icon: <Gavel className="w-7 h-7 text-yellow-700" />,
    description: "Answers adjusted for your level.",
    route: "/qabot"
  },
  {
    name: "Study Plan Generator",
    icon: <BookOpen className="w-7 h-7 text-blue-700" />,
    description: "Get printable/online schedule.",
    comingSoon: true
  },
  {
    name: "Case Explainer",
    icon: <Search className="w-7 h-7 text-orange-700" />,
    description: "Breakdown judgments for learning.",
    route: "/summarizer" // Reuse summarizer for now
  },
];

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" },
  { label: "தமிழ்", code: "ta" },
  { label: "తెలుగు", code: "te" }
];

const disclaimer = "This is not a substitute for professional legal advice.";

const LegalOpsHome = () => {
  const [role, setRole] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Remember role in localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem("legalops_role");
    if (stored) setRole(stored);
  }, []);
  useEffect(() => {
    if (role) window.localStorage.setItem("legalops_role", role);
  }, [role]);

  const handleRoleSelect = (r: string) => setRole(r);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setDocFiles(files);
    if (files.length) {
      toast({ title: "Files uploaded!", description: `You uploaded ${files.length} document(s).` });
      // In real app, process via Groq or pass to summarizer/explainer
    }
  };

  const startSummarize = () => {
    toast({
      title: "Summarize Documents",
      description: "Feature coming soon. For now, use the Summarizer or NyayaBot tool for single docs."
    });
  };

  // Show onboarding if no role, else dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-100 dark:from-blue-900 dark:to-yellow-900 py-10 px-4 flex flex-col">
      {/* Greeting / Onboarding */}
      {!role && (
        <div className="max-w-xl mx-auto py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-blue-900 dark:text-yellow-100">👋 Hello! I’m <span className="text-blue-700 dark:text-yellow-200">LegalOps AI</span></h1>
          <p className="text-lg text-blue-600 dark:text-yellow-100 mb-7 font-medium">
            Your intelligent legal assistant built to help both practicing lawyers and law students.<br />
            <span className="inline-block mt-2 text-base">Choose your role to unlock tailored legal tools!</span>
          </p>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-6 justify-center">
              {roleOptions.map(opt => (
                <Button
                  key={opt.value}
                  size="lg"
                  className="px-10 text-base font-bold"
                  onClick={() => handleRoleSelect(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role-based Dashboard */}
      {role && (
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-5 text-sm flex flex-wrap gap-4 items-center justify-between">
            <span className="bg-blue-100 dark:bg-blue-900 py-1 px-3 rounded">
              {role === "lawyer" ? "Practicing Lawyer" : "Law Student"} Mode
            </span>
            <label className="block">
              <span className="mr-1 font-medium">
                <Languages className="inline-block w-4 h-4 -mt-1 mr-1" /> Language:
              </span>
              <select value={lang} className="rounded px-2 py-1 border ml-1" onChange={e => setLang(e.target.value)}>
                {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Document Upload */}
          <Card className="mb-7">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <UploadCloud className="w-6 h-6" />
                Upload Legal Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                onChange={handleDocUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-yellow-100"
              />
              {docFiles.length > 0 && (
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-100">
                  {docFiles.length} document(s) ready.
                  <Button className="ml-4" size="sm" onClick={startSummarize}>
                    Summarize
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(role === "lawyer" ? lawyerTools : studentTools).map(tool => (
              <Card
                key={tool.name}
                className={"transition-all " + (tool.comingSoon ? "opacity-50 grayscale pointer-events-none" : "hover:scale-[1.03] cursor-pointer")}
                onClick={() => tool.route && navigate(tool.route)}
              >
                <CardHeader className="flex-row items-center gap-3">
                  {tool.icon}
                  <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-base font-normal">{tool.description}</div>
                  {tool.comingSoon && <div className="mt-2 text-xs text-gray-500 italic">Coming soon</div>}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-xs text-gray-700 dark:text-gray-200 text-center">
            {disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalOpsHome;
