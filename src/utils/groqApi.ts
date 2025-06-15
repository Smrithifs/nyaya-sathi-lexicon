
/**
 * Utility for calling Groq LLM completions API for text completion.
 * Returns just the content string from the response.
 */
export async function groqCompletion({
  apiKey,
  prompt,
  systemInstruction,
  language = "English",
  model = "llama3-70b-8192"
}: {
  apiKey: string,
  prompt: string,
  systemInstruction?: string,
  language?: string,
  model?: string
}) {
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
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

  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    let errMsg = "Groq API error";
    try {
      const errorData = await res.json();
      if (errorData?.error?.message) {
        errMsg = `Groq API error: ${errorData.error.message}`;
      }
    } catch {}
    throw new Error(errMsg);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content as string;
  if (!text) throw new Error("Groq produced no output");
  return text;
}
