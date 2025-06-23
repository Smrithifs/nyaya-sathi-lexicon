
// Get API key from environment or fallback to .env value
const getApiKey = () => {
  // Try multiple possible environment variable names
  const apiKey = process.env.NEXT_PUBLIC_KANOON_API_KEY || 
                 import.meta.env.VITE_KANOON_API_KEY ||
                 '7bab131b7fdd98e4d9e7c7c62c1aa7afaaccec40'; // Fallback from .env
  
  console.log('Indian Kanoon API Key check:', {
    fromNextPublic: process.env.NEXT_PUBLIC_KANOON_API_KEY ? 'found' : 'missing',
    fromVite: import.meta.env.VITE_KANOON_API_KEY ? 'found' : 'missing',
    usingFallback: !process.env.NEXT_PUBLIC_KANOON_API_KEY && !import.meta.env.VITE_KANOON_API_KEY,
    keyLength: apiKey ? apiKey.length : 0
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
    authHeader: headers.Authorization,
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
    headers: headers.Authorization
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
      console.error('Indian Kanoon API error response:', errorText);
      throw new Error(`Indian Kanoon API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Indian Kanoon search success:', {
      resultCount: Array.isArray(data) ? data.length : 'not array',
      hasResults: data && data.length > 0
    });
    
    return data;
  } catch (error) {
    console.error('Indian Kanoon search failed:', error);
    throw error;
  }
};

export const getIndianKanoonDocument = async (tid: string) => {
  const headers = getHeaders();
  const url = `https://api.indiankanoon.org/doc/${tid}`;
  
  console.log('Indian Kanoon document request:', { url, tid });
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    
    console.log('Indian Kanoon document response:', {
      status: response.status,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Indian Kanoon document error:', errorText);
      throw new Error(`Failed to fetch document: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Indian Kanoon document success:', {
      hasContent: !!data.content,
      title: data.title
    });
    
    return data;
  } catch (error) {
    console.error('Indian Kanoon document fetch failed:', error);
    throw error;
  }
};

export const getFullJudgment = async (tid: string) => {
  try {
    const response = await fetch(`https://api.indiankanoon.org/doc/${tid}`, {
      method: "GET",
      headers: getHeaders()
    });
    
    if (!response.ok) {
      console.warn('Full judgment fetch failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data?.content || null;
  } catch (error) {
    console.warn('Full judgment error:', error);
    return null;
  }
};

export const getOriginalCourtCopy = async (tid: string) => {
  try {
    const response = await fetch(`https://api.indiankanoon.org/origdoc/${tid}`, {
      method: "GET",
      headers: getHeaders()
    });
    
    if (!response.ok) {
      console.warn('Original court copy fetch failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data?.content || null;
  } catch (error) {
    console.warn('Original court copy error:', error);
    return null;
  }
};

export const getDocumentFragment = async (tid: string, query: string) => {
  try {
    const response = await fetch(`https://api.indiankanoon.org/docfragment/${tid}?formInput=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: getHeaders()
    });
    
    if (!response.ok) {
      console.warn('Document fragment fetch failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data?.content || null;
  } catch (error) {
    console.warn('Document fragment error:', error);
    return null;
  }
};
