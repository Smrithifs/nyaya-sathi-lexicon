
export async function askPuter(prompt: string, model: string = "gpt-4o"): Promise<string> {
  if (!window.puter) {
    throw new Error("Puter.js is not loaded. Please ensure the script is included in your HTML.");
  }
  
  try {
    const response = await window.puter.ai.chat(prompt, { model });
    
    // Extract the actual message content from the response object
    if (typeof response === 'string') {
      return response;
    } else if (response && typeof response === 'object') {
      // Try to extract message content from object response
      if ('message' in response && typeof response.message === 'string') {
        return response.message;
      } else if ('toString' in response && typeof response.toString === 'function') {
        return response.toString();
      } else {
        console.error('Unexpected response format from Puter.js:', response);
        return String(response);
      }
    } else {
      console.error('Unexpected response format from Puter.js:', response);
      return String(response);
    }
  } catch (error) {
    console.error('Puter AI error:', error);
    throw new Error("Failed to get AI response. Please try again.");
  }
}
