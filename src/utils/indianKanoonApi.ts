const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';
const KANOON_API_TOKEN = process.env.NEXT_PUBLIC_KANOON_API_KEY;

export interface IndianKanoonSearchResult {
  title: string;
  tid: string;
  url: string;
  snippet: string;
  citation?: string;
  court?: string;
  date?: string;
}

export interface IndianKanoonDocument {
  title: string;
  content: string;
  citation: string;
  court: string;
  date: string;
  judges: string[];
}

// 1. Search cases
export const searchIndianKanoon = async (query: string, filters?: any): Promise<IndianKanoonSearchResult[]> => {
  const params = new URLSearchParams({ formInput: query, pagenum: '0' });

  if (filters) {
    if (filters.fromdate) params.append('fromdate', filters.fromdate);
    if (filters.todate) params.append('todate', filters.todate);
    if (filters.doctypes) params.append('doctypes', filters.doctypes);
    if (filters.author) params.append('author', filters.author);
    if (filters.bench) params.append('bench', filters.bench);
  }

  const res = await fetch(`${INDIAN_KANOON_BASE_URL}/search/?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${KANOON_API_TOKEN}`,
      'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
    }
  });

  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = await res.json();

  return (data.docs || []).map((doc: any) => ({
    title: doc.title || '',
    tid: doc.tid || '',
    url: doc.url || `https://indiankanoon.org/doc/${doc.tid}/`,
    snippet: doc.snippet || '',
    citation: doc.citation || '',
    court: doc.court || '',
    date: doc.date || ''
  }));
};

// 2. Get detailed doc
export const getIndianKanoonDocument = async (docId: string): Promise<IndianKanoonDocument | null> => {
  const res = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${KANOON_API_TOKEN}`,
      'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
    }
  });

  if (!res.ok) return null;
  const data = await res.json();

  return {
    title: data.title || '',
    content: data.doc || '',
    citation: data.citation || '',
    court: data.court || '',
    date: data.date || '',
    judges: data.judges || []
  };
};

// 3. Full judgment (alias)
export const getFullJudgment = async (docId: string): Promise<string | null> => {
  const res = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${KANOON_API_TOKEN}`,
      'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
    }
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.doc || null;
};

// 4. Original court copy
export const getOriginalCourtCopy = async (docId: string): Promise<string | null> => {
  const res = await fetch(`${INDIAN_KANOON_BASE_URL}/origdoc/${docId}/`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${KANOON_API_TOKEN}`,
      'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
    }
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.doc || data.url || null;
};

// 5. Doc fragment
export const getDocumentFragment = async (docId: string, query: string): Promise<string | null> => {
  const params = new URLSearchParams({ formInput: query });
  const res = await fetch(`${INDIAN_KANOON_BASE_URL}/docfragment/${docId}/?${params.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${KANOON_API_TOKEN}`,
      'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)'
    }
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.fragment || data.doc || null;
};
xs
