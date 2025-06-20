import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { askPuter } from "@/utils/openaiApi";

const BareActNavigator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAct, setSelectedAct] = useState("");
  const [topic, setTopic] = useState("");
  const [navigation, setNavigation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const acts = [
    { value: "ipc", label: "Indian Penal Code (IPC)" },
    { value: "crpc", label: "Code of Criminal Procedure (CrPC)" },
    { value: "cpc", label: "Code of Civil Procedure (CPC)" },
    { value: "evidence", label: "Indian Evidence Act" },
    { value: "contract", label: "Indian Contract Act" },
    { value: "constitution", label: "Constitution of India" },
    { value: "ibc", label: "Insolvency and Bankruptcy Code" },
    { value: "companies", label: "Companies Act 2013" }
  ];

  const handleNavigate = async () => {
    if (!selectedAct || !topic) {
      toast({
        title: "Missing Information",
        description: "Please select an act and enter a topic.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const actName = acts.find(act => act.value === selectedAct)?.label || selectedAct;
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

      const result = await askPuter(prompt);

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

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>
          ← Back to Dashboard
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
              <label className="block text-sm font-medium mb-2">Select Act</label>
              <Select value={selectedAct} onValueChange={setSelectedAct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a legal act to navigate" />
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
      </div>
    </div>
  );
};

export default BareActNavigator;
