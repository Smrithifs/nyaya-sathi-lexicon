/** CaseDetail */
export interface CaseDetail {
  /** Case Title */
  case_title: string;
  /** Summary */
  summary: string;
  /** Ratio Decidendi */
  ratio_decidendi: string;
  /** Judgment Outcome */
  judgment_outcome: string;
  /** Citation */
  citation: string;
  /** Court Name */
  court_name: string;
  /** Case Year */
  case_year: string;
  /** Doc Id */
  doc_id: string;
  /** Download Url */
  download_url: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** LegalSearchRequest */
export interface LegalSearchRequest {
  /** Case Type */
  case_type?: string | null;
  /** Section */
  section?: string | null;
  /** From Year */
  from_year?: number | null;
  /** To Year */
  to_year?: number | null;
  /** Case Name */
  case_name?: string | null;
  /** Court Type */
  court_type?: string | null;
  /**
   * Offset
   * @default 0
   */
  offset?: number;
}

/** SearchResponse */
export interface SearchResponse {
  /** Cases */
  cases: CaseDetail[];
  /** Total Results */
  total_results: number;
  /** Offset */
  offset: number;
  /** Has More */
  has_more: boolean;
  /** Search Params */
  search_params: Record<string, any>;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type SearchLegalCasesData = SearchResponse;

export type SearchLegalCasesError = HTTPValidationError;

/** Response Get Case Types */
export type GetCaseTypesData = string[];

/** Response Get Court Types */
export type GetCourtTypesData = string[];

/** Response Test Search */
export type TestSearchData = Record<string, any>;
