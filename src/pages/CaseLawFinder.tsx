
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

const CaseLawFinder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Missing Query",
        description: "Please enter a search query to find relevant case law.",
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
      const systemInstruction = "You are a legal research assistant specializing in Indian case law. Provide accurate case law citations, summaries, and precedential value of legal cases.";
      
      const prompt = `${systemInstruction}

Search for relevant Indian case law related to: "${query}"
      
Please provide:
1. Most relevant Supreme Court cases with full citations
2. High Court cases if applicable
3. Brief summary of each case's facts and legal principles
4. Current precedential value and legal significance
5. Key legal points established by each case
6. How these cases apply to the search query

Focus specifically on Indian jurisprudence and provide accurate citations in standard format.`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setSearchResults(result);
      toast({
        title: "Case Law Search Complete",
        description: "Relevant cases and precedents found."
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
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Case Law Finder</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Indian Case Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Legal Query or Topic</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'right to privacy', 'Article 14 equality', 'contract breach remedies'"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching Case Law...
                </>
              ) : (
                "Search Cases"
              )}
            </Button>
          </CardContent>
        </Card>

        {searchResults && (
          <Card>
            <CardHeader>
              <CardTitle>Case Law Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {searchResults}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaseLawFinder;
