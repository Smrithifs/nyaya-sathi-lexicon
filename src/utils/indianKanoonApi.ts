const headers = {
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_KANOON_API_KEY}`,
  'Content-Type': 'application/json'
};

/**
 * Search Indian Kanoon for judgments by keyword or citation.
 */
export const searchIndianKanoon = async (query: string) => {
  const response = await fetch(`https://api.indiankanoon.ai/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to search Indian Kanoon");
  }

  return await response.json();
};

/**
 * Get the full document content of a judgment by TID.
 */
export const getIndianKanoonDocument = async (tid: string) => {
  const response = await fetch(`https://api.indiankanoon.ai/doc/${tid}`, {
    method: "GET",
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to fetch document content");
  }

  return await response.json();
};

/**
 * Get the full judgment text (/doc) content only.
 */
export const getFullJudgment = async (tid: string) => {
  const response = await fetch(`https://api.indiankanoon.ai/doc/${tid}`, {
    method: "GET",
    headers
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data?.content || null;
};

/**
 * Get the original scanned court copy (/origdoc) if available.
 */
export const getOriginalCourtCopy = async (tid: string) => {
  const response = await fetch(`https://api.indiankanoon.ai/origdoc/${tid}`, {
    method: "GET",
    headers
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data?.content || null;
};

/**
 * Get document fragments (/docfragment) that match a specific search query.
 */
export const getDocumentFragment = async (tid: string, query: string) => {
  const response = await fetch(`https://api.indiankanoon.ai/docfragment/${tid}?q=${encodeURIComponent(query)}`, {
    method: "GET",
    headers
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data?.content || null;
};
