
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import ContractGenerator from "./pages/ContractGenerator";
import QABot from "./pages/QABot";
import Summarizer from "./pages/Summarizer";
import ToolsAndFeatures from "./pages/ToolsAndFeatures";
import CaseLawFinder from "./pages/CaseLawFinder";
import SectionExplainer from "./pages/SectionExplainer";
import BareActNavigator from "./pages/BareActNavigator";
import LegalDraftTemplates from "./pages/LegalDraftTemplates";
import LegalDraftGenerator from "./pages/LegalDraftGenerator";
import VoiceDictation from "./pages/VoiceDictation";
import MultiLanguageSupport from "./pages/MultiLanguageSupport";
import CitationChecker from "./pages/CitationChecker";
import HearingTracker from "./pages/HearingTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contract-generator" element={<ContractGenerator />} />
          <Route path="/legal-qna" element={<QABot />} />
          <Route path="/summarizer" element={<Summarizer />} />
          <Route path="/tools" element={<ToolsAndFeatures />} />
          {/* New dedicated feature routes */}
          <Route path="/case-law-finder" element={<CaseLawFinder />} />
          <Route path="/section-explainer" element={<SectionExplainer />} />
          <Route path="/bare-act-navigator" element={<BareActNavigator />} />
          <Route path="/legal-draft-templates" element={<LegalDraftTemplates />} />
          <Route path="/legal-draft-generator" element={<LegalDraftGenerator />} />
          <Route path="/voice-dictation" element={<VoiceDictation />} />
          <Route path="/multi-language-support" element={<MultiLanguageSupport />} />
          <Route path="/citation-checker" element={<CitationChecker />} />
          <Route path="/hearing-tracker" element={<HearingTracker />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
