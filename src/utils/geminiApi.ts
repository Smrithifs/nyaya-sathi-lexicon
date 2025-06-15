
/**
 * Utility for Google Gemini API completion (text only).
 * Returns .candidates[0].content.parts[0].text
 */
export async function geminiTextCompletion({
  apiKey,
  prompt,
  systemInstruction
}: { apiKey: string, prompt: string, systemInstruction?: string }) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
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
  if (!res.ok) throw new Error("Gemini API error");
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini produced no output");
  return text;
}
