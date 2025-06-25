
const INDIAN_KANOON_BASE_URL = 'http://api.indiankanoon.org';
const API_TOKEN = '7061433e91576225eb89bbbeb11c9a350146a264';

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

const getHeaders = () => ({
  'Authorization': `Token ${API_TOKEN}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
});

export const searchCases = async (params: SearchParams): Promise<SearchResponse> => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${INDIAN_KANOON_BASE_URL}/search/?${searchParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Indian Kanoon API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching Indian Kanoon:', error);
    throw error;
  }
};

export const getDocument = async (docId: string, maxcites = 10, maxcitedby = 10): Promise<DocumentResponse> => {
  const url = `${INDIAN_KANOON_BASE_URL}/doc/${docId}/?maxcites=${maxcites}&maxcitedby=${maxcitedby}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Indian Kanoon API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching document from Indian Kanoon:', error);
    throw error;
  }
};

export const getDocumentMeta = async (docId: string): Promise<DocumentMetaResponse> => {
  const url = `${INDIAN_KANOON_BASE_URL}/docmeta/${docId}/`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Indian Kanoon API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching document meta from Indian Kanoon:', error);
    throw error;
  }
};

export const getOriginalDocument = async (docId: string): Promise<string> => {
  const url = `${INDIAN_KANOON_BASE_URL}/origdoc/${docId}/`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Indian Kanoon API error: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching original document from Indian Kanoon:', error);
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
