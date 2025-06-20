
import React, { useState } from "react";
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
  Languages,
  Sparkles
} from "lucide-react";

const allTools = [
  {
    title: "Contract Generator",
    description: "Generate professional legal contracts with AI assistance",
    icon: FileText,
    route: "/contract-generator",
    category: "Drafting"
  },
  {
    title: "Legal Q&A (NyayaBot)",
    description: "Get instant answers to Indian legal questions",
    icon: HelpCircle,
    route: "/legal-qna",
    category: "Learning"
  },
  {
    title: "Case Law Finder",
    description: "Search and find relevant case law and precedents",
    icon: Search,
    route: "/case-law-finder",
    category: "Research"
  },
  {
    title: "Section Explainer",
    description: "Get detailed explanations of legal sections",
    icon: BookOpen,
    route: "/section-explainer",
    category: "Learning"
  },
  {
    title: "Bare Act Navigator",
    description: "Navigate through legal acts efficiently",
    icon: Navigation,
    route: "/bare-act-navigator",
    category: "Learning"
  },
  {
    title: "Legal Draft Templates",
    description: "Generate professional legal document templates",
    icon: PenTool,
    route: "/legal-draft-templates",
    category: "Drafting"
  },
  {
    title: "Voice Dictation → Legal Format",
    description: "Convert voice recordings to legal documents",
    icon: Mic,
    route: "/voice-dictation",
    category: "Drafting"
  },
  {
    title: "Multi-Language Support",
    description: "Translate legal documents and responses",
    icon: Languages,
    route: "/multi-language-support",
    category: "Research"
  },
  {
    title: "Citation Checker",
    description: "Verify and check legal citations",
    icon: CheckCircle,
    route: "/citation-checker",
    category: "Research"
  },
  {
    title: "Client Brief Summary Tool",
    description: "Summarize client briefs and documents",
    icon: ClipboardList,
    route: "/summarizer",
    category: "Research"
  },
  {
    title: "Hearing/Deadline Tracker",
    description: "Track court dates and deadlines",
    icon: Calendar,
    route: "/hearing-tracker",
    category: "Trackers"
  },
  {
    title: "Flashcards (Legal Terms)",
    description: "Create flashcards for legal terminology",
    icon: Flashlight,
    route: "/tools",
    category: "Learning"
  },
  {
    title: "Syllabus Tracker",
    description: "Track your law school syllabus and study progress",
    icon: ClipboardCheck,
    route: "/tools",
    category: "Learning"
  }
];

const categories = ["All", "Drafting", "Research", "Learning", "Trackers"];

const ToolsAndFeatures = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleToolClick = (route: string) => {
    if (route) {
      navigate(route);
    }
  };

  const filteredTools = selectedCategory === "All" 
    ? allTools 
    : allTools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <TopNav />
      <main className="pt-24 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">All Tools & Features</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Complete Legal Toolkit
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need for legal work in one place – Draft. Learn. File. Track.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={index}
                  className="group cursor-pointer bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 rounded-xl overflow-hidden"
                  onClick={() => handleToolClick(tool.route)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-slate-700/50 text-blue-300 rounded-full border border-slate-600/50">
                        {tool.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm leading-relaxed">
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
