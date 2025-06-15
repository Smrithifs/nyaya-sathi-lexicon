
import React from "react";
import LandingBackground from "../components/LandingBackground";
import TopNav from "../components/TopNav";
import { Waves } from "lucide-react";

const LadyOfJustice = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 64 64"
    aria-label="Lady of Justice"
    fill="none"
    className="mx-auto my-2"
  >
    <g filter="url(#shadow)">
      <ellipse cx="32" cy="61" rx="16" ry="3" fill="#132d4a" fillOpacity="0.33" />
      <path d="M23 36a9 10 0 0 0 18 0" stroke="#ccd6f6" strokeWidth="2"/>
      <ellipse cx="32" cy="24" rx="7" ry="11" fill="#fff" stroke="#4069b1" strokeWidth="2"/>
      <path d="M29 13c2.5-4.5 8.5-4.5 11 0" stroke="#4069b1" strokeWidth="2" strokeLinecap="round"/>
      <rect x="27" y="8" width="10" height="3" rx="1.5" fill="#1b2949" />
      {/* Scales */}
      <path d="M18 21 L32 35 L46 21" stroke="#f6c543" strokeWidth="2"/>
      <circle cx="18" cy="21" r="2.5" fill="#f6c543"/>
      <circle cx="46" cy="21" r="2.5" fill="#f6c543"/>
      {/* Sword */}
      <rect x="31" y="33" width="2" height="12" rx="1" fill="#768edb"/>
      <polygon points="29,45 35,45 32,55" fill="#b8c2e6"/>
    </g>
    <defs>
      <filter id="shadow" x="0" y="0" width="64" height="72" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#222d" />
      </filter>
    </defs>
  </svg>
);

const Index = () => (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden">
    <LandingBackground />
    <TopNav />
    <main className="relative z-10 flex flex-col min-h-screen items-center justify-center w-full pt-24">
      {/* LegalOps - Main Heading */}
      <h1 className="font-serif text-6xl md:text-8xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_24px_#4852B7aa] animate-fade-in select-none">
        LegalOps
      </h1>
      {/* Subtitle */}
      <div className="mt-6 text-2xl md:text-3xl text-blue-200/90 font-semibold text-center animate-fade-in">
        Where law meets technology
      </div>
      {/* Lady of Justice Symbol */}
      <div className="mt-5 animate-scale-in">
        <LadyOfJustice />
      </div>
      {/* Decorative Waves Accent */}
      <div className="mt-5">
        <Waves className="mx-auto h-10 w-24 text-blue-300/70 drop-shadow-[0_1px_10px_#00eaff80]" />
      </div>
    </main>
  </div>
);

export default Index;

