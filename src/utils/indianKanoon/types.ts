
// Define proper types for filters
export interface SearchFilters {
  jurisdiction?: string;
  yearFrom?: string;
  yearTo?: string;
  judge?: string;
  benchType?: string;
  [key: string]: any;
}

export interface SearchRequestBody {
  formInput: string;
  doctypes?: string;
  fromdate?: string;
  todate?: string;
  author?: string;
  bench?: string;
  [key: string]: any;
}
