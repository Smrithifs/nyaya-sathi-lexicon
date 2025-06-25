import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Search, Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";

import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

const contractTypes = [
  { label: "Agency Contract", value: "agency" },
  { label: "Bailment Contract", value: "bailment" },
  { label: "Board Resolution", value: "board_resolution" },
  { label: "Construction Contract", value: "construction" },
  { label: "Consulting Agreement", value: "consulting" },
  { label: "Contract of Guarantee", value: "guarantee" },
  { label: "Contract of Indemnity", value: "indemnity" },
  { label: "Contingent Contract", value: "contingent" },
  { label: "E-commerce Terms & Conditions", value: "ecommerce_terms" },
  { label: "Employment Bond", value: "employment_bond" },
  { label: "Employment Contract", value: "employment" },
  { label: "Equity Vesting Agreement", value: "equity_vesting" },
  { label: "Express Contract (General)", value: "express_general" },
  { label: "Founder Agreement", value: "founder" },
  { label: "Franchise Agreement", value: "franchise" },
  { label: "Freelance Contract", value: "freelance" },
  { label: "Gift Deed", value: "gift_deed" },
  { label: "General Power of Attorney", value: "general_poa" },
  { label: "Loan Agreement", value: "loan" },
  { label: "Memorandum of Understanding (MoU)", value: "mou" },
  { label: "Non-Disclosure Agreement (NDA)", value: "nda" },
  { label: "Partnership Agreement", value: "partnership" },
  { label: "Pledge Contract", value: "pledge" },
  { label: "Prenuptial Agreement", value: "prenuptial" },
  { label: "Quasi-Contract", value: "quasi" },
  { label: "Real Estate Contract", value: "real_estate" },
  { label: "Rental Agreement", value: "rental" },
  { label: "Sale of Goods Agreement", value: "sale_of_goods" },
  { label: "Service Level Agreement (SLA)", value: "sla" },
  { label: "Shareholders Agreement", value: "shareholders" },
  { label: "Software Licensing Agreement", value: "software_licensing" },
  { label: "Special Power of Attorney", value: "special_poa" },
  { label: "Startup Investment Agreement", value: "startup_investment" },
  { label: "Standard Form Contract", value: "standard_form" },
  { label: "Vendor Agreement", value: "vendor" },
  { label: "Will and Testament", value: "will_testament" },
];

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी (Hindi)", code: "hi" },
  { label: "ಕನ್ನಡ (Kannada)", code: "kn" },
  { label: "தமிழ் (Tamil)", code: "ta" },
  { label: "తెలుగు (Telugu)", code: "te" },
  { label: "मराठी (Marathi)", code: "mr" },
  { label: "ગુજરાતી (Gujarati)", code: "gu" },
  { label: "বাংলা (Bengali)", code: "bn" },
  { label: "ਪੰਜਾਬੀ (Punjabi)", code: "pa" },
  { label: "മലയാളം (Malayalam)", code: "ml" },
];

const jurisdictions = [
  { label: "Andhra Pradesh", value: "ap", court: "Andhra Pradesh High Court", rules: "Andhra Pradesh High Court Rules of Practice" },
  { label: "Assam", value: "as", court: "Gauhati High Court", rules: "Gauhati High Court Rules" },
  { label: "Bihar", value: "br", court: "Patna High Court", rules: "Patna High Court Rules of Practice" },
  { label: "Chhattisgarh", value: "cg", court: "Chhattisgarh High Court", rules: "Chhattisgarh High Court Rules" },
  { label: "Delhi", value: "dl", court: "Delhi High Court", rules: "Delhi High Court Rules of Practice" },
  { label: "Goa", value: "ga", court: "Bombay High Court (Goa Bench)", rules: "Bombay High Court Rules (Goa)" },
  { label: "Gujarat", value: "gj", court: "Gujarat High Court", rules: "Gujarat High Court Rules of Practice" },
  { label: "Haryana", value: "hr", court: "Punjab and Haryana High Court", rules: "Punjab & Haryana High Court Rules" },
  { label: "Himachal Pradesh", value: "hp", court: "Himachal Pradesh High Court", rules: "Himachal Pradesh High Court Rules" },
  { label: "Jharkhand", value: "jh", court: "Jharkhand High Court", rules: "Jharkhand High Court Rules of Practice" },
  { label: "Karnataka", value: "ka", court: "Karnataka High Court", rules: "Karnataka High Court Rules of Practice" },
  { label: "Kerala", value: "kl", court: "Kerala High Court", rules: "Kerala High Court Rules of Practice" },
  { label: "Madhya Pradesh", value: "mp", court: "Madhya Pradesh High Court", rules: "Madhya Pradesh High Court Rules" },
  { label: "Maharashtra", value: "mh", court: "Bombay High Court", rules: "Bombay High Court Rules of Practice" },
  { label: "Manipur", value: "mn", court: "Manipur High Court", rules: "Manipur High Court Rules" },
  { label: "Meghalaya", value: "ml", court: "Meghalaya High Court", rules: "Meghalaya High Court Rules" },
  { label: "Mizoram", value: "mz", court: "Gauhati High Court (Aizawl Bench)", rules: "Gauhati High Court Rules (Mizoram)" },
  { label: "Nagaland", value: "nl", court: "Gauhati High Court (Kohima Bench)", rules: "Gauhati High Court Rules (Nagaland)" },
  { label: "Odisha", value: "or", court: "Orissa High Court", rules: "Orissa High Court Rules of Practice" },
  { label: "Punjab", value: "pb", court: "Punjab and Haryana High Court", rules: "Punjab & Haryana High Court Rules" },
  { label: "Rajasthan", value: "rj", court: "Rajasthan High Court", rules: "Rajasthan High Court Rules of Practice" },
  { label: "Sikkim", value: "sk", court: "Sikkim High Court", rules: "Sikkim High Court Rules" },
  { label: "Tamil Nadu", value: "tn", court: "Madras High Court", rules: "Civil Rules of Practice (Madras High Court)" },
  { label: "Telangana", value: "ts", court: "Telangana High Court", rules: "Telangana High Court Rules of Practice" },
  { label: "Tripura", value: "tr", court: "Tripura High Court", rules: "Tripura High Court Rules" },
  { label: "Uttar Pradesh", value: "up", court: "Allahabad High Court", rules: "Allahabad High Court Rules of Practice" },
  { label: "Uttarakhand", value: "uk", court: "Uttarakhand High Court", rules: "Uttarakhand High Court Rules" },
  { label: "West Bengal", value: "wb", court: "Calcutta High Court", rules: "Calcutta High Court Rules of Practice" },
];

interface UploadedDocument {
  id: string;
  filename: string;
  type: string;
  content: string;
  size: number;
  uploadedAt: string;
}

const ContractGenerator = () => {
  const navigate = useNavigate();
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [contractType, setContractType] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [lang, setLang] = useState("en");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [extractedDetails, setExtractedDetails] = useState("");
  const [extracting, setExtracting] = useState(false);
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();

  const selectedContractType = contractTypes.find(ct => ct.value === contractType);
  const selectedJurisdiction = jurisdictions.find(j => j.value === jurisdiction);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      const sessionId = `session_${Date.now()}`;
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('sessionId', sessionId);

      const response = await fetch('/api/process-documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process documents');
      }

      if (data.success) {
        setUploadedDocuments(data.documents);
        toast({
          title: "Documents uploaded successfully",
          description: `${data.documents.length} documents processed`,
        });
        
        // Auto-extract details after upload
        await extractContractDetails(data.documents);
        
        // Clear the input
        event.target.value = '';
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload documents",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const extractContractDetails = async (documents: UploadedDocument[]) => {
    if (!geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key to use this feature.",
        variant: "destructive",
      });
      return;
    }

    setExtracting(true);
    try {
      const documentContent = documents.map(doc => `Document: ${doc.filename}\nContent: ${doc.content}`).join('\n\n');
      
      const extractionPrompt = `Extract contract details from the following documents and format them as:

Party A: [First party name]
Party B: [Second party name]
Date: [Contract date in YYYY-MM-DD format]
Jurisdiction: [State/jurisdiction mentioned]
Purpose: [Brief description of contract purpose]
Contract Type (suggested): [Suggested contract type based on content]

Documents to analyze:
${documentContent}

Only extract information that is clearly mentioned in the documents. If information is not available, leave it blank or write "Not specified".`;

      const result = await callGeminiAPI(extractionPrompt, geminiKey);
      setExtractedDetails(result);
      toast({
        title: "Details extracted",
        description: "Contract details have been extracted from uploaded documents",
      });
    } catch (error: any) {
      console.error('Extraction error:', error);
      toast({
        title: "Extraction failed",
        description: "Failed to extract details from documents",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    if (uploadedDocuments.length === 1) {
      setExtractedDetails("");
    }
  };

  const getContractPrompt = (type: string, partyA: string, partyB: string, date: string, language: string, jurisdiction: string, additionalDetails?: string) => {
    const languageMap: { [key: string]: string } = {
      en: "English",
      hi: "Hindi",
      kn: "Kannada", 
      ta: "Tamil",
      te: "Telugu",
      mr: "Marathi",
      gu: "Gujarati",
      bn: "Bengali",
      pa: "Punjabi",
      ml: "Malayalam"
    };

    const langStr = languageMap[language] || "English";
    const typeLabel = contractTypes.find(ct => ct.value === type)?.label || "Agreement";
    const jurisdictionInfo = jurisdictions.find(j => j.value === jurisdiction);

    let specificClauses = "";
    let relevantLaws = "Indian Contract Act, 1872";

    // Add specific clauses and laws based on contract type
    switch (type) {
      case "employment":
      case "employment_bond":
        specificClauses = "including salary, designation, working hours, leave policy, termination clauses, confidentiality, and notice period";
        relevantLaws = "Indian Contract Act 1872, Payment of Wages Act 1936, Employees' Provident Funds Act 1952, and relevant labor laws";
        break;
      case "rental":
        specificClauses = "including rent amount, security deposit, maintenance, utilities, renewal terms, and termination conditions";
        relevantLaws = "Indian Contract Act 1872, Transfer of Property Act 1882, and relevant rent control laws";
        break;
      case "nda":
        specificClauses = "including definition of confidential information, permitted disclosures, return of information, and breach consequences";
        relevantLaws = "Indian Contract Act 1872, Information Technology Act 2000";
        break;
      case "partnership":
        specificClauses = "including profit sharing, capital contribution, decision making, dissolution terms, and partner liabilities";
        relevantLaws = "Indian Partnership Act 1932, Indian Contract Act 1872";
        break;
      case "software_licensing":
      case "ecommerce_terms":
        specificClauses = "including license scope, usage restrictions, intellectual property rights, data protection, and liability limitations";
        relevantLaws = "Indian Contract Act 1872, Information Technology Act 2000, Copyright Act 1957";
        break;
      case "real_estate":
        specificClauses = "including property description, consideration, possession, registration, and title warranties";
        relevantLaws = "Transfer of Property Act 1882, Indian Contract Act 1872, Registration Act 1908";
        break;
      case "shareholders":
      case "startup_investment":
        specificClauses = "including shareholding, voting rights, board composition, transfer restrictions, and exit mechanisms";
        relevantLaws = "Companies Act 2013, Indian Contract Act 1872, SEBI regulations";
        break;
      case "loan":
        specificClauses = "including principal amount, interest rate, repayment schedule, security, and default provisions";
        relevantLaws = "Indian Contract Act 1872, Banking Regulation Act 1949, Limitation Act 1963";
        break;
      case "construction":
        specificClauses = "including scope of work, timeline, materials, payment schedule, quality standards, and penalties";
        relevantLaws = "Indian Contract Act 1872, Real Estate (Regulation and Development) Act 2016";
        break;
      case "franchise":
        specificClauses = "including franchise rights, territory, fees, operational standards, and termination conditions";
        relevantLaws = "Indian Contract Act 1872, Trade Marks Act 1999, Competition Act 2002";
        break;
      default:
        specificClauses = "including all standard and specific clauses relevant to this type of agreement";
    }

    const jurisdictionClause = jurisdictionInfo ? 
      `\n\n**Jurisdiction-Specific Requirements:**
- Applicable Court: ${jurisdictionInfo.court}
- Rules of Practice: ${jurisdictionInfo.rules}
- Jurisdiction clause must reference ${jurisdictionInfo.court} for dispute resolution
- Format and procedural requirements must comply with ${jurisdictionInfo.rules}
- Include specific provisions for service of process under ${jurisdictionInfo.label} jurisdiction
- Ensure compliance with local registration and stamp duty requirements for ${jurisdictionInfo.label}` : "";

    const additionalContext = additionalDetails ? `\n\n**Additional Context from Uploaded Documents:**
${additionalDetails}

Please incorporate relevant information from the uploaded documents while ensuring legal compliance.` : "";

    return `
You are a legal contract generation assistant trained in Indian law. Draft a complete, professional ${typeLabel} in ${langStr} that is legally valid under Indian law and specifically tailored for ${jurisdictionInfo?.label || "Indian"} jurisdiction.

Contract Details:
- Party A (First Party): ${partyA}
- Party B (Second Party): ${partyB}
- Date of Agreement: ${date}
- Contract Type: ${typeLabel}
- Jurisdiction: ${jurisdictionInfo?.label || "India"}
- Applicable Court: ${jurisdictionInfo?.court || "Competent Court having jurisdiction"}

Requirements:
1. Use proper Indian legal structure with:
   - Parties section with full details
   - Recitals (WHEREAS clauses)
   - Definitions section
   - Main operative clauses ${specificClauses}
   - General provisions (governing law, jurisdiction, amendments, etc.)
   - Execution section with signature blocks

2. Reference relevant Indian laws: ${relevantLaws}

3. Include all essential legal elements:
   - Consideration clause
   - Terms and conditions specific to ${typeLabel}
   - Dispute resolution clause specifically referencing ${jurisdictionInfo?.court || "appropriate court"}
   - Governing law as Indian law with ${jurisdictionInfo?.label || "Indian"} jurisdiction
   - Force majeure clause
   - Entire agreement clause

4. Format: Use markdown with proper headings and structure
5. Language: ${langStr === "English" ? "Use clear legal English" : `Translate to ${langStr} but keep legal terms in English where necessary for precision`}
6. Make it ready for digital/physical signature and legally enforceable

${jurisdictionClause}${additionalContext}

Generate a complete, professional contract that covers all necessary legal aspects for a ${typeLabel} under Indian law, specifically formatted for ${jurisdictionInfo?.label || "Indian"} jurisdiction and compliant with ${jurisdictionInfo?.rules || "standard Indian legal practice"}.
    `.trim();
  };

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!contractType) {
      toast({ title: "Error", description: "Please select a contract type", variant: "destructive" });
      return;
    }
    if (!jurisdiction) {
      toast({ title: "Error", description: "Please select applicable jurisdiction/state", variant: "destructive" });
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

    setLoading(true);
    setOutput(null);
    try {
      const prompt = getContractPrompt(contractType, partyA, partyB, contractDate, lang, jurisdiction, extractedDetails);

      const doc = await callGeminiAPI(prompt, geminiKey);

      setOutput(doc);
      const langLabel = languages.find(l => l.code === lang)?.label || "English";
      const jurisdictionLabel = jurisdictions.find(j => j.value === jurisdiction)?.label || "India";
      toast({ title: "Contract generated!", description: `${selectedContractType?.label} ready in ${langLabel} for ${jurisdictionLabel} jurisdiction` });
    } catch (err: any) {
      toast({ title: "Generation Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Contract Generator</h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-lg border border-input">
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Document Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload documents to auto-extract contract details (PDF, DOCX, TXT)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="document-upload"
                />
                <Button 
                  asChild 
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                  type="button"
                >
                  <label htmlFor="document-upload" className="cursor-pointer">
                    {uploading ? 'Processing...' : 'Upload Documents'}
                  </label>
                </Button>
              </div>

              {/* Uploaded Documents List */}
              {uploadedDocuments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Uploaded Documents ({uploadedDocuments.length})
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {uploadedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          {getFileIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.filename}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(doc.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Details Editor */}
              {extractedDetails && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Extracted Details (Editable)</label>
                  <Textarea
                    value={extractedDetails}
                    onChange={e => setExtractedDetails(e.target.value)}
                    placeholder="Extracted contract details will appear here..."
                    className="min-h-[120px]"
                    disabled={extracting}
                  />
                  {extracting && (
                    <p className="text-sm text-blue-600 mt-1">Extracting details from uploaded documents...</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Party A (First Party)</label>
                <Input
                  value={partyA}
                  onChange={e => setPartyA(e.target.value)}
                  placeholder="Name of first party"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Party B (Second Party)</label>
                <Input
                  value={partyB}
                  onChange={e => setPartyB(e.target.value)}
                  placeholder="Name of second party"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date of Agreement</label>
                <Input
                  type="date"
                  value={contractDate}
                  onChange={e => setContractDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Applicable Jurisdiction/State</label>
                <Select value={jurisdiction} onValueChange={setJurisdiction} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state/jurisdiction" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {jurisdictions.map(j => (
                      <SelectItem key={j.value} value={j.value}>
                        {j.label} ({j.court})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contract Type</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={loading}
                      type="button"
                    >
                      {selectedContractType?.label || "Search or select contract type..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white">
                    <Command>
                      <CommandInput placeholder="Search contract types..." />
                      <CommandEmpty>No contract type found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {contractTypes.map((ct) => (
                            <CommandItem
                              key={ct.value}
                              value={ct.label}
                              onSelect={() => {
                                setContractType(ct.value);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  contractType === ct.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {ct.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Output Language</label>
                <Select value={lang} onValueChange={setLang} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {languages.map(l => (
                      <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                {loading ? "Generating Contract..." : "Generate Contract"}
              </Button>
            </div>
          </form>
          {output && (
            <div className="mt-8 border-t pt-6 prose prose-base max-w-none break-words">
              <div dangerouslySetInnerHTML={{ __html: marked(output) }} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractGenerator;
