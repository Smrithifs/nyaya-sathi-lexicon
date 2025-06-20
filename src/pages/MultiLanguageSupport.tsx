
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Download, Languages, FileText, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { askPuter } from "@/utils/openaiApi";

const MultiLanguageSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState("");

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिंदी)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
    { code: "as", name: "Assamese (অসমীয়া)" }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    
    try {
      const fileText = await file.text();
      setDocumentContent(fileText);
      setInputText(fileText);
      
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to read the document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const translateText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text",
        description: "Please enter text to translate or upload a document.",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const sourceLang = languages.find(l => l.code === sourceLanguage)?.name || "English";
      const targetLang = languages.find(l => l.code === targetLanguage)?.name || "Hindi";

      const prompt = `You are a professional legal translator specializing in Indian legal documents and terminology. 

Translate the following legal text from ${sourceLang} to ${targetLang}:

"${inputText}"

Requirements:
1. Maintain all legal terminology accuracy
2. Preserve the formal legal language structure
3. Keep proper nouns, case citations, and legal section references intact
4. Ensure cultural and jurisdictional context is appropriate for Indian legal system
5. Maintain the original formatting and structure
6. Use appropriate legal equivalents in the target language

Provide only the translated text without any explanations or additional commentary.`;

      const result = await askPuter(prompt);
      setTranslatedText(result);
      
      toast({
        title: "Translation Complete",
        description: `Text translated from ${sourceLang} to ${targetLang} successfully.`
      });
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const downloadTranslation = () => {
    if (!translatedText) return;

    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated_document_${targetLanguage}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Translated document has been downloaded."
    });
  };

  const swapLanguages = () => {
    const tempSource = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempSource);
    
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/features")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Languages className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Multi-Language Support</h1>
            <p className="text-gray-600">Translate legal documents and text between Indian languages</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Source Document</span>
                <div className="flex items-center gap-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Source Language</Label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {uploadedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {uploadedFile.name}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Enter Text or Upload Document</Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter legal text to translate or upload a document..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Translated Document</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapLanguages}
                    disabled={isTranslating}
                  >
                    ⇄ Swap
                  </Button>
                  {translatedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadTranslation}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Language</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Translated Text</Label>
                <Textarea
                  value={translatedText}
                  onChange={(e) => setTranslatedText(e.target.value)}
                  placeholder="Translated text will appear here..."
                  rows={12}
                  className="font-mono text-sm bg-gray-50"
                />
              </div>

              <Button
                onClick={translateText}
                disabled={isTranslating || !inputText.trim()}
                className="w-full"
                size="lg"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4 mr-2" />
                    Translate Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Translation Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Legal Accuracy</p>
                  <p className="text-gray-600">Maintains legal terminology and context</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Document Upload</p>
                  <p className="text-gray-600">Supports .txt, .doc, and .docx files</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Indian Languages</p>
                  <p className="text-gray-600">Supports 12 major Indian languages</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiLanguageSupport;
