
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
    <div className="min-h-screen" style={{ background: 'var(--ivo-background)' }}>
      <TopNav />
      <main className="pt-24 pb-12">
        <div className="ivo-container">
          <div className="flex items-center gap-4 mb-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="ivo-btn-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 mb-8" style={{ 
              background: 'var(--ivo-white)', 
              borderColor: 'var(--ivo-gray-200)',
              boxShadow: 'var(--ivo-shadow-sm)'
            }}>
              <Sparkles className="w-5 h-5" style={{ color: 'var(--ivo-secondary)' }} />
              <span className="ivo-text-small font-semibold" style={{ color: 'var(--ivo-primary)' }}>All Tools & Features</span>
            </div>
            <h1 className="ivo-text-heading mb-6">
              Complete Legal Toolkit
            </h1>
            <p className="ivo-text-body max-w-3xl mx-auto">
              Everything you need for legal work in one place – Draft. Learn. File. Track.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold ivo-transition ${
                  selectedCategory === category
                    ? "text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  background: selectedCategory === category 
                    ? 'var(--ivo-secondary)' 
                    : 'var(--ivo-white)',
                  border: selectedCategory === category 
                    ? 'none' 
                    : '2px solid var(--ivo-gray-200)',
                  boxShadow: selectedCategory === category 
                    ? 'var(--ivo-shadow-md)' 
                    : 'var(--ivo-shadow-sm)'
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="ivo-grid-features">
            {filteredTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <div 
                  key={index}
                  className="ivo-card-feature cursor-pointer group"
                  onClick={() => handleToolClick(tool.route)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="ivo-icon">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <span 
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ 
                        background: 'var(--ivo-gray-100)',
                        color: 'var(--ivo-secondary)'
                      }}
                    >
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 ivo-transition" style={{ color: 'var(--ivo-primary)' }}>
                    {tool.title}
                  </h3>
                  <p className="ivo-text-small leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolsAndFeatures;
