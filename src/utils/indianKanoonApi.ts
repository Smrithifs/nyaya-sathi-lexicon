
const headers = {
  'Authorization': `Token ${process.env.NEXT_PUBLIC_KANOON_API_KEY}`,
  'Content-Type': 'application/json'
};

export const searchIndianKanoon = async (query: string) => {
  const response = await fetch(`https://api.indiankanoon.org/search?formInput=${encodeURIComponent(query)}`, {
    method: "GET",
    headers
  });
  if (!response.ok) throw new Error("Failed to search Indian Kanoon");
  return await response.json();
};

export const getIndianKanoonDocument = async (tid: string) => {
  const response = await fetch(`https://api.indiankanoon.org/doc/${tid}`, {
    method: "GET",
    headers
  });
  if (!response.ok) throw new Error("Failed to fetch document");
  return await response.json();
};

export const getFullJudgment = async (tid: string) => {
  const response = await fetch(`https://api.indiankanoon.org/doc/${tid}`, {
    method: "GET",
    headers
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.content || null;
};

export const getOriginalCourtCopy = async (tid: string) => {
  const response = await fetch(`https://api.indiankanoon.org/origdoc/${tid}`, {
    method: "GET",
    headers
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.content || null;
};

export const getDocumentFragment = async (tid: string, query: string) => {
  const response = await fetch(`https://api.indiankanoon.org/docfragment/${tid}?formInput=${encodeURIComponent(query)}`, {
    method: "GET",
    headers
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.content || null;
};
