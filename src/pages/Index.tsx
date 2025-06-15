
import React from "react";
import LandingBackground from "../components/LandingBackground";
import { Scale, FileText, Bot, BookText } from "lucide-react";
import { Link } from "react-router-dom";

// --- Main landing page layout as described ---
const featureDemos = [
  {
    label: "Contract Generator",
    icon: <FileText className="w-8 h-8 mb-3 mx-auto text-white" />,
    link: "/contract-generator",
    desc: "Create legal agreements in seconds"
  },
  {
    label: "NyayaBot Q&A",
    icon: <Bot className="w-8 h-8 mb-3 mx-auto text-white" />,
    link: "/qabot",
    desc: "Get legal questions answered"
  },
  {
    label: "Summarizer",
    icon: <BookText className="w-8 h-8 mb-3 mx-auto text-white" />,
    link: "/summarizer",
    desc: "Summarize legal documents"
  },
];
const Index = () => (
  <div className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden bg-transparent">
    <LandingBackground />
    {/* Splash: LegalOps Branding (centered, visually prominent) */}
    <section className="relative w-full flex flex-col items-center pt-32 md:pt-40 pb-12 z-10 min-h-[72vh]">
      <span className="inline-flex items-center justify-center rounded-full bg-black/35 border border-white/10 shadow-lg p-5 mb-6">
        <Scale className="w-16 h-16 text-white drop-shadow-[0_0_16px_#fff7]" strokeWidth={1.7} />
      </span>
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_#6667] font-serif select-none animate-fade-in"
          style={{ letterSpacing: ".06em" }}>
        LegalOps
      </h1>
      <p className="mt-4 text-2xl md:text-3xl text-white/80 font-medium animate-fade-in" style={{ animationDelay: "0.3s" }}>
        Where Law Meets Technology
      </p>
      <div className="flex flex-row justify-center gap-8 mt-12 w-full max-w-4xl animate-fade-in">
        {featureDemos.map(f => (
          <Link
            key={f.label}
            to={f.link}
            className="w-full max-w-xs px-6 py-7 min-h-[162px] flex-1 rounded-2xl border border-white/20 bg-white/3 shadow-xl hover:scale-105 hover:bg-white/10 transition group flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {f.icon}
            <div className="text-lg font-bold text-white mb-0">{f.label}</div>
            <div className="text-sm text-white/70 mt-1 font-normal">{f.desc}</div>
          </Link>
        ))}
      </div>
      <a href="#about" className="absolute left-1/2 -translate-x-1/2 bottom-3 mt-10 animate-bounce text-white/70 hover:text-white/90 text-lg font-bold font-serif cursor-pointer">
        <span className="underline">About LegalOps</span>
      </a>
    </section>
    {/* About Section */}
    <section
      id="about"
      className="relative w-full max-w-3xl px-4 py-20 text-center z-10 bg-opacity-70 bg-gradient-to-t from-[#20202aee] to-transparent rounded-xl flex flex-col items-center animate-fade-in"
      style={{ scrollMarginTop: 80 }}
    >
      <h2 className="text-4xl font-extrabold text-white mb-6 font-serif tracking-tight drop-shadow">
        About LegalOps
      </h2>
      <div className="text-xl text-white/90 leading-relaxed mb-2 font-medium">
        Built for lawyers, law firms, and businesses who want to work smarter.
      </div>
      <p className="text-lg text-white/85 font-light leading-normal mt-2 mb-3">
        LegalOps unites legal expertise with cutting-edge AI to transform how you create, review, and understand legal documents.<br/>
        <span className="font-medium text-white/95">Automate routine work, minimize risk, and speed up your workflow</span> with confidence—no technical experience required. 
        <br /><br />
        <span className="font-semibold text-white/95">Why choose LegalOps?</span>
        <ul className="list-disc list-inside text-left text-white/80 text-base mt-3 mb-6 space-y-1 mx-auto max-w-2xl">
          <li>Draft precise contracts in minutes, not hours</li>
          <li>Instant legal answers from the trusted NyayaBot (trained on Indian law)</li>
          <li>Summarize multi-page legalese into clear, actionable insights</li>
          <li>Secure, private, and 100% free to try</li>
          <li>No registration required – get started immediately</li>
        </ul>
        <span className="text-white/90 font-light">
          Experience the most advanced legal automation toolkit for the modern lawyer.<br />
          <b>Power up your legal practice today!</b>
        </span>
      </p>
    </section>
    {/* Demo Features ("Try our tools") - below about */}
    <section id="demos" className="relative w-full max-w-5xl px-4 py-16 z-10 flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-serif">Try Our Free Demo Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Contract Generator Demo */}
        <div className="flex flex-col items-center">
          <span className="mb-2 rounded-full bg-white/5 p-3 border border-white/20">
            <FileText className="w-8 h-8 text-white" />
          </span>
          <div className="mb-2 font-semibold text-white/90">Contract Generator</div>
          <div className="text-sm text-white/70 mb-4 text-center">Generate professional legal contracts with full clause structure.</div>
          <Link to="/contract-generator" className="inline-block px-4 py-2 rounded bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold transition-all shadow">
            Try Now
          </Link>
        </div>
        {/* Q&A Bot Demo */}
        <div className="flex flex-col items-center">
          <span className="mb-2 rounded-full bg-white/5 p-3 border border-white/20">
            <Bot className="w-8 h-8 text-white" />
          </span>
          <div className="mb-2 font-semibold text-white/90">NyayaBot Q&amp;A</div>
          <div className="text-sm text-white/70 mb-4 text-center">Ask legal questions—get answers with references to Indian law.</div>
          <Link to="/qabot" className="inline-block px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white text-sm font-bold transition-all shadow">
            Ask NyayaBot
          </Link>
        </div>
        {/* Summarizer Demo */}
        <div className="flex flex-col items-center">
          <span className="mb-2 rounded-full bg-white/5 p-3 border border-white/20">
            <BookText className="w-8 h-8 text-white" />
          </span>
          <div className="mb-2 font-semibold text-white/90">Summarizer</div>
          <div className="text-sm text-white/70 mb-4 text-center">Summarize lengthy legal docs into clear, actionable bullet points.</div>
          <Link to="/summarizer" className="inline-block px-4 py-2 rounded bg-yellow-700 hover:bg-yellow-800 text-white text-sm font-bold transition-all shadow">
            Summarize Now
          </Link>
        </div>
      </div>
      <div className="mt-10 text-center text-white/60 text-sm">
        For the full experience, try each tool above—free to all users!
      </div>
    </section>
    {/* Footer */}
    <footer className="w-full text-center z-10 py-8 mt-8">
      <span className="text-xs text-white/40">© {new Date().getFullYear()} LegalOps. All rights reserved.</span>
    </footer>
  </div>
);
export default Index;
