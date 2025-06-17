
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Search, FileText } from "lucide-react";

const CaseLawFinder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [searchType, setSearchType] = useState("general"); // general, year-range, topic-specific
  const [searchResults, setSearchResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Missing Query",
        description: "Please enter a search query.",
        variant: "destructive"
      });
      return;
    }

    if (searchType === "year-range" && (!startYear || !endYear)) {
      toast({
        title: "Missing Year Range",
        description: "Please enter both start and end years for year-range search.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let prompt = "";
      
      if (searchType === "year-range") {
        prompt = `Find and provide detailed information about major Supreme Court of India cases between ${startYear} and ${endYear} related to: "${searchQuery}"

For each case, provide the following detailed format:

**Case Title:** [Full case name]
**Citation:** [Case citation with year]
**Date of Judgment:** [DD Month YYYY]
**Court & Bench:** [Supreme Court of India - Justice names]
**Summary of Facts:** [Brief factual background]
**Key Issue(s) Involved:** [Legal questions before the court]
**Judgment and Holding:** [Court's decision and ruling]
**Ratio Decidendi:** [Legal reasoning and principle established]
**Legal Significance:** [Precedent value and impact on law]

---

Please list all major decisions within this range (${startYear}-${endYear}) and format each case as a detailed brief similar to how landmark cases are explained in law textbooks.

Focus on Supreme Court judgments only and ensure accuracy in citations and legal principles.`;
      } else {
        prompt = `Find and provide detailed information about relevant Supreme Court case law for: "${searchQuery}"

For each significant case, provide:

**Case Title:** [Full case name]
**Citation:** [Case citation with year]
**Date of Judgment:** [DD Month YYYY]
**Court & Bench:** [Supreme Court of India - Justice names]
**Summary of Facts:** [Brief factual background]
**Key Issue(s) Involved:** [Legal questions before the court]
**Judgment and Holding:** [Court's decision and ruling]
**Ratio Decidendi:** [Legal reasoning and principle established]
**Legal Significance:** [Precedent value and impact on law]

---

Focus on landmark Supreme Court judgments and provide detailed case briefs for each relevant decision.`;
      }

      const systemInstruction = `You are a legal research assistant specializing in Indian Supreme Court case law. Provide accurate case citations, detailed factual summaries, legal reasoning, and precedent value. Format each case as a comprehensive brief suitable for legal research and study. Ensure all information follows the exact format requested with clear section headers.`;

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

      setSearchResults(result);
      toast({
        title: "Case Search Complete",
        description: `${searchType === "year-range" ? "Year-range" : "General"} case law search results generated.`
      });
    } catch (error) {
      console.error('Error searching case law:', error);
      toast({
        title: "Error",
        description: "Failed to search case law. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/features")}
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Case Law Finder</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Supreme Court Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Search Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSearchType("general")}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    searchType === "general" 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">General Search</span>
                  </div>
                  <p className="text-sm text-gray-600">Search by topic, law, or legal concept</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSearchType("year-range")}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    searchType === "year-range" 
                      ? "border-blue-500 bg-blue-50 text-blue-700" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Year Range Search</span>
                  </div>
                  <p className="text-sm text-gray-600">Find cases within specific years</p>
                </button>
              </div>
            </div>

            {/* Year Range Inputs */}
            {searchType === "year-range" && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-3">Year Range Selection</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-800">Start Year</label>
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      placeholder="e.g., 2010"
                      min="1950"
                      max={currentYear}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-800">End Year</label>
                    <input
                      type="number"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      placeholder="e.g., 2020"
                      min="1950"
                      max={currentYear}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {searchType === "year-range" ? "Topic/Legal Area" : "Search Query"}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === "year-range"
                    ? "e.g., RTI Act, Article 21, Article 14, Criminal Law..."
                    : "Enter keywords, section numbers, or legal concepts (e.g., 'dowry death', 'Section 498A', 'anticipatory bail')"
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Example Searches */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Example Searches:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {searchType === "year-range" ? (
                  <>
                    <p>• "RTI Act" (2010-2020) - All RTI-related judgments from 2010 to 2020</p>
                    <p>• "Article 21" (2015-2023) - Right to life cases in recent years</p>
                    <p>• "Criminal Law" (2005-2015) - Major criminal law precedents</p>
                  </>
                ) : (
                  <>
                    <p>• "Section 498A dowry harassment"</p>
                    <p>• "Article 226 writ petition"</p>
                    <p>• "Consumer protection defective goods"</p>
                  </>
                )}
              </div>
            </div>

            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching Supreme Court Cases...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {searchType === "year-range" ? "Search Cases by Year Range" : "Search Cases"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {searchResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Supreme Court Case Results
                {searchType === "year-range" && startYear && endYear && (
                  <span className="text-sm font-normal text-gray-600">
                    ({startYear} - {endYear})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {searchResults.split('**').map((part, index) => {
                    if (index % 2 === 1) {
                      // This is content between ** markers (should be bold)
                      return <strong key={index}>{part}</strong>;
                    }
                    return part;
                  })}
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
