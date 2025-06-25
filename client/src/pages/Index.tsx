import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Search, BookOpen, Navigation, PenTool, Mic, CheckCircle, ClipboardList, Calendar, HelpCircle, Flashlight, ClipboardCheck, Languages, Scale, ChevronDown, ArrowRight, Shield, Zap, Users } from "lucide-react";
const allTools = [{
  title: "Contract Generator",
  description: "Generate professional legal contracts with AI assistance",
  icon: FileText,
  route: "/contract-generator",
  category: "Drafting"
}, {
  title: "Legal Q&A (NyayaBot)",
  description: "Get instant answers to Indian legal questions",
  icon: HelpCircle,
  route: "/legal-qna",
  category: "Learning"
}, {
  title: "Case Law Finder",
  description: "Search and find relevant case law and precedents",
  icon: Search,
  route: "/case-law-finder",
  category: "Research"
}, {
  title: "Section Explainer",
  description: "Get detailed explanations of legal sections",
  icon: BookOpen,
  route: "/section-explainer",
  category: "Learning"
}, {
  title: "Bare Act Navigator",
  description: "Navigate through legal acts efficiently",
  icon: Navigation,
  route: "/bare-act-navigator",
  category: "Learning"
}, {
  title: "Legal Draft Templates",
  description: "Generate professional legal document templates",
  icon: PenTool,
  route: "/legal-draft-templates",
  category: "Drafting"
}, {
  title: "Voice Dictation → Legal Format",
  description: "Convert voice recordings to legal documents",
  icon: Mic,
  route: "/voice-dictation",
  category: "Drafting"
}, {
  title: "Multi-Language Support",
  description: "Translate legal documents and responses",
  icon: Languages,
  route: "/multi-language-support",
  category: "Research"
}, {
  title: "Citation Checker",
  description: "Verify and check legal citations",
  icon: CheckCircle,
  route: "/citation-checker",
  category: "Research"
}, {
  title: "Client Brief Summary Tool",
  description: "Summarize client briefs and documents",
  icon: ClipboardList,
  route: "/summarizer",
  category: "Research"
}, {
  title: "Hearing/Deadline Tracker",
  description: "Track court dates and deadlines",
  icon: Calendar,
  route: "/hearing-tracker",
  category: "Trackers"
}, {
  title: "Flashcards (Legal Terms)",
  description: "Create flashcards for legal terminology",
  icon: Flashlight,
  route: "/tools",
  category: "Learning"
}, {
  title: "Syllabus Tracker",
  description: "Track your law school syllabus and study progress",
  icon: ClipboardCheck,
  route: "/tools",
  category: "Learning"
}];
const categories = ["All", "Drafting", "Research", "Learning", "Trackers"];
const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDocument, setShowDocument] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [showRedUnderline, setShowRedUnderline] = useState(false);
  const [showChanging, setShowChanging] = useState(false);
  const [showNewText, setShowNewText] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [bounceIndex, setBounceIndex] = useState(-1);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(-1);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorClicked, setCursorClicked] = useState(false);
  const [showToolsSection, setShowToolsSection] = useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState(-1);
  const [featureBoxJump, setFeatureBoxJump] = useState(-1);
  useEffect(() => {
    // Animation sequence with updated timings for longer durations
    const timer1 = setTimeout(() => setShowDocument(true), 500);
    const timer2 = setTimeout(() => setShowText(true), 1500);
    const timer3 = setTimeout(() => setShowHighlight(true), 3000);
    const timer4 = setTimeout(() => setShowRedUnderline(true), 5000);
    const timer5 = setTimeout(() => setShowChanging(true), 7000);
    const timer6 = setTimeout(() => setShowNewText(true), 9000);
    const timer7 = setTimeout(() => setShowFeatures(true), 11000);

    // Cursor animation - start after features appear
    const timer8 = setTimeout(() => setShowCursor(true), 12000);
    const timer9 = setTimeout(() => setCursorClicked(true), 15000);

    // Hide cursor and start feature box jumping after click
    const timer10 = setTimeout(() => setShowCursor(false), 16000);
    const timer11 = setTimeout(() => setFeatureBoxJump(0), 16500); // First box jumps
    const timer12 = setTimeout(() => setFeatureBoxJump(1), 17500); // Second box jumps
    const timer13 = setTimeout(() => setFeatureBoxJump(2), 18500); // Third box jumps
    const timer14 = setTimeout(() => setFeatureBoxJump(-1), 20000); // Reset jumping

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
      clearTimeout(timer10);
      clearTimeout(timer11);
      clearTimeout(timer12);
      clearTimeout(timer13);
      clearTimeout(timer14);
    };
  }, []);
  useEffect(() => {
    if (showFeatures) {
      // Sequential bouncing with longer delays for smoother effect
      const bounceTimers = [0, 1, 2].map(index => setTimeout(() => setBounceIndex(index), index * 1200));
      return () => {
        bounceTimers.forEach(clearTimeout);
      };
    }
  }, [showFeatures]);

  // Intersection Observer for tools section
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'tools-section') {
          setShowToolsSection(true);
          // Start tool selection animations with longer delays
          setTimeout(() => setSelectedToolIndex(0), 500); // Contract Generator - yellow
          setTimeout(() => setSelectedToolIndex(1), 3000); // Legal Q&A - pink  
          setTimeout(() => setSelectedToolIndex(2), 5500); // Case Law Finder - green
          setTimeout(() => setSelectedToolIndex(-1), 8000); // Clear selection
        }
      });
    }, {
      threshold: 0.3
    });
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      observer.observe(toolsSection);
    }
    return () => observer.disconnect();
  }, []);
  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleToolClick = (route: string) => {
    if (route) {
      navigate(route);
    }
  };
  const filteredTools = selectedCategory === "All" ? allTools : allTools.filter(tool => tool.category === selectedCategory);
  return <div className="min-h-screen" style={{
    background: 'var(--ivo-background)'
  }}>
      {/* Animated Cursor */}
      {showCursor && <div className={`animated-cursor ${cursorClicked ? 'cursor-clicked' : ''}`}>
          <div className="cursor-icon">🖱️</div>
        </div>}

      {/* Ivo.ai Style Navigation */}
      <nav className="ivo-nav">
        <div className="ivo-container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              
              <span style={{
              color: 'var(--ivo-primary)'
            }} className="font-bold text-xl text-left mx-[8px] px-[8px]">legalOps</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="ivo-nav-link">Home</a>
              <a href="#tools-section" onClick={scrollToTools} className="ivo-nav-link cursor-pointer">Tools</a>
              <button onClick={() => navigate("/about")} className="ivo-nav-link">About</button>
              <a href="#contact" className="ivo-nav-link">Contact</a>
            </div>

            <Button onClick={scrollToTools} className={`ivo-btn-primary launch-button ${cursorClicked ? 'button-clicked' : ''}`}>
              Launch LegalOps
            </Button>
          </div>
        </div>
      </nav>

      {/* Updated Hero Section with Normal Sky Blue Background */}
      <section id="home" className="ivo-hero ivo-section relative min-h-screen flex items-center justify-center overflow-hidden bg-sky-50">
        <div className="ivo-container relative z-10">
          <div className="text-center mb-16 ivo-fade-in">
            <h1 className="ivo-text-hero mb-16">
              Where Law Meets
              <span className="ivo-gradient-text"> Intelligence</span>
            </h1>
          </div>
          
          {/* New Two-Column Layout with Animations */}
          <div className="content-grid grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto items-center">
            {/* Left Column - Animated Word Document */}
            <div className="lg:col-span-3">
              <div className={`legal-doc-container transition-all duration-1000 ${showDocument ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="word-interface">
                  <div className="word-header">
                    <span className="doc-icon"></span>
                    <span>Document - Word</span>
                  </div>
                  
                  <div className="word-toolbar">
                    <div className="toolbar-section">
                      <select className="font-dropdown">
                        <option>Aptos (Body)</option>
                        <option>Calibri</option>
                        <option>Times New Roman</option>
                      </select>
                      <select className="font-dropdown" style={{
                      width: '50px'
                    }}>
                        <option>12</option>
                        <option>11</option>
                        <option>14</option>
                      </select>
                    </div>
                    <div className="toolbar-section">
                      <button className="toolbar-btn"><strong>B</strong></button>
                      <button className="toolbar-btn"><em>I</em></button>
                      <button className="toolbar-btn"><u>U</u></button>
                    </div>
                    <div className="toolbar-section">
                      <button className="toolbar-btn">≡</button>
                      <button className="toolbar-btn">≣</button>
                      <button className="toolbar-btn">≡</button>
                    </div>
                  </div>
                  
                  <div className="ruler"></div>
                  
                  <div className="word-document">
                    <div className="document-page">
                      <div className="document-header-info rounded-2xl bg-yellow-50">
                        <h3 className="case-title text-sm">CASE SUMMARY: Mr. Mehra vs State</h3>
                        <p className="case-citation text-xs">Citation: (2024) 3 SCC 512 (SC)</p>
                      </div>
                      
                      <h4 className="section-title">5. TERM AND TERMINATION</h4>
                      
                      <div className="subsection">
                        <span className="subsection-number">5.1</span>
                        <span className="subsection-text">Subject to earlier termination as provided below, this Agreement is for the Initial Service Term as specified in the Order Form, and shall be automatically renewed for additional periods of the same duration as the Initial Service Term.</span>
                      </div>
                      
                      <div className={`subsection transition-all duration-1000 ${showNewText ? 'bg-white' : showChanging ? 'bg-blue-50' : showHighlight ? 'bg-yellow-100' : 'bg-white'}`}>
                        <span className="subsection-number">5.2</span>
                        <span className={`subsection-text font-normal text-gray-800 transition-all duration-500 ${showRedUnderline && !showChanging ? 'border-b-2 border-red-500' : ''}`}>
                          {showNewText ? "Either party may terminate this Agreement without cause, by providing the other party with no less than thirty (30) days' prior written notice of termination." : "Either party may terminate this Agreement without any reason by giving the other party thirty (30) days prior notice in writing."}
                        </span>
                      </div>
                      
                      <div className="subsection">
                        <span className="subsection-number">5.3</span>
                        <span className="subsection-text">Either party may terminate this Agreement immediately upon written notice if the other party materially breaches this Agreement and fails to cure such breach within fifteen (15) days after receiving written notice.</span>
                      </div>
                      
                      <div className="document-footer">
                        Last updated: June 2025
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Marketing Copy */}
            <div className="lg:col-span-2">
              <div className={`marketing-content transition-all duration-1000 delay-1000 ${showText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <h2 className="catchy-heading font-bold text-3xl lg:text-4xl leading-tight mb-6" style={{
                color: 'var(--ivo-primary)'
              }}>
                  LegalOps is designed for Indian lawyers, firms, and enterprises seeking speed, precision, and control.
                </h2>
                <p className="description text-lg leading-relaxed" style={{
                color: 'var(--ivo-gray-600)'
              }}>
                  We blend deep legal expertise with cutting-edge AI to help you draft, review, and understand legal documents—faster and smarter than ever before.
                </p>
                <div className="mt-8">
                  <Button onClick={scrollToTools} className="ivo-btn-primary text-lg px-8 py-4">
                    Explore Tools <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Ivo.ai Style Feature Highlights with Animation */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 transition-all duration-1000 ${showFeatures ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`text-center transition-all duration-500 ${featureBoxJump === 0 ? 'feature-box-jump' : ''}`}>
              <div className="ivo-icon mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{
              color: 'var(--ivo-primary)'
            }}>Secure & Reliable</h3>
              <p className="ivo-text-small">Enterprise-grade security for your legal documents</p>
            </div>
            <div className={`text-center transition-all duration-500 delay-500 ${featureBoxJump === 1 ? 'feature-box-jump' : ''}`}>
              <div className="ivo-icon mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{
              color: 'var(--ivo-primary)'
            }}>Lightning Fast</h3>
              <p className="ivo-text-small">Generate documents and research in seconds</p>
            </div>
            <div className={`text-center transition-all duration-500 delay-1000 ${featureBoxJump === 2 ? 'feature-box-jump' : ''}`}>
              <div className="ivo-icon mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{
              color: 'var(--ivo-primary)'
            }}>Collaborative</h3>
              <p className="ivo-text-small">Built for teams and solo practitioners</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6" style={{
          color: 'var(--ivo-gray-400)'
        }} />
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
            {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-6 py-3 rounded-full font-semibold ivo-transition ${selectedCategory === category ? "text-white shadow-lg" : "text-gray-600 hover:text-gray-800"}`} style={{
            background: selectedCategory === category ? 'var(--ivo-secondary)' : 'var(--ivo-white)',
            border: selectedCategory === category ? 'none' : '2px solid var(--ivo-gray-200)',
            boxShadow: selectedCategory === category ? 'var(--ivo-shadow-md)' : 'var(--ivo-shadow-sm)'
          }}>
                {category}
              </button>)}
          </div>

          <div className="ivo-grid-features">
            {filteredTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return <div key={index} className={`ivo-card-feature cursor-pointer group transition-all duration-500 ${showToolsSection && selectedToolIndex === index ? index === 0 ? 'feature-selected-yellow' : index === 1 ? 'feature-selected-pink' : index === 2 ? 'feature-selected-green' : '' : ''}`} onClick={() => handleToolClick(tool.route)}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="ivo-icon">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{
                  background: 'var(--ivo-gray-100)',
                  color: 'var(--ivo-secondary)'
                }}>
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 ivo-transition" style={{
                color: 'var(--ivo-primary)'
              }}>
                    {tool.title}
                  </h3>
                  <p className="ivo-text-small leading-relaxed">
                    {tool.description}
                  </p>
                </div>;
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
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, var(--ivo-secondary), #0099cc)'
              }}>
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold" style={{
                color: 'var(--ivo-primary)'
              }}>LegalOps</span>
              </div>
              <p className="ivo-text-small leading-relaxed">
                AI-powered legal assistance for the modern legal professional.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6" style={{
              color: 'var(--ivo-primary)'
            }}>Product</h3>
              <ul className="space-y-4">
                <li><a href="#tools-section" className="ivo-text-small hover:text-blue-600 ivo-transition">All Tools</a></li>
                <li><button onClick={() => navigate("/about")} className="ivo-text-small hover:text-blue-600 ivo-transition">About</button></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6" style={{
              color: 'var(--ivo-primary)'
            }}>Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Help Center</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Feedback</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6" style={{
              color: 'var(--ivo-primary)'
            }}>Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Privacy Policy</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Legal Disclaimer</a></li>
                <li><a href="#" className="ivo-text-small hover:text-blue-600 ivo-transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center" style={{
          borderColor: 'var(--ivo-gray-200)'
        }}>
            <p className="ivo-text-small">
              © 2024 LegalOps. All rights reserved. Built with ❤️ for the legal community.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
