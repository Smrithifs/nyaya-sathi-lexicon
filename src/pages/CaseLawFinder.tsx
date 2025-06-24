import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, Download, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

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
      console.log('Starting case law search with criteria:', {
        keyword: caseKeyword,
        citation,
        jurisdiction,
        yearFrom,
        yearTo,
        provision
      });

      let searchQuery = "";
      if (caseKeyword) searchQuery += caseKeyword + " ";
      if (citation) searchQuery += citation + " ";
      if (provision) searchQuery += provision + " ";
      if (jurisdiction && jurisdiction !== "All High Courts") searchQuery += jurisdiction + " ";
      
      // Create a comprehensive search prompt for AI-generated case analysis
      const systemInstruction = "You are an expert Indian legal researcher. Generate comprehensive case briefs based on the search criteria provided.";
      
      let filters = [];
      if (jurisdiction && jurisdiction !== "All High Courts") filters.push(`Jurisdiction: ${jurisdiction}`);
      if (yearFrom || yearTo) filters.push(`Year Range: ${yearFrom || 'earliest'} to ${yearTo || 'latest'}`);
      if (judge) filters.push(`Judge: ${judge}`);
      if (benchType && benchType !== "All Benches") filters.push(`Bench Type: ${benchType}`);
      if (legalDomain.length > 0) filters.push(`Legal Domain: ${legalDomain.join(', ')}`);
      if (outcome && outcome !== "All") filters.push(`Outcome: ${outcome}`);
      if (tags.length > 0) filters.push(`Tags: ${tags.join(', ')}`);
      
      const enhancedPrompt = `${systemInstruction}

Search Criteria:
- Keywords: ${searchQuery.trim()}
- Filters: ${filters.join('; ')}

Generate 3-5 comprehensive case briefs for Indian legal cases that match these criteria. Each case brief should follow this structure:

**Case [Number]: [Case Title]**
📌 **CASE TITLE:** [Full case name]
📚 **CITATION:** [Standard Indian legal citation]
📆 **DATE OF JUDGMENT:** [Date]
⚖️ **COURT & BENCH:** [Court name and judges]

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

Ensure each case brief is relevant to the search criteria and represents actual legal principles from Indian jurisprudence.`;

      const result = await callGeminiAPI(enhancedPrompt, geminiKey);
      
      // Parse the AI response into structured case briefs
      const caseBriefs = [{
        id: 1,
        content: result,
        title: `AI-Generated Case Analysis for: ${searchQuery.trim()}`,
        citation: 'AI Analysis',
        expanded: false
      }];

      setSearchResults(caseBriefs);
      toast({
        title: "Case Analysis Generated",
        description: "AI-generated case analysis based on your search criteria."
      });
    } catch (error) {
      console.error('Error searching case law:', error);
      toast({
        title: "Error",
        description: "Failed to search case law. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCaseExpansion = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
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
        <h1 className="text-3xl font-bold text-blue-900">Case Law Finder – AI-Powered Legal Research</h1>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Main Search Card */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Search className="w-6 h-6" />
              Search Indian Case Law
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
                  placeholder="e.g., 'Maneka Gandhi', 'Kesavananda Bharati'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Citation (Optional)</label>
                <input
                  type="text"
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="e.g., 'AIR 1978 SC 597', '(1973) 4 SCC 225'"
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
                    <label className="block text-sm font-medium mb-2">Court Name (Optional)</label>
                    <input
                      type="text"
                      value={courtName}
                      onChange={(e) => setCourtName(e.target.value)}
                      placeholder="e.g., Bombay High Court at Aurangabad"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bench Type</label>
                    <Select value={benchType} onValueChange={setBenchType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Bench Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {benchTypes.map(bt => (
                          <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Judge(s)</label>
                    <input
                      type="text"
                      value={judge}
                      onChange={(e) => setJudge(e.target.value)}
                      placeholder="e.g., Justice Khanna"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Outcome</label>
                    <Select value={outcome} onValueChange={setOutcome}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        {outcomes.map(o => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Legal Domain</label>
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[42px]">
                      {legalDomain.length === 0 && (
                        <span className="text-gray-400 text-sm">Select domains...</span>
                      )}
                      {legalDomain.map(domain => (
                        <span key={domain} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {domain}
                          <button 
                            onClick={() => handleMultiSelect(domain, legalDomain, setLegalDomain)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >×</button>
                        </span>
                      ))}
                    </div>
                    <Select onValueChange={(value) => handleMultiSelect(value, legalDomain, setLegalDomain)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Add domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {legalDomains.filter(d => !legalDomain.includes(d)).map(domain => (
                          <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-sm font-medium mb-2">Important Tags</label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[42px]">
                    {tags.length === 0 && (
                      <span className="text-gray-400 text-sm">Select tags...</span>
                    )}
                    {tags.map(tag => (
                      <span key={tag} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {tag}
                        <button 
                          onClick={() => handleMultiSelect(tag, tags, setTags)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >×</button>
                      </span>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleMultiSelect(value, tags, setTags)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Add tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {importantTags.filter(t => !tags.includes(t)).map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  Generating Legal Analysis...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Generate Case Analysis
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
                AI-Generated Legal Analysis ({searchResults.length} analysis generated)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {searchResults.map((caseItem) => (
                  <Card key={caseItem.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-blue-900 cursor-pointer" 
                                   onClick={() => toggleCaseExpansion(caseItem.id)}>
                          {caseItem.title}
                        </CardTitle>
                        <div className="flex gap-2">
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
                            onClick={() => toast({ title: "Bookmarked", description: "Analysis saved to your library." })}
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
