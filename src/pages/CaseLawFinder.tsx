import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, FileText } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { askPuter } from "@/utils/openaiApi";

const CaseLawFinder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [citationFormat, setCitationFormat] = useState("AIR");
  const [searchResults, setSearchResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      query: "",
      citationFormat: "AIR"
    }
  });

  const callPuterCompletion = async (prompt: string, systemInstruction: string) => {
    const fullPrompt = `${systemInstruction}\n\n${prompt}`;
    return await askPuter(fullPrompt);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Missing Query",
        description: "Please enter a search query, case name, or year range.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let prompt = "";

      if (/\d{4}\s*-\s*\d{4}/.test(searchQuery.trim())) {
        const [startYear, endYear] = searchQuery.match(/\d{4}/g);
        prompt = `🔍 You are a senior legal researcher trained in Indian jurisprudence. Generate 5 landmark Indian Supreme Court or High Court judgments from ${startYear} to ${endYear}.

For each case, follow this EXACT structure:

▶ **CASE TITLE:**  
▶ **CITATION:** [${citationFormat} format]  
▶ **DATE OF JUDGMENT:**  
▶ **COURT & BENCH:**  

**1. SUMMARY OF FACTS**  
• At least 300 words describing full chronology, parties involved, context, and procedural background.

**2. LEGAL ISSUES INVOLVED**  
• At least 200 words explaining primary and secondary constitutional or legal questions.

**3. JUDGMENT & HOLDING**  
• At least 400 words with detailed summary of reasoning, interpretation, outcome, and orders.

**4. RATIO DECIDENDI (LEGAL REASONING)**  
• At least 300 words explaining the legal principle(s) laid down and how the court arrived at it.

**5. LEGAL SIGNIFICANCE / PRECEDENTIAL VALUE**  
• At least 200 words discussing long-term impact, use in subsequent citations, and doctrinal shift.

Requirements:
- Each case minimum 1200 words
- Total 6000+ words for 5 cases
- Only Indian-origin judgments
- Citations in ${citationFormat} format only
- Use SCC Online/Manupatra/EBC databases format
- Academic/textbook writing style`;
      } else if (/\d{4}/.test(searchQuery.trim())) {
        const year = searchQuery.match(/\d{4}/)[0];
        prompt = `🔍 You are a senior legal researcher trained in Indian jurisprudence. Generate 5 landmark Indian Supreme Court or High Court judgments from the year ${year}.

For each case, follow this EXACT structure:

▶ **CASE TITLE:**  
▶ **CITATION:** [${citationFormat} format]  
▶ **DATE OF JUDGMENT:**  
▶ **COURT & BENCH:**  

**1. SUMMARY OF FACTS**  
• At least 300 words describing full chronology, parties involved, context, and procedural background.

**2. LEGAL ISSUES INVOLVED**  
• At least 200 words explaining primary and secondary constitutional or legal questions.

**3. JUDGMENT & HOLDING**  
• At least 400 words with detailed summary of reasoning, interpretation, outcome, and orders.

**4. RATIO DECIDENDI (LEGAL REASONING)**  
• At least 300 words explaining the legal principle(s) laid down and how the court arrived at it.

**5. LEGAL SIGNIFICANCE / PRECEDENTIAL VALUE**  
• At least 200 words discussing long-term impact, use in subsequent citations, and doctrinal shift.

Requirements:
- Each case minimum 1200 words
- Total 6000+ words for 5 cases
- Only Indian-origin judgments
- Citations in ${citationFormat} format only
- Use SCC Online/Manupatra/EBC databases format
- Academic/textbook writing style`;
      } else {
        prompt = `🔍 You are a senior legal researcher trained in Indian jurisprudence. Generate comprehensive legal brief for Indian case or topic: ${searchQuery}.

For each case, follow this EXACT structure:

▶ **CASE TITLE:**  
▶ **CITATION:** [${citationFormat} format]  
▶ **DATE OF JUDGMENT:**  
▶ **COURT & BENCH:**  

**1. SUMMARY OF FACTS**  
• At least 300 words describing full chronology, parties involved, context, and procedural background.

**2. LEGAL ISSUES INVOLVED**  
• At least 200 words explaining primary and secondary constitutional or legal questions.

**3. JUDGMENT & HOLDING**  
• At least 400 words with detailed summary of reasoning, interpretation, outcome, and orders.

**4. RATIO DECIDENDI (LEGAL REASONING)**  
• At least 300 words explaining the legal principle(s) laid down and how the court arrived at it.

**5. LEGAL SIGNIFICANCE / PRECEDENTIAL VALUE**  
• At least 200 words discussing long-term impact, use in subsequent citations, and doctrinal shift.

Requirements:
- Minimum 1200 words per case
- Only Indian-origin judgments
- Citations in ${citationFormat} format only
- Use SCC Online/Manupatra/EBC databases format
- Academic/textbook writing style
- Constitutional/statutory references as per Indian legal framework`;
      }

      const systemInstruction = `🧑‍⚖️ You are a senior legal research specialist in Indian Supreme Court jurisprudence. You MUST provide comprehensive Indian legal analysis ONLY. 

🎯 Your output is used by:
- Advocates filing briefs before Supreme Court
- Judiciary aspirants studying landmark case law
- Law professors preparing teaching material
- Legal scholars writing articles

NEVER include foreign cases. Focus exclusively on Indian constitutional law and statutory provisions. Write in formal academic/textbook format with precise legal terminology.

Each case brief must be structured exactly as specified with minimum word counts per section. Pull citations only from SCC Online/Manupatra/EBC databases format.`;

      const result = await callPuterCompletion(prompt, systemInstruction);

      setSearchResults(result);
      toast({
        title: "Case Analysis Ready",
        description: "Comprehensive Indian Supreme Court case briefs generated in textbook format."
      });
    } catch (error) {
      console.error('Error searching case law:', error);
      toast({
        title: "Error",
        description: "Failed to generate case analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>← Back to Dashboard</Button>
        <h1 className="text-2xl font-bold">🔍 Indian Supreme Court Case Law Finder</h1>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Generate Landmark Indian Judgments & Legal Briefs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Article 21, 2024, 2015-2020, Kesavananda Bharati"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  📝 Input: Year (2019) | Year Range (2015-2020) | Topic (Article 21) | Case Name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Citation Format
                </label>
                <select
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AIR">AIR (All India Reporter)</option>
                  <option value="SCC">SCC (Supreme Court Cases)</option>
                  <option value="SCR">SCR (Supreme Court Reports)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  📚 Choose preferred Indian legal citation format
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📌 Output Structure (Per Case):</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Case Title & Citation</strong> (AIR/SCC/SCR format)</li>
                <li>• <strong>Summary of Facts</strong> (300+ words)</li>
                <li>• <strong>Legal Issues</strong> (200+ words)</li>
                <li>• <strong>Judgment & Holding</strong> (400+ words)</li>
                <li>• <strong>Ratio Decidendi</strong> (300+ words)</li>
                <li>• <strong>Legal Significance</strong> (200+ words)</li>
                <li>• <strong>Minimum 1200 words per case</strong></li>
              </ul>
            </div>

            <Button onClick={handleSearch} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Legal Briefs...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> Generate Indian Case Law Analysis
                </>
              )}
            </Button>

            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <strong>🎓 Used by:</strong> Supreme Court Advocates, Judiciary Aspirants, Law Professors, Legal Scholars
              <br />
              <strong>📖 Format:</strong> Academic/Textbook style with verified Indian constitutional references
            </div>
          </CardContent>
        </Card>

        {searchResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Indian Supreme Court Case Briefs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed bg-gray-50 p-6 rounded-lg overflow-x-auto border">
                  {searchResults}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaseLawFinder;
