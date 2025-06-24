
// Get API key from environment with proper Vite support
export const getApiKey = () => {
  // Try multiple possible environment variable sources for Vite
  const apiKey = import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY || 
                 import.meta.env.NEXT_PUBLIC_KANOON_API_KEY ||
                 process.env.NEXT_PUBLIC_KANOON_API_KEY || 
                 '53c9ce4ce9cece18f8f866be2e47eab43f9eeccb'; // Fallback API key
  
  console.log('Indian Kanoon API Key check:', {
    fromViteNext: import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY ? 'found' : 'missing',
    fromViteDirect: import.meta.env.NEXT_PUBLIC_KANOON_API_KEY ? 'found' : 'missing',
    fromProcessEnv: process.env.NEXT_PUBLIC_KANOON_API_KEY ? 'found' : 'missing',
    usingFallback: !import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY && 
                   !import.meta.env.NEXT_PUBLIC_KANOON_API_KEY && 
                   !process.env.NEXT_PUBLIC_KANOON_API_KEY,
    keyLength: apiKey ? apiKey.length : 0,
    keyPreview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'none'
  });
  
  return apiKey;
};

export const getHeaders = () => {
  const apiKey = getApiKey();
  const headers = {
    'Authorization': `Token ${apiKey}`,
    'Content-Type': 'application/json'
  };
  
  console.log('Indian Kanoon headers:', {
    authHeader: `Token ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
    hasValidKey: apiKey && apiKey !== 'undefined' && apiKey.length > 10,
    contentType: headers['Content-Type']
  });
  
  return headers;
};
