
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UploadedDocument {
  id: string;
  filename: string;
  type: string;
  content: string;
  size: number;
  uploadedAt: string;
}

interface DocumentUploadProps {
  onDocumentsUploaded: (documents: UploadedDocument[]) => void;
  uploadedDocuments: UploadedDocument[];
  onRemoveDocument: (documentId: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentsUploaded,
  uploadedDocuments,
  onRemoveDocument
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      const sessionId = `session_${Date.now()}`;
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('sessionId', sessionId);

      const { data, error } = await supabase.functions.invoke('process-documents', {
        body: formData,
      });

      if (error) throw error;

      if (data.success) {
        onDocumentsUploaded(data.documents);
        toast({
          title: "Documents uploaded successfully",
          description: `${data.documents.length} documents processed`,
        });
        
        // Clear the input
        event.target.value = '';
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload documents",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes('image')) return <Image className="w-4 h-4 text-blue-500" />;
    if (type.includes('text')) return <FileText className="w-4 h-4 text-gray-500" />;
    if (type.includes('word') || type.includes('msword')) return <FileText className="w-4 h-4 text-blue-600" />;
    return <File className="w-4 h-4 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-3">
          Upload multiple documents (PDF, DOCX, TXT, JPG, PNG)
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="document-upload"
        />
        <Button 
          asChild 
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <label htmlFor="document-upload" className="cursor-pointer">
            {uploading ? 'Processing...' : 'Choose Files'}
          </label>
        </Button>
      </div>

      {/* Uploaded Documents List */}
      {uploadedDocuments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Uploaded Documents ({uploadedDocuments.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadedDocuments.map((doc, index) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Document {index + 1}: {doc.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDocument(doc.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            💡 Reference documents in your questions like "Summarize document 1" or "Compare document 1 and 2"
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
