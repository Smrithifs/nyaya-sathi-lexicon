const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';

export interface IndianKanoonSearchResult {
  title: string;
  tid: string;
  url: string;
  snippet: string;
  citation?: string;
  court?: string;
  date?: string;
}

export interface IndianKanoonDocument {
  title: string;
  content: string;
  citation: string;
  court: string;
  date: string;
  judges: string[];
}

export const searchIndianKanoon = async (
  query: string, 
  filters?: {
    fromdate?: string; // DD-MM-YYYY format
    todate?: string;   // DD-MM-YYYY format  
    doctypes?: string; // supremecourt,highcourts,tribunal,etc
    author?: string;   // judge name
    bench?: string;    // bench type
  }
): Promise<IndianKanoonSearchResult[]> => {
  try {
    console.log('Starting Indian Kanoon search for query:', query, 'with filters:', filters);
    
    // Build query parameters
    const params = new URLSearchParams({
      formInput: query,
      pagenum: '0'
    });
    
    if (filters) {
      if (filters.fromdate) params.append('fromdate', filters.fromdate);
      if (filters.todate) params.append('todate', filters.todate);
      if (filters.doctypes) params.append('doctypes', filters.doctypes);
      if (filters.author) params.append('author', filters.author);
      if (filters.bench) params.append('bench', filters.bench);
    }

    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/search/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`Indian Kanoon API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Indian Kanoon search successful, found', data.docs?.length || 0, 'results');
    
    return (data.docs || []).map((doc: any) => ({
      title: doc.title || '',
      tid: doc.tid || '',
      url: doc.url || `https://indiankanoon.org/doc/${doc.tid}/`,
      snippet: doc.snippet || '',
      citation: doc.citation || '',
      court: doc.court || '',
      date: doc.date || ''
    }));
  } catch (error) {
    console.error('Indian Kanoon search error:', error);
    throw error;
  }
};

export const getIndianKanoonDocument = async (docId: string): Promise<IndianKanoonDocument | null> => {
  try {
    console.log('Fetching Indian Kanoon document for docId:', docId);
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
      }
    });

    if (!response.ok) {
      console.error('Indian Kanoon document API error:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      title: data.title || '',
      content: data.doc || '',
      citation: data.citation || '',
      court: data.court || '',
      date: data.date || '',
      judges: data.judges || []
    };
  } catch (error) {
    console.error('Indian Kanoon document fetch error:', error);
    return null;
  }
};

// Get full judgment document
export const getFullJudgment = async (docId: string): Promise<string | null> => {
  try {
    console.log('Fetching full judgment for docId:', docId);
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
      }
    });

    if (!response.ok) {
      console.error('Indian Kanoon full judgment API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.doc || null;
  } catch (error) {
    console.error('Full judgment fetch error:', error);
    return null;
  }
};

// Get original court copy
export const getOriginalCourtCopy = async (docId: string): Promise<string | null> => {
  try {
    console.log('Fetching original court copy for docId:', docId);
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/origdoc/${docId}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
      }
    });

    if (!response.ok) {
      console.error('Indian Kanoon original court copy API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.doc || data.url || null;
  } catch (error) {
    console.error('Original court copy fetch error:', error);
    return null;
  }
};

// Get document fragment based on query
export const getDocumentFragment = async (docId: string, query: string): Promise<string | null> => {
  try {
    console.log('Fetching document fragment for docId:', docId, 'query:', query);
    
    const params = new URLSearchParams({
      formInput: query
    });
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/docfragment/${docId}/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
      }
    });

    if (!response.ok) {
      console.error('Indian Kanoon document fragment API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.fragment || data.doc || null;
  } catch (error) {
    console.error('Document fragment fetch error:', error);
    return null;
  }
};

// Search for section-specific content
export const searchSectionInIndianKanoon = async (sectionNumber: string, actName: string): Promise<IndianKanoonSearchResult[]> => {
  try {
    const query = `Section ${sectionNumber} ${actName}`;
    return await searchIndianKanoon(query);
  } catch (error) {
    console.error('Section search error:', error);
    return [];
  }
};

// Legal Q&A - Search for section and get explanation
export const searchSectionExplanation = async (section: string): Promise<{
  legalOutput: string;
  simplifiedOutput: string;
} | null> => {
  try {
    // Search for the section
    const searchResults = await searchIndianKanoon(section);
    
    if (searchResults.length === 0) {
      return null;
    }

    // Get the top result's document
    const topResult = searchResults[0];
    const document = await getIndianKanoonDocument(topResult.tid);
    
    if (!document) {
      return null;
    }

    return {
      legalOutput: document.content,
      simplifiedOutput: '' // Will be filled by Gemini
    };
  } catch (error) {
    console.error('Section explanation search error:', error);
    return null;
  }
};

// Search cases related to a section
export const searchSectionCases = async (section: string): Promise<IndianKanoonSearchResult[]> => {
  try {
    const query = `Section ${section}`;
    return await searchIndianKanoon(query);
  } catch (error) {
    console.error('Section cases search error:', error);
    return [];
  }
};

// Citation checker
export const searchCitationInIndianKanoon = async (citation: string): Promise<{
  found: boolean;
  document?: IndianKanoonDocument;
  searchResults: IndianKanoonSearchResult[];
}> => {
  try {
    const cleanCitation = citation.trim();
    const searchResults = await searchIndianKanoon(cleanCitation);
    
    if (searchResults.length === 0) {
      return { found: false, searchResults: [] };
    }

    // Get the top matching document
    const topResult = searchResults[0];
    const document = await getIndianKanoonDocument(topResult.tid);
    
    return {
      found: true,
      document: document || undefined,
      searchResults
    };
  } catch (error) {
    console.error('Citation search error:', error);
    return { found: false, searchResults: [] };
  }
};

// Advanced case search with filters
export const advancedCaseSearch = async (params: {
  query?: string;
  fromYear?: string;
  toYear?: string;
  court?: string;
  judge?: string;
  bench?: string;
}): Promise<IndianKanoonSearchResult[]> => {
  try {
    const filters: any = {};
    
    // Convert years to DD-MM-YYYY format
    if (params.fromYear) {
      filters.fromdate = `01-01-${params.fromYear}`;
    }
    if (params.toYear) {
      filters.todate = `31-12-${params.toYear}`;
    }
    
    // Map court to doctypes
    if (params.court) {
      if (params.court.toLowerCase().includes('supreme')) {
        filters.doctypes = 'supremecourt';
      } else if (params.court.toLowerCase().includes('high')) {
        filters.doctypes = 'highcourts';
      }
    }
    
    if (params.judge) {
      filters.author = params.judge;
    }
    
    if (params.bench) {
      filters.bench = params.bench;
    }
    
    const query = params.query || '';
    return await searchIndianKanoon(query, filters);
  } catch (error) {
    console.error('Advanced case search error:', error);
    return [];
  }
};

// Bare Act search
export const searchBareAct = async (actName: string): Promise<{
  actContent: string;
  document?: IndianKanoonDocument;
} | null> => {
  try {
    const searchResults = await searchIndianKanoon(actName);
    
    if (searchResults.length === 0) {
      return null;
    }

    // Get the top result which should be the Act itself
    const topResult = searchResults[0];
    const document = await getIndianKanoonDocument(topResult.tid);
    
    if (!document) {
      return null;
    }

    return {
      actContent: document.content,
      document
    };
  } catch (error) {
    console.error('Bare Act search error:', error);
    return null;
  }
};
