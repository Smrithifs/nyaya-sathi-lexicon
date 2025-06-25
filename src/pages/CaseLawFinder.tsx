
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, Download, Bookmark, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";
import { searchCases, getDocument, getDocumentMeta, getOriginalDocument, mapSearchFilters } from "@/utils/indianKanoonApi";

const jurisdictions = [
  "Supreme Court",
  "All High Courts",
  "Allahabad High Court",
  "Andhra Pradesh High Court",
  "Bombay High Court",
  "Calcutta High Court",
  "Delhi High Court",
  "Gujarat High Court",
  "Karnataka High Court",
  "Kerala High Court",
  "Madras High Court",
  "Madhya Pradesh High Court",
  "Orissa High Court",
  "Patna High Court",
  "Punjab & Haryana High Court",
  "Rajasthan High Court",
];

const benchTypes = [
  "All Benches",
  "Division Bench",
  "Constitution Bench", 
  "Full Bench",
  "Single Judge",
];

const legalDomains = [
  "Constitutional Law",
  "Criminal Law",
  "Civil Law", 
  "Public Interest Litigation",
  "Intellectual Property Rights",
  "Corporate Law",
  "Labour Law",
  "Family Law",
  "Property Law",
  "Tax Law",
  "Environmental Law",
  "Human Rights",
];

const outcomes = [
  "All",
  "Allowed",
  "Dismissed", 
  "Partially Allowed",
  "Quashed",
  "Remanded",
];

const importantTags = [
  "Landmark Judgment",
  "Basic Structure",
  "Minority Rights", 
  "Fundamental Rights",
  "Directive Principles",
  "PIL Guidelines",
  "Precedent Setting",
];

const CaseLawFinder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  
  // Form states
  const [caseKeyword, setCaseKeyword] = useState("");
  const [citation, setCitation] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [courtName, setCourtName] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [judge, setJudge] = useState("");
  const [benchType, setBenchType] = useState("");
  const [legalDomain, setLegalDomain] = useState([]);
  const [provision, setProvision] = useState("");
  const [outcome, setOutcome] = useState("");
  const [tags, setTags] = useState([]);
  
  // UI states
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCase, setExpandedCase] = useState(null);

  const handleMultiSelect = (value, currentArray, setter) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter(item => item !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  const handleSearch = async () => {
    if (!caseKeyword.trim() && !citation.trim() && !provision.trim()) {
      toast({
        title: "Missing Search Criteria",
        description: "Please enter at least a case keyword, citation, or legal provision.",
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
      console.log('Starting Indian Kanoon API search...');

      // Prepare search filters for Indian Kanoon API
      const searchFilters = {
        keyword: caseKeyword,
        citation: citation,
        jurisdiction: jurisdiction,
        yearFrom: yearFrom,
        yearTo: yearTo,
        judge: judge,
        provision: provision
      };

      const apiParams = mapSearchFilters(searchFilters);
      console.log('API Parameters:', apiParams);

      // Search using Indian Kanoon API
      const searchResponse = await searchCases(apiParams);
      console.log('Search response:', searchResponse);

      if (!searchResponse.docs || searchResponse.docs.length === 0) {
        toast({
          title: "No Results Found",
          description: "No cases found matching your search criteria.",
        });
        setSearchResults([]);
        return;
      }

      // Process top results (limit to 5 for better performance)
      const topResults = searchResponse.docs.slice(0, 5);
      const processedResults = [];

      for (const result of topResults) {
        try {
          console.log(`Processing case: ${result.title}`);
          
          // Get document content and metadata
          const [docContent, docMeta] = await Promise.all([
            getDocument(result.tid),
            getDocumentMeta(result.tid).catch(() => null) // Don't fail if meta is not available
          ]);

          // Use Gemini to analyze and structure the case information
          const analysisPrompt = `Analyze this Indian legal case and provide structured information:

**Case Title:** ${result.title}
**Source:** ${result.docsource}
**Headline:** ${result.headline}

**Document Content:** ${docContent.doc ? docContent.doc.substring(0, 5000) : 'Content not available'}

Please provide the following information in a structured format:

📌 **CASE TITLE:** ${result.title}
📚 **CITATION:** [Extract proper citation if available]
📆 **DATE OF JUDGMENT:** [Extract date from content]
⚖️ **COURT & BENCH:** [Extract court and judges information]
🔢 **CASE NUMBER:** [Extract case number if available]
📄 **SUMMARY OF FACTS** (400-500 words):
[Detailed factual background of the case]

⚖️ **LEGAL ISSUES** (200-300 words):
[Key legal questions and constitutional/statutory provisions involved]

🧾 **JUDGMENT & HOLDING** (400-500 words):
[Court's decision, reasoning, and detailed analysis]

📘 **RATIO DECIDENDI** (250-300 words):
[Legal principle established by the judgment]

📊 **LEGAL SIGNIFICANCE/PRECEDENT** (200-250 words):
[Impact on Indian jurisprudence and precedential value]

Please extract this information from the actual case content provided.`;

          const analysis = await callGeminiAPI(analysisPrompt, geminiKey);

          processedResults.push({
            id: result.tid,
            title: result.title,
            citation: docMeta?.citation || 'Citation not available',
            court: docMeta?.court || result.docsource,
            content: analysis,
            originalDoc: docContent.doc,
            headline: result.headline,
            docsize: result.docsize,
            expanded: false
          });

        } catch (error) {
          console.error(`Error processing case ${result.tid}:`, error);
          // Add basic result even if processing fails
          processedResults.push({
            id: result.tid,
            title: result.title,
            citation: 'Processing failed',
            court: result.docsource,
            content: `**Case Title:** ${result.title}\n\n**Source:** ${result.docsource}\n\n**Summary:** ${result.headline}\n\n*Full analysis unavailable due to processing error.*`,
            originalDoc: null,
            headline: result.headline,
            docsize: result.docsize,
            expanded: false
          });
        }
      }

      setSearchResults(processedResults);
      toast({
        title: "Search Complete",
        description: `Found ${searchResponse.found} cases, displaying top ${processedResults.length} with detailed analysis.`
      });

    } catch (error) {
      console.error('Error searching case law:', error);
      toast({
        title: "Search Error",
        description: "Failed to search cases. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCaseExpansion = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const viewOriginalDocument = async (caseItem) => {
    if (!caseItem.originalDoc) {
      try {
        const originalDoc = await getOriginalDocument(caseItem.id);
        // Open in new window/tab
        const newWindow = window.open();
        newWindow.document.write(`
          <html>
            <head><title>Original Document - ${caseItem.title}</title></head>
            <body style="font-family: Arial, sans-serif; margin: 20px;">
              <h2>${caseItem.title}</h2>
              <div>${originalDoc}</div>
            </body>
          </html>
        `);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load original document.",
          variant: "destructive"
        });
      }
    } else {
      // Open existing content in new window
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head><title>Document - ${caseItem.title}</title></head>
          <body style="font-family: Arial, sans-serif; margin: 20px;">
            <h2>${caseItem.title}</h2>
            <div>${caseItem.originalDoc}</div>
          </body>
        </html>
      `);
    }
  };

  const exportToPDF = (caseContent, caseTitle) => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality will be available soon.",
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-blue-900">Case Law Finder – Powered by Indian Kanoon</h1>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Main Search Card */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Search className="w-6 h-6" />
              Search Real Indian Case Law
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Primary Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Case Name / Keyword *</label>
                <input
                  type="text"
                  value={caseKeyword}
                  onChange={(e) => setCaseKeyword(e.target.value)}
                  placeholder="e.g., 'Maneka Gandhi', 'Kesavananda Bharati', 'murder'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Citation (Optional)</label>
                <input
                  type="text"
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="e.g., 'AIR 1978 SC 597', '1993 AIR'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Toggle Filters Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="w-full md:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Advanced Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-6 space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Jurisdiction</label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Court" />
                      </SelectTrigger>
                      <SelectContent>
                        {jurisdictions.map(j => (
                          <SelectItem key={j} value={j}>{j}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Year From</label>
                    <input
                      type="number"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                      placeholder="1950"
                      min="1950"
                      max="2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Year To</label>
                    <input
                      type="number"
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                      placeholder="2024"
                      min="1950"
                      max="2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Judge(s)</label>
                    <input
                      type="text"
                      value={judge}
                      onChange={(e) => setJudge(e.target.value)}
                      placeholder="e.g., Justice Khanna, Arijit Pasayat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Legal Provision / Section</label>
                    <input
                      type="text"
                      value={provision}
                      onChange={(e) => setProvision(e.target.value)}
                      placeholder="e.g., Article 21, Section 438 CrPC"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching Indian Kanoon Database...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Real Cases
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Search className="w-6 h-6" />
                Search Results from Indian Kanoon ({searchResults.length} cases found)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {searchResults.map((caseItem) => (
                  <Card key={caseItem.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-blue-900 cursor-pointer mb-2" 
                                     onClick={() => toggleCaseExpansion(caseItem.id)}>
                            {caseItem.title}
                          </CardTitle>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>Court:</strong> {caseItem.court}</div>
                            <div><strong>Citation:</strong> {caseItem.citation}</div>
                            <div><strong>Document Size:</strong> {caseItem.docsize} characters</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewOriginalDocument(caseItem)}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Original
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportToPDF(caseItem.content, caseItem.title)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast({ title: "Bookmarked", description: "Case saved to your library." })}
                          >
                            <Bookmark className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleCaseExpansion(caseItem.id)}
                          >
                            {expandedCase === caseItem.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {expandedCase === caseItem.id && (
                      <CardContent>
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                            {caseItem.content}
                          </pre>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaseLawFinder;
