
import React from "react";
import LandingBackground from "../components/LandingBackground";
import LawSymbol from "../components/LawSymbol";
import TopNav from "../components/TopNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <LandingBackground />
      <TopNav />
      <main className="relative z-10 flex flex-col min-h-screen items-center justify-center w-full px-4">
        <div className="flex flex-col items-center">
          <LawSymbol className="w-24 h-24 mb-8 animate-scale-in" />
          <h1 className="font-serif text-7xl md:text-8xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_24px_#4852B7aa] animate-fade-in select-none">
            LegalOps
          </h1>
          <div className="mt-7 text-2xl md:text-3xl text-blue-100/90 font-semibold text-center animate-fade-in">
            Where law meets technology
          </div>
          
          <div className="mt-12">
            <Button 
              onClick={() => navigate("/tools")} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg"
            >
              Explore Tools & Features →
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
