
// Main Indian Kanoon API - delegates to modular implementation
export {
  searchIndianKanoon,
  getIndianKanoonDocument,
  getFullJudgment,
  getOriginalCourtCopy,
  getDocumentFragment
} from './indianKanoon';

export type { SearchFilters } from './indianKanoon';
