
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, systemInstruction, model = "llama3-70b-8192" } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ API key not configured');
    }

    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqApiKey}`
    };

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({
      role: "user",
      content: prompt
    });

    const body = {
      model,
      messages,
      temperature: 0.2
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      let errMsg = "Groq API error";
      try {
        const errorData = await response.json();
        if (errorData?.error?.message) {
          errMsg = `Groq API error: ${errorData.error.message}`;
        }
      } catch {}
      throw new Error(errMsg);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error("Groq produced no output");
    }

    return new Response(JSON.stringify({ result: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in groq-completion function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
