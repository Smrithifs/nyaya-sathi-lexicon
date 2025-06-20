
export async function askPuter(prompt: string, model: string = "gpt-4o"): Promise<string> {
  if (!window.puter) {
    throw new Error("Puter.js is not loaded. Please ensure the script is included in your HTML.");
  }
  
  try {
    const response = await window.puter.ai.chat(prompt, { model });
    return response;
  } catch (error) {
    console.error('Puter AI error:', error);
    throw new Error("Failed to get AI response. Please try again.");
  }
}
