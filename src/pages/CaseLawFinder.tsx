
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, FileText } from "lucide-react";

const CaseLawFinder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Missing Query",
        description: "Please enter a search query for Indian Supreme Court cases.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `You are a senior legal research specialist in Indian Supreme Court jurisprudence. Provide COMPREHENSIVE case briefs for major Supreme Court of India cases related to: "${searchQuery}"

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

FOCUS EXCLUSIVELY ON LANDMARK SUPREME COURT OF INDIA JUDGMENTS. Each case brief MUST be 1200-1500 words minimum with law textbook-level detail and analysis. NEVER mention USA cases unless specifically requested.`;

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
        title: "Comprehensive Indian Supreme Court Analysis Complete",
        description: "Detailed 1200+ word Indian Supreme Court case analysis generated successfully."
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
            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter Legal Topic, Case Name, or Year (e.g., "criminal law 2024", "Article 21", "Kesavananda Bharati")
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter case names, legal topics, constitutional provisions, or year (e.g., 'criminal law 2024', 'Article 226', 'Section 302 IPC', 'cases of 2023')"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Enhanced Example Searches */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">📚 1200+ Word Analysis Examples:</h3>
              <div className="space-y-1 text-sm text-amber-800">
                <p>• "criminal law 2024" - All major criminal law cases from 2024 with full 1200+ word analysis</p>
                <p>• "Article 21" - Every landmark right to life case with comprehensive legal briefing</p>
                <p>• "Kesavananda Bharati" - Complete 1200+ word constitutional analysis</p>
                <p>• "cases of 2023" - All major Supreme Court decisions from 2023 with detailed analysis</p>
                <p>• "Section 498A" - Dowry harassment cases with full legal reasoning</p>
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

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">🏛️ Exclusive Indian Supreme Court Coverage:</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Only Supreme Court of India judgments</p>
                <p>• Proper Indian legal citation format (AIR/SCC/SCR)</p>
                <p>• Constitutional and statutory analysis as per Indian law</p>
                <p>• Law textbook-level comprehensive analysis</p>
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
                  Generating Comprehensive Indian Supreme Court Analysis (1200+ words each)...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Generate Detailed Indian Supreme Court Case Analysis (1200+ words each)
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
