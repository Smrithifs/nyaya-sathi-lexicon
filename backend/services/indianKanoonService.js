
const axios = require('axios');
const { generateAuthHeaders } = require('../utils/crypto');

const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';

class IndianKanoonService {
  constructor() {
    this.baseURL = INDIAN_KANOON_BASE_URL;
  }

  async makeRequest(endpoint, params = {}, method = 'GET') {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = generateAuthHeaders(url, method);
      
      console.log('Making Indian Kanoon request:', { url, params, method });
      
      const config = {
        method,
        url,
        headers,
        timeout: 30000,
        ...(method === 'GET' ? { params } : { data: params })
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Indian Kanoon API Error:', error.response?.data || error.message);
      throw new Error(`Indian Kanoon API Error: ${error.response?.status || 'Network Error'} - ${error.message}`);
    }
  }

  // Search cases
  async searchCases(query, filters = {}) {
    const params = {
      formInput: query,
      pagenum: filters.pagenum || 0
    };

    // Add optional filters
    if (filters.fromdate) params.fromdate = filters.fromdate;
    if (filters.todate) params.todate = filters.todate;
    if (filters.doctypes) params.doctypes = filters.doctypes;
    if (filters.author) params.author = filters.author;
    if (filters.bench) params.bench = filters.bench;
    if (filters.title) params.title = filters.title;
    if (filters.cite) params.cite = filters.cite;

    return await this.makeRequest('/search/', params);
  }

  // Get document details
  async getDocument(docId, maxcites = 10, maxcitedby = 10) {
    const params = { maxcites, maxcitedby };
    return await this.makeRequest(`/doc/${docId}/`, params);
  }

  // Get original court document
  async getOriginalDocument(docId) {
    return await this.makeRequest(`/origdoc/${docId}/`);
  }

  // Get document fragment
  async getDocumentFragment(docId, query) {
    const params = { formInput: query };
    return await this.makeRequest(`/docfragment/${docId}/`, params);
  }

  // Get document metadata
  async getDocumentMeta(docId) {
    return await this.makeRequest(`/docmeta/${docId}/`);
  }
}

module.exports = new IndianKanoonService();
