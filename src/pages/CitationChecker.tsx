import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { askPuter } from "@/utils/openaiApi";

const CitationChecker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

    setIsLoading(true);
    try {
      const systemInstruction = "You are a legal research expert specializing in case law status and citation checking. Provide accurate information about the current validity and precedential value of legal cases.";
      
      const prompt = `${systemInstruction}

Check the status and validity of this legal citation: "${citation}"
      
Please provide:
1. Case name and full citation details
2. Court that decided the case
3. Current legal status (overruled, affirmed, distinguished, etc.)
4. Key legal principles established
5. Any subsequent developments or appeals
6. Reliability for current use in legal arguments
7. Related cases that might affect its precedential value

Focus on Indian case law and provide accurate status information.`;

      const result = await askPuter(prompt);

      setCheckResult(result);
      toast({
        title: "Citation Checked",
        description: "Citation status analysis complete."
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
        <Button variant="ghost" onClick={() => navigate("/features")}>
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Citation Checker</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Check Case Law Status</CardTitle>
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
                "Check Citation Status"
              )}
            </Button>
          </CardContent>
        </Card>

        {checkResult && (
          <Card>
            <CardHeader>
              <CardTitle>Citation Status Report</CardTitle>
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
