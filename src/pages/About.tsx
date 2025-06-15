import React from "react";
import LandingBackground from "../components/LandingBackground";
import TopNav from "../components/TopNav";
import { FileText, Bot, BookText } from "lucide-react";
import { Link } from "react-router-dom";

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

const About = () => (
  <div className="relative min-h-screen flex flex-col items-center bg-transparent">
    <LandingBackground />
    <TopNav />
    <main className="relative z-10 w-full flex flex-col items-center">
      <section className="max-w-3xl w-full mx-auto px-6 pt-28 pb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white mb-7 drop-shadow">
          About LegalOps
        </h1>
        <div className="text-xl text-white/90 leading-relaxed mb-4 font-medium">
          Power up your legal practice with intelligent, automated tools—built by lawyers, for lawyers.
        </div>
        <div className="text-lg text-white/85 font-light leading-relaxed mb-7">
          LegalOps is designed for Indian lawyers, firms, and enterprises seeking <span className="font-semibold text-white">speed, precision, and control</span>.<br className="hidden md:block"/>
          We blend deep legal expertise with cutting-edge AI to help you draft, review, and understand legal documents—<b>faster and smarter than ever before.</b>
        </div>
        <div className="rounded-xl bg-[#23233c]/90 px-6 py-8 mt-2 shadow-lg flex flex-col items-center gap-3 border border-white/10 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-200 mb-2 font-serif text-center">Why choose LegalOps?</h2>
          <ul className="list-disc pl-6 pr-0 text-base md:text-lg text-white/80 space-y-2">
            <li><b>Draft perfect contracts:</b> Generate NDAs, Service Agreements, Leases, and more—customized, error-free, in minutes.</li>
            <li><b>Instant law-based answers:</b> NyayaBot references IPC, CrPC, and statutes. Never offers unsupported guesses or risky advice.</li>
            <li><b>Summarize legalese clearly:</b> Converts complex documents to actionable bullet points—no more overwhelm.</li>
            <li><b>100% secure &amp; private:</b> Your inputs are never stored. Try every feature, free—no registration required.</li>
            <li><b>Ready for modern practice:</b> Spend less time on admin, more time acting on what matters.</li>
          </ul>
        </div>
      </section>
      <section className="w-full md:max-w-4xl mx-auto px-2 pb-20 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-serif mt-4 text-center">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {features.map(f => (
            <div
              key={f.label}
              className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/3 shadow-lg p-6 group transition hover:scale-105 hover:bg-white/10"
            >
              {f.icon}
              <div className="text-lg font-bold text-white mb-1 text-center">{f.label}</div>
              <div className="text-sm text-white/70 mt-2 text-center">{f.desc}</div>
              <Link
                to={f.link}
                className="mt-4 inline-block px-4 py-2 rounded bg-blue-700 hover:bg-blue-900 text-white text-sm font-bold transition-all shadow"
              >
                Try Now
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default About;
