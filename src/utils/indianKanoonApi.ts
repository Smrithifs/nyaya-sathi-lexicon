
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

export const searchCases = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/indian-kanoon/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.formInput,
        filters: {
          doctypes: params.doctypes,
          fromdate: params.fromdate,
          todate: params.todate,
          title: params.title,
          cite: params.cite,
          author: params.author,
          bench: params.bench,
          pagenum: params.pagenum,
          maxcites: params.maxcites
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching Indian Kanoon via backend:', error);
    throw error;
  }
};

export const getDocument = async (docId: string, maxcites = 10, maxcitedby = 10): Promise<DocumentResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/indian-kanoon/doc/${docId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxcites,
        maxcitedby
      })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching document via backend:', error);
    throw error;
  }
};

export const getDocumentMeta = async (docId: string): Promise<DocumentMetaResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/indian-kanoon/docmeta/${docId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching document meta via backend:', error);
    throw error;
  }
};

export const getOriginalDocument = async (docId: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/indian-kanoon/origdoc/${docId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
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
