
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, FileText } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

interface DocumentFormatterProps {
  transcription: string;
  setTranscription: (transcription: string) => void;
  onDocumentFormatted: (document: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DocumentFormatter: React.FC<DocumentFormatterProps> = ({
  transcription,
  setTranscription,
  onDocumentFormatted,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);

  const formatDocument = async () => {
    if (!transcription.trim()) {
      toast({
        title: "No Transcription",
        description: "Please record audio first.",
        variant: "destructive"
      });
      return;
    }

    if (!geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key to use this feature.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const systemInstruction = "You are a legal document formatter specializing in Indian legal documents. Convert voice transcriptions into properly structured legal documents with correct formatting, language, and legal provisions.";
      
      const prompt = `${systemInstruction}

Convert the following voice transcription into a properly formatted legal document:

"${transcription}"

Please:
1. Structure it as a formal legal document appropriate for Indian courts
2. Add proper headings and sections (Title, Parties, Facts, Prayer, etc.)
3. Use appropriate legal language and terminology
4. Include standard legal formatting with numbered paragraphs
5. Add placeholder fields where specific details are needed
6. Ensure proper legal document structure with verification clause
7. Include relevant legal provisions and sections where applicable

Format it as a complete, professional legal petition/application.`;

      const result = await callGeminiAPI(prompt, geminiKey);

      onDocumentFormatted(result);
      toast({
        title: "Document Formatted",
        description: "Your voice input has been converted to a legal document."
      });
    } catch (error) {
      console.error('Error formatting document:', error);
      toast({
        title: "Error",
        description: "Failed to format document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!transcription) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Transcribed Text</label>
          <Button
            onClick={() => setIsEditingTranscription(!isEditingTranscription)}
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditingTranscription ? "Save" : "Edit"}
          </Button>
        </div>
        <Textarea
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          readOnly={!isEditingTranscription}
          rows={6}
          className={`w-full ${!isEditingTranscription ? 'bg-gray-50' : ''}`}
          placeholder="Your transcribed text will appear here..."
        />
        <Button 
          onClick={formatDocument} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Formatting Document...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Convert to Legal Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentFormatter;
