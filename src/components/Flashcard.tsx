
import React, { useState } from "react";

// Nice palette of colors for cards
const COLORS = [
  "bg-gradient-to-r from-fuchsia-500 to-pink-500",
  "bg-gradient-to-r from-cyan-500 to-blue-500",
  "bg-gradient-to-r from-green-400 to-lime-400",
  "bg-gradient-to-r from-yellow-400 to-orange-500",
  "bg-gradient-to-r from-violet-500 to-blue-400",
  "bg-gradient-to-r from-pink-400 to-rose-500",
  "bg-gradient-to-r from-emerald-400 to-teal-500",
];

interface FlashcardProps {
  question: string;
  answer: string;
  colorIdx?: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer, colorIdx = 0 }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`w-[280px] h-[175px] md:w-[340px] md:h-[195px] perspective-1000 cursor-pointer`}
      onClick={() => setFlipped(!flipped)}
      title={flipped ? "Show question" : "Show answer"}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") setFlipped(f => !f);
      }}
      role="button"
      aria-pressed={flipped}
      style={{ outline: "none" }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform ${flipped ? "rotate-y-180" : ""}`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front (Question) */}
        <div
          className={`absolute inset-0 flex flex-col justify-center items-center rounded-xl shadow-xl text-white px-4 py-3 text-lg font-semibold select-none ${COLORS[colorIdx % COLORS.length]} ` +
            (!flipped ? "z-10" : "z-0")}
          style={{
            backfaceVisibility: "hidden",
            minHeight: 120,
          }}
        >
          <div className="mb-2 text-base font-bold uppercase tracking-wide">Flashcard</div>
          <div className="text-lg md:text-xl text-center break-words">{question}</div>
          <div className="text-xs mt-3 opacity-70">Click to flip</div>
        </div>
        {/* Back (Answer) */}
        <div
          className={`absolute inset-0 flex flex-col justify-center items-center rounded-xl shadow-xl bg-white text-gray-900 px-4 py-3 text-lg font-semibold select-text ${COLORS[colorIdx % COLORS.length]}`}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            minHeight: 120,
          }}
        >
          <div className="mb-2 text-base font-bold uppercase tracking-wide text-gray-900">Answer</div>
          <div className="text-lg md:text-xl text-center break-words">{answer}</div>
          <div className="text-xs mt-3 opacity-50">Click to flip back</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
