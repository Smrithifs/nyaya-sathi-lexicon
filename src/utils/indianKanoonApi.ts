
const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';
const API_KEY = '7bab131b7fdd98e4d9e7c7c62c1aa7afaaccec40'; // From .env file

const headers = {
  'Authorization': `Token ${API_KEY}`,
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
};

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

/**
 * Search Indian Kanoon for judgments by keyword or citation.
 */
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
      headers
    });

    if (!response.ok) {
      console.error(`Indian Kanoon API error: ${response.status} ${response.statusText}`);
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

/**
 * Get the full document content of a judgment by TID.
 */
export const getIndianKanoonDocument = async (docId: string): Promise<IndianKanoonDocument | null> => {
  try {
    console.log('Fetching Indian Kanoon document for docId:', docId);
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, {
      method: 'GET',
      headers
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

/**
 * Get the full judgment text (/doc) content only.
 */
export const getFullJudgment = async (docId: string): Promise<string | null> => {
  try {
    console.log('Fetching full judgment for docId:', docId);
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, {
      method: 'GET',
      headers
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

/**
 * Get the original scanned court copy (/origdoc) if available.
 */
export const getOriginalCourtCopy = async (docId: string): Promise<string | null> => {
  try {
    console.log('Fetching original court copy for docId:', docId);
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/origdoc/${docId}/`, {
      method: 'GET',
      headers
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

/**
 * Get document fragments (/docfragment) that match a specific search query.
 */
export const getDocumentFragment = async (docId: string, query: string): Promise<string | null> => {
  try {
    console.log('Fetching document fragment for docId:', docId, 'query:', query);
    
    const params = new URLSearchParams({
      formInput: query
    });
    
    const response = await fetch(`${INDIAN_KANOON_BASE_URL}/docfragment/${docId}/?${params.toString()}`, {
      method: 'GET',
      headers
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

// Additional utility functions for backwards compatibility

export const searchSectionInIndianKanoon = async (sectionNumber: string, actName: string): Promise<IndianKanoonSearchResult[]> => {
  try {
    const query = `Section ${sectionNumber} ${actName}`;
    return await searchIndianKanoon(query);
  } catch (error) {
    console.error('Section search error:', error);
    return [];
  }
};

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
