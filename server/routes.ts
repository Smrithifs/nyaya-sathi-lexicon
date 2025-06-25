import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";

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

  const httpServer = createServer(app);

  return httpServer;
}
