// Get API key from environment with proper Vite support
const getApiKey = () => {
  const apiKey =
    import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY ||
    import.meta.env.NEXT_PUBLIC_KANOON_API_KEY ||
    process.env.NEXT_PUBLIC_KANOON_API_KEY ||
    '7bab131b7fdd98e4d9e7c762c1aa7afaacce40'; // fallback

  console.log('Indian Kanoon API Key check:', {
    fromViteNext: !!import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY,
    fromViteDirect: !!import.meta.env.NEXT_PUBLIC_KANOON_API_KEY,
    fromProcessEnv: !!process.env.NEXT_PUBLIC_KANOON_API_KEY,
    usingFallback:
      !import.meta.env.VITE_NEXT_PUBLIC_KANOON_API_KEY &&
      !import.meta.env.NEXT_PUBLIC_KANOON_API_KEY &&
      !process.env.NEXT_PUBLIC_KANOON_API_KEY,
    keyLength: apiKey.length,
    keyPreview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
  });

  return apiKey;
};

// Main Indian Kanoon API – delegates to modular implementation
export {
  getApiKey,
  searchIndianKanoon,
  getIndianKanoonDocument,
  getFullJudgment,
  getOriginalCourtCopy,
  getDocumentFragment
} from './indianKanoon';
