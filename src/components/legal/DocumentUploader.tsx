
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface DocumentUploaderProps {
  onDocumentProcessed: (extractedText: string) => void;
  onClose: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentProcessed,
  onClose
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    console.log('Processing file:', file.name, file.type, file.size);

    // Check file type
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword', 
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, Word, or Text documents only.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      let extractedText = "";

      if (file.type === 'text/plain') {
        console.log('Processing text file...');
        extractedText = await file.text();
        console.log('Extracted text length:', extractedText.length);
      } else if (file.type === 'application/pdf') {
        extractedText = `[PDF Document: ${file.name}]\n\nPDF text extraction is not yet implemented. Please copy and paste the relevant text from your PDF document into the case details field manually.`;
      } else if (file.type.includes('word')) {
        extractedText = `[Word Document: ${file.name}]\n\nWord document text extraction is not yet implemented. Please copy and paste the relevant text from your Word document into the case details field manually.`;
      }

      if (extractedText.trim()) {
        onDocumentProcessed(extractedText);
        toast({
          title: "Document Processed",
          description: `Text has been extracted successfully from ${file.name}.`
        });
      } else {
        throw new Error("No text could be extracted from the document");
      }
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the document. Please try again or copy-paste the text manually.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <Card className="border-2 border-dashed border-blue-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Upload className="w-5 h-5" />
            Upload Reference Document
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-lg font-medium">Processing Document...</p>
              <p className="text-sm text-gray-600">Extracting text content</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <FileText className="w-16 h-16 text-blue-400" />
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag and drop your document here
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  or click to browse files
                </p>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-4">
                <p>Supported formats: PDF, Word (.docx, .doc), Text (.txt)</p>
                <p>Maximum file size: 10MB</p>
                <p className="mt-2 text-blue-600">Note: Currently only .txt files are fully processed</p>
              </div>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
