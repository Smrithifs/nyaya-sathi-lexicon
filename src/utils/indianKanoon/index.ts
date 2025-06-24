
// Re-export all API functions from their respective modules
export { searchIndianKanoon } from './search';
export { 
  getIndianKanoonDocument, 
  getFullJudgment, 
  getOriginalCourtCopy, 
  getDocumentFragment 
} from './documents';
export type { SearchFilters } from './types';
