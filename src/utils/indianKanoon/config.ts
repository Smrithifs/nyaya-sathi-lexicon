
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxecwllzdsjqemgsylqa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZWN3bGx6ZHNqcWVtZ3N5bHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDAwNDQsImV4cCI6MjA2NTU3NjA0NH0.ruLzev0_Yn6xbMdXy6q05FfZt6Gu4cSiM16GHnFOanE'
)

export const callIndianKanoonProxy = async (action: string, params: any = {}) => {
  const { data, error } = await supabase.functions.invoke('indian-kanoon-proxy', {
    body: { action, ...params }
  })

  if (error) {
    console.error('Supabase function error:', error)
    throw new Error(`Proxy error: ${error.message}`)
  }

  if (data?.error) {
    console.error('Indian Kanoon API error:', data.error)
    throw new Error(data.error)
  }

  return data
}

// Legacy function for backward compatibility
export const getApiKey = () => {
  console.log('Using Supabase proxy for Indian Kanoon API')
  return 'proxy-mode'
}

export const getHeaders = () => {
  console.log('Using Supabase proxy - headers not needed')
  return {}
}
