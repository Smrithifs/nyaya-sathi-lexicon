
import React from "react";
import LandingBackground from "../components/LandingBackground";
import LandingNav from "../components/LandingNav";
import { Scale } from "lucide-react";

const Index = () => {
  // Landing splash for root route
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <LandingBackground />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 animate-fade-in">
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-lg p-4">
            <Scale className="w-14 h-14 text-white drop-shadow-[0_0_12px_#fff6]" strokeWidth={1.5} />
          </span>
        </div>
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
      <footer className="absolute bottom-6 left-0 right-0 text-center z-10">
        <span className="text-xs text-white/40">© {new Date().getFullYear()} LegalOps. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Index;
