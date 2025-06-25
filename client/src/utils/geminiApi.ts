
/**
 * Utility for Google Gemini API completion (text only).
 * Returns .candidates[0].content.parts[0].text
 */
export async function geminiTextCompletion({
  apiKey,
  prompt,
  systemInstruction
}: { apiKey: string, prompt: string, systemInstruction?: string }) {
  // Updated to use the correct Gemini model name
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const messages = [];
  
  if (systemInstruction) {
    messages.push({ role: "user", parts: [{ text: systemInstruction }] });
  }
  messages.push({ role: "user", parts: [{ text: prompt }] });

  const body = { contents: messages };
  
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    // Try to parse a more descriptive error and throw it
    let errMsg = "Gemini API error";
    try {
      const errorData = await res.json();
      if (errorData?.error?.message) {
        errMsg = `Gemini API error: ${errorData.error.message}`;
      }
    } catch {}
    throw new Error(errMsg);
  }
  
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini produced no output");
  return text;
}

// Add the callGeminiAPI function that QABot expects
export async function callGeminiAPI(prompt: string, apiKey: string) {
  return await geminiTextCompletion({ apiKey, prompt });
}
