
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const LegalDraftTemplates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templateType, setTemplateType] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    { value: "affidavit", label: "Affidavit" },
    { value: "notice", label: "Legal Notice" },
    { value: "petition", label: "Petition" },
    { value: "application", label: "Court Application" },
    { value: "complaint", label: "Complaint" },
    { value: "reply", label: "Reply/Response" },
    { value: "memorandum", label: "Memorandum of Arguments" },
    { value: "undertaking", label: "Undertaking" }
  ];

  const handleGenerate = async () => {
    if (!templateType) {
      toast({
        title: "Missing Information",
        description: "Please select a template type.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const templateName = templates.find(t => t.value === templateType)?.label || templateType;
      const prompt = `Generate a professional ${templateName} template for Indian legal practice.
      
Additional details: ${customDetails || "Standard template"}

Please provide:
1. Complete format with proper headings
2. Standard legal language and clauses
3. Placeholder fields marked with [PLACEHOLDER_NAME]
4. Proper verification clause if applicable
5. Format suitable for Indian courts
6. Include necessary legal formalities

Make it comprehensive and professionally formatted.`;

      const systemInstruction = "You are a legal drafting expert specializing in Indian legal documents. Create professional, court-ready templates with proper legal formatting and language.";

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

      setGeneratedTemplate(result);
      toast({
        title: "Template Generated",
        description: "Your legal document template is ready."
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTemplate);
    toast({
      title: "Copied!",
      description: "Template copied to clipboard."
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>
          ← Back to Dashboard
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
                  <SelectValue placeholder="Choose a document type" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Details (Optional)</label>
              <textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Specify any particular requirements, court, or special clauses needed..."
                rows={3}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Template</CardTitle>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                Copy Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {generatedTemplate}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LegalDraftTemplates;
