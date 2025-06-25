import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, ChevronDown, ChevronUp, RefreshCw, FileText, Calendar, User, Building, Scale } from "lucide-react";

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
  const [caseDetails, setCaseDetails] = useState({});
  const [caseSummaries, setCaseSummaries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastSearchQuery, setLastSearchQuery] = useState("");

  const mapFiltersToBackend = () => {
    const filters = {};
    
    // Map year filters to date format
    if (yearFrom) filters.fromdate = `1-1-${yearFrom}`;
    if (yearTo) filters.todate = `31-12-${yearTo}`;
    
    // Map other filters
    if (judge) filters.bench = judge;
    if (citation) filters.cite = citation;
    
    // Map jurisdiction to doctypes
    const jurisdictionMap = {
      'Supreme Court': 'supremecourt',
      'Delhi High Court': 'delhi',
      'Bombay High Court': 'bombay',
      'Calcutta High Court': 'kolkata',
      'Madras High Court': 'chennai',
      'Allahabad High Court': 'allahabad',
      'Andhra Pradesh High Court': 'andhra',
      'Gujarat High Court': 'gujarat',
      'Karnataka High Court': 'karnataka',
      'Kerala High Court': 'kerala',
      'Madhya Pradesh High Court': 'madhyapradesh',
      'Orissa High Court': 'orissa',
      'Patna High Court': 'patna',
      'Punjab & Haryana High Court': 'punjab',
      'Rajasthan High Court': 'rajasthan',
      'All High Courts': 'highcourts'
    };
    
    if (jurisdiction && jurisdictionMap[jurisdiction]) {
      filters.doctypes = jurisdictionMap[jurisdiction];
    }
    
    return filters;
  };

  const handleSearch = async (isRefresh = false) => {
    if (!caseKeyword.trim() && !citation.trim() && !provision.trim()) {
      toast({
        title: "Missing Search Criteria",
        description: "Please enter at least a case keyword, citation, or legal provision.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting case law search...');

      // Build search query
      let searchQuery = caseKeyword;
      if (caseType) searchQuery += ` ${caseType}`;
      if (provision) searchQuery += ` ${provision}`;

      const filters = mapFiltersToBackend();
      
      const endpoint = isRefresh ? '/api/case-search/next' : '/api/case-search';
      const requestBody = isRefresh ? 
        { query: lastSearchQuery, filters, currentPage } :
        { query: searchQuery, filters };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Search failed');
      }

      const data = await response.json();
      
      setSearchResults(data.docs || []);
      setCurrentPage(data.currentPage || (isRefresh ? currentPage + 1 : 0));
      setLastSearchQuery(searchQuery);
      setCaseDetails({});
      setCaseSummaries({});

      toast({
        title: "Search Complete",
        description: `Found ${data.docs?.length || 0} cases. Click on any case to view AI-powered summary.`
      });

    } catch (error) {
      console.error('Error searching cases:', error);
      toast({
        title: "Search Error", 
        description: error.message || "Failed to search cases. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCaseSummary = async (docId) => {
    if (caseSummaries[docId]) return; // Already loaded

    setIsLoadingSummary(prev => ({ ...prev, [docId]: true }));
    
    try {
      console.log('Generating AI summary for case:', docId);

      const response = await fetch(`http://localhost:8000/api/case-summary/${docId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to generate summary');
      }

      const data = await response.json();
      
      setCaseSummaries(prev => ({
        ...prev,
        [docId]: data.summary
      }));

      toast({
        title: "Summary Generated",
        description: "AI-powered case summary is ready!"
      });

    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Summary Error",
        description: error.message || "Failed to generate case summary.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSummary(prev => ({ ...prev, [docId]: false }));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-blue-900">Indian Case Law Finder</h1>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Main Search Card */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Search className="w-6 h-6" />
              Find Indian Case Law
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

            <div className="flex gap-4">
              <Button 
                onClick={() => handleSearch(false)} 
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching Cases...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Cases
                  </>
                )}
              </Button>

              {searchResults.length > 0 && (
                <Button 
                  onClick={() => handleSearch(true)} 
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Next 5 Cases
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">Search Results</h2>
            {searchResults.map((result, index) => (
              <Card key={result.tid} className="border border-gray-200">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-lg font-semibold text-blue-900">
                          {result.title || `Case ${index + 1}`}
                        </span>
                      </div>
                      {result.headline && (
                        <p className="text-sm text-gray-600 mb-2">{result.headline}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {result.docsource || 'Court'}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {result.docsize ? `${Math.round(result.docsize / 1024)} KB` : 'Document'}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleGetCaseSummary(result.tid)}
                      disabled={isLoadingSummary[result.tid]}
                      className="ml-4"
                    >
                      {isLoadingSummary[result.tid] ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : caseSummaries[result.tid] ? (
                        <>
                          <Scale className="w-4 h-4 mr-2" />
                          View Summary
                        </>
                      ) : (
                        <>
                          <Scale className="w-4 h-4 mr-2" />
                          Get AI Summary
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                
                {caseSummaries[result.tid] && (
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-blue-50 p-4 rounded-lg">
                        {caseSummaries[result.tid]}
                      </pre>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseLawFinder;
