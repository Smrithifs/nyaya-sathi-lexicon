
import { getHeaders } from './config';

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
