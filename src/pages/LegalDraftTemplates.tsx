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
import { Loader2 } from "lucide-react";

const LegalDraftTemplates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templateType, setTemplateType] = useState("");
  const [courtType, setCourtType] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [petitionerName, setPetitionerName] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [advocateName, setAdvocateName] = useState("");
  const [caseBackground, setCaseBackground] = useState("");
  const [prayerRelief, setPrayerRelief] = useState("");
  const [applicableLaws, setApplicableLaws] = useState("");
  const [filingPurpose, setFilingPurpose] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("English");
  const [customDetails, setCustomDetails] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    { value: "affidavit_cpc", label: "Affidavit (under CPC)" },
    { value: "anticipatory_bail", label: "Anticipatory Bail Application (under CrPC)" },
    { value: "writ_petition_226", label: "Writ Petition (under Article 226)" },
    { value: "consumer_complaint", label: "Consumer Court Complaint" },
    { value: "legal_notice", label: "Legal Notice" },
    { value: "reply_notice", label: "Reply Notice" },
    { value: "rti_application", label: "RTI Application" },
    { value: "pil_draft", label: "PIL Draft" },
    { value: "power_of_attorney", label: "Power of Attorney" },
    { value: "bail_application", label: "Bail Application" },
    { value: "divorce_petition", label: "Divorce Petition" },
    { value: "injunction_application", label: "Injunction Application" },
    { value: "appeal_memorandum", label: "Appeal Memorandum" },
    { value: "revision_petition", label: "Revision Petition" },
    { value: "habeas_corpus", label: "Habeas Corpus Petition" },
    { value: "quashing_petition", label: "Quashing Petition" },
    { value: "others", label: "Others (specify in details)" }
  ];

  const courtTypes = [
    { value: "district_court", label: "District Court" },
    { value: "sessions_court", label: "Sessions Court" },
    { value: "high_court", label: "High Court" },
    { value: "supreme_court", label: "Supreme Court" },
    { value: "consumer_court", label: "Consumer Court" },
    { value: "family_court", label: "Family Court" },
    { value: "labour_court", label: "Labour Court" },
    { value: "tribunal", label: "Tribunal" },
    { value: "magistrate_court", label: "Magistrate Court" }
  ];

  const jurisdictions = [
    { value: "andhra_pradesh", label: "Andhra Pradesh" },
    { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal_pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya_pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar_pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west_bengal", label: "West Bengal" },
    { value: "delhi", label: "Delhi" },
    { value: "chandigarh", label: "Chandigarh" },
    { value: "puducherry", label: "Puducherry" }
  ];

  const languages = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Tamil", label: "Tamil" },
    { value: "Telugu", label: "Telugu" },
    { value: "Kannada", label: "Kannada" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Marathi", label: "Marathi" },
    { value: "Bengali", label: "Bengali" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Punjabi", label: "Punjabi" }
  ];

  const handleGenerate = async () => {
    if (!templateType || !courtType || !jurisdiction) {
      toast({
        title: "Missing Information",
        description: "Please fill in template type, court type, and jurisdiction.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const templateName = templates.find(t => t.value === templateType)?.label || templateType;
      const courtName = courtTypes.find(c => c.value === courtType)?.label || courtType;
      const stateName = jurisdictions.find(j => j.value === jurisdiction)?.label || jurisdiction;

      const prompt = `You are a legal drafting expert specializing in Indian court procedures and state-specific Rules of Practice. Create professional, court-ready templates with proper legal formatting, language, and compliance with specific state High Court rules. Pay special attention to jurisdiction-specific requirements:
      
- Karnataka: Follow Karnataka High Court Rules of Practice
- Tamil Nadu: Apply Civil Rules of Practice (Madras High Court style)
- Maharashtra: Bombay High Court procedures
- Delhi: Delhi High Court Rules
- Other states: Apply respective High Court Rules of Practice

Ensure all documents are formatted for both e-filing and offline submission as applicable.

Generate a professional ${templateName} for ${courtName} in ${stateName} following the state's Rules of Practice and Filing.

Document Details:
- Template Type: ${templateName}
- Court: ${courtName}
- Jurisdiction/State: ${stateName}
- Petitioner/Applicant: ${petitionerName || "[PETITIONER NAME]"}
- Respondent: ${respondentName || "[RESPONDENT NAME]"}
- Advocate: ${advocateName || "[ADVOCATE NAME]"}
- Case Background: ${caseBackground || "[CASE BACKGROUND TO BE FILLED]"}
- Prayer/Relief Sought: ${prayerRelief || "[RELIEF SOUGHT TO BE SPECIFIED]"}
- Applicable Laws/Sections: ${applicableLaws || "[APPLICABLE SECTIONS TO BE MENTIONED]"}
- Filing Purpose: ${filingPurpose || "[PURPOSE TO BE SPECIFIED]"}
- Output Language: ${outputLanguage}
- Additional Details: ${customDetails || "Standard format"}

Please provide:
1. Complete format following ${stateName} ${courtName} Rules of Practice
2. Proper legal headings and structure as per court requirements
3. Standard legal language and clauses appropriate for ${templateName}
4. Placeholder fields marked with [PLACEHOLDER_NAME] where information is missing
5. Proper verification clause and formatting
6. Court-specific formatting requirements for ${stateName}
7. Include necessary legal formalities and citation format
8. Ensure compliance with ${stateName} High Court/Court Rules of Filing
9. Add appropriate sections for exhibits, annexures if required
10. Include proper prayer format as per court practice

Make it comprehensive, court-ready, and professionally formatted for ${outputLanguage === "English" ? "English" : outputLanguage + " with legal terms in English where necessary"}.`;

      const result = await askPuter(prompt);

      setGeneratedTemplate(result);
      toast({
        title: "Legal Draft Generated",
        description: `Your ${templateName} for ${courtName}, ${stateName} is ready.`
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
      description: "Legal draft copied to clipboard."
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
            <CardTitle>Generate Court-Specific Legal Document</CardTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Court Type */}
              <div>
                <Label className="text-sm font-medium">Type of Court *</Label>
                <Select value={courtType} onValueChange={setCourtType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select court type" />
                  </SelectTrigger>
                  <SelectContent>
                    {courtTypes.map((court) => (
                      <SelectItem key={court.value} value={court.value}>
                        {court.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Jurisdiction */}
              <div>
                <Label className="text-sm font-medium">Jurisdiction/State *</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state/jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <Label className="text-sm font-medium">Advocate Name (Optional)</Label>
                <Input
                  value={advocateName}
                  onChange={(e) => setAdvocateName(e.target.value)}
                  placeholder="Enter advocate name"
                />
              </div>
            </div>

            {/* Case Background */}
            <div>
              <Label className="text-sm font-medium">Case Background</Label>
              <Textarea
                value={caseBackground}
                onChange={(e) => setCaseBackground(e.target.value)}
                placeholder="Provide a brief description of the case facts and circumstances..."
                rows={3}
              />
            </div>

            {/* Prayer/Relief */}
            <div>
              <Label className="text-sm font-medium">Prayer or Relief Sought</Label>
              <Textarea
                value={prayerRelief}
                onChange={(e) => setPrayerRelief(e.target.value)}
                placeholder="Specify what relief or order you are seeking from the court..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Applicable Laws */}
              <div>
                <Label className="text-sm font-medium">Applicable Acts/Sections</Label>
                <Input
                  value={applicableLaws}
                  onChange={(e) => setApplicableLaws(e.target.value)}
                  placeholder="e.g., Section 438 CrPC, Article 226"
                />
              </div>

              {/* Filing Purpose */}
              <div>
                <Label className="text-sm font-medium">Filing Purpose</Label>
                <Input
                  value={filingPurpose}
                  onChange={(e) => setFilingPurpose(e.target.value)}
                  placeholder="e.g., interim relief, stay order"
                />
              </div>
            </div>

            {/* Output Language */}
            <div>
              <Label className="text-sm font-medium">Output Language</Label>
              <Select value={outputLanguage} onValueChange={setOutputLanguage}>
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

            {/* Additional Details */}
            <div>
              <Label className="text-sm font-medium">Additional Details/Special Requirements</Label>
              <Textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Specify any special formatting, e-filing requirements, or other details..."
                rows={2}
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

        {generatedTemplate && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Legal Draft</CardTitle>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                Copy Draft
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
