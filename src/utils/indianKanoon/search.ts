
import { callIndianKanoonProxy } from './config'
import { SearchFilters, SearchRequestBody } from './types'

export const searchIndianKanoon = async (query: string, filters: SearchFilters = {}) => {
  // Build the request body according to Indian Kanoon API specs
  const requestBody: SearchRequestBody = {
    formInput: query.trim()
  }
  
  // Add filters if provided
  if (filters.jurisdiction && filters.jurisdiction !== "All High Courts") {
    requestBody.doctypes = filters.jurisdiction.toLowerCase().replace(' ', '')
  }
  
  if (filters.yearFrom || filters.yearTo) {
    if (filters.yearFrom) requestBody.fromdate = `${filters.yearFrom}-01-01`
    if (filters.yearTo) requestBody.todate = `${filters.yearTo}-12-31`
  }
  
  if (filters.judge) {
    requestBody.author = filters.judge
  }
  
  if (filters.benchType && filters.benchType !== "All Benches") {
    requestBody.bench = filters.benchType.toLowerCase()
  }
  
  console.log('Indian Kanoon search via Supabase proxy:', {
    query,
    filters,
    requestBody
  })
  
  try {
    // Use the Supabase proxy instead of direct API calls
    const data = await callIndianKanoonProxy('search', { requestBody })
    
    console.log('Indian Kanoon search success via proxy:', {
      resultCount: Array.isArray(data) ? data.length : 'not array',
      hasResults: data && Array.isArray(data) && data.length > 0,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : [],
      firstResultPreview: Array.isArray(data) && data.length > 0 ? {
        title: data[0].title,
        tid: data[0].tid,
        court: data[0].court,
        date: data[0].date
      } : null
    })
    
    return data
  } catch (error) {
    console.error('Indian Kanoon search failed via proxy:', {
      error: error.message,
      stack: error.stack,
      query,
      filters,
      requestBody
    })
    throw error
  }
}
