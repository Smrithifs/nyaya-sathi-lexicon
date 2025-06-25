
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";
import DocumentUploader from "@/components/legal/DocumentUploader";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी (Hindi)", code: "hi" },
  { label: "ಕನ್ನಡ (Kannada)", code: "kn" },
  { label: "தமிழ் (Tamil)", code: "ta" },
  { label: "తెలుగు (Telugu)", code: "te" },
  { label: "मराठी (Marathi)", code: "mr" },
  { label: "ગુજરાતી (Gujarati)", code: "gu" },
  { label: "বাংলা (Bengali)", code: "bn" },
  { label: "ਪੰਜਾਬੀ (Punjabi)", code: "pa" },
  { label: "മലയാളം (Malayalam)", code: "ml" },
];

const MultiLanguageSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Missing Text",
        description: "Please enter text to translate.",
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
      const sourceLangLabel = languages.find(l => l.code === sourceLang)?.label || "English";
      const targetLangLabel = languages.find(l => l.code === targetLang)?.label || "Hindi";
      
      const systemInstruction = "You are a professional legal translator specializing in Indian legal documents and terminology. Maintain legal accuracy while translating.";
      
      const prompt = `${systemInstruction}

Translate the following legal text from ${sourceLangLabel} to ${targetLangLabel}:

"${sourceText}"

Please ensure:
1. Legal terminology is accurately translated
2. Maintain the formal legal tone and structure
3. Preserve legal concepts and meanings
4. Use appropriate legal language in the target language
5. Keep proper names, case citations, and legal references in original form where appropriate

Provide only the translation without additional explanations.`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setTranslatedText(result);
      toast({
        title: "Translation Complete",
        description: `Text translated from ${sourceLangLabel} to ${targetLangLabel}.`
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

  const handleDocumentUploaded = (extractedText: string) => {
    setSourceText(extractedText);
    setShowUploader(false);
    toast({
      title: "Document Processed",
      description: "Text has been extracted and added for translation."
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Multi-Language Support</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Legal Document Translation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Language</label>
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Language</label>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Text to Translate</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploader(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter legal text, document content, or legal terminology to translate..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

        {showUploader && (
          <DocumentUploader
            onDocumentProcessed={handleDocumentUploaded}
            onClose={() => setShowUploader(false)}
          />
        )}

        {translatedText && (
          <Card>
            <CardHeader>
              <CardTitle>Translation Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-md border">
                <p className="text-sm text-gray-600 mb-2">
                  Translated to {languages.find(l => l.code === targetLang)?.label}:
                </p>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {translatedText}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiLanguageSupport;
