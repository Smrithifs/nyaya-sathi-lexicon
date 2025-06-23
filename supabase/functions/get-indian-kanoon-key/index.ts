
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Returning hardcoded Indian Kanoon API key...');
    const indianKanoonApiKey = '7bab131b7fdd98e4d9e7c7c62c1aa7afaaccec40';
    
    console.log('Indian Kanoon API key found, returning to client');
    return new Response(
      JSON.stringify({ apiKey: indianKanoonApiKey }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in get-indian-kanoon-key function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get API key',
        message: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
