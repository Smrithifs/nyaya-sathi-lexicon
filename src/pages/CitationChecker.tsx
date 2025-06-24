
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

const CitationChecker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [citation, setCitation] = useState("");
  const [checkResult, setCheckResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!citation.trim()) {
      toast({
        title: "Missing Citation",
        description: "Please enter a case citation to check.",
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
      console.log('Checking citation:', citation);
      
      const systemInstruction = "You are a legal citation expert. Analyze and validate legal citations for Indian case law.";
      
      const prompt = `${systemInstruction}

**Citation to Check:** "${citation}"

Please provide:

🎯 **Citation Status:** [Analyze if the format appears valid or invalid]
📚 **Analysis:** 
   - Check if the citation format follows standard Indian legal citation formats (AIR, SCC, SCR, etc.)
   - Suggest correct format if there are obvious errors
   - Indicate common citation patterns and standards
✨ **Formatting Guidance:** 
   - Provide the correct Indian legal citation format
   - Examples of proper citations: "AIR 1973 SC 1461", "(2018) 10 SCC 1", etc.
📊 **General Information:** Brief explanation of citation importance and usage`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setCheckResult(result);
      toast({
        title: "Citation Analysis Complete",
        description: "Citation analysis completed using AI validation"
      });
    } catch (error) {
      console.error('Error checking citation:', error);
      toast({
        title: "Error",
        description: "Failed to check citation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Citation Checker</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Check Case Law Citation Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Case Citation</label>
              <input
                type="text"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
                placeholder="e.g., 'AIR 1973 SC 1461', 'Kesavananda Bharati v. State of Kerala', '(2018) 10 SCC 1'"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button 
              onClick={handleCheck} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking Citation...
                </>
              ) : (
                "Check Citation Format"
              )}
            </Button>
          </CardContent>
        </Card>

        {checkResult && (
          <Card>
            <CardHeader>
              <CardTitle>Citation Analysis Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {checkResult}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CitationChecker;
