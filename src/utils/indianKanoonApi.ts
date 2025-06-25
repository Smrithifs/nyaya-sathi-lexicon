
const BACKEND_BASE_URL = 'http://localhost:8000';

interface SearchParams {
  formInput: string;
  doctypes?: string;
  fromdate?: string;
  todate?: string;
  title?: string;
  cite?: string;
  author?: string;
  bench?: string;
  pagenum?: number;
  maxcites?: number;
}

interface SearchResult {
  tid: string;
  title: string;
  headline: string;
  docsource: string;
  docsize: number;
}

interface SearchResponse {
  docs: SearchResult[];
  found: number;
  encodedformInput: string;
  categories: any[];
}

interface DocumentResponse {
  doc: string;
  title: string;
  tid: string;
  citeList?: any[];
  citedbyList?: any[];
}

interface DocumentMetaResponse {
  title: string;
  author: string;
  bench: string;
  court: string;
  date: string;
  citation: string;
}

// Helper function to make requests with better error handling
const makeBackendRequest = async (endpoint: string, body: any) => {
  try {
    console.log(`Making request to backend: ${BACKEND_BASE_URL}${endpoint}`);
    console.log('Request body:', body);

    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Backend API error (${response.status}): ${errorData.error || errorData.details || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Response data received:', data);
    return data;
  } catch (error) {
    console.error('Backend request failed:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000');
    }
    throw error;
  }
};

export const searchCases = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    if (!params.formInput || params.formInput.trim() === '') {
      throw new Error('Search query is required');
    }

    const requestBody = {
      query: params.formInput.trim(),
      filters: {
        doctypes: params.doctypes,
        fromdate: params.fromdate,
        todate: params.todate,
        title: params.title,
        cite: params.cite,
        author: params.author,
        bench: params.bench,
        pagenum: params.pagenum || 0,
        maxcites: params.maxcites
      }
    };

    return await makeBackendRequest('/api/indian-kanoon/search', requestBody);
  } catch (error) {
    console.error('Error searching Indian Kanoon via backend:', error);
    throw error;
  }
};

export const getDocument = async (docId: string, maxcites = 10, maxcitedby = 10): Promise<DocumentResponse> => {
  try {
    if (!docId || docId.trim() === '') {
      throw new Error('Document ID is required');
    }

    return await makeBackendRequest(`/api/indian-kanoon/doc/${docId}`, {
      maxcites,
      maxcitedby
    });
  } catch (error) {
    console.error('Error fetching document via backend:', error);
    throw error;
  }
};

export const getDocumentMeta = async (docId: string): Promise<DocumentMetaResponse> => {
  try {
    if (!docId || docId.trim() === '') {
      throw new Error('Document ID is required');
    }

    return await makeBackendRequest(`/api/indian-kanoon/docmeta/${docId}`, {});
  } catch (error) {
    console.error('Error fetching document meta via backend:', error);
    throw error;
  }
};

export const getOriginalDocument = async (docId: string): Promise<string> => {
  try {
    if (!docId || docId.trim() === '') {
      throw new Error('Document ID is required');
    }

    const data = await makeBackendRequest(`/api/indian-kanoon/origdoc/${docId}`, {});
    return data.doc || data;
  } catch (error) {
    console.error('Error fetching original document via backend:', error);
    throw error;
  }
};

// Helper function to map our search filters to Indian Kanoon parameters
export const mapSearchFilters = (filters: any): SearchParams => {
  const params: SearchParams = {
    formInput: filters.keyword || '',
    pagenum: 0
  };

  // Map jurisdiction to doctypes
  if (filters.jurisdiction) {
    const jurisdictionMap: { [key: string]: string } = {
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
    
    if (jurisdictionMap[filters.jurisdiction]) {
      params.doctypes = jurisdictionMap[filters.jurisdiction];
    }
  }

  // Map date filters
  if (filters.yearFrom) {
    params.fromdate = `1-1-${filters.yearFrom}`;
  }
  if (filters.yearTo) {
    params.todate = `31-12-${filters.yearTo}`;
  }

  // Map judge filter
  if (filters.judge) {
    params.bench = filters.judge;
  }

  // Map citation filter
  if (filters.citation) {
    params.cite = filters.citation;
  }

  // Map provision to search query
  if (filters.provision) {
    params.formInput = params.formInput ? 
      `${params.formInput} ANDD ${filters.provision}` : 
      filters.provision;
  }

  return params;
};
