
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

const BareActNavigator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [actName, setActName] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [topic, setTopic] = useState("");
  const [navigation, setNavigation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // New fields for case law search
  const [searchYear, setSearchYear] = useState("");
  const [courtLevel, setCourtLevel] = useState("");
  const [specificCourt, setSpecificCourt] = useState("");
  const [caseResults, setCaseResults] = useState("");
  const [isCaseLoading, setIsCaseLoading] = useState(false);

  const handleNavigate = async () => {
    if (!actName || !topic) {
      toast({
        title: "Missing Information",
        description: "Please enter both act name and topic.",
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
      const systemInstruction = "You are a legal navigation assistant. Help users find their way through complex legal acts by providing structured guidance and cross-references.";
      
      const prompt = `${systemInstruction}

Help me navigate the ${actName} for the topic: "${topic}"
      
Please provide:
1. Relevant sections and their numbers
2. Chapter/Part organization related to this topic
3. Cross-references to related provisions
4. Key definitions from the act
5. Step-by-step guidance for finding relevant provisions
6. Any amendments or important notifications

Structure this as a navigation guide for legal practitioners.`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setNavigation(result);
      toast({
        title: "Navigation Guide Generated",
        description: "Your legal act navigation guide is ready."
      });
    } catch (error) {
      console.error('Error generating navigation:', error);
      toast({
        title: "Error",
        description: "Failed to generate navigation guide. Please try again.",
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
1. Case names with full citations
2. How the section was interpreted or applied in each case
3. Key judicial observations about this section
4. Any significant precedents established
5. Current legal position based on these cases

Focus on cases that specifically deal with Section ${sectionNumber} of the ${actName}.`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setCaseResults(result);
      toast({
        title: "Case Search Complete",
        description: "Cases citing this section have been found."
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
        <h1 className="text-2xl font-bold">Bare Act Navigator</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Navigate Legal Acts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Act Name</label>
              <input
                type="text"
                value={actName}
                onChange={(e) => setActName(e.target.value)}
                placeholder="e.g., Indian Penal Code, Companies Act 2013, Constitution of India"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic or Concept</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 'bail provisions', 'murder', 'contract formation', 'fundamental rights'"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button 
              onClick={handleNavigate} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Navigation Guide...
                </>
              ) : (
                "Navigate Act"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Find Cases Using Specific Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {navigation && (
          <Card>
            <CardHeader>
              <CardTitle>Navigation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {navigation}
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

export default BareActNavigator;
