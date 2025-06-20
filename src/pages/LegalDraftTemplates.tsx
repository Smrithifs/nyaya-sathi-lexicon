
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { askPuter } from "@/utils/openaiApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Edit3, Upload } from "lucide-react";

const LegalDraftTemplates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templateType, setTemplateType] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [petitionerName, setPetitionerName] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [caseFacts, setCaseFacts] = useState("");
  const [legalSection, setLegalSection] = useState("");
  const [prayerRelief, setPrayerRelief] = useState("");
  const [language, setLanguage] = useState("English");
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [editableTemplate, setEditableTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    { value: "affidavit", label: "Affidavit" },
    { value: "anticipatory_bail", label: "Anticipatory Bail Application (under Section 438 CrPC)" },
    { value: "consumer_complaint", label: "Consumer Complaint" },
    { value: "legal_notice", label: "Legal Notice" },
    { value: "pil", label: "Public Interest Litigation (PIL)" },
    { value: "power_of_attorney", label: "Power of Attorney" },
    { value: "reply_notice", label: "Reply to Legal Notice" },
    { value: "rti_application", label: "RTI Application" },
    { value: "writ_petition_226", label: "Writ Petition (under Article 226)" }
  ];

  const jurisdictions = [
    { value: "delhi_high_court", label: "Delhi High Court" },
    { value: "district_court", label: "District Court (General Format)" },
    { value: "karnataka_high_court", label: "Karnataka High Court" },
    { value: "supreme_court", label: "Supreme Court of India" }
  ];

  const languages = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Regional", label: "Regional Language" }
  ];

  const handleGenerate = async () => {
    if (!templateType || !jurisdiction) {
      toast({
        title: "Missing Information",
        description: "Please select template type and jurisdiction.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const templateName = templates.find(t => t.value === templateType)?.label || templateType;
      const courtName = jurisdictions.find(j => j.value === jurisdiction)?.label || jurisdiction;

      const prompt = `You are a legal drafting assistant trained in Indian law and jurisdiction-specific court procedures. Your role is to generate **fully compliant legal documents** based on user inputs, using court-approved formats from Indian judicial systems.

Generate a professional ${templateName} for ${courtName} following Indian legal practice and court-specific Rules of Practice.

Document Details:
- Template Type: ${templateName}
- Court/Jurisdiction: ${courtName}
- Petitioner/Applicant: ${petitionerName || "[PETITIONER NAME]"}
- Respondent: ${respondentName || "[RESPONDENT NAME]"}
- Occupation/Relation: ${occupation || "[OCCUPATION/RELATION]"}
- Case Facts: ${caseFacts || "[CASE FACTS TO BE FILLED]"}
- Legal Section/Reference: ${legalSection || "[APPLICABLE SECTIONS TO BE MENTIONED]"}
- Prayer/Relief Sought: ${prayerRelief || "[RELIEF SOUGHT TO BE SPECIFIED]"}
- Language: ${language}

REQUIREMENTS:
1. Use appropriate legal language and court phrasing specific to ${courtName}
2. Match templates with standard court formats for ${jurisdiction.replace('_', ' ')}
3. Include proper legal headings and structure as per Indian court requirements
4. Use standard legal language and clauses appropriate for ${templateName}
5. Mark placeholder fields with [PLACEHOLDER_NAME] where information is missing
6. Include proper verification clause and formatting
7. Add court-specific formatting requirements
8. Include necessary legal formalities and citation format
9. Ensure compliance with Indian legal practice — **no U.S. style references**
10. Add appropriate sections for exhibits, annexures if required
11. Include proper prayer format as per Indian court practice
12. Show placeholders like "[Signature]", "[Stamp]", "[Advocate details]"

Make it comprehensive, court-ready, and professionally formatted for ${language === "English" ? "English" : language + " with legal terms in English where necessary"}.

Format the output as a complete legal document ready for court filing.`;

      const result = await askPuter(prompt);
      setGeneratedTemplate(result);
      setEditableTemplate(result);
      setShowPreview(true);
      
      toast({
        title: "Legal Draft Generated",
        description: `Your ${templateName} for ${courtName} is ready for review.`
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

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Legal Document</title>
            <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 20px; }
              .document { max-width: 800px; margin: 0 auto; }
              pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; }
            </style>
          </head>
          <body>
            <div class="document">
              <pre>${editableTemplate}</pre>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast({
      title: "Download Initiated",
      description: "Your legal document is ready for printing/saving as PDF."
    });
  };

  const handleDownloadWord = () => {
    const blob = new Blob([editableTemplate], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal_document_${templateType}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Legal document downloaded as Word document."
    });
  };

  if (showPreview) {
    return (
      <div className="p-6 min-h-screen bg-white flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => setShowPreview(false)}>
            ← Back to Form
          </Button>
          <h1 className="text-2xl font-bold">Legal Document Preview</h1>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                Editable Document Preview
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={handleDownloadWord} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Word
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editableTemplate}
                onChange={(e) => setEditableTemplate(e.target.value)}
                className="min-h-[600px] font-mono text-sm leading-relaxed"
                placeholder="Your legal document will appear here..."
              />
              <p className="text-sm text-gray-500 mt-2">
                You can edit the document above before downloading. Make sure to review all placeholders and fill in any missing information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <CardTitle>Generate Court-Compliant Legal Document</CardTitle>
            <p className="text-sm text-gray-600">
              Create professionally formatted legal documents following Indian court procedures and state-specific Rules of Practice.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Type */}
            <div>
              <Label className="text-sm font-medium">Document Type *</Label>
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

            {/* Jurisdiction */}
            <div>
              <Label className="text-sm font-medium">Court/Jurisdiction *</Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select court/jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {jurisdictions.map((court) => (
                    <SelectItem key={court.value} value={court.value}>
                      {court.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Party Details */}
              <div>
                <Label className="text-sm font-medium">Petitioner/Applicant Name</Label>
                <Input
                  value={petitionerName}
                  onChange={(e) => setPetitionerName(e.target.value)}
                  placeholder="Enter petitioner name"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Respondent Name</Label>
                <Input
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  placeholder="Enter respondent name"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Occupation/Relation</Label>
              <Input
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Enter occupation or relation details"
              />
            </div>

            {/* Case Facts */}
            <div>
              <Label className="text-sm font-medium">Case Facts (Short Paragraph)</Label>
              <Textarea
                value={caseFacts}
                onChange={(e) => setCaseFacts(e.target.value)}
                placeholder="Provide a brief description of the case facts and circumstances..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Legal Section */}
              <div>
                <Label className="text-sm font-medium">Section/Law Reference</Label>
                <Input
                  value={legalSection}
                  onChange={(e) => setLegalSection(e.target.value)}
                  placeholder="e.g., Section 438 CrPC, Article 226"
                />
              </div>

              {/* Language */}
              <div>
                <Label className="text-sm font-medium">Language Preference</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prayer/Relief */}
            <div>
              <Label className="text-sm font-medium">Prayer/Relief Requested</Label>
              <Textarea
                value={prayerRelief}
                onChange={(e) => setPrayerRelief(e.target.value)}
                placeholder="Specify what relief or order you are seeking from the court..."
                rows={3}
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
                  Generating Legal Draft...
                </>
              ) : (
                "Generate Legal Draft"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Optional: Upload Existing Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Upload an existing document (FIR, legal notice, etc.) to auto-extract information and populate the form fields.
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalDraftTemplates;
