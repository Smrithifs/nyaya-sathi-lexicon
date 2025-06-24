
// Get API key from environment with proper Vite support
const getApiKey = () => {
  // Try multiple possible environment variable sources for Vite
  const apiKey = import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY || 
                 import.meta.env.NEXT_PUBLIC_KANOON_API_KEY ||
                 process.env.NEXT_PUBLIC_KANOON_API_KEY || 
                 '53c9ce4ce9cece18f8f866be2e47eab43f9eeccb'; // Fallback API key
  
  console.log('Indian Kanoon API Key check:', {
    fromViteNext: import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY ? 'found' : 'missing',
    fromViteDirect: import.meta.env.NEXT_PUBLIC_KANOON_API_KEY ? 'found' : 'missing',
    fromProcessEnv: process.env.NEXT_PUBLIC_KANOON_API_KEY ? 'found' : 'missing',
    usingFallback: !import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY && 
                   !import.meta.env.NEXT_PUBLIC_KANOON_API_KEY && 
                   !process.env.NEXT_PUBLIC_KANOON_API_KEY,
    keyLength: apiKey ? apiKey.length : 0,
    keyPreview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'none'
  });
  
  return apiKey;
};

const getHeaders = () => {
  const apiKey = getApiKey();
  const headers = {
    'Authorization': `Token ${apiKey}`,
    'Content-Type': 'application/json'
  };
  
  console.log('Indian Kanoon headers:', {
    authHeader: `Token ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
    hasValidKey: apiKey && apiKey !== 'undefined' && apiKey.length > 10,
    contentType: headers['Content-Type']
  });
  
  return headers;
};

// Define proper types for filters
interface SearchFilters {
  jurisdiction?: string;
  yearFrom?: string;
  yearTo?: string;
  judge?: string;
  benchType?: string;
  [key: string]: any;
}

export const searchIndianKanoon = async (query: string, filters: SearchFilters = {}) => {
  const headers = getHeaders();
  const url = 'https://api.indiankanoon.org/search/';
  
  // Build the request body according to Indian Kanoon API specs
  const requestBody: any = {
    formInput: query.trim()
  };
  
  // Add filters if provided
  if (filters.jurisdiction && filters.jurisdiction !== "All High Courts") {
    requestBody.doctypes = filters.jurisdiction.toLowerCase().replace(' ', '');
  }
  
  if (filters.yearFrom || filters.yearTo) {
    if (filters.yearFrom) requestBody.fromdate = `${filters.yearFrom}-01-01`;
    if (filters.yearTo) requestBody.todate = `${filters.yearTo}-12-31`;
  }
  
  if (filters.judge) {
    requestBody.author = filters.judge;
  }
  
  if (filters.benchType && filters.benchType !== "All Benches") {
    requestBody.bench = filters.benchType.toLowerCase();
  }
  
  console.log('Indian Kanoon search request:', {
    url,
    method: 'POST',
    query,
    filters,
    requestBody,
    authPreview: headers.Authorization.substring(0, 15) + '...',
    contentType: headers['Content-Type']
  });
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });
    
    console.log('Indian Kanoon search response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Indian Kanoon API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        requestBody,
        url
      });
      throw new Error(`Indian Kanoon API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Indian Kanoon search success:', {
      resultCount: Array.isArray(data) ? data.length : 'not array',
      hasResults: data && data.length > 0,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : [],
      firstResultPreview: Array.isArray(data) && data.length > 0 ? {
        title: data[0].title,
        tid: data[0].tid,
        court: data[0].court,
        date: data[0].date
      } : null
    });
    
    return data;
  } catch (error) {
    console.error('Indian Kanoon search failed:', {
      error: error.message,
      stack: error.stack,
      url,
      query,
      filters,
      requestBody
    });
    throw error;
  }
};

export const getIndianKanoonDocument = async (tid: string) => {
  const headers = getHeaders();
  const url = `https://api.indiankanoon.org/doc/${tid}/`;
  
  console.log('Indian Kanoon document request:', { 
    url, 
    method: 'GET',
    tid,
    authPreview: headers.Authorization.substring(0, 15) + '...'
  });
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    
    console.log('Indian Kanoon document response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      tid,
      url: response.url
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Indian Kanoon document error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        tid,
        url
      });
      throw new Error(`Failed to fetch document: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Indian Kanoon document success:', {
      hasContent: !!data.content,
      title: data.title,
      contentLength: data.content ? data.content.length : 0,
      tid,
      dataKeys: Object.keys(data)
    });
    
    return data;
  } catch (error) {
    console.error('Indian Kanoon document fetch failed:', {
      error: error.message,
      stack: error.stack,
      tid,
      url
    });
    throw error;
  }
};

export const getFullJudgment = async (tid: string) => {
  const headers = getHeaders();
  const url = `https://api.indiankanoon.org/doc/${tid}/`;
  
  console.log('Indian Kanoon full judgment request:', { 
    url, 
    method: 'GET',
    tid,
    authPreview: headers.Authorization.substring(0, 15) + '...'
  });
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    
    console.log('Indian Kanoon full judgment response:', {
      status: response.status,
      ok: response.ok,
      tid,
      url: response.url
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Full judgment fetch failed:', {
        status: response.status,
        errorBody: errorText,
        tid,
        url
      });
      return null;
    }
    
    const data = await response.json();
    console.log('Indian Kanoon full judgment success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid,
      dataKeys: data ? Object.keys(data) : []
    });
    
    return data?.content || null;
  } catch (error) {
    console.warn('Full judgment error:', {
      error: error.message,
      tid,
      url
    });
    return null;
  }
};

export const getOriginalCourtCopy = async (tid: string) => {
  const headers = getHeaders();
  const url = `https://api.indiankanoon.org/origdoc/${tid}/`;
  
  console.log('Indian Kanoon original court copy request:', { 
    url, 
    method: 'GET',
    tid,
    authPreview: headers.Authorization.substring(0, 15) + '...'
  });
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    
    console.log('Indian Kanoon original court copy response:', {
      status: response.status,
      ok: response.ok,
      tid,
      url: response.url
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Original court copy fetch failed:', {
        status: response.status,
        errorBody: errorText,
        tid,
        url
      });
      return null;
    }
    
    const data = await response.json();
    console.log('Indian Kanoon original court copy success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid,
      dataKeys: data ? Object.keys(data) : []
    });
    
    return data?.content || null;
  } catch (error) {
    console.warn('Original court copy error:', {
      error: error.message,
      tid,
      url
    });
    return null;
  }
};

export const getDocumentFragment = async (tid: string, query: string) => {
  const headers = getHeaders();
  const url = `https://api.indiankanoon.org/docfragment/${tid}/?query=${encodeURIComponent(query)}`;
  
  console.log('Indian Kanoon document fragment request:', { 
    url, 
    method: 'GET',
    tid,
    query,
    authPreview: headers.Authorization.substring(0, 15) + '...'
  });
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    
    console.log('Indian Kanoon document fragment response:', {
      status: response.status,
      ok: response.ok,
      tid,
      query,
      url: response.url
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Document fragment fetch failed:', {
        status: response.status,
        errorBody: errorText,
        tid,
        query,
        url
      });
      return null;
    }
    
    const data = await response.json();
    console.log('Indian Kanoon document fragment success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid,
      query,
      dataKeys: data ? Object.keys(data) : []
    });
    
    return data?.content || null;
  } catch (error) {
    console.warn('Document fragment error:', {
      error: error.message,
      tid,
      query,
      url
    });
    return null;
  }
};
