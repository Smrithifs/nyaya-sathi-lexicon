
// Re-export all API functions from their respective modules
export { searchIndianKanoon } from './search';
export { 
  getIndianKanoonDocument, 
  getFullJudgment, 
  getOriginalCourtCopy, 
  getDocumentFragment 
} from './documents';
export { getApiKey } from './config';
export type { SearchFilters } from './types';
