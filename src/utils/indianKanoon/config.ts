
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
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
