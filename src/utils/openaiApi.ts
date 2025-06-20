// /src/utils/openaiApi.ts
export async function askPuter(prompt: string, model: string = "gpt-4o"): Promise<string> {
  if (!window.puter) throw new Error("Puter.js is not loaded");
  const response = await window.puter.ai.chat(prompt, { model });
  return response;
}
