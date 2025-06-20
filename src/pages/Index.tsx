
import React, { useState } from "react";
import LandingBackground from "../components/LandingBackground";
import LawSymbol from "../components/LawSymbol";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  Bot
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
    route: "/features",
    category: "🧠 Learning"
  },
  {
    title: "Syllabus Tracker",
    description: "Track your law school syllabus and study progress",
    icon: ClipboardCheck,
    route: "/features",
    category: "🧠 Learning"
  }
];

const Index = () => {
  const navigate = useNavigate();

  const handleToolClick = (route: string) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <LandingBackground />
      <TopNav />
      <main className="relative z-10 flex flex-col min-h-screen items-center justify-center w-full pt-32 pb-12 px-4">
        <div className="flex flex-col items-center mb-16">
          <LawSymbol className="w-24 h-24 mb-8 animate-scale-in" />
          <h1 className="font-serif text-7xl md:text-8xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_24px_#4852B7aa] animate-fade-in select-none">
            LegalOps
          </h1>
          <div className="mt-7 text-2xl md:text-3xl text-blue-100/90 font-semibold text-center animate-fade-in">
            Where law meets technology
          </div>
        </div>

        {/* All Tools Section */}
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            🛠️ All LegalOps Tools – Draft. Learn. File. Track.
          </h2>
          <p className="text-center text-blue-100/80 mb-8 text-lg">
            Everything you need for legal work in one place
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border border-white/20 bg-black/40 backdrop-blur text-white"
                  onClick={() => handleToolClick(tool.route)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-xs text-blue-300 font-medium">{tool.category}</span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-white">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate("/features")} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg"
            >
              Explore All Features →
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
