import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
      const prompt = `You are an expert legal assistant specializing in Indian law. Provide accurate, detailed explanations of legal sections with practical insights.

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
      const result = await callGeminiAPI(prompt, geminiKey);

      setExplanation(result);
      toast({
        title: "Explanation Generated",
        description: "Section explanation generated using AI analysis"
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

      const prompt = `You are a legal research assistant specializing in Indian case law. Find relevant cases that have cited or interpreted Section ${sectionNumber} of the ${actName}.

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
        description: "Case analysis generated using AI knowledge"
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
