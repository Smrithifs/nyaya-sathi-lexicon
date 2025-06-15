
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MultiLanguageSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const prompt = `Translate the following legal text into ${languageName}, maintaining legal terminology accuracy and formal tone:

"${inputText}"

Please ensure:
1. Legal terms are correctly translated
2. Formal legal language is maintained
3. Context and meaning are preserved
4. Technical legal concepts are accurately conveyed
5. The translation is suitable for legal documents

Provide only the translation without additional commentary.`;

      const systemInstruction = "You are a legal translation expert specializing in Indian languages. Provide accurate translations of legal documents while maintaining legal terminology and formal tone.";

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Copied!",
      description: "Translation copied to clipboard."
    });
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
            <CardTitle>Translate Legal Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text to Translate</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter legal text, document, or response to translate..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                Copy Translation
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {translatedText}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiLanguageSupport;
