
import React, { useState } from "react";
import LandingBackground from "../components/LandingBackground";
import LandingNav from "../components/LandingNav";
import { Scale, Wand2, Bot, BookText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Mini "demo contract" -- short, not replacing full tool
const DemoContract = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [out, setOut] = useState<string | null>(null);
  return (
    <div className="p-4 bg-black/30 rounded-xl border border-white/10 w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <Input placeholder="Party A" value={a} onChange={e=>setA(e.target.value)} className="bg-black/60 text-white border-white/20" />
        <Input placeholder="Party B" value={b} onChange={e=>setB(e.target.value)} className="bg-black/60 text-white border-white/20" />
      </div>
      <Button className="mt-3 w-full" onClick={() => setOut(a && b ? `Demo NDA between ${a} and ${b} [content hidden]` : null)} disabled={!a || !b}>
        <Wand2 className="inline-block mr-2" /> Generate Demo
      </Button>
      {out && <div className="mt-3 text-sm text-white/80 bg-white/5 p-2 rounded">{out}</div>}
    </div>
  );
};

// Mini Q&A bot demo
const DemoQABot = () => {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState<string | null>(null);
  return (
    <div className="p-4 bg-black/30 rounded-xl border border-white/10 w-full max-w-md mx-auto">
      <Textarea
        placeholder="e.g. What is theft under IPC?"
        value={q}
        onChange={e=>setQ(e.target.value)}
        className="bg-black/60 text-white border-white/20"
        rows={2}
      />
      <Button className="mt-3 w-full" onClick={() => setAns(q ? 'Section 378 IPC: Theft means dishonestly taking property... (demo)' : null)} disabled={!q}>
        <Bot className="inline-block mr-2" /> Ask Demo Bot
      </Button>
      {ans && <div className="mt-3 text-sm text-white/80 bg-white/5 p-2 rounded">{ans}</div>}
    </div>
  );
};

// Mini summarizer demo
const DemoSummarizer = () => {
  const [txt, setTxt] = useState("");
  const [sum, setSum] = useState<string | null>(null);
  return (
    <div className="p-4 bg-black/30 rounded-xl border border-white/10 w-full max-w-md mx-auto">
      <Textarea
        placeholder="Paste legal paragraph here…"
        value={txt}
        onChange={e=>setTxt(e.target.value)}
        className="bg-black/60 text-white border-white/20"
        rows={2}
      />
      <Button className="mt-3 w-full" onClick={() => setSum(txt ? 'Short summary: (demo)' : null)} disabled={!txt}>
        <BookText className="inline-block mr-2" /> Summarize Demo
      </Button>
      {sum && <div className="mt-3 text-sm text-white/80 bg-white/5 p-2 rounded">{sum}</div>}
    </div>
  );
};

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden bg-transparent">
      <LandingBackground />
      {/* Splash section */}
      <section className="relative w-full flex flex-col items-center pt-28 pb-12 z-10 min-h-[60vh]">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center justify-center rounded-full bg-black/30 border border-white/10 shadow-lg p-4 mb-4">
            <Scale className="w-14 h-14 text-white drop-shadow-[0_0_12px_#fff6]" strokeWidth={1.5} />
          </span>
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white drop-shadow-[0_4px_24px_#8889] font-serif select-none animate-fade-in"
            style={{ letterSpacing: ".07em" }}
          >
            LegalOps
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-white/70 font-medium animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Where Law Meets Technology
          </p>
          <LandingNav />
        </div>
      </section>
      {/* About */}
      <section id="about" className="relative w-full max-w-3xl px-4 text-center py-16 z-10">
        <h2 className="text-3xl font-bold text-white mb-4 font-serif">About LegalOps</h2>
        <p className="text-lg text-white/80 font-light leading-relaxed">
          LegalOps empowers you to bridge the gap between law and technology with intelligent document automation, legal insights, and contract tools.<br />
          Instantly generate contracts, receive legal answers from NyayaBot, and summarize legal documents—all free to try. We make legal solutions simple and accessible.
        </p>
      </section>
      {/* Demo tools */}
      <section id="demos" className="relative w-full max-w-6xl px-4 py-16 z-10 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-serif">Try Our Free Demos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Contract Generator Demo */}
          <div className="flex flex-col items-center">
            <span className="mb-2 rounded-full bg-white/5 p-3 border border-white/20">
              <Wand2 className="w-8 h-8 text-white" />
            </span>
            <div className="mb-2 font-semibold text-white/90">Contract Generator</div>
            <DemoContract />
          </div>
          {/* Q&A Bot Demo */}
          <div className="flex flex-col items-center">
            <span className="mb-2 rounded-full bg-white/5 p-3 border border-white/20">
              <Bot className="w-8 h-8 text-white" />
            </span>
            <div className="mb-2 font-semibold text-white/90">NyayaBot Q&amp;A</div>
            <DemoQABot />
          </div>
          {/* Summarizer Demo */}
          <div className="flex flex-col items-center">
            <span className="mb-2 rounded-full bg-white/5 p-3 border border-white/20">
              <BookText className="w-8 h-8 text-white" />
            </span>
            <div className="mb-2 font-semibold text-white/90">Summarizer</div>
            <DemoSummarizer />
          </div>
        </div>
        {/* Encourage further navigation */}
        <div className="mt-10 text-center text-white/60 text-sm">
          Want full features? Use the navigation above to explore the complete tools!
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full text-center z-10 py-8 mt-8">
        <span className="text-xs text-white/40">© {new Date().getFullYear()} LegalOps. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Index;
