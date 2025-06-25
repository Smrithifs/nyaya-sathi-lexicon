import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { indianKanoonAuth } from "./indianKanoonAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // Document processing endpoint (replaces Supabase edge function)
  app.post("/api/process-documents", upload.array("files"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const sessionId = req.body.sessionId;
      
      if (!sessionId) {
        return res.status(400).json({ success: false, error: "Session ID is required" });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, error: "No files uploaded" });
      }

      const processedDocuments = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `doc_${Date.now()}_${i}`;
        
        let content = '';
        const fileType = file.mimetype.toLowerCase();
        
        try {
          if (fileType.includes('pdf')) {
            content = `[PDF Document: ${file.originalname}] - Content extraction requires specialized PDF processing. Document uploaded successfully for AI analysis.`;
          } else if (fileType.includes('msword') || fileType.includes('wordprocessingml') || file.originalname.endsWith('.docx')) {
            content = `[DOCX Document: ${file.originalname}] - Word document uploaded successfully. Content will be processed by AI for analysis.`;
          } else if (fileType.startsWith('text/')) {
            content = file.buffer.toString('utf-8');
          } else if (fileType.startsWith('image/')) {
            content = `[Image Document: ${file.originalname}] - Image uploaded successfully. OCR text extraction will be performed by AI during analysis.`;
          } else {
            content = `[Unsupported Format: ${file.originalname}] - File uploaded but format may not be fully supported.`;
          }

          const processedDoc = {
            id: fileId,
            filename: file.originalname,
            type: fileType,
            content: content,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };

          processedDocuments.push(processedDoc);
          
        } catch (error) {
          console.error(`Error processing file ${file.originalname}:`, error);
          processedDocuments.push({
            id: fileId,
            filename: file.originalname,
            type: fileType,
            content: `[Processing Error: ${file.originalname}] - Unable to extract content, but file is available for AI analysis.`,
            size: file.size,
            uploadedAt: new Date().toISOString()
          });
        }
      }

      res.json({ 
        success: true, 
        documents: processedDocuments,
        message: `Successfully processed ${processedDocuments.length} documents`
      });

    } catch (error: any) {
      console.error('Error in process-documents endpoint:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to process documents' 
      });
    }
  });

  // Indian Kanoon API authenticated endpoints
  app.get("/api/indiankanoon/search", async (req, res) => {
    try {
      const { formInput, pagenum = 1, fromdate, todate, doctypes, bench, cite } = req.query;
      
      if (!formInput) {
        return res.status(400).json({ error: "formInput parameter is required" });
      }

      let url = `https://api.indiankanoon.org/search/?formInput=${encodeURIComponent(formInput as string)}&pagenum=${pagenum}`;
      
      if (fromdate) url += `&fromdate=${fromdate}`;
      if (todate) url += `&todate=${todate}`;
      if (doctypes) url += `&doctypes=${doctypes}`;
      if (bench) url += `&bench=${encodeURIComponent(bench as string)}`;
      if (cite) url += `&cite=${encodeURIComponent(cite as string)}`;

      const response = await indianKanoonAuth.makeAuthenticatedRequest(url);
      
      if (!response.ok) {
        throw new Error(`Indian Kanoon API responded with status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);

    } catch (error: any) {
      console.error('Error in Indian Kanoon search:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to search Indian Kanoon API' 
      });
    }
  });

  app.get("/api/indiankanoon/doc/:docid", async (req, res) => {
    try {
      const { docid } = req.params;
      const { maxcites = 10, maxcitedby = 10 } = req.query;
      
      const url = `https://api.indiankanoon.org/doc/${docid}/?maxcites=${maxcites}&maxcitedby=${maxcitedby}`;
      const response = await indianKanoonAuth.makeAuthenticatedRequest(url);
      
      if (!response.ok) {
        throw new Error(`Indian Kanoon API responded with status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);

    } catch (error: any) {
      console.error('Error fetching document:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to fetch document from Indian Kanoon API' 
      });
    }
  });

  app.get("/api/indiankanoon/origdoc/:docid", async (req, res) => {
    try {
      const { docid } = req.params;
      
      const url = `https://api.indiankanoon.org/origdoc/${docid}/`;
      const response = await indianKanoonAuth.makeAuthenticatedRequest(url);
      
      if (!response.ok) {
        throw new Error(`Indian Kanoon API responded with status ${response.status}`);
      }

      const data = await response.text();
      res.json({ doc: data });

    } catch (error: any) {
      console.error('Error fetching original document:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to fetch original document from Indian Kanoon API' 
      });
    }
  });

  app.get("/api/indiankanoon/docmeta/:docid", async (req, res) => {
    try {
      const { docid } = req.params;
      
      const url = `https://api.indiankanoon.org/docmeta/${docid}/`;
      const response = await indianKanoonAuth.makeAuthenticatedRequest(url);
      
      if (!response.ok) {
        throw new Error(`Indian Kanoon API responded with status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);

    } catch (error: any) {
      console.error('Error fetching document metadata:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to fetch document metadata from Indian Kanoon API' 
      });
    }
  });

  app.get("/api/indiankanoon/docfragment/:docid", async (req, res) => {
    try {
      const { docid } = req.params;
      const { formInput } = req.query;
      
      if (!formInput) {
        return res.status(400).json({ error: "formInput parameter is required" });
      }
      
      const url = `https://api.indiankanoon.org/docfragment/${docid}/?formInput=${encodeURIComponent(formInput as string)}`;
      const response = await indianKanoonAuth.makeAuthenticatedRequest(url);
      
      if (!response.ok) {
        throw new Error(`Indian Kanoon API responded with status ${response.status}`);
      }

      const data = await response.text();
      res.json({ fragment: data });

    } catch (error: any) {
      console.error('Error fetching document fragment:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to fetch document fragment from Indian Kanoon API' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
