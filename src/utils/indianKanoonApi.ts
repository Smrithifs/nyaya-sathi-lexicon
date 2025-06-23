const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';

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

// Securely get API key from environment variable
const getIndianKanoonApiKey = (): string => {
  const key = process.env.NEXT_PUBLIC_KANOON_API_KEY;
  if (!key) throw new Error('Missing Indian Kanoon API Key in env!');
  return key;
};

// Shared headers
const headers = {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (compatible; LegalResearchBot/1.0)',
  'Authorization': `Token ${getIndianKanoonApiKey()}`
};

export const searchIndianKanoon = async (
  query: string,
  filters?: {
    fromdate?: string;
    todate?: string;
    doctypes?: string;
    author?: string;
    bench?: string;
  }
): Promise<IndianKanoonSearchResult[]> => {
  try {
    const params = new URLSearchParams({ formInput: query, pagenum: '0' });
    if (filters) {
      if (filters.fromdate) params.append('fromdate', filters.fromdate);
      if (filters.todate) params.append('todate', filters.todate);
      if (filters.doctypes) params.append('doctypes', filters.doctypes);
      if (filters.author) params.append('author', filters.author);
      if (filters.bench) params.append('bench', filters.bench);
    }

    const res = await fetch(`${INDIAN_KANOON_BASE_URL}/search/?${params.toString()}`, { headers });
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
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
};

export const getIndianKanoonDocument = async (docId: string): Promise<IndianKanoonDocument | null> => {
  try {
    const res = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, { headers });
    if (!res.ok) throw new Error(`Document fetch failed: ${res.status}`);
    const data = await res.json();

    return {
      title: data.title || '',
      content: data.doc || '',
      citation: data.citation || '',
      court: data.court || '',
      date: data.date || '',
      judges: data.judges || []
    };
  } catch (err) {
    console.error('Document fetch error:', err);
    return null;
  }
};

export const getFullJudgment = async (docId: string): Promise<string | null> => {
  try {
    const res = await fetch(`${INDIAN_KANOON_BASE_URL}/doc/${docId}/`, { headers });
    if (!res.ok) throw new Error(`Full judgment fetch failed: ${res.status}`);
    const data = await res.json();
    return data.doc || null;
  } catch (err) {
    console.error('Full judgment fetch error:', err);
    return null;
  }
};

export const getOriginalCourtCopy = async (docId: string): Promise<string | null> => {
  try {
    const res = await fetch(`${INDIAN_KANOON_BASE_URL}/origdoc/${docId}/`, { headers });
    if (!res.ok) throw new Error(`Court copy fetch failed: ${res.status}`);
    const data = await res.json();
    return data.doc || data.url || null;
  } catch (err) {
    console.error('Court copy fetch error:', err);
    return null;
  }
};

export const getDocumentFragment = async (docId: string, query: string): Promise<string | null> => {
  try {
    const params = new URLSearchParams({ formInput: query });
    const res = await fetch(`${INDIAN_KANOON_BASE_URL}/docfragment/${docId}/?${params.toString()}`, { headers });
    if (!res.ok) throw new Error(`Fragment fetch failed: ${res.status}`);
    const data = await res.json();
    return data.fragment || data.doc || null;
  } catch (err) {
    console.error('Document fragment fetch error:', err);
    return null;
  }
};

export const searchSectionInIndianKanoon = async (
  sectionNumber: string, actName: string
): Promise<IndianKanoonSearchResult[]> => {
  return searchIndianKanoon(`Section ${sectionNumber} ${actName}`);
};

export const searchSectionExplanation = async (section: string): Promise<{
  legalOutput: string;
  simplifiedOutput: string;
} | null> => {
  const results = await searchIndianKanoon(section);
  if (results.length === 0) return null;
  const doc = await getIndianKanoonDocument(results[0].tid);
  return doc ? { legalOutput: doc.content, simplifiedOutput: '' } : null;
};

export const searchSectionCases = async (section: string): Promise<IndianKanoonSearchResult[]> => {
  return searchIndianKanoon(`Section ${section}`);
};

export const searchCitationInIndianKanoon = async (
  citation: string
): Promise<{ found: boolean; document?: IndianKanoonDocument; searchResults: IndianKanoonSearchResult[] }> => {
  const cleanCitation = citation.trim();
  const results = await searchIndianKanoon(cleanCitation);
  if (results.length === 0) return { found: false, searchResults: [] };
  const doc = await getIndianKanoonDocument(results[0].tid);
  return { found: true, document: doc || undefined, searchResults: results };
};

export const advancedCaseSearch = async (params: {
  query?: string;
  fromYear?: string;
  toYear?: string;
  court?: string;
  judge?: string;
  bench?: string;
}): Promise<IndianKanoonSearchResult[]> => {
  const filters: any = {};
  if (params.fromYear) filters.fromdate = `01-01-${params.fromYear}`;
  if (params.toYear) filters.todate = `31-12-${params.toYear}`;
  if (params.court) {
    if (params.court.toLowerCase().includes('supreme')) filters.doctypes = 'supremecourt';
    if (params.court.toLowerCase().includes('high')) filters.doctypes = 'highcourts';
  }
  if (params.judge) filters.author = params.judge;
  if (params.bench) filters.bench = params.bench;

  return searchIndianKanoon(params.query || '', filters);
};

export const searchBareAct = async (
  actName: string
): Promise<{ actContent: string; document?: IndianKanoonDocument } | null> => {
  const results = await searchIndianKanoon(actName);
  if (results.length === 0) return null;
  const doc = await getIndianKanoonDocument(results[0].tid);
  return doc ? { actContent: doc.content, document: doc } : null;
};
