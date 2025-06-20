
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Languages,
  Scale,
  ChevronDown,
  ArrowRight,
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

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LegalOps</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Home</a>
              <a href="#tools-section" onClick={scrollToTools} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-sm font-medium">Tools</a>
              <button onClick={() => navigate("/about")} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">About</button>
              <a href="#contact" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Contact</a>
            </div>

            <Button 
              onClick={scrollToTools}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium text-sm border-0"
            >
              Launch LegalOps
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Powered by AI</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Where Law Meets
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"> Intelligence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Explore 15+ legal tools for drafting, research, and preparation. 
            Streamline your legal workflow with AI-powered assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button 
              onClick={scrollToTools}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-medium rounded-xl border-0 shadow-lg shadow-blue-500/25"
            >
              Try LegalOps <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate("/about")}
              variant="outline"
              size="lg"
              className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800 px-8 py-4 text-lg font-medium rounded-xl backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-20 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive Legal Toolkit
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need for modern legal practice - from contract generation to case research, 
              all powered by advanced AI technology.
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
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">LegalOps</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI-powered legal assistance for the modern legal professional.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#tools-section" className="hover:text-white transition-colors">All Tools</a></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-white transition-colors">About</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal Disclaimer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/50 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 LegalOps. All rights reserved. Built with ❤️ for the legal community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
