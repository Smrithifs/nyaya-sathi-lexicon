
import React from "react";
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
  ArrowRight
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
    category: "Research"
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

const Index = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">LegalOps</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#tools-section" onClick={scrollToTools} className="text-white/80 hover:text-white transition-colors cursor-pointer">Tools</a>
              <button onClick={() => navigate("/about")} className="text-white/80 hover:text-white transition-colors">About</button>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>

            <Button 
              onClick={scrollToTools}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Launch LegalOps
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <Scale className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Where Law Meets
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Intelligence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in">
            Explore 15+ legal tools for drafting, research, and preparation. 
            Streamline your legal workflow with AI-powered assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button 
              onClick={scrollToTools}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg"
            >
              Explore Tools <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate("/about")}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium rounded-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive Legal Toolkit
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need for modern legal practice - from contract generation to case research, 
              all powered by advanced AI technology.
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
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold text-white">LegalOps</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered legal assistance for the modern legal professional.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#tools-section" className="hover:text-white transition-colors">All Tools</a></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-white transition-colors">About</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 LegalOps. All rights reserved. Built with ❤️ for the legal community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
