const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes with specific configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://567a48d1-baaa-4be4-8efd-44f674b408a9.lovableproject.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Preflight handler for all routes
app.options('*', cors());

// Indian Kanoon API configuration
const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';
const INDIAN_KANOON_API_KEY = '7061433e91576225eb89bbbeb11c9a350146a264';

// Helper function to make Indian Kanoon API requests
const makeIndianKanoonRequest = async (endpoint, params = {}) => {
  try {
    const config = {
      method: 'GET',
      url: `${INDIAN_KANOON_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Token ${INDIAN_KANOON_API_KEY}`,
        'Accept': 'application/json',
        'User-Agent': 'LegalResearchApp/1.0'
      },
      params,
      timeout: 30000 // 30 second timeout
    };

    console.log('Making request to Indian Kanoon:', config.url);
    console.log('With params:', params);
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Indian Kanoon API Error:', error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - Indian Kanoon API is taking too long to respond');
    }
    throw error;
  }
};

// Health check endpoints - both GET and POST
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend proxy server is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/indian-kanoon/search',
      '/api/indian-kanoon/doc/:docId',
      '/api/indian-kanoon/origdoc/:docId',
      '/api/indian-kanoon/docfragment/:docId',
      '/api/indian-kanoon/docmeta/:docId'
    ]
  });
});

app.post('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend proxy server is running (POST)',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/indian-kanoon/search',
      '/api/indian-kanoon/doc/:docId',
      '/api/indian-kanoon/origdoc/:docId',
      '/api/indian-kanoon/docfragment/:docId',
      '/api/indian-kanoon/docmeta/:docId'
    ]
  });
});

// Search endpoint
app.post('/api/indian-kanoon/search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        error: 'Query parameter is required',
        details: 'Please provide a search query' 
      });
    }
    
    // Clean up filters - remove undefined values that are being sent as objects
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      // Only add filter if it's not undefined and not an object with undefined value
      if (value !== undefined && 
          !(typeof value === 'object' && value._type === 'undefined')) {
        cleanFilters[key] = value;
      }
    });

    const searchParams = {
      formInput: query,
      pagenum: cleanFilters.pagenum || 0
    };
    
    // Add valid filters
    if (cleanFilters.fromdate) searchParams.fromdate = cleanFilters.fromdate;
    if (cleanFilters.todate) searchParams.todate = cleanFilters.todate;
    if (cleanFilters.doctypes) searchParams.doctypes = cleanFilters.doctypes;
    if (cleanFilters.author) searchParams.author = cleanFilters.author;
    if (cleanFilters.bench) searchParams.bench = cleanFilters.bench;
    if (cleanFilters.title) searchParams.title = cleanFilters.title;
    if (cleanFilters.cite) searchParams.cite = cleanFilters.cite;
    if (cleanFilters.maxcites) searchParams.maxcites = cleanFilters.maxcites;

    console.log('Cleaned search params:', searchParams);
    
    const data = await makeIndianKanoonRequest('/search/', searchParams);
    res.json(data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to search Indian Kanoon API',
      details: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Get document endpoint
app.post('/api/indian-kanoon/doc/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    const { maxcites = 10, maxcitedby = 10 } = req.body;
    
    console.log('Fetching document:', docId);
    
    const searchParams = {
      maxcites,
      maxcitedby
    };
    
    const data = await makeIndianKanoonRequest(`/doc/${docId}/`, searchParams);
    res.json(data);
  } catch (error) {
    console.error('Document fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch document from Indian Kanoon API',
      details: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Get original court copy endpoint
app.post('/api/indian-kanoon/origdoc/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    console.log('Fetching original court copy:', docId);
    
    const data = await makeIndianKanoonRequest(`/origdoc/${docId}/`);
    res.json(data);
  } catch (error) {
    console.error('Original court copy fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch original court copy from Indian Kanoon API',
      details: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Get document fragment endpoint
app.post('/api/indian-kanoon/docfragment/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    const { query } = req.body;
    console.log('Fetching document fragment:', docId, 'with query:', query);
    
    const searchParams = {
      formInput: query
    };
    
    const data = await makeIndianKanoonRequest(`/docfragment/${docId}/`, searchParams);
    res.json(data);
  } catch (error) {
    console.error('Document fragment fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch document fragment from Indian Kanoon API',
      details: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Get document metadata endpoint  
app.post('/api/indian-kanoon/docmeta/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    console.log('Fetching document metadata:', docId);
    
    const data = await makeIndianKanoonRequest(`/docmeta/${docId}/`);
    res.json(data);
  } catch (error) {
    console.error('Document metadata fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch document metadata from Indian Kanoon API',
      details: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LegalOps Backend Proxy running on port ${PORT}`);
  console.log(`📡 Indian Kanoon API proxy endpoints available at http://localhost:${PORT}/api/indian-kanoon/`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/api/health`);
});
