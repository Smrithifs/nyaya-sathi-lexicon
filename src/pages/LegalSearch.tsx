import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Search, RefreshCw } from 'lucide-react';
import brain from 'brain';
import { toast } from 'sonner';

interface CaseDetail {
  case_title: string;
  summary: string;
  ratio_decidendi: string;
  judgment_outcome: string;
  citation: string;
  court_name: string;
  case_year: string;
  doc_id: string;
  download_url: string;
}

interface SearchParams {
  case_type: string;
  section: string;
  from_year: string;
  to_year: string;
  case_name: string;
  court_type: string;
}

const LegalSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    case_type: '',
    section: '',
    from_year: '',
    to_year: '',
    case_name: '',
    court_type: ''
  });
  
  const [cases, setCases] = useState<CaseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [caseTypes, setCaseTypes] = useState<string[]>([]);
  const [courtTypes, setCourtTypes] = useState<string[]>([]);

  React.useEffect(() => {
    // Load dropdown options
    loadDropdownOptions();
  }, []);

  const loadDropdownOptions = async () => {
    try {
      const [caseTypesRes, courtTypesRes] = await Promise.all([
        brain.get_case_types(),
        brain.get_court_types()
      ]);
      
      const caseTypesData = await caseTypesRes.json();
      const courtTypesData = await courtTypesRes.json();
      
      setCaseTypes(caseTypesData);
      setCourtTypes(courtTypesData);
    } catch (error) {
      console.error('Failed to load dropdown options:', error);
    }
  };

  const handleSearch = async (newSearch = true) => {
    if (newSearch) {
      setCases([]);
      setOffset(0);
    }
    
    setLoading(true);
    
    try {
      const currentOffset = newSearch ? 0 : offset;
      
      const response = await brain.search_legal_cases({
        case_type: searchParams.case_type || null,
        section: searchParams.section || null,
        from_year: searchParams.from_year ? parseInt(searchParams.from_year) : null,
        to_year: searchParams.to_year ? parseInt(searchParams.to_year) : null,
        case_name: searchParams.case_name || null,
        court_type: searchParams.court_type || null,
        offset: currentOffset
      });
      
      const data = await response.json();
      
      if (newSearch) {
        setCases(data.cases);
      } else {
        setCases(prev => [...prev, ...data.cases]);
      }
      
      setOffset(currentOffset + 5);
      setHasMore(data.has_more);
      
      toast.success(`Found ${data.cases.length} cases`);
      
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNewCases = () => {
    handleSearch(false);
  };

  const updateSearchParam = (key: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LegalOps - Indian Legal Research</h1>
        <p className="text-gray-600">Search Indian legal cases with AI-powered analysis</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Multi-Field Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Case Type */}
            <div>
              <Label htmlFor="case-type">Case Type</Label>
              <Select value={searchParams.case_type} onValueChange={(value) => updateSearchParam('case_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section/Act */}
            <div>
              <Label htmlFor="section">Section/Act</Label>
              <Input
                id="section"
                placeholder="e.g. Section 302, Article 21"
                value={searchParams.section}
                onChange={(e) => updateSearchParam('section', e.target.value)}
              />
            </div>

            {/* From Year */}
            <div>
              <Label htmlFor="from-year">From Year</Label>
              <Input
                id="from-year"
                type="number"
                placeholder="2004"
                value={searchParams.from_year}
                onChange={(e) => updateSearchParam('from_year', e.target.value)}
              />
            </div>

            {/* To Year */}
            <div>
              <Label htmlFor="to-year">To Year</Label>
              <Input
                id="to-year"
                type="number"
                placeholder="2024"
                value={searchParams.to_year}
                onChange={(e) => updateSearchParam('to_year', e.target.value)}
              />
            </div>

            {/* Case Name */}
            <div>
              <Label htmlFor="case-name">Case Name (Optional)</Label>
              <Input
                id="case-name"
                placeholder="e.g. State v. Accused"
                value={searchParams.case_name}
                onChange={(e) => updateSearchParam('case_name', e.target.value)}
              />
            </div>

            {/* Court Type */}
            <div>
              <Label htmlFor="court-type">Court Type</Label>
              <Select value={searchParams.court_type} onValueChange={(value) => updateSearchParam('court_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent>
                  {courtTypes.map(court => (
                    <SelectItem key={court} value={court}>{court}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => handleSearch(true)} disabled={loading} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {loading ? 'Searching...' : 'Search Cases'}
            </Button>
            
            {cases.length > 0 && hasMore && (
              <Button variant="outline" onClick={getNewCases} disabled={loading} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Get New Cases
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {cases.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Search Results ({cases.length} cases)</h2>
          
          {cases.map((case_item, index) => (
            <Card key={`${case_item.doc_id}-${index}`} className="">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{case_item.case_title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{case_item.court_name}</Badge>
                    <Badge variant="outline">{case_item.case_year}</Badge>
                  </div>
                </div>
                {case_item.citation && (
                  <p className="text-sm text-gray-600 font-mono">{case_item.citation}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">Summary</h4>
                    <p className="text-gray-800">{case_item.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">Ratio Decidendi</h4>
                    <p className="text-gray-800">{case_item.ratio_decidendi}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">Judgment Outcome</h4>
                    <p className="text-gray-800">{case_item.judgment_outcome}</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={case_item.download_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Full Document
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
console.log("LegalSearch page loaded");


export default LegalSearch;
