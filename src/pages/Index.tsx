
import React, { useState } from "react";
import LandingBackground from "../components/LandingBackground";
import LawSymbol from "../components/LawSymbol";
import TopNav from "../components/TopNav";
import { askPuter } from "../utils/openaiApi";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <LandingBackground />
      <TopNav />
      <main className="relative z-10 flex flex-col min-h-screen items-center justify-center w-full pt-32 pb-12 px-4">
        <div className="flex flex-col items-center">
          <LawSymbol className="w-24 h-24 mb-8 animate-scale-in" />
          <h1 className="font-serif text-7xl md:text-8xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_24px_#4852B7aa] animate-fade-in select-none">
            LegalOps
          </h1>
          <div className="mt-7 text-2xl md:text-3xl text-blue-100/90 font-semibold text-center animate-fade-in">
            Where law meets technology
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
