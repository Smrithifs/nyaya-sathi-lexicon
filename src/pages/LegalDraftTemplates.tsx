
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Upload, FileText, Eye, Save } from "lucide-react";
import { marked } from "marked";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";
import DocumentEditor from "@/components/legal/DocumentEditor";
import DocumentUploader from "@/components/legal/DocumentUploader";

const jurisdictions = [
  "Supreme Court of India",
  "Delhi High Court",
  "Bombay High Court", 
  "Calcutta High Court",
  "Madras High Court",
  "Karnataka High Court",
  "Kerala High Court",
  "Allahabad High Court",
  "Punjab & Haryana High Court",
  "Rajasthan High Court",
  "Gujarat High Court",
  "Madhya Pradesh High Court",
  "Orissa High Court",
  "Patna High Court",
  "Andhra Pradesh High Court",
  "Other (Specify)",
];

const languages = [
  { label: "English", value: "english" },
  { label: "हिंदी (Hindi)", value: "hindi" },
  { label: "ಕನ್ನಡ (Kannada)", value: "kannada" },
  { label: "தமிழ் (Tamil)", value: "tamil" },
  { label: "తెలుగు (Telugu)", value: "telugu" },
  { label: "मराठी (Marathi)", value: "marathi" },
  { label: "বাংলা (Bengali)", value: "bengali" },
  { label: "ગુજરાતી (Gujarati)", value: "gujarati" },
];

const LegalDraftTemplates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  
  // Form states - simplified as requested
  const [templateType, setTemplateType] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [customJurisdiction, setCustomJurisdiction] = useState("");
  const [petitionerName, setPetitionerName] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [counselName, setCounselName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [legalSection, setLegalSection] = useState("");
  const [language, setLanguage] = useState("english");
  const [caseDetails, setCaseDetails] = useState("");
  
  // Document states
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const handleGenerate = async () => {
    if (!templateType.trim()) {
      toast({
        title: "Missing Template Type",
        description: "Please enter the type of legal document you want to generate.",
        variant: "destructive"
      });
      return;
    }

    if (!caseDetails.trim()) {
      toast({
        title: "Missing Case Details",
        description: "Please provide case details, facts, parties, and legal issues.",
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
      const actualJurisdiction = jurisdiction === 'Other (Specify)' ? customJurisdiction : jurisdiction;
      const languageLabel = languages.find(l => l.value === language)?.label;
      
      const systemInstruction = `You are a professional legal drafting assistant specializing in Indian law practice. Generate court-ready legal documents that strictly comply with Indian legal standards, Supreme Court Rules 2013, High Court Rules, CrPC, CPC, Indian Evidence Act, and Constitution of India. Use only Indian legal terminology and avoid American legal concepts.`;
      
      const prompt = `${systemInstruction}

Generate a professional ${templateType} for Indian courts with the following details:

TEMPLATE TYPE: ${templateType}
JURISDICTION/COURT: ${actualJurisdiction || 'As applicable'}
PETITIONER: ${petitionerName || '[To be filled]'}
RESPONDENT: ${respondentName || '[To be filled]'}
COUNSEL: ${counselName || '[To be filled]'}
OCCUPATION/RELATION: ${occupation || '[To be filled]'}
LEGAL SECTION/ACT: ${legalSection || 'As applicable'}
OUTPUT LANGUAGE: ${languageLabel}

CASE DETAILS AND FACTS:
${caseDetails}

Please provide a complete, professionally formatted legal draft that includes:

1. **PROPER COURT HEADING** with court name, jurisdiction, and case details
2. **PARTY DETAILS** section with petitioner, respondent names and addresses
3. **STRUCTURED PARAGRAPHS** for:
   - Background/Facts of the Case (detailed factual matrix)
   - Relevant Legal Provisions (cite specific sections of CrPC, CPC, Constitution, etc.)
   - Grounds/Legal Issues (legal arguments and contentions)
   - Prayer/Relief Claimed (specific relief sought)
   - Verification and Signature Clause (as per CPC)

4. **FORMATTING REQUIREMENTS**:
   - Use standard court formatting with proper numbering
   - Include inline citations in AIR/SCC/SCR format where applicable
   - Follow Indian legal drafting conventions
   - Use formal legal language appropriate for Indian courts
   - Include proper spacing and paragraph structure

5. **COMPLIANCE STANDARDS**:
   - Supreme Court Rules, 2013
   - Relevant High Court Rules
   - Code of Civil Procedure, 1908
   - Code of Criminal Procedure, 1973
   - Indian Evidence Act, 1872
   - Constitution of India

6. **LANGUAGE**: Generate the entire document in ${languageLabel}

Ensure the draft is court-ready, professionally structured, and follows all Indian legal drafting standards. The document should be suitable for filing in the specified jurisdiction.`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setGeneratedTemplate(result);
      setShowEditor(true);
      toast({
        title: "Legal Draft Generated",
        description: `${templateType} has been created successfully in ${languageLabel}.`
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Error",
        description: "Failed to generate legal template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUploaded = (extractedText: string) => {
    setCaseDetails(extractedText);
    setShowUploader(false);
    toast({
      title: "Document Processed",
      description: "Text has been extracted and added to case details."
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-3xl font-bold text-blue-900">Legal Draft Templates – India Compliant</h1>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-6">
        {!showEditor ? (
          <>
            <Card className="border-2 border-blue-100">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <FileText className="w-6 h-6" />
                  Generate Legal Document Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Simplified Template Type Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Template Type *</label>
                  <Input
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    placeholder="e.g., Bail Application, Writ Petition, Civil Suit, Affidavit, Legal Notice"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter any legal document type you need (Bail Application, Writ Petition, Consumer Complaint, etc.)
                  </p>
                </div>

                {/* Optional Fields Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Jurisdiction/Court Name (Optional)</label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select court/jurisdiction" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {jurisdictions.map(court => (
                          <SelectItem key={court} value={court}>{court}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {jurisdiction === 'Other (Specify)' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Jurisdiction</label>
                      <Input
                        value={customJurisdiction}
                        onChange={(e) => setCustomJurisdiction(e.target.value)}
                        placeholder="e.g., District Court, Tribunal Name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Language Preference</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {languages.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Optional Party Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Petitioner Name (Optional)</label>
                    <Input
                      value={petitionerName}
                      onChange={(e) => setPetitionerName(e.target.value)}
                      placeholder="Petitioner/Applicant name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Respondent Name (Optional)</label>
                    <Input
                      value={respondentName}
                      onChange={(e) => setRespondentName(e.target.value)}
                      placeholder="Respondent name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Counsel Name (Optional)</label>
                    <Input
                      value={counselName}
                      onChange={(e) => setCounselName(e.target.value)}
                      placeholder="Advocate name"
                    />
                  </div>
                </div>

                {/* Optional Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Occupation/Relation (Optional)</label>
                    <Input
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g., Businessman, Son of, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Section/Act Reference (Optional)</label>
                    <Input
                      value={legalSection}
                      onChange={(e) => setLegalSection(e.target.value)}
                      placeholder="e.g., Section 438 CrPC, Article 226"
                    />
                  </div>
                </div>

                {/* Main Case Details Text Area */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Case Details / Facts *</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUploader(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Reference Doc
                    </Button>
                  </div>
                  <textarea
                    value={caseDetails}
                    onChange={(e) => setCaseDetails(e.target.value)}
                    placeholder="Provide all case details here:
- Facts of the case
- Parties involved  
- Legal issues
- Relief sought
- Chronology of events
- Any other relevant information..."
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include all case facts, parties, legal issues, and relief sought in this single text area
                  </p>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Professional Legal Draft...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Legal Document Template
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {showUploader && (
              <DocumentUploader
                onDocumentProcessed={handleDocumentUploaded}
                onClose={() => setShowUploader(false)}
              />
            )}
          </>
        ) : (
          <DocumentEditor
            document={generatedTemplate}
            onDocumentChange={setGeneratedTemplate}
            onBack={() => setShowEditor(false)}
            title={`${templateType} - Legal Draft Template`}
          />
        )}
      </div>
    </div>
  );
};

export default LegalDraftTemplates;

