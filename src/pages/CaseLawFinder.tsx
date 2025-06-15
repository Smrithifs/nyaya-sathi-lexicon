
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
        description: "Please enter a search query.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Find and provide information about relevant case law for: "${searchQuery}"
      
Please provide:
1. Important landmark cases related to this topic
2. Recent relevant judgments
3. Key legal principles established
4. Case citations with court names and years
5. Brief summary of each case's significance

Focus on Indian case law and Supreme Court/High Court judgments.`;

      const systemInstruction = "You are a legal research assistant specializing in Indian case law. Provide accurate case citations, court names, and brief summaries of relevant judgments.";

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

      setSearchResults(result);
      toast({
        title: "Search Complete",
        description: "Case law search results have been generated."
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
        <h1 className="text-2xl font-bold">Case Law Finder</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Case Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Query</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter keywords, section numbers, or legal concepts (e.g., 'dowry death', 'Section 498A', 'anticipatory bail')"
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
              <CardTitle>Search Results</CardTitle>
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
