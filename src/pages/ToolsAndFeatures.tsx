
import React from "react";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { 
  FileText, 
  Search, 
  BookOpen, 
  Navigation,
  PenTool,
  Mic,
  CheckCircle,
  ClipboardList,
  Calendar,
  HelpCircle,
  Flashlight,
  ClipboardCheck,
  Languages
} from "lucide-react";

const allTools = [
  {
    title: "Contract Generator",
    description: "Generate professional legal contracts with AI assistance",
    icon: FileText,
    route: "/contract-generator",
    category: "⚖️ Drafting"
  },
  {
    title: "Legal Q&A (NyayaBot)",
    description: "Get instant answers to Indian legal questions",
    icon: HelpCircle,
    route: "/legal-qna",
    category: "🤖 AI Assistant"
  },
  {
    title: "Case Law Finder",
    description: "Search and find relevant case law and precedents",
    icon: Search,
    route: "/case-law-finder",
    category: "🔍 Research"
  },
  {
    title: "Section Explainer",
    description: "Get detailed explanations of legal sections",
    icon: BookOpen,
    route: "/section-explainer",
    category: "📚 Learning"
  },
  {
    title: "Bare Act Navigator",
    description: "Navigate through legal acts efficiently",
    icon: Navigation,
    route: "/bare-act-navigator",
    category: "📚 Learning"
  },
  {
    title: "Legal Draft Templates",
    description: "Generate professional legal document templates",
    icon: PenTool,
    route: "/legal-draft-templates",
    category: "⚖️ Drafting"
  },
  {
    title: "Voice Dictation → Legal Format",
    description: "Convert voice recordings to legal documents",
    icon: Mic,
    route: "/voice-dictation",
    category: "🛠️ Utilities"
  },
  {
    title: "Multi-Language Support",
    description: "Translate legal documents and responses",
    icon: Languages,
    route: "/multi-language-support",
    category: "🛠️ Utilities"
  },
  {
    title: "Citation Checker",
    description: "Verify and check legal citations",
    icon: CheckCircle,
    route: "/citation-checker",
    category: "🛠️ Utilities"
  },
  {
    title: "Client Brief Summary Tool",
    description: "Summarize client briefs and documents",
    icon: ClipboardList,
    route: "/summarizer",
    category: "🛠️ Utilities"
  },
  {
    title: "Hearing/Deadline Tracker",
    description: "Track court dates and deadlines",
    icon: Calendar,
    route: "/hearing-tracker",
    category: "📅 Court"
  },
  {
    title: "Flashcards (Legal Terms)",
    description: "Create flashcards for legal terminology",
    icon: Flashlight,
    route: "/tools",
    category: "🧠 Learning"
  },
  {
    title: "Syllabus Tracker",
    description: "Track your law school syllabus and study progress",
    icon: ClipboardCheck,
    route: "/tools",
    category: "🧠 Learning"
  }
];

const ToolsAndFeatures = () => {
  const navigate = useNavigate();

  const handleToolClick = (route: string) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <TopNav />
      <main className="pt-24 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🛠️ All Tools & Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need for legal work in one place – Draft. Learn. File. Track.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={index}
                  className="group cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                  onClick={() => handleToolClick(tool.route)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-white/10 text-blue-300 rounded-full">
                        {tool.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolsAndFeatures;
