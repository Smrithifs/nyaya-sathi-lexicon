import {
  CheckHealthData,
  GetCaseTypesData,
  GetCourtTypesData,
  LegalSearchRequest,
  SearchLegalCasesData,
  TestSearchData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Search for legal cases with multi-field parameters and AI analysis
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name search_legal_cases
   * @summary Search Legal Cases
   * @request POST:/routes/search-cases
   */
  export namespace search_legal_cases {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LegalSearchRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SearchLegalCasesData;
  }

  /**
   * @description Get available case types for dropdown
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name get_case_types
   * @summary Get Case Types
   * @request GET:/routes/case-types
   */
  export namespace get_case_types {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCaseTypesData;
  }

  /**
   * @description Get available court types for dropdown
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name get_court_types
   * @summary Get Court Types
   * @request GET:/routes/court-types
   */
  export namespace get_court_types {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCourtTypesData;
  }

  /**
   * @description Test endpoint to verify Indian Kanoon API connection
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name test_search
   * @summary Test Search
   * @request GET:/routes/test-search
   */
  export namespace test_search {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TestSearchData;
  }
}
