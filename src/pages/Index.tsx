
import React from "react";
import LandingBackground from "../components/LandingBackground";
import TopNav from "../components/TopNav";

const Index = () => (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden">
    <LandingBackground />
    <TopNav />
    <main className="relative z-10 flex flex-col min-h-screen items-center justify-center w-full pt-24">
      <h1 className="font-serif text-6xl md:text-8xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_24px_#6667] animate-fade-in select-none">
        LegalOps
      </h1>
    </main>
  </div>
);

export default Index;
