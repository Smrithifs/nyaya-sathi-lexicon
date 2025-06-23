
// Get API key from environment with proper Vite support
const getApiKey = () => {
  // Try multiple possible environment variable sources for Vite
  const apiKey = import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY || 
                 import.meta.env.NEXT_PUBLIC_KANOON_API_KEY ||
                 process.env.NEXT_PUBLIC_KANOON_API_KEY || 
                 '7bab131b7fdd98e4d9e7c7c62c1aa7afaaccec40'; // Fallback from .env
  
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
    hasValidKey: apiKey && apiKey !== 'undefined' && apiKey.length > 10
  });
  
  return headers;
};

export const searchIndianKanoon = async (query: string) => {
  const headers = getHeaders();
  const url = `https://api.indiankanoon.org/search?formInput=${encodeURIComponent(query)}`;
  
  console.log('Indian Kanoon search request:', {
    url,
    query,
    authPreview: headers.Authorization.substring(0, 15) + '...'
  });
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    
    console.log('Indian Kanoon search response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Indian Kanoon API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`Indian Kanoon API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Indian Kanoon search success:', {
      resultCount: Array.isArray(data) ? data.length : 'not array',
      hasResults: data && data.length > 0,
      dataType: typeof data,
      firstResultPreview: Array.isArray(data) && data.length > 0 ? {
        title: data[0].title,
        tid: data[0].tid
      } : null
    });
    
    return data;
  } catch (error) {
    console.error('Indian Kanoon search failed:', {
      error: error.message,
      stack: error.stack,
      url,
      query
    });
    throw error;
  }
};

export const getIndianKanoonDocument = async (tid: string) => {
  const headers = getHeaders();
  const url = `https://api.indiankanoon.org/doc/${tid}`;
  
  console.log('Indian Kanoon document request:', { 
    url, 
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
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Indian Kanoon document error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        tid
      });
      throw new Error(`Failed to fetch document: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Indian Kanoon document success:', {
      hasContent: !!data.content,
      title: data.title,
      contentLength: data.content ? data.content.length : 0,
      tid
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
  const url = `https://api.indiankanoon.org/doc/${tid}`;
  
  console.log('Indian Kanoon full judgment request:', { 
    url, 
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
      tid
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Full judgment fetch failed:', {
        status: response.status,
        errorBody: errorText,
        tid
      });
      return null;
    }
    
    const data = await response.json();
    console.log('Indian Kanoon full judgment success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid
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
  const url = `https://api.indiankanoon.org/origdoc/${tid}`;
  
  console.log('Indian Kanoon original court copy request:', { 
    url, 
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
      tid
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Original court copy fetch failed:', {
        status: response.status,
        errorBody: errorText,
        tid
      });
      return null;
    }
    
    const data = await response.json();
    console.log('Indian Kanoon original court copy success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid
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
  const url = `https://api.indiankanoon.org/docfragment/${tid}?formInput=${encodeURIComponent(query)}`;
  
  console.log('Indian Kanoon document fragment request:', { 
    url, 
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
      query
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Document fragment fetch failed:', {
        status: response.status,
        errorBody: errorText,
        tid,
        query
      });
      return null;
    }
    
    const data = await response.json();
    console.log('Indian Kanoon document fragment success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid,
      query
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
