
import React from "react";
import LandingBackground from "../components/LandingBackground";

const Index = () => (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden">
    <LandingBackground />
    <main className="relative z-10 flex flex-col min-h-screen items-center justify-center w-full pt-32 pb-12 px-4">
      <h1 className="font-serif text-7xl md:text-8xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_24px_#4852B7aa] animate-fade-in select-none">
        LegalOps
      </h1>
      <div className="mt-7 text-2xl md:text-3xl text-blue-100/90 font-semibold text-center animate-fade-in">
        Where law meets technology
      </div>
      {/* Lady Justice image, centered */}
      <img
        src="/lovable-uploads/362a5a40-46a3-4cb0-a833-bbfc134de9a1.png"
        alt="Lady Justice statue"
        className="mt-10 rounded-xl max-w-[320px] md:max-w-[410px] w-full shadow-lg animate-scale-in border-2 border-blue-100/20"
        style={{ background: "rgba(34, 44, 79, 0.12)" }}
      />
    </main>
  </div>
);

export default Index;
