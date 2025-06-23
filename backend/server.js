const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Indian Kanoon API configuration
const INDIAN_KANOON_BASE_URL = 'https://api.indiankanoon.org';
const INDIAN_KANOON_API_KEY = '7bab131b7fdd98e4d9e7c7c62c1aa7afaaccec40';

// Helper function to make Indian Kanoon API requests
const makeIndianKanoonRequest = async (endpoint, params = {}) => {
  try {
    const config = {
      method: 'POST',
      url: `${INDIAN_KANOON_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Token ${INDIAN_KANOON_API_KEY}`,
        'Accept': 'application/json',
        'User-Agent': 'LegalResearchApp/1.0'
      },
      params
    };

    console.log('Making request to Indian Kanoon:', config.url);
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Indian Kanoon API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Search endpoint
app.post('/api/indian-kanoon/search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    let searchUrl = `/search/?formInput=${encodeURIComponent(query)}`;
    
    // Add filters if provided
    if (filters.fromdate) searchUrl += `&fromdate=${filters.fromdate}`;
    if (filters.todate) searchUrl += `&todate=${filters.todate}`;
    if (filters.doctypes) searchUrl += `&doctypes=${filters.doctypes}`;
    if (filters.author) searchUrl += `&author=${encodeURIComponent(filters.author)}`;
    if (filters.bench) searchUrl += `&bench=${encodeURIComponent(filters.bench)}`;

    console.log('Search query:', query, 'URL:', searchUrl);
    
    const data = await makeIndianKanoonRequest(searchUrl);
    res.json(data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to search Indian Kanoon API',
      details: error.response?.data || error.message 
    });
  }
});

// Get document endpoint
app.post('/api/indian-kanoon/doc/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    console.log('Fetching document:', docId);
    
    const data = await makeIndianKanoonRequest(`/doc/${docId}/`);
    res.json(data);
  } catch (error) {
    console.error('Document fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch document from Indian Kanoon API',
      details: error.response?.data || error.message 
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
      details: error.response?.data || error.message 
    });
  }
});

// Get document fragment endpoint
app.post('/api/indian-kanoon/docfragment/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    const { query } = req.body;
    console.log('Fetching document fragment:', docId, 'with query:', query);
    
    const data = await makeIndianKanoonRequest(`/docfragment/${docId}/?formInput=${encodeURIComponent(query)}`);
    res.json(data);
  } catch (error) {
    console.error('Document fragment fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch document fragment from Indian Kanoon API',
      details: error.response?.data || error.message 
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
      details: error.response?.data || error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 LegalOps Backend Proxy running on port ${PORT}`);
  console.log(`📡 Indian Kanoon API proxy endpoints available at http://localhost:${PORT}/api/indian-kanoon/`);
});
