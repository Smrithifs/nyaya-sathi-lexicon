
import { getHeaders } from './config';
import { SearchFilters, SearchRequestBody } from './types';

export const searchIndianKanoon = async (query: string, filters: SearchFilters = {}) => {
  const headers = getHeaders();
  const url = 'https://api.indiankanoon.org/search/';
  
  // Build the request body according to Indian Kanoon API specs
  const requestBody: SearchRequestBody = {
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
