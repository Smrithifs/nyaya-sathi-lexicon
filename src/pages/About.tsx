
import React, { useState } from "react";
import LandingBackground from "../components/LandingBackground";
import TopNav from "../components/TopNav";
import {
  Gavel, BookOpen, Layers, FileEdit, Bot, Search, Landmark, Wand2,
  BookText, AudioLines, Brain, Users, Languages
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionReveal from "../components/SectionReveal";
import { Button } from "@/components/ui/button";
import RoleFeatureChat from "./RoleFeatureChat";

const lawyerTools = [
  { name: "Contract Generator", icon: <FileEdit className="w-7 h-7 text-blue-600" /> },
  { name: "Legal Q&A (NyayaBot)", icon: <Gavel className="w-7 h-7 text-yellow-700" /> },
  { name: "Case Law Finder", icon: <Search className="w-7 h-7 text-green-600" /> },
  { name: "Section Explainer", icon: <Landmark className="w-7 h-7 text-gray-600" /> },
  { name: "Bare Act Navigator", icon: <BookOpen className="w-7 h-7 text-amber-700" /> },
  { name: "Legal Draft Templates", icon: <Layers className="w-7 h-7 text-purple-600" /> },
  { name: "Voice Dictation → Legal Format", icon: <AudioLines className="w-7 h-7 text-pink-600" /> },
  { name: "Multi-Language Support", icon: <Languages className="w-7 h-7 text-blue-700" /> },
  { name: "Citation Checker", icon: <Wand2 className="w-7 h-7 text-lime-700" /> },
  { name: "Client Brief Summary Tool", icon: <Brain className="w-7 h-7 text-indigo-700" /> },
  { name: "Hearing/Deadline Tracker", icon: <Users className="w-7 h-7 text-orange-700" /> }
];
const studentTools = [
  { name: "Topic-Wise Quiz Generator", icon: <Brain className="w-7 h-7 text-blue-600" /> },
  { name: "Case Brief Generator", icon: <Layers className="w-7 h-7 text-gray-700" /> },
  { name: "Flashcards (Legal Terms)", icon: <Wand2 className="w-7 h-7 text-yellow-700" /> },
  { name: "Syllabus Tracker", icon: <BookOpen className="w-7 h-7 text-purple-600" /> },
  { name: "Law News Digest", icon: <Landmark className="w-7 h-7 text-green-700" /> },
  { name: "Doubt Forum (Ask Senior)", icon: <Users className="w-7 h-7 text-pink-700" /> },
  { name: "Mock Test Generator", icon: <FileEdit className="w-7 h-7 text-indigo-700" /> },
  { name: "Study Plan Generator", icon: <BookOpen className="w-7 h-7 text-blue-700" /> },
  { name: "Legal Q&A (NyayaBot)", icon: <Gavel className="w-7 h-7 text-yellow-700" /> },
  { name: "Case Explainer", icon: <Search className="w-7 h-7 text-orange-700" /> },
];

const whyLegalOpsItems = [
  { bold: "Draft perfect contracts:", text: " Generate NDAs, Service Agreements, Leases, and more—customized, error-free, in minutes." },
  { bold: "Instant law-based answers:", text: " NyayaBot references IPC, CrPC, and statutes. Never offers unsupported guesses or risky advice." },
  { bold: "Summarize legalese clearly:", text: " Converts complex documents to actionable bullet points—no more overwhelm." },
  { bold: "100% secure & private:", text: " Your inputs are never stored. Try every feature, free—no registration required." },
  { bold: "Ready for modern practice:", text: " Spend less time on admin, more time acting on what matters." }
];

const roleColumnStyles = "flex-1 min-w-[220px] max-w-xs bg-gradient-to-br from-blue-900/70 to-blue-700/60 hover:from-blue-700/80 hover:to-yellow-400/95 border border-white/10 rounded-xl shadow-lg px-7 py-10 m-4 text-white text-center flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 outline-none focus:ring-2 focus:ring-blue-300";
const selectedRoleStyles = "ring-4 ring-yellow-300 border-yellow-300";
const roleIconCommon = "mx-auto mb-2 rounded-full bg-white/10 p-4 w-16 h-16 flex items-center justify-center";

const About = () => {
  const [role, setRole] = useState<"lawyer" | "student" | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-transparent">
      <LandingBackground />
      <TopNav />
      <main className="relative z-10 w-full flex flex-col items-center px-4">
        {/* Hero Section */}
        <section className="w-full text-center pt-28 pb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold font-serif tracking-tight text-white mb-6 drop-shadow-lg animate-fade-in">
            About LegalOps
          </h1>
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-white/90 leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '200ms' }}>
            Power up your legal practice with intelligent, automated tools—built by lawyers, for lawyers.
          </p>
        </section>

        {/* Mission/Vision Section */}
        <SectionReveal className="w-full">
          <section className="max-w-4xl w-full mx-auto pb-16">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10 shadow-xl">
              <h2 className="text-3xl font-bold text-blue-200 mb-6 font-serif text-center">Our Mission</h2>
              <p className="text-lg text-white/85 leading-relaxed text-center">
                LegalOps is designed for Indian lawyers, firms, and enterprises seeking <span className="font-semibold text-white">speed, precision, and control</span>. We blend deep legal expertise with cutting-edge AI to help you draft, review, and understand legal documents—<b>faster and smarter than ever before.</b> Our goal is to handle the repetitive, time-consuming tasks, so you can focus on high-value legal work that truly matters.
              </p>
            </div>
          </section>
        </SectionReveal>

        {/* Why Choose Us Section */}
        <SectionReveal className="w-full">
          <section className="max-w-4xl w-full mx-auto pb-16">
            <Card className="bg-gradient-to-br from-[#23233c]/90 to-[#1a1a2e]/90 backdrop-blur-lg border-white/10 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-blue-200 font-serif text-center mb-4">Why Choose LegalOps?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {whyLegalOpsItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <svg className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
                      <span className="text-lg text-white/90">
                        <b>{item.bold}</b>{item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </SectionReveal>

        {/* Features Section + Role Selector */}
        <SectionReveal className="w-full">
          <section className="w-full max-w-6xl mx-auto px-2 pb-20 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 font-serif mt-4 text-center">
              Explore Our Features
            </h2>
            {/* Floating role selection columns */}
            <div className="w-full flex flex-wrap justify-center gap-6 mb-10">
              <div
                tabIndex={0}
                className={`${roleColumnStyles} ${role === "lawyer" ? selectedRoleStyles : ""}`}
                onClick={() => { setRole("lawyer"); setSelectedFeature(null); }}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && setRole("lawyer")}
                aria-label="Practicing Lawyer"
              >
                <div className={`${roleIconCommon}  bg-blue-500/20`}>
                  <Gavel className="w-10 h-10 text-yellow-200" />
                </div>
                <div className="text-xl font-bold mb-2 font-serif">Practicing Lawyer</div>
                <div className="text-base text-white/80">Access tools designed for professionals—contracts, advanced Q&amp;A, citation checker, and more.</div>
              </div>
              <div
                tabIndex={0}
                className={`${roleColumnStyles} ${role === "student" ? selectedRoleStyles : ""}`}
                onClick={() => { setRole("student"); setSelectedFeature(null); }}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && setRole("student")}
                aria-label="Law Student"
              >
                <div className={`${roleIconCommon}  bg-yellow-500/20`}>
                  <BookOpen className="w-10 h-10 text-blue-300" />
                </div>
                <div className="text-xl font-bold mb-2 font-serif">Law Student</div>
                <div className="text-base text-white/80">Get learning aids—case briefings, study plans, quizzes and doubt forum built just for you.</div>
              </div>
            </div>
            {/* Show relevant features based on role */}
            {role && (
              <div className="w-full flex flex-col items-center animate-fade-in">
                {!selectedFeature ? (
                  <>
                    <div className="mb-6 flex justify-center">
                      <Button variant="ghost" className="text-white/70 underline underline-offset-2" onClick={() => setRole(null)}>
                        ← Change role
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full">
                      {(role === "lawyer" ? lawyerTools : studentTools).map((tool) => (
                        <Card
                          key={tool.name}
                          onClick={() => setSelectedFeature(tool.name)}
                          className="flex flex-col bg-black/30 backdrop-blur-lg border border-white/15 text-white shadow-lg group transition-all duration-300 hover:scale-105 hover:border-yellow-200 cursor-pointer max-w-xs mx-auto focus:ring-2 focus:ring-yellow-300"
                          tabIndex={0}
                          role="button"
                        >
                          <CardHeader className="items-center text-center">
                            <div className="p-4 bg-white/10 rounded-full mb-4 transition-all duration-300 group-hover:bg-white/20">
                              {tool.icon}
                            </div>
                            <CardTitle className="text-lg font-bold text-white font-serif">{tool.name}</CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    <div className="text-xs text-gray-300 mt-6 text-center italic w-full">
                      This is not a substitute for professional legal advice.
                    </div>
                  </>
                ) : (
                  <RoleFeatureChat
                    featureName={selectedFeature}
                    role={role}
                    onBack={() => setSelectedFeature(null)}
                  />
                )}
              </div>
            )}
          </section>
        </SectionReveal>
      </main>
    </div>
  );
};

export default About;
