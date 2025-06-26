import {
  CheckHealthData,
  GetCaseTypesData,
  GetCourtTypesData,
  LegalSearchRequest,
  SearchLegalCasesData,
  SearchLegalCasesError,
  TestSearchData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Search for legal cases with multi-field parameters and AI analysis
   *
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name search_legal_cases
   * @summary Search Legal Cases
   * @request POST:/routes/search-cases
   */
  search_legal_cases = (data: LegalSearchRequest, params: RequestParams = {}) =>
    this.request<SearchLegalCasesData, SearchLegalCasesError>({
      path: `/routes/search-cases`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get available case types for dropdown
   *
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name get_case_types
   * @summary Get Case Types
   * @request GET:/routes/case-types
   */
  get_case_types = (params: RequestParams = {}) =>
    this.request<GetCaseTypesData, any>({
      path: `/routes/case-types`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get available court types for dropdown
   *
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name get_court_types
   * @summary Get Court Types
   * @request GET:/routes/court-types
   */
  get_court_types = (params: RequestParams = {}) =>
    this.request<GetCourtTypesData, any>({
      path: `/routes/court-types`,
      method: "GET",
      ...params,
    });

  /**
   * @description Test endpoint to verify Indian Kanoon API connection
   *
   * @tags dbtn/module:legal_search, dbtn/hasAuth
   * @name test_search
   * @summary Test Search
   * @request GET:/routes/test-search
   */
  test_search = (params: RequestParams = {}) =>
    this.request<TestSearchData, any>({
      path: `/routes/test-search`,
      method: "GET",
      ...params,
    });
}
