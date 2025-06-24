
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const INDIAN_KANOON_API_KEY = Deno.env.get('INDIAN_KANOON_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
    console.log('Indian Kanoon proxy request:', { action, params })
    
    if (!INDIAN_KANOON_API_KEY) {
      throw new Error('Indian Kanoon API key not configured')
    }

    const headers = {
      'Authorization': `Token ${INDIAN_KANOON_API_KEY}`,
      'Content-Type': 'application/json'
    }

    let response
    let url

    switch (action) {
      case 'search':
        url = 'https://api.indiankanoon.org/search/'
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(params.requestBody)
        })
        break

      case 'getDocument':
        url = `https://api.indiankanoon.org/doc/${params.tid}/`
        response = await fetch(url, {
          method: 'GET',
          headers
        })
        break

      case 'getFullJudgment':
        url = `https://api.indiankanoon.org/doc/${params.tid}/`
        response = await fetch(url, {
          method: 'GET',
          headers
        })
        break

      case 'getOriginalCourtCopy':
        url = `https://api.indiankanoon.org/origdoc/${params.tid}/`
        response = await fetch(url, {
          method: 'GET',
          headers
        })
        break

      case 'getDocumentFragment':
        url = `https://api.indiankanoon.org/docfragment/${params.tid}/?query=${encodeURIComponent(params.query)}`
        response = await fetch(url, {
          method: 'GET',
          headers
        })
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    console.log('Indian Kanoon API response:', {
      status: response.status,
      ok: response.ok,
      action,
      url
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Indian Kanoon API error:', {
        status: response.status,
        error: errorText,
        action,
        url
      })
      throw new Error(`Indian Kanoon API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Indian Kanoon proxy error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to proxy Indian Kanoon API request'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
