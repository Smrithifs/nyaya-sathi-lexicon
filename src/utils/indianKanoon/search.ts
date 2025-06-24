
import { callIndianKanoonProxy } from './config'
import { SearchFilters, SearchRequestBody } from './types'

export const searchIndianKanoon = async (query: string, filters: SearchFilters = {}) => {
  // Build the request body according to Indian Kanoon API specs
  const requestBody: SearchRequestBody = {
    formInput: query.trim()
  }
  
  // Add filters if provided - using correct Indian Kanoon field names
  if (filters.jurisdiction && filters.jurisdiction !== "All High Courts") {
    // Map jurisdiction to doctypes field
    const jurisdictionMap: { [key: string]: string } = {
      "Supreme Court": "supremecourt",
      "Allahabad High Court": "allahabad",
      "Andhra Pradesh High Court": "andhrapradesh", 
      "Bombay High Court": "bombay",
      "Calcutta High Court": "calcutta",
      "Delhi High Court": "delhi",
      "Gujarat High Court": "gujarat",
      "Karnataka High Court": "karnataka",
      "Kerala High Court": "kerala",
      "Madras High Court": "madras",
      "Madhya Pradesh High Court": "madhyapradesh",
      "Orissa High Court": "orissa",
      "Patna High Court": "patna",
      "Punjab & Haryana High Court": "punjabharyana",
      "Rajasthan High Court": "rajasthan"
    }
    
    if (jurisdictionMap[filters.jurisdiction]) {
      requestBody.doctypes = jurisdictionMap[filters.jurisdiction]
    }
  }
  
  // Add date filters if provided
  if (filters.yearFrom || filters.yearTo) {
    if (filters.yearFrom) requestBody.fromdate = `${filters.yearFrom}-01-01`
    if (filters.yearTo) requestBody.todate = `${filters.yearTo}-12-31`
  }
  
  // Add judge filter if provided
  if (filters.judge) {
    requestBody.author = filters.judge
  }
  
  // Add bench type filter if provided
  if (filters.benchType && filters.benchType !== "All Benches") {
    const benchMap: { [key: string]: string } = {
      "Division Bench": "division",
      "Constitution Bench": "constitution", 
      "Full Bench": "full",
      "Single Judge": "single"
    }
    
    if (benchMap[filters.benchType]) {
      requestBody.bench = benchMap[filters.benchType]
    }
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
