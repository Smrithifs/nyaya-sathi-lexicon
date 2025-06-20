
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
  Shield,
  Zap,
  Users
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
    <div className="min-h-screen" style={{ background: 'var(--ivo-background)' }}>
      {/* Ivo.ai Style Navigation */}
      <nav className="ivo-nav">
        <div className="ivo-container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--ivo-secondary), #0099cc)' }}>
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--ivo-primary)' }}>LegalOps</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="ivo-nav-link">Home</a>
              <a href="#tools-section" onClick={scrollToTools} className="ivo-nav-link cursor-pointer">Tools</a>
              <button onClick={() => navigate("/about")} className="ivo-nav-link">About</button>
              <a href="#contact" className="ivo-nav-link">Contact</a>
            </div>

            <Button 
              onClick={scrollToTools}
              className="ivo-btn-primary"
            >
              Launch LegalOps
            </Button>
          </div>
        </div>
      </nav>

      {/* Updated Hero Section */}
      <section id="home" className="ivo-hero ivo-section relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="ivo-container relative z-10">
          <div className="text-center mb-16 ivo-fade-in">
            <h1 className="ivo-text-hero mb-16">
              Where Law Meets
              <span className="ivo-gradient-text"> Intelligence</span>
            </h1>
          </div>
          
          {/* New Two-Column Layout */}
          <div className="content-grid grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto items-center">
            {/* Left Column - Document Interactive Component */}
            <div className="lg:col-span-3 ivo-scale-in">
              <div className="document-viewer bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
                <div className="document-header" style={{ background: 'var(--ivo-secondary)', color: 'white', padding: '16px 20px' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <span className="font-semibold text-lg">SaaS Services Agreement</span>
                  </div>
                </div>
                <div className="document-content p-6 space-y-4 text-left">
                  <div className="text-lg font-semibold" style={{ color: 'var(--ivo-primary)' }}>
                    5. TERM AND TERMINATION
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>5.1</strong> Subject to earlier termination as provided below, this Agreement is for the Initial Service Term as specified in the Order Form, and shall be automatically renewed for additional periods of the same duration as the Initial Service Term.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>5.2</strong> Either party may terminate this Agreement without cause by giving the other party at least thirty (30) days prior written notice of termination.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>5.3</strong> Either party may terminate this Agreement immediately upon written notice if the other party materially breaches this Agreement and fails to cure such breach within fifteen (15) days after receiving written notice.
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Last updated: December 2024</span>
                      <span>Page 12 of 24</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Marketing Copy */}
            <div className="lg:col-span-2 ivo-fade-in">
              <div className="marketing-content">
                <h2 className="catchy-heading font-bold text-3xl lg:text-4xl leading-tight mb-6" style={{ color: 'var(--ivo-primary)' }}>
                  LegalOps is designed for Indian lawyers, firms, and enterprises seeking speed, precision, and control.
                </h2>
                <p className="description text-lg leading-relaxed" style={{ color: 'var(--ivo-gray-600)' }}>
                  We blend deep legal expertise with cutting-edge AI to help you draft, review, and understand legal documents—faster and smarter than ever before.
                </p>
                <div className="mt-8">
                  <Button 
                    onClick={scrollToTools}
                    className="ivo-btn-primary text-lg px-8 py-4"
                  >
                    Explore Tools <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Ivo.ai Style Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 ivo-scale-in">
            <div className="text-center">
              <div className="ivo-icon mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ivo-primary)' }}>Secure & Reliable</h3>
              <p className="ivo-text-small">Enterprise-grade security for your legal documents</p>
            </div>
            <div className="text-center">
              <div className="ivo-icon mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ivo-primary)' }}>Lightning Fast</h3>
              <p className="ivo-text-small">Generate documents and research in seconds</p>
            </div>
            <div className="text-center">
              <div className="ivo-icon mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ivo-primary)' }}>Collaborative</h3>
              <p className="ivo-text-small">Built for teams and solo practitioners</p>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6" style={{ color: 'var(--ivo-gray-400)' }} />
        </div>
      </section>

      {/* Ivo.ai Style Tools Section */}
      <section id="tools-section" className="ivo-section relative">
        <div className="ivo-container">
          <div className="text-center mb-16">
            <h2 className="ivo-text-heading mb-6">
              Comprehensive Legal Toolkit
            </h2>
            <p className="ivo-text-body max-w-3xl mx-auto">
              Everything you need for modern legal practice - from contract generation to case research, 
              all powered by advanced AI technology.
            </p>
          </div>

          {/* Ivo.ai Style Category Filters */}
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
      </section>

      {/* Ivo.ai Style Footer */}
      <footer className="border-t py-20" style={{ 
        background: 'var(--ivo-white)', 
        borderColor: 'var(--ivo-gray-200)' 
      }}>
        <div className="ivo-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--ivo-secondary), #0099cc)' }}>
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold" style={{ color: 'var(--ivo-primary)' }}>LegalOps</span>
              </div>
              <p className="ivo-text-small leading-relaxed">
                AI-powered legal assistance for the modern legal professional.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6" style={{ color: 'var(--ivo-primary)' }}>Product</h3>
              <ul className="space-y-4">
                <li><a href="#tools-section" className="ivo-text-small hover:text-blue-600 ivo-transition">All Tools</a></li>
                <li><button onClick={() => navigate("/about")} className="ivo-text-small hover:text-blue-600 ivo-transition">About</button></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6" style={{ color: 'var(--ivo-primary)' }}>Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Help Center</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Feedback</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6" style={{ color: 'var(--ivo-primary)' }}>Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Privacy Policy</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Legal Disclaimer</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center" style={{ borderColor: 'var(--ivo-gray-200)' }}>
            <p className="ivo-text-small">
              © 2024 LegalOps. All rights reserved. Built with ❤️ for the legal community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
