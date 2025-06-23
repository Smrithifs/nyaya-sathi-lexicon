import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { searchSectionInIndianKanoon, getIndianKanoonDocument } from "@/utils/indianKanoonApi";

const SectionExplainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [actName, setActName] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // New fields for case law search
  const [searchYear, setSearchYear] = useState("");
  const [courtLevel, setCourtLevel] = useState("");
  const [specificCourt, setSpecificCourt] = useState("");
  const [caseResults, setCaseResults] = useState("");
  const [isCaseLoading, setIsCaseLoading] = useState(false);

  const handleExplain = async () => {
    if (!actName || !sectionNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both act name and section number.",
        variant: "destructive"
      });
      return;
    }

    if (!geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key to use this feature.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let sectionContext = "";
      let relatedCases = [];
      let usingIndianKanoon = false;
      
      try {
        console.log('Searching Indian Kanoon for:', sectionNumber, actName);
        const sectionResults = await searchSectionInIndianKanoon(sectionNumber, actName);
        console.log('Indian Kanoon search results:', sectionResults);
        
        if (sectionResults && sectionResults.length > 0) {
          usingIndianKanoon = true;
          console.log('Processing', sectionResults.length, 'results from Indian Kanoon');
          
          // Get detailed content from top results
          const detailedResults = await Promise.all(
            sectionResults.slice(0, 3).map(async (result) => {
              try {
                const doc = await getIndianKanoonDocument(result.tid);
                return {
                  title: result.title,
                  citation: result.citation,
                  content: doc?.content?.substring(0, 1500) || result.snippet,
                  isCase: result.title.toLowerCase().includes('v.') || result.title.toLowerCase().includes('vs.')
                };
              } catch (error) {
                console.error('Error fetching document:', result.tid, error);
                return {
                  title: result.title,
                  citation: result.citation,
                  content: result.snippet,
                  isCase: result.title.toLowerCase().includes('v.') || result.title.toLowerCase().includes('vs.')
                };
              }
            })
          );
          
          // Separate section text from case law
          const bareActResults = detailedResults.filter(r => !r.isCase);
          relatedCases = detailedResults.filter(r => r.isCase);
          
          if (bareActResults.length > 0) {
            sectionContext = bareActResults.map(result => 
              `**${result.title}**\n${result.content}`
            ).join('\n\n---\n\n');
          }
          
          console.log('Found', bareActResults.length, 'bare act results and', relatedCases.length, 'case results');
        }
      } catch (indianKanoonError) {
        console.error('Indian Kanoon API error:', indianKanoonError);
        toast({
          title: "Indian Kanoon Unavailable",
          description: "Using AI analysis only. Indian Kanoon API is temporarily unavailable.",
          variant: "default",
        });
      }

      // Create comprehensive explanation using both sources
      const enhancedPrompt = usingIndianKanoon && sectionContext 
        ? `You are an expert legal assistant specializing in Indian law. Use the provided legal text and case law to explain the section comprehensively.

**Section Context from Indian Kanoon:**
${sectionContext}

**Related Cases:**
${relatedCases.map(c => `• ${c.title} ${c.citation ? `(${c.citation})` : ''}\n  ${c.content.substring(0, 300)}...`).join('\n\n')}

Based on the above legal sources, please explain Section ${sectionNumber} of the ${actName} in detail:

📘 **ACT & SECTION:** Section ${sectionNumber} of ${actName}
📜 **LEGAL TEXT:** [Extract exact provision text from the sources above]
✨ **SIMPLIFIED EXPLANATION:** [Clear, practical explanation]
📚 **KEY ELEMENTS:** [Essential requirements and conditions]
⚖️ **PRACTICAL APPLICATION:** [Real-world examples and usage]
🏛️ **RELATED PROVISIONS:** [Connected sections or acts]
📊 **LANDMARK JUDGMENTS:** [2-3 important case summaries from the provided context]

Use the legal context provided above to give accurate, source-based explanations.`
        : `You are an expert legal assistant specializing in Indian law. Provide accurate, detailed explanations of legal sections with practical insights.

Explain Section ${sectionNumber} of the ${actName} in detail. Structure your response as follows:

📘 **ACT & SECTION:** Section ${sectionNumber} of ${actName}
📜 **LEGAL TEXT:** [Exact text/provision of the section]
✨ **SIMPLIFIED EXPLANATION:** [Clear, practical explanation in simple terms]
📚 **KEY ELEMENTS:** [Essential requirements and conditions]
⚖️ **PRACTICAL APPLICATION:** [Real-world examples and usage]
🏛️ **RELATED PROVISIONS:** [Connected sections or acts]
📊 **LANDMARK JUDGMENTS:** [Important case law or precedents]

Please provide a comprehensive yet clear explanation suitable for legal practitioners.`;

      console.log('Calling Gemini API with enhanced prompt');
      const result = await callGeminiAPI(enhancedPrompt, geminiKey);

      setExplanation(result);
      toast({
        title: "Explanation Generated",
        description: usingIndianKanoon 
          ? `Section explained using ${relatedCases.length} related cases from Indian Kanoon`
          : "Section explanation generated using AI analysis"
      });
    } catch (error) {
      console.error('Error generating explanation:', error);
      toast({
        title: "Error",
        description: "Failed to generate explanation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaseSearch = async () => {
    if (!actName || !sectionNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter act name and section number first.",
        variant: "destructive"
      });
      return;
    }

    if (!geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key to use this feature.",
        variant: "destructive",
      });
      return;
    }

    setIsCaseLoading(true);
    try {
      // First try to get cases from Indian Kanoon
      let indianKanoonCases = [];
      let usingIndianKanoon = false;
      
      try {
        console.log('Searching Indian Kanoon for cases using section:', sectionNumber, actName);
        let searchQuery = `Section ${sectionNumber} ${actName}`;
        
        // Add court filter if specified
        if (courtLevel && specificCourt) {
          searchQuery += ` ${specificCourt}`;
        } else if (courtLevel) {
          searchQuery += ` ${courtLevel}`;
        }
        
        const sectionResults = await searchSectionInIndianKanoon(sectionNumber, actName);
        console.log('Found', sectionResults?.length || 0, 'results from Indian Kanoon');
        
        if (sectionResults && sectionResults.length > 0) {
          usingIndianKanoon = true;
          // Filter for cases only and apply year filter if specified
          const caseResults = sectionResults.filter(result => 
            result.title.toLowerCase().includes('v.') || result.title.toLowerCase().includes('vs.')
          );
          
          // Apply year filter if specified
          let filteredCases = caseResults;
          if (searchYear) {
            filteredCases = caseResults.filter(result => {
              const year = searchYear.trim();
              if (year.includes('-')) {
                const [startYear, endYear] = year.split('-').map(y => parseInt(y.trim()));
                const resultYear = parseInt(result.date?.substring(0, 4) || '0');
                return resultYear >= startYear && resultYear <= endYear;
              } else {
                return result.date?.includes(year) || result.title.includes(year);
              }
            });
          }
          
          // Get detailed content for top cases
          indianKanoonCases = await Promise.all(
            filteredCases.slice(0, 5).map(async (result) => {
              try {
                const doc = await getIndianKanoonDocument(result.tid);
                return {
                  title: result.title,
                  citation: result.citation,
                  court: result.court,
                  date: result.date,
                  content: doc?.content?.substring(0, 2000) || result.snippet
                };
              } catch (error) {
                console.error('Error fetching case document:', result.tid, error);
                return {
                  title: result.title,
                  citation: result.citation,
                  court: result.court,
                  date: result.date,
                  content: result.snippet
                };
              }
            })
          );
          
          console.log('Processed', indianKanoonCases.length, 'detailed cases');
        }
      } catch (indianKanoonError) {
        console.error('Indian Kanoon case search error:', indianKanoonError);
      }

      let courtFilter = "";
      if (courtLevel && specificCourt) {
        courtFilter = ` decided by ${specificCourt}`;
      } else if (courtLevel) {
        courtFilter = ` from ${courtLevel}`;
      }

      let yearFilter = "";
      if (searchYear) {
        yearFilter = ` from the year ${searchYear}`;
      }

      const prompt = usingIndianKanoon && indianKanoonCases.length > 0
        ? `You are a legal research assistant specializing in Indian case law. Based on the following actual cases from Indian Kanoon that have cited Section ${sectionNumber} of the ${actName}, provide a comprehensive analysis:

**Cases Found:**
${indianKanoonCases.map(c => `
**${c.title}**
Citation: ${c.citation || 'Not available'}
Court: ${c.court || 'Not specified'}
Date: ${c.date || 'Not specified'}
Content: ${c.content}
`).join('\n---\n')}

Please analyze these cases and provide:

📊 **CASE SUMMARY:** Brief overview of ${indianKanoonCases.length} cases found
📜 **SECTION INTERPRETATION:** How Section ${sectionNumber} was interpreted in these cases
⚖️ **JUDICIAL OBSERVATIONS:** Key observations made by courts about this section
🏛️ **PRECEDENTS ESTABLISHED:** Significant precedents from these cases
📈 **CURRENT LEGAL POSITION:** Current state of law based on these judgments
🔍 **PRACTICAL INSIGHTS:** How this section is applied in practice

Focus on the actual cases provided above that specifically deal with Section ${sectionNumber} of the ${actName}.`
        : `You are a legal research assistant specializing in Indian case law. Find relevant cases that have cited or interpreted Section ${sectionNumber} of the ${actName}.

Search for Indian case law${courtFilter}${yearFilter} that has cited, interpreted, or applied Section ${sectionNumber} of the ${actName}.

Please provide:

📊 **CASE SUMMARY:** Overview of relevant cases found
📜 **SECTION INTERPRETATION:** How the section was interpreted or applied in cases
⚖️ **JUDICIAL OBSERVATIONS:** Key judicial observations about this section
🏛️ **PRECEDENTS ESTABLISHED:** Any significant precedents established
📈 **CURRENT LEGAL POSITION:** Current legal position based on these cases
🔍 **PRACTICAL INSIGHTS:** How this section is applied in practice

Focus on cases that specifically deal with Section ${sectionNumber} of the ${actName}.`;

      console.log('Calling Gemini API for case analysis');
      const result = await callGeminiAPI(prompt, geminiKey);

      setCaseResults(result);
      toast({
        title: "Case Search Complete",
        description: usingIndianKanoon 
          ? `Found ${indianKanoonCases.length} relevant cases from Indian Kanoon`
          : "Case analysis generated using AI knowledge"
      });
    } catch (error) {
      console.error('Error searching cases:', error);
      toast({
        title: "Error",
        description: "Failed to search cases. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCaseLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Section Explainer</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Explain Legal Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Act Name</label>
              <input
                type="text"
                value={actName}
                onChange={(e) => setActName(e.target.value)}
                placeholder="e.g., Indian Penal Code, Code of Criminal Procedure, Constitution of India"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Section Number</label>
              <input
                type="text"
                value={sectionNumber}
                onChange={(e) => setSectionNumber(e.target.value)}
                placeholder="e.g., 302, 420, 498A"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button 
              onClick={handleExplain} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Explanation...
                </>
              ) : (
                "Explain Section"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Find Cases Using This Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Year (Optional)</label>
                <input
                  type="text"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  placeholder="e.g., 2020, 2015-2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Court Level (Optional)</label>
                <select
                  value={courtLevel}
                  onChange={(e) => setCourtLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Court</option>
                  <option value="Supreme Court">Supreme Court</option>
                  <option value="High Court">High Court</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Specific Court (Optional)</label>
                <input
                  type="text"
                  value={specificCourt}
                  onChange={(e) => setSpecificCourt(e.target.value)}
                  placeholder="e.g., Bombay High Court, Delhi High Court"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button 
              onClick={handleCaseSearch} 
              disabled={isCaseLoading}
              className="w-full"
            >
              {isCaseLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching Cases...
                </>
              ) : (
                "Find Cases Using This Section"
              )}
            </Button>
          </CardContent>
        </Card>

        {explanation && (
          <Card>
            <CardHeader>
              <CardTitle>Section Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {explanation}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {caseResults && (
          <Card>
            <CardHeader>
              <CardTitle>Cases Using This Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {caseResults}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SectionExplainer;
