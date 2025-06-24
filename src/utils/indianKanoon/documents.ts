
import { callIndianKanoonProxy } from './config'

export const getIndianKanoonDocument = async (tid: string) => {
  console.log('Indian Kanoon document request via proxy:', { tid })
  
  try {
    const data = await callIndianKanoonProxy('getDocument', { tid })
    
    console.log('Indian Kanoon document success:', {
      hasContent: !!data.content,
      title: data.title,
      contentLength: data.content ? data.content.length : 0,
      tid,
      dataKeys: Object.keys(data)
    })
    
    return data
  } catch (error) {
    console.error('Indian Kanoon document fetch failed:', {
      error: error.message,
      stack: error.stack,
      tid
    })
    throw error
  }
}

export const getFullJudgment = async (tid: string) => {
  console.log('Indian Kanoon full judgment request via proxy:', { tid })
  
  try {
    const data = await callIndianKanoonProxy('getFullJudgment', { tid })
    
    console.log('Indian Kanoon full judgment success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid,
      dataKeys: data ? Object.keys(data) : []
    })
    
    return data?.content || null
  } catch (error) {
    console.warn('Full judgment error:', {
      error: error.message,
      tid
    })
    return null
  }
}

export const getOriginalCourtCopy = async (tid: string) => {
  console.log('Indian Kanoon original court copy request via proxy:', { tid })
  
  try {
    const data = await callIndianKanoonProxy('getOriginalCourtCopy', { tid })
    
    console.log('Indian Kanoon original court copy success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid,
      dataKeys: data ? Object.keys(data) : []
    })
    
    return data?.content || null
  } catch (error) {
    console.warn('Original court copy error:', {
      error: error.message,
      tid
    })
    return null
  }
}

export const getDocumentFragment = async (tid: string, query: string) => {
  console.log('Indian Kanoon document fragment request via proxy:', { tid, query })
  
  try {
    const data = await callIndianKanoonProxy('getDocumentFragment', { tid, query })
    
    console.log('Indian Kanoon document fragment success:', {
      hasContent: !!data?.content,
      contentLength: data?.content ? data.content.length : 0,
      tid,
      query,
      dataKeys: data ? Object.keys(data) : []
    })
    
    return data?.content || null
  } catch (error) {
    console.warn('Document fragment error:', {
      error: error.message,
      tid,
      query
    })
    return null
  }
}
