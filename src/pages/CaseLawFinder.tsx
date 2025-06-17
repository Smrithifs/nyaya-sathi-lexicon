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
        description: "Please enter a search query, case name, or year range.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let prompt = "";

      if (/\d{4}\s*-\s*\d{4}/.test(searchQuery.trim())) {
        const [startYear, endYear] = searchQuery.match(/\d{4}/g);
        prompt = `You are an Indian legal assistant. Retrieve and explain at least 5 landmark Indian court judgments per year from ${startYear} to ${endYear}.

Each case must include:
- Title
- Citation (AIR/SCC)
- Date of Judgment
- Bench and Court
- Facts (300+ words)
- Legal Issues (200+ words)
- Judgment (400+ words)
- Ratio Decidendi (300+ words)
- Legal Significance (200+ words)

Minimum 1200 words per case. Strictly Indian judgments only.`;
      } else if (/\d{4}/.test(searchQuery.trim())) {
        const year = searchQuery.match(/\d{4}/)[0];
        prompt = `You are an Indian legal assistant. Retrieve and explain at least 5 landmark Indian court judgments from the year ${year}.

Each case must include:
- Title
- Citation (AIR/SCC)
- Date of Judgment
- Bench and Court
- Facts (300+ words)
- Legal Issues (200+ words)
- Judgment (400+ words)
- Ratio Decidendi (300+ words)
- Legal Significance (200+ words)

Minimum 1200 words per case. Strictly Indian judgments only.`;
      } else {
        prompt = `You are an Indian legal assistant. Provide a detailed legal brief (min. 1200 words) of the Indian case or topic: ${searchQuery}.

Include:
- Case Title and Citation (AIR/SCC)
- Court and Bench
- Date of Judgment
- Summary of Facts
- Legal Issues
- Final Holding
- Ratio Decidendi
- Relevant Constitutional/Statutory Provisions
- Legal Significance
- Dissenting opinions (if any)

Strictly use Indian judgments and law.`;
      }

      const systemInstruction = `You are a senior legal research specialist in Indian Supreme Court jurisprudence. You must provide comprehensive Indian legal analysis ONLY. Exclude foreign cases. Focus on law textbook-level structure and clarity.`;

      const result = await groqCompletion({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        prompt,
        systemInstruction
      });

      setSearchResults(result);
      toast({
        title: "Case Analysis Ready",
        description: "Detailed Indian Supreme Court case explanation generated."
      });
    } catch (error) {
      console.error('Error searching case law:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>← Back to Dashboard</Button>
        <h1 className="text-2xl font-bold">Indian Supreme Court Case Law Finder</h1>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Landmark Judgments or Case by Year/Range/Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter a Legal Topic, Case Name, or Year/Range (e.g., "Article 21", "Kesavananda", "2019-2020")
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Article 21, 2019, 2015-2017, Navtej Johar v. Union of India"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button onClick={handleSearch} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> Generate Case Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {searchResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Case Brief Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {searchResults}
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
