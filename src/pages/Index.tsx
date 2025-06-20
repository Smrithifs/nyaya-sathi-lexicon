import React, { useState } from "react";
import LandingBackground from "../components/LandingBackground";
import LawSymbol from "../components/LawSymbol";
import TopNav from "../components/TopNav";
import { askPuter } from "../utils/openaiApi";

const Index = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const result = await askPuter("Explain Article 14 of the Indian Constitution.");
      setResponse(result);
    } catch (error) {
      setResponse("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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

        {/* ✅ Ask Puter Test */}
        <div className="mt-12 w-full max-w-3xl text-center">
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            {loading ? "Asking AI..." : "Ask AI about Article 14"}
          </button>

          {response && (
            <div className="mt-6 p-4 bg-white rounded-lg text-left whitespace-pre-wrap text-sm text-gray-900 shadow-md">
              {response}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;

