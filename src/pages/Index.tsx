
// Dashboard index page with navigation and routed content
import React, { useState } from "react";
import Summarizer from "./Summarizer";
import QABot from "./QABot";
import ContractGenerator from "./ContractGenerator";
import { BookOpen, Search, FilePen } from "lucide-react";

const NAV = [
  { label: "Summarizer", value: "summarizer", icon: BookOpen },
  { label: "Legal Q&A Bot", value: "qa", icon: Search },
  { label: "Contract Generator", value: "contract", icon: FilePen }
];

const DASH_BG =
  "bg-gradient-to-br from-slate-50 from-30% via-white to-blue-50 dark:from-neutral-900 dark:via-gray-900 dark:to-blue-900";

const Index = () => {
  const [active, setActive] = useState("summarizer");

  return (
    <div className={`${DASH_BG} min-h-screen`}>
      <nav className="flex w-full justify-center shadow bg-card/75 sticky top-0 z-10">
        <ul className="flex lg:gap-8 gap-2 py-4">
          {NAV.map(tab => (
            <li key={tab.value}>
              <button
                onClick={() => setActive(tab.value)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-md transition border font-medium text-base 
                  ${active === tab.value
                    ? "bg-primary text-primary-foreground shadow"
                    : "hover:bg-muted hover:text-primary/90 text-muted-foreground border-transparent"}`
                }
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="py-12 px-4 w-full">
        {active === "summarizer" && <Summarizer />}
        {active === "qa" && <QABot />}
        {active === "contract" && <ContractGenerator />}
      </div>
    </div>
  );
};

export default Index;
