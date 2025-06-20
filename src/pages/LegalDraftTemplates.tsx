
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { marked } from "marked";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

const templateTypes = [
  { label: "Bail Application", value: "bail_application" },
  { label: "Writ Petition", value: "writ_petition" },
  { label: "Civil Suit", value: "civil_suit" },
  { label: "Criminal Complaint", value: "criminal_complaint" },
  { label: "Divorce Petition", value: "divorce_petition" },
  { label: "Property Dispute", value: "property_dispute" },
  { label: "Consumer Complaint", value: "consumer_complaint" },
  { label: "Labour Dispute", value: "labour_dispute" },
  { label: "Appeal Petition", value: "appeal_petition" },
  { label: "Review Petition", value: "review_petition" },
  { label: "Injunction Application", value: "injunction_application" },
  { label: "Anticipatory Bail", value: "anticipatory_bail" },
];

const LegalDraftTemplates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [templateType, setTemplateType] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!templateType) {
      toast({
        title: "Missing Template Type",
        description: "Please select a template type to generate.",
        variant: "destructive"
      });
      return;
    }

    if (!caseDetails.trim()) {
      toast({
        title: "Missing Case Details",
        description: "Please provide case details or brief facts.",
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
      const templateLabel = templateTypes.find(t => t.value === templateType)?.label;
      const systemInstruction = "You are a legal drafting assistant specializing in Indian court procedures and legal document preparation. Generate professional legal templates that comply with Indian legal standards.";
      
      const prompt = `${systemInstruction}

Generate a professional ${templateLabel} template for Indian courts based on the following case details:

Case Details: ${caseDetails}

Please provide:
1. Proper legal format and structure for ${templateLabel}
2. Standard legal language and terminology
3. All necessary sections and clauses
4. Proper citation format and references
5. Placeholder fields for specific details
6. Compliance with Indian court procedures and rules

Format the document professionally with proper headings, numbering, and legal structure suitable for filing in Indian courts.`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setGeneratedTemplate(result);
      toast({
        title: "Template Generated",
        description: `${templateLabel} template has been created successfully.`
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Error",
        description: "Failed to generate template. Please try again.",
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
        <h1 className="text-2xl font-bold">Legal Draft Templates</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Legal Document Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Template Type</label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map(template => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Case Details / Brief Facts</label>
              <textarea
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
                placeholder="Provide brief facts, parties involved, legal issues, relief sought, etc."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Template...
                </>
              ) : (
                "Generate Template"
              )}
            </Button>
          </CardContent>
        </Card>

        {generatedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Legal Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: marked(generatedTemplate) }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LegalDraftTemplates;
