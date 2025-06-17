
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
        prompt = `Provide EXTREMELY DETAILED case briefs for all major Supreme Court of India cases between ${startYear} and ${endYear} related to: "${searchQuery}"

For each case, provide a COMPREHENSIVE analysis in this EXACT format:

═══════════════════════════════════════════════════════
**CASE TITLE:** [Full case name with all parties]
**CITATION:** [Complete citation with AIR/SCC/SCR reference]
**DATE OF JUDGMENT:** [Day Month Year]
**COURT & BENCH:** [Supreme Court of India - Complete Justice names with Chief Justice if applicable]
═══════════════════════════════════════════════════════

**DETAILED FACTUAL BACKGROUND:**
[Provide extensive factual background - 4-6 paragraphs covering:
- Complete chronology of events
- All relevant parties and their roles
- Previous legal proceedings
- Circumstances leading to the Supreme Court appeal
- Any constitutional/statutory provisions involved]

**PROCEDURAL HISTORY:**
[Detailed procedural journey - 2-3 paragraphs covering:
- Lower court proceedings and decisions
- Appeals and interim orders
- Constitutional/legal challenges raised
- Timeline of legal proceedings]

**KEY LEGAL ISSUES PRESENTED:**
[List all major legal questions - each with detailed explanation:
1. [Primary constitutional/legal issue with context]
2. [Secondary issues with their implications]
3. [Any procedural or jurisdictional questions]
4. [Interpretation of specific statutory provisions]]

**ARGUMENTS PRESENTED:**
**Petitioner's Arguments:**
[2-3 paragraphs detailing complete legal arguments, precedents cited, constitutional provisions relied upon]

**Respondent's Arguments:**
[2-3 paragraphs detailing counter-arguments, distinguishing precedents, statutory interpretations]

**DETAILED JUDGMENT AND HOLDING:**
[4-5 paragraphs providing:
- Complete reasoning of the Court
- How each issue was addressed
- Specific legal conclusions reached
- Orders/directions issued by the Court]

**COMPREHENSIVE RATIO DECIDENDI:**
[3-4 paragraphs explaining:
- The exact legal principle established
- The constitutional/legal reasoning behind it
- How it differs from or builds upon previous law
- The scope and limitations of the principle]

**LEGAL SIGNIFICANCE & PRECEDENTIAL VALUE:**
[3-4 paragraphs covering:
- Impact on existing jurisprudence
- How it has been applied in subsequent cases
- Its effect on legal practice and procedure
- Constitutional/statutory interpretation clarified
- Long-term implications for Indian law]

**SUBSEQUENT JUDICIAL TREATMENT:**
[If applicable - how later courts have interpreted/applied this decision]

════════════════════════════════════════════════════════

Focus ONLY on Supreme Court of India judgments from ${startYear}-${endYear}. Provide extensive detail similar to comprehensive law textbook analysis. Each case brief should be 800-1200 words minimum.`;
      } else {
        prompt = `Provide EXTREMELY DETAILED case briefs for major Supreme Court of India cases related to: "${searchQuery}"

For each relevant case, provide a COMPREHENSIVE analysis in this EXACT format:

═══════════════════════════════════════════════════════
**CASE TITLE:** [Full case name with all parties]
**CITATION:** [Complete citation with AIR/SCC/SCR reference]
**DATE OF JUDGMENT:** [Day Month Year]
**COURT & BENCH:** [Supreme Court of India - Complete Justice names with Chief Justice if applicable]
═══════════════════════════════════════════════════════

**DETAILED FACTUAL BACKGROUND:**
[Provide extensive factual background - 4-6 paragraphs covering:
- Complete chronology of events
- All relevant parties and their roles
- Previous legal proceedings
- Circumstances leading to the Supreme Court appeal
- Any constitutional/statutory provisions involved]

**PROCEDURAL HISTORY:**
[Detailed procedural journey - 2-3 paragraphs covering:
- Lower court proceedings and decisions
- Appeals and interim orders
- Constitutional/legal challenges raised
- Timeline of legal proceedings]

**KEY LEGAL ISSUES PRESENTED:**
[List all major legal questions - each with detailed explanation:
1. [Primary constitutional/legal issue with context]
2. [Secondary issues with their implications]
3. [Any procedural or jurisdictional questions]
4. [Interpretation of specific statutory provisions]]

**ARGUMENTS PRESENTED:**
**Petitioner's Arguments:**
[2-3 paragraphs detailing complete legal arguments, precedents cited, constitutional provisions relied upon]

**Respondent's Arguments:**
[2-3 paragraphs detailing counter-arguments, distinguishing precedents, statutory interpretations]

**DETAILED JUDGMENT AND HOLDING:**
[4-5 paragraphs providing:
- Complete reasoning of the Court
- How each issue was addressed
- Specific legal conclusions reached
- Orders/directions issued by the Court]

**COMPREHENSIVE RATIO DECIDENDI:**
[3-4 paragraphs explaining:
- The exact legal principle established
- The constitutional/legal reasoning behind it
- How it differs from or builds upon previous law
- The scope and limitations of the principle]

**LEGAL SIGNIFICANCE & PRECEDENTIAL VALUE:**
[3-4 paragraphs covering:
- Impact on existing jurisprudence
- How it has been applied in subsequent cases
- Its effect on legal practice and procedure
- Constitutional/statutory interpretation clarified
- Long-term implications for Indian law]

**SUBSEQUENT JUDICIAL TREATMENT:**
[If applicable - how later courts have interpreted/applied this decision]

════════════════════════════════════════════════════════

Focus ONLY on landmark Supreme Court of India judgments. Provide extensive detail similar to comprehensive law textbook analysis. Each case brief should be 800-1200 words minimum.`;
      }

      const systemInstruction = `You are a senior legal research assistant specializing in Indian Supreme Court jurisprudence with 20+ years of experience. You must provide EXTREMELY DETAILED, comprehensive case briefs that would be suitable for:

1. Law professors teaching constitutional/criminal/civil law
2. Senior advocates preparing for Supreme Court arguments
3. Legal researchers conducting in-depth analysis
4. Law students studying for advanced examinations

CRITICAL REQUIREMENTS:
- Each case brief must be 800-1200 words minimum
- Provide exhaustive factual background with complete chronology
- Include detailed procedural history with all court proceedings
- Analyze legal arguments from both sides comprehensively
- Explain the Court's reasoning in great detail
- Provide thorough ratio decidendi analysis
- Discuss extensive legal significance and precedential impact
- Use proper Indian legal citation format
- Ensure accuracy of all legal principles and precedents
- Format exactly as specified with proper headers and separators

The level of detail should match the most comprehensive legal textbooks and case commentaries available in Indian law schools and legal libraries.`;

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

      setSearchResults(result);
      toast({
        title: "Detailed Case Analysis Complete",
        description: `Comprehensive ${searchType === "year-range" ? "year-range" : "general"} case law analysis generated with extensive detail.`
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

      <div className="max-w-6xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Supreme Court Cases - Detailed Analysis
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
                  <p className="text-sm text-gray-600">Comprehensive case analysis by topic/law</p>
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
                  <p className="text-sm text-gray-600">Detailed cases within specific years</p>
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
                    ? "e.g., criminal law, RTI Act, Article 21, dowry death..."
                    : "Enter legal topics, case names, or statutory provisions (e.g., 'Section 498A', 'Kesavananda Bharati', 'Article 226')"
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Enhanced Example Searches */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">📚 Detailed Analysis Examples:</h3>
              <div className="space-y-1 text-sm text-amber-800">
                {searchType === "year-range" ? (
                  <>
                    <p>• "criminal law" (2018-2020) - All major criminal law precedents with full analysis</p>
                    <p>• "Article 21" (2015-2023) - Comprehensive right to life case studies</p>
                    <p>• "dowry death" (2010-2020) - Detailed Section 498A jurisprudence evolution</p>
                  </>
                ) : (
                  <>
                    <p>• "Kesavananda Bharati" - Complete constitutional analysis with full judgment breakdown</p>
                    <p>• "Section 498A dowry harassment" - Comprehensive criminal law analysis</p>
                    <p>• "Maneka Gandhi passport" - Detailed Article 21 precedent study</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">🔍 What You'll Get:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                <div>
                  <p>✓ Complete factual chronology</p>
                  <p>✓ Detailed procedural history</p>
                  <p>✓ Comprehensive legal arguments</p>
                  <p>✓ In-depth judgment analysis</p>
                </div>
                <div>
                  <p>✓ Extensive ratio decidendi</p>
                  <p>✓ Legal significance breakdown</p>
                  <p>✓ Precedential impact analysis</p>
                  <p>✓ 800-1200 words per case</p>
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
                  Generating Detailed Case Analysis...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {searchType === "year-range" ? "Generate Detailed Year-Range Analysis" : "Generate Comprehensive Case Analysis"}
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
                Comprehensive Case Law Analysis
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
