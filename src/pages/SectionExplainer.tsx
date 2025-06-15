
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SectionExplainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAct, setSelectedAct] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const acts = [
    { value: "ipc", label: "Indian Penal Code (IPC)" },
    { value: "crpc", label: "Code of Criminal Procedure (CrPC)" },
    { value: "cpc", label: "Code of Civil Procedure (CPC)" },
    { value: "evidence", label: "Indian Evidence Act" },
    { value: "contract", label: "Indian Contract Act" },
    { value: "constitution", label: "Constitution of India" }
  ];

  const handleExplain = async () => {
    if (!selectedAct || !sectionNumber) {
      toast({
        title: "Missing Information",
        description: "Please select an act and enter a section number.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const actName = acts.find(act => act.value === selectedAct)?.label || selectedAct;
      const prompt = `Explain Section ${sectionNumber} of the ${actName} in detail. Include:
1. The exact text/provision
2. Key elements and requirements
3. Practical application and examples
4. Related sections or provisions
5. Important case law or precedents if any
Please provide a comprehensive yet clear explanation suitable for legal practitioners.`;

      const systemInstruction = "You are an expert legal assistant specializing in Indian law. Provide accurate, detailed explanations of legal sections with practical insights.";

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

      setExplanation(result);
      toast({
        title: "Explanation Generated",
        description: "Section explanation has been generated successfully."
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

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>
          ← Back to Dashboard
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
              <label className="block text-sm font-medium mb-2">Select Act</label>
              <Select value={selectedAct} onValueChange={setSelectedAct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a legal act" />
                </SelectTrigger>
                <SelectContent>
                  {acts.map((act) => (
                    <SelectItem key={act.value} value={act.value}>
                      {act.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      </div>
    </div>
  );
};

export default SectionExplainer;
