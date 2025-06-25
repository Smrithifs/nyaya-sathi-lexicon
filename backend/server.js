
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const indianKanoonService = require('./services/indianKanoonService');
const geminiService = require('./services/geminiService');
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

app.use(express.json({ limit: '50mb' }));

// Preflight handler for all routes
app.options('*', cors());

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running with Indian Kanoon integration',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/case-search',
      '/api/case-details/:docId',
      '/api/case-summary/:docId'
    ]
  });
});

// Search cases endpoint - matches frontend expectations
app.post('/api/case-search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    console.log('Received search request:', { query, filters });
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        error: 'Query parameter is required',
        details: 'Please provide a search query' 
      });
    }

    console.log('Searching cases with query:', query, 'filters:', filters);
    
    const searchResults = await indianKanoonService.searchCases(query, filters);
    
    // Limit to top 5 results as requested
    const limitedResults = {
      ...searchResults,
      docs: searchResults.docs ? searchResults.docs.slice(0, 5) : [],
      currentPage: filters.pagenum || 0
    };
    
    console.log('Search results:', limitedResults);
    res.json(limitedResults);
  } catch (error) {
    console.error('Case search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to search cases',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get next page of results (pagination)
app.post('/api/case-search/next', async (req, res) => {
  try {
    const { query, filters = {}, currentPage = 0 } = req.body;
    
    console.log('Next page request:', { query, filters, currentPage });
    
    const nextPageFilters = {
      ...filters,
      pagenum: currentPage + 1
    };
    
    const searchResults = await indianKanoonService.searchCases(query, nextPageFilters);
    
    // Limit to top 5 results
    const limitedResults = {
      ...searchResults,
      docs: searchResults.docs ? searchResults.docs.slice(0, 5) : [],
      currentPage: currentPage + 1
    };
    
    res.json(limitedResults);
  } catch (error) {
    console.error('Next page search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch next page',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get case details with AI summary
app.post('/api/case-details/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    
    console.log('Fetching case details for:', docId);
    
    // Fetch case document, metadata, and original document in parallel
    const [docData, metaData, origDoc] = await Promise.allSettled([
      indianKanoonService.getDocument(docId),
      indianKanoonService.getDocumentMeta(docId),
      indianKanoonService.getOriginalDocument(docId)
    ]);

    const caseDetails = {
      docId,
      document: docData.status === 'fulfilled' ? docData.value : null,
      metadata: metaData.status === 'fulfilled' ? metaData.value : null,
      originalDoc: origDoc.status === 'fulfilled' ? origDoc.value : null
    };

    res.json(caseDetails);
  } catch (error) {
    console.error('Case details fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch case details',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get AI-powered case summary
app.post('/api/case-summary/:docId', async (req, res) => {
  try {
    const { docId } = req.params;
    
    console.log('Generating AI summary for case:', docId);
    
    // First get the case details
    const [docData, metaData] = await Promise.all([
      indianKanoonService.getDocument(docId),
      indianKanoonService.getDocumentMeta(docId)
    ]);

    if (!docData || !docData.doc) {
      return res.status(404).json({
        error: 'Case document not found',
        details: `No document found for ID: ${docId}`
      });
    }

    // Generate AI summary using Gemini
    const summary = await geminiService.summarizeJudgment(docData.doc, metaData);
    
    const result = {
      docId,
      summary,
      metadata: metaData,
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    console.error('Case summary generation error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate case summary',
      details: error.message,
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
  console.log(`🚀 LegalOps Backend with Indian Kanoon Integration running on port ${PORT}`);
  console.log(`🔐 Using private key authentication for Indian Kanoon API`);
  console.log(`🤖 Gemini AI integration available for case summarization`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`📧 Customer email: ${process.env.CUSTOMER_EMAIL}`);
  console.log(`🔑 Gemini API configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});
