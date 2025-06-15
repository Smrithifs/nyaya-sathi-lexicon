import React from "react";
import LandingBackground from "../components/LandingBackground";
import TopNav from "../components/TopNav";
import { FileText, Bot, BookText, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SectionReveal from "../components/SectionReveal";

const features = [
  {
    label: "Contract Generator",
    icon: <FileText className="w-8 h-8 mx-auto text-blue-400" />,
    link: "/contract-generator",
    desc: (
      <>
        <b>Create legal agreements in seconds.</b><br />
        Generates fully-formatted contracts of any type. Specify parties, terms, and clauses—output is always professional.
      </>
    ),
  },
  {
    label: "NyayaBot Q&A",
    icon: <Bot className="w-8 h-8 mx-auto text-green-400" />,
    link: "/qabot",
    desc: (
      <>
        <b>AI legal answers based on Indian law.</b><br />
        Instant, accurate answers with law/section citations and examples. Never guesses or gives unsupported advice.
      </>
    ),
  },
  {
    label: "Summarizer",
    icon: <BookText className="w-8 h-8 mx-auto text-yellow-300" />,
    link: "/summarizer",
    desc: (
      <>
        <b>Turn long documents into clear summaries.</b><br />
        Extracts key obligations, dates, penalties and more—simple, actionable, concise and formal.
      </>
    ),
  },
];

const whyLegalOpsItems = [
    { bold: "Draft perfect contracts:", text: " Generate NDAs, Service Agreements, Leases, and more—customized, error-free, in minutes." },
    { bold: "Instant law-based answers:", text: " NyayaBot references IPC, CrPC, and statutes. Never offers unsupported guesses or risky advice." },
    { bold: "Summarize legalese clearly:", text: " Converts complex documents to actionable bullet points—no more overwhelm." },
    { bold: "100% secure & private:", text: " Your inputs are never stored. Try every feature, free—no registration required." },
    { bold: "Ready for modern practice:", text: " Spend less time on admin, more time acting on what matters." }
];


const About = () => (
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
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
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

      {/* Features Section */}
      <SectionReveal className="w-full">
        <section className="w-full max-w-6xl mx-auto px-2 pb-20 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 font-serif mt-4 text-center">
            Explore Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {features.map((f, i) => (
              <Card
                key={f.label}
                className="flex flex-col bg-black/30 backdrop-blur-lg border border-white/15 text-white shadow-lg group transition-all duration-300 hover:scale-105 hover:border-white/30"
              >
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-white/10 rounded-full mb-4 transition-all duration-300 group-hover:bg-white/20">{f.icon}</div>
                  <CardTitle className="text-xl font-bold text-white">{f.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-grow px-6">
                  <div className="text-base text-white/80">{f.desc}</div>
                </CardContent>
                <CardFooter className="justify-center pt-4 pb-6">
                  <Link
                    to={f.link}
                    className="inline-block px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold transition-all shadow-md hover:shadow-lg group-hover:scale-105"
                  >
                    Try Now
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </SectionReveal>
    </main>
  </div>
);

export default About;
