
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
  const [searchType, setSearchType] = useState("general");
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
        prompt = `You are a senior legal research specialist in Indian Supreme Court jurisprudence. Provide COMPREHENSIVE case briefs for ALL major Supreme Court of India cases between ${startYear} and ${endYear} related to: "${searchQuery}"

CRITICAL REQUIREMENTS - EACH CASE MUST BE EXACTLY 1200-1500 WORDS:

For EVERY case, provide this EXACT format structure:

═══════════════════════════════════════════════════════
**CASE TITLE:** [Complete case name with all parties - e.g., Maneka Gandhi v. Union of India]
**CITATION:** [Full Indian citation - AIR/SCC/SCR format]
**DATE OF JUDGMENT:** [Complete date - Day Month Year]
**COURT & BENCH:** [Supreme Court of India - Full bench composition with Chief Justice name]
═══════════════════════════════════════════════════════

**COMPREHENSIVE SUMMARY OF FACTS:**
[Write 300-400 words providing exhaustive factual background including:
- Complete chronological sequence of events
- All parties involved and their specific roles
- Detailed circumstances that led to the legal dispute
- Any relevant constitutional/statutory framework
- Previous legal proceedings and their outcomes
- The specific grievance that brought the matter to Supreme Court]

**KEY LEGAL ISSUES INVOLVED:**
[Write 200-250 words listing and explaining all major legal questions:
1. [Primary constitutional/legal issue with detailed context]
2. [Secondary legal questions with implications]
3. [Any procedural or jurisdictional matters]
4. [Interpretation of specific provisions/articles]]

**DETAILED JUDGMENT AND HOLDING:**
[Write 400-500 words providing:
- Complete reasoning adopted by the Supreme Court
- How each legal issue was systematically addressed
- Specific conclusions reached by the Court
- Any dissenting opinions if applicable
- Final orders/directions issued
- Immediate impact of the judgment]

**COMPREHENSIVE RATIO DECIDENDI (LEGAL REASONING):**
[Write 300-350 words explaining:
- The exact legal principle established by this case
- The constitutional/legal reasoning behind the principle
- How this principle differs from or builds upon existing law
- The scope and limitations of the legal principle
- The methodology adopted by the Court in reaching this conclusion]

**LEGAL SIGNIFICANCE AND PRECEDENTIAL VALUE:**
[Write 200-250 words covering:
- Impact on existing Indian jurisprudence
- How this case has been cited in subsequent Supreme Court judgments
- Effect on legal practice and constitutional interpretation
- Long-term implications for Indian legal system
- Its place in landmark constitutional/legal precedents]

FOCUS EXCLUSIVELY ON SUPREME COURT OF INDIA JUDGMENTS FROM ${startYear}-${endYear}. Each case brief MUST be 1200-1500 words minimum with extensive legal analysis suitable for law textbooks.`;
      } else {
        prompt = `You are a senior legal research specialist in Indian Supreme Court jurisprudence. Provide COMPREHENSIVE case briefs for major Supreme Court of India cases related to: "${searchQuery}"

CRITICAL REQUIREMENTS - EACH CASE MUST BE EXACTLY 1200-1500 WORDS:

For EVERY case, provide this EXACT format structure:

═══════════════════════════════════════════════════════
**CASE TITLE:** [Complete case name with all parties - e.g., Kesavananda Bharati v. State of Kerala]
**CITATION:** [Full Indian citation - AIR/SCC/SCR format]
**DATE OF JUDGMENT:** [Complete date - Day Month Year]
**COURT & BENCH:** [Supreme Court of India - Full bench composition with Chief Justice name]
═══════════════════════════════════════════════════════

**COMPREHENSIVE SUMMARY OF FACTS:**
[Write 300-400 words providing exhaustive factual background including:
- Complete chronological sequence of events
- All parties involved and their specific roles
- Detailed circumstances that led to the legal dispute
- Any relevant constitutional/statutory framework
- Previous legal proceedings and their outcomes
- The specific grievance that brought the matter to Supreme Court]

**KEY LEGAL ISSUES INVOLVED:**
[Write 200-250 words listing and explaining all major legal questions:
1. [Primary constitutional/legal issue with detailed context]
2. [Secondary legal questions with implications]
3. [Any procedural or jurisdictional matters]
4. [Interpretation of specific provisions/articles]]

**DETAILED JUDGMENT AND HOLDING:**
[Write 400-500 words providing:
- Complete reasoning adopted by the Supreme Court
- How each legal issue was systematically addressed
- Specific conclusions reached by the Court
- Any dissenting opinions if applicable
- Final orders/directions issued
- Immediate impact of the judgment]

**COMPREHENSIVE RATIO DECIDENDI (LEGAL REASONING):**
[Write 300-350 words explaining:
- The exact legal principle established by this case
- The constitutional/legal reasoning behind the principle
- How this principle differs from or builds upon existing law
- The scope and limitations of the legal principle
- The methodology adopted by the Court in reaching this conclusion]

**LEGAL SIGNIFICANCE AND PRECEDENTIAL VALUE:**
[Write 200-250 words covering:
- Impact on existing Indian jurisprudence
- How this case has been cited in subsequent Supreme Court judgments
- Effect on legal practice and constitutional interpretation
- Long-term implications for Indian legal system
- Its place in landmark constitutional/legal precedents]

FOCUS EXCLUSIVELY ON LANDMARK SUPREME COURT OF INDIA JUDGMENTS. Each case brief MUST be 1200-1500 words minimum with law textbook-level detail and analysis.`;
      }

      const systemInstruction = `You are a senior legal research specialist with 25+ years of experience in Indian Supreme Court jurisprudence. You MUST provide EXTREMELY DETAILED case briefs suitable for:

1. Senior advocates arguing before the Supreme Court
2. Law professors teaching constitutional/criminal/civil law at premier institutions
3. Legal researchers conducting doctoral-level analysis
4. Advanced law students preparing for judicial services

ABSOLUTE REQUIREMENTS:
- EACH case brief MUST be exactly 1200-1500 words
- NEVER mention or reference USA cases unless specifically asked
- FOCUS EXCLUSIVELY on Supreme Court of India judgments
- Provide exhaustive legal analysis with complete reasoning
- Use proper Indian legal citation format (AIR/SCC/SCR)
- Ensure accuracy of all constitutional provisions and legal principles
- Format exactly as specified with proper section headers
- Include extensive factual chronology and procedural history
- Provide comprehensive ratio decidendi analysis
- Explain long-term legal significance and precedential impact

The level of detail MUST match the most comprehensive Indian law textbooks, constitutional commentaries, and Supreme Court case analyses available in top law schools and legal research institutions.`;

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

      setSearchResults(result);
      toast({
        title: "Comprehensive Case Analysis Complete",
        description: `Detailed 1200+ word ${searchType === "year-range" ? "year-range" : "general"} Indian Supreme Court case analysis generated.`
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
        <h1 className="text-2xl font-bold">Indian Supreme Court Case Law Finder</h1>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Supreme Court of India Cases - Comprehensive 1200+ Word Analysis
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
                    <span className="font-medium">General Topic Search</span>
                  </div>
                  <p className="text-sm text-gray-600">1200+ word analysis by legal topic/area</p>
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
                  <p className="text-sm text-gray-600">1200+ word analysis within specific years</p>
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
                {searchType === "year-range" ? "Legal Topic/Area" : "Search Query"}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === "year-range"
                    ? "e.g., criminal law, Article 21, Section 498A, constitutional law..."
                    : "Enter case names, legal topics, or constitutional provisions (e.g., 'Kesavananda Bharati', 'Article 226', 'Section 302 IPC')"
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Enhanced Example Searches */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">📚 1200+ Word Analysis Examples:</h3>
              <div className="space-y-1 text-sm text-amber-800">
                {searchType === "year-range" ? (
                  <>
                    <p>• "Article 21" (2018-2020) - Every major right to life case with full 1200+ word analysis</p>
                    <p>• "criminal procedure" (2015-2023) - Complete CrPC jurisprudence with detailed briefing</p>
                    <p>• "constitutional law" (2010-2020) - Landmark constitutional cases with comprehensive analysis</p>
                  </>
                ) : (
                  <>
                    <p>• "Kesavananda Bharati v. State of Kerala" - Complete 1200+ word constitutional analysis</p>
                    <p>• "Maneka Gandhi v. Union of India" - Detailed Article 21 precedent study</p>
                    <p>• "criminal law precedents" - Major criminal law cases with full legal reasoning</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">🔍 Every Case Brief Includes (1200+ Words):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                <div>
                  <p>✓ Complete factual chronology (300-400 words)</p>
                  <p>✓ Detailed legal issues (200-250 words)</p>
                  <p>✓ Comprehensive judgment analysis (400-500 words)</p>
                </div>
                <div>
                  <p>✓ Extensive ratio decidendi (300-350 words)</p>
                  <p>✓ Legal significance breakdown (200-250 words)</p>
                  <p>✓ Precedential impact analysis</p>
                </div>
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
                  Generating 1200+ Word Indian Supreme Court Analysis...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {searchType === "year-range" ? "Generate Detailed Year-Range Analysis (1200+ words each)" : "Generate Comprehensive Case Analysis (1200+ words each)"}
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
                Supreme Court of India - Comprehensive Case Analysis (1200+ Words Each)
                {searchType === "year-range" && startYear && endYear && (
                  <span className="text-sm font-normal text-gray-600">
                    ({startYear} - {endYear})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {searchResults.split('**').map((part, index) => {
                    if (index % 2 === 1) {
                      return <strong key={index} className="text-blue-900 font-bold">{part}</strong>;
                    }
                    return <span key={index} className="text-gray-800">{part}</span>;
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
