import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { askPuter } from "@/utils/openaiApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, FileText, Download } from "lucide-react";

interface UploadedDocument {
  id: string;
  filename: string;
  type: string;
  content: string;
  size: number;
  uploadedAt: string;
}

const MultiLanguageSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  const languages = [
    { value: "hindi", label: "Hindi (हिंदी)" },
    { value: "kannada", label: "Kannada (ಕನ್ನಡ)" },
    { value: "tamil", label: "Tamil (தமிழ்)" },
    { value: "telugu", label: "Telugu (తెలుగు)" },
    { value: "marathi", label: "Marathi (मराठी)" },
    { value: "gujarati", label: "Gujarati (ગુજરાતી)" },
    { value: "bengali", label: "Bengali (বাংলা)" },
    { value: "punjabi", label: "Punjabi (ਪੰਜਾਬੀ)" }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `doc_${Date.now()}_${i}`;
        
        let content = '';
        const fileType = file.type.toLowerCase();
        
        if (fileType.includes('pdf')) {
          content = `[PDF Document: ${file.name}] - Content will be extracted for translation.`;
        } else if (fileType.includes('msword') || fileType.includes('wordprocessingml') || file.name.endsWith('.docx')) {
          content = `[DOCX Document: ${file.name}] - Word document content will be extracted for translation.`;
        } else if (fileType.startsWith('text/')) {
          content = await file.text();
        } else if (fileType.startsWith('image/')) {
          content = `[Image Document: ${file.name}] - OCR will extract text for translation.`;
        } else {
          content = `[Document: ${file.name}] - Content will be processed for translation.`;
        }

        const processedDoc: UploadedDocument = {
          id: fileId,
          filename: file.name,
          type: fileType,
          content: content,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        setUploadedDocuments(prev => [...prev, processedDoc]);
      }

      toast({
        title: "Documents uploaded successfully",
        description: `${files.length} documents ready for translation`,
      });
      
      event.target.value = '';
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

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast({
      title: "Document removed",
      description: "Document has been removed from the list"
    });
  };

  const translateDocument = async (document: UploadedDocument) => {
    if (!targetLanguage) {
      toast({
        title: "Select Language",
        description: "Please select a target language first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const languageName = languages.find(lang => lang.value === targetLanguage)?.label || targetLanguage;
      const prompt = `You are a legal translation expert specializing in Indian languages. Provide accurate translations of legal documents while maintaining legal terminology and formal tone.

Translate the following document content into ${languageName}, maintaining legal terminology and formal tone:

Document: ${document.filename}
Content: "${document.content}"

Please ensure:
1. Legal terms are correctly translated
2. Formal legal language is maintained
3. Context and meaning are preserved
4. Technical legal concepts are accurately conveyed
5. The translation is suitable for legal documents

Provide only the translation without additional commentary.`;

      const result = await askPuter(prompt);

      setTranslatedText(result);
      setInputText(`Document: ${document.filename}\n\nOriginal Content:\n${document.content}`);
      
      toast({
        title: "Translation Complete",
        description: `${document.filename} translated to ${languageName}.`
      });
    } catch (error) {
      console.error('Error translating document:', error);
      toast({
        title: "Error",
        description: "Failed to translate document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim() || !targetLanguage) {
      toast({
        title: "Missing Information",
        description: "Please enter text and select a target language.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const languageName = languages.find(lang => lang.value === targetLanguage)?.label || targetLanguage;
      const prompt = `You are a legal translation expert specializing in Indian languages. Provide accurate translations of legal documents while maintaining legal terminology and formal tone.

Translate the following legal text into ${languageName}, maintaining legal terminology accuracy and formal tone:

"${inputText}"

Please ensure:
1. Legal terms are correctly translated
2. Formal legal language is maintained
3. Context and meaning are preserved
4. Technical legal concepts are accurately conveyed
5. The translation is suitable for legal documents

Provide only the translation without additional commentary.`;

      const result = await askPuter(prompt);

      setTranslatedText(result);
      toast({
        title: "Translation Complete",
        description: `Text translated to ${languageName}.`
      });
    } catch (error) {
      console.error('Error translating text:', error);
      toast({
        title: "Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTranslation = () => {
    if (!translatedText) return;

    const content = `Translation Result\n\nOriginal:\n${inputText}\n\nTranslated to ${languages.find(lang => lang.value === targetLanguage)?.label}:\n${translatedText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Translation downloaded as text file."
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Copied!",
      description: "Translation copied to clipboard."
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Multi-Language Support</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents for Translation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Upload documents (PDF, DOCX, TXT, JPG, PNG) for translation
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
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </label>
              </Button>
            </div>

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
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Document {index + 1}: {doc.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => translateDocument(doc)}
                          disabled={isLoading || !targetLanguage}
                          size="sm"
                          variant="outline"
                        >
                          Translate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translate Text or Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text to Translate</label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter legal text, document, or response to translate..."
                rows={6}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Language</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose target language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleTranslate} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate Text"
              )}
            </Button>
          </CardContent>
        </Card>

        {translatedText && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Translation Result</CardTitle>
              <div className="flex gap-2">
                <Button onClick={downloadTranslation} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  Copy Translation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <Textarea
                  value={translatedText}
                  onChange={(e) => setTranslatedText(e.target.value)}
                  className="min-h-64 font-sans text-sm leading-relaxed border-none bg-transparent resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiLanguageSupport;
