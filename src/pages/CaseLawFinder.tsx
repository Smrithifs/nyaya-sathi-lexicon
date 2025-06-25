
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
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

const caseTypes = [
  "Civil Appeal",
  "Criminal Appeal", 
  "Writ Petition",
  "Special Leave Petition",
  "Review Petition",
  "Contempt Petition",
  "Bail Application",
  "Habeas Corpus",
  "Mandamus",
  "Certiorari",
  "Prohibition",
  "Quo Warranto",
  "Public Interest Litigation",
  "Transfer Petition",
  "Interlocutory Application",
  "Miscellaneous Petition",
  "Company Petition",
  "Arbitration Petition",
  "Election Petition",
  "Matrimonial Cases",
  "Land Acquisition Cases",
  "Service Matter",
  "Constitutional Petition",
  "Tax Appeal",
  "Commercial Dispute",
  "Consumer Complaint",
  "Trademark Opposition",
  "Patent Dispute",
  "Copyright Infringement",
  "Environmental Petition",
];

const CaseLawFinder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  
  // Form states
  const [caseKeyword, setCaseKeyword] = useState("");
  const [citation, setCitation] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [judge, setJudge] = useState("");
  const [provision, setProvision] = useState("");
  const [caseType, setCaseType] = useState("");
  
  // UI states
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
      console.log('Starting case law search with AI analysis...');

      // Build search query from form inputs
      let searchQuery = caseKeyword;
      if (caseType) searchQuery += ` ${caseType}`;
      if (jurisdiction) searchQuery += ` ${jurisdiction}`;
      if (provision) searchQuery += ` ${provision}`;
      if (judge) searchQuery += ` ${judge}`;
      if (citation) searchQuery += ` ${citation}`;

      // Use Gemini to provide legal research assistance
      const researchPrompt = `As a legal research assistant, provide comprehensive guidance for finding Indian case law based on these search criteria:

**Search Query:** ${searchQuery}
**Case Type:** ${caseType || 'Not specified'}
**Jurisdiction:** ${jurisdiction || 'Not specified'}
**Legal Provision:** ${provision || 'Not specified'}
**Judge:** ${judge || 'Not specified'}
**Citation:** ${citation || 'Not specified'}
**Year Range:** ${yearFrom ? `${yearFrom} to ${yearTo || 'present'}` : 'Not specified'}

Please provide:

1. **SEARCH STRATEGY**: Detailed guidance on how to effectively search for these cases
2. **RECOMMENDED DATABASES**: List of legal databases and resources to search
3. **SEARCH TERMS**: Specific keywords and search terms to use
4. **CITATION FORMATS**: Expected citation formats for the specified jurisdiction
5. **LEGAL CONTEXT**: Brief explanation of the legal area and relevant precedents
6. **RESEARCH TIPS**: Professional tips for finding relevant case law

Format your response as a comprehensive legal research guide.`;

      const analysis = await callGeminiAPI(researchPrompt, geminiKey);

      const mockResult = {
        id: 'research-guide',
        title: `Legal Research Guide: ${searchQuery}`,
        content: analysis,
        searchCriteria: {
          keyword: caseKeyword,
          caseType,
          jurisdiction,
          provision,
          judge,
          citation,
          yearRange: yearFrom ? `${yearFrom}-${yearTo || 'present'}` : 'All years'
        }
      };

      setSearchResults([mockResult]);
      toast({
        title: "Research Guide Generated",
        description: "AI-powered legal research guidance has been created for your search criteria."
      });

    } catch (error) {
      console.error('Error generating research guide:', error);
      toast({
        title: "Search Error",
        description: "Failed to generate research guide. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-blue-900">Case Law Research Assistant</h1>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Main Search Card */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Search className="w-6 h-6" />
              Legal Research Assistant
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
                    <label className="block text-sm font-medium mb-2">Case Type</label>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Case Type" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {caseTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      placeholder="e.g., Justice Khanna, Arijit Pasayat"
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
                  Generating Research Guide...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Generate Research Guide
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Research Guide Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Search className="w-6 h-6" />
                Legal Research Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {searchResults.map((result) => (
                <div key={result.id} className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Search Criteria</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Keyword:</strong> {result.searchCriteria.keyword || 'Not specified'}</div>
                      <div><strong>Case Type:</strong> {result.searchCriteria.caseType || 'Not specified'}</div>
                      <div><strong>Jurisdiction:</strong> {result.searchCriteria.jurisdiction || 'Not specified'}</div>
                      <div><strong>Provision:</strong> {result.searchCriteria.provision || 'Not specified'}</div>
                      <div><strong>Judge:</strong> {result.searchCriteria.judge || 'Not specified'}</div>
                      <div><strong>Citation:</strong> {result.searchCriteria.citation || 'Not specified'}</div>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {result.content}
                    </pre>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaseLawFinder;
