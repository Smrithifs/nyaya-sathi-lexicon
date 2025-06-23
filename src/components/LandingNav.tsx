
import React from "react";
import { Link } from "react-router-dom";
import { FileText, Bot, BookText } from "lucide-react";

const navItems = [
  {
    label: "Contract Generator",
    to: "/contract-generator",
    icon: FileText,
    description: "Create legal agreements in seconds"
  },
  {
    label: "NyayaBot Q&A",
    to: "/qabot",
    icon: Bot,
    description: "Get legal questions answered"
  },
  {
    label: "Summarizer",
    to: "/summarizer",
    icon: BookText,
    description: "Summarize legal documents"
  },
];

const LandingNav: React.FC = () => (
  <nav className="mt-12 flex flex-col items-center">
    <ul className="flex flex-col sm:flex-row gap-6">
      {navItems.map(({ label, to, icon: Icon, description }) => (
        <li key={label}>
          <Link
            to={to}
            className="group flex flex-col items-center bg-white/5 border border-white/20 rounded-xl px-5 py-4 min-w-[175px] transition hover:scale-105 hover:bg-white/10 shadow-lg backdrop-blur-sm"
          >
            <Icon className="w-8 h-8 text-white drop-shadow-[0_1px_8px_#fff9]" strokeWidth={1.5} />
            <span className="mt-2 text-lg font-bold text-white tracking-wide">{label}</span>
            <span className="text-xs text-white/60 mt-1 text-center">{description}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default LandingNav;
