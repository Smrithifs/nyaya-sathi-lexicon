import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Gavel, BookOpen, Layers, FileEdit, Search, Landmark, Wand2,
  AudioLines, Brain, Users, Languages, Scale, Shield, CheckCircle, ArrowRight
} from "lucide-react";

const lawyerTools = [
  { name: "Contract Generator", icon: <FileEdit className="w-7 h-7 text-blue-600" /> },
  { name: "Case Law Finder", icon: <Search className="w-7 h-7 text-green-600" /> },
  { name: "Section Explainer", icon: <Landmark className="w-7 h-7 text-gray-600" /> },
  { name: "Bare Act Navigator", icon: <BookOpen className="w-7 h-7 text-amber-700" /> },
  { name: "Legal Draft Templates", icon: <Layers className="w-7 h-7 text-purple-600" /> },
  { name: "Voice Dictation → Legal Format", icon: <AudioLines className="w-7 h-7 text-pink-600" /> },
  { name: "Multi-Language Support", icon: <Languages className="w-7 h-7 text-blue-700" /> },
  { name: "Citation Checker", icon: <Wand2 className="w-7 h-7 text-lime-700" /> },
  { name: "Client Brief Summary Tool", icon: <Brain className="w-7 h-7 text-indigo-700" /> },
  { name: "Hearing/Deadline Tracker", icon: <Users className="w-7 h-7 text-orange-700" /> },
  { name: "Legal Q&A (NyayaBot)", icon: <Gavel className="w-7 h-7 text-yellow-700" /> }
];

const studentTools = [
  { name: "Flashcards (Legal Terms)", icon: <Wand2 className="w-7 h-7 text-yellow-700" /> },
  { name: "Syllabus Tracker", icon: <BookOpen className="w-7 h-7 text-purple-600" /> },
  { name: "Legal Q&A (NyayaBot)", icon: <Gavel className="w-7 h-7 text-yellow-700" /> }
];

const whyLegalOpsItems = [
  { bold: "Draft perfect contracts:", text: " Generate NDAs, Service Agreements, Leases, and more—customized, error-free, in minutes." },
  { bold: "Instant law-based answers:", text: " NyayaBot references IPC, CrPC, and statutes. Never offers unsupported guesses or risky advice." },
  { bold: "Summarize legalese clearly:", text: " Converts complex documents to actionable bullet points—no more overwhelm." },
  { bold: "100% secure & private:", text: " Your inputs are never stored. Try every feature, free—no registration required." },
  { bold: "Ready for modern practice:", text: " Spend less time on admin, more time acting on what matters." }
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'var(--ivo-background)' }}>
      {/* Ivo.ai Style Navigation */}
      <nav className="ivo-nav">
        <div className="ivo-container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, var(--ivo-secondary), #0099cc)'
              }}>
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--ivo-primary)' }}>LegalOps</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate("/")} className="ivo-nav-link">Home</button>
              <a href="/#tools-section" className="ivo-nav-link">Tools</a>
              <a href="#about" className="ivo-nav-link">About</a>
              <a href="#contact" className="ivo-nav-link">Contact</a>
            </div>

            <Button onClick={() => navigate("/")} className="ivo-btn-primary">
              Launch LegalOps
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="ivo-hero ivo-section relative">
          <div className="ivo-container">
            <div className="text-center mb-16 ivo-fade-in">
              <h1 className="ivo-text-hero mb-6">
                About LegalOps
              </h1>
              <p className="ivo-text-body max-w-4xl mx-auto">
                Power up your legal practice with intelligent, automated tools—built by lawyers, for lawyers.
              </p>
            </div>
          </div>
        </section>

        {/* Mission/Vision Section */}
        <section className="ivo-section">
          <div className="ivo-container">
            <div className="ivo-card max-w-4xl mx-auto p-8 md:p-12">
              <h2 className="ivo-text-heading text-center mb-6">Our Mission</h2>
              <p className="ivo-text-body text-center">
                LegalOps is designed for Indian lawyers, firms, and enterprises seeking <span className="font-semibold" style={{ color: 'var(--ivo-primary)' }}>speed, precision, and control</span>. We blend deep legal expertise with cutting-edge AI to help you draft, review, and understand legal documents—<strong>faster and smarter than ever before.</strong> Our goal is to handle the repetitive, time-consuming tasks, so you can focus on high-value legal work that truly matters.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="ivo-section" style={{ background: 'var(--ivo-gray-50)' }}>
          <div className="ivo-container">
            <Card className="ivo-card max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="ivo-text-heading text-center mb-4">Why Choose LegalOps?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {whyLegalOpsItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <span className="ivo-text-body">
                        <strong style={{ color: 'var(--ivo-primary)' }}>{item.bold}</strong>{item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="ivo-section">
          <div className="ivo-container">
            <div className="text-center mb-16">
              <h2 className="ivo-text-heading mb-6">Explore Our Features</h2>
            </div>

            {/* Role Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              <div className="ivo-card-feature text-center">
                <div className="ivo-icon mx-auto">
                  <Gavel className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ivo-primary)' }}>Practicing Lawyer</h3>
                <p className="ivo-text-small">Access tools designed for professionals—contracts, advanced Q&A, citation checker, and more.</p>
              </div>
              <div className="ivo-card-feature text-center">
                <div className="ivo-icon mx-auto">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ivo-primary)' }}>Law Student</h3>
                <p className="ivo-text-small">Get learning aids—flashcards, syllabus tracking, and Q&A built just for you.</p>
              </div>
            </div>

            {/* Tool Categories */}
            <div className="space-y-16">
              <div>
                <h3 className="ivo-text-subheading text-center mb-8">Lawyer Tools</h3>
                <div className="ivo-grid-features">
                  {lawyerTools.map((tool) => (
                    <Card key={tool.name} className="ivo-card-feature">
                      <CardHeader className="items-center text-center">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mb-4">
                          {tool.icon}
                        </div>
                        <CardTitle className="text-lg font-bold" style={{ color: 'var(--ivo-primary)' }}>{tool.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="ivo-text-subheading text-center mb-8">Student Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  {studentTools.map((tool) => (
                    <Card key={tool.name} className="ivo-card-feature">
                      <CardHeader className="items-center text-center">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mb-4">
                          {tool.icon}
                        </div>
                        <CardTitle className="text-lg font-bold" style={{ color: 'var(--ivo-primary)' }}>{tool.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <Button 
                onClick={() => navigate("/")}
                className="ivo-btn-primary text-lg px-8 py-4"
              >
                Try These Features <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="ivo-text-small mt-6 italic">
                This is not a substitute for professional legal advice.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Ivo.ai Style Footer */}
      <footer className="border-t py-20" style={{ background: 'var(--ivo-white)', borderColor: 'var(--ivo-gray-200)' }}>
        <div className="ivo-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, var(--ivo-secondary), #0099cc)'
                }}>
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

export default About;
