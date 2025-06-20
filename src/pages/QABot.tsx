
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, Bot } from "lucide-react";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";
import { useToast } from "@/hooks/use-toast";

const QABot = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("english");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "You need to ask a legal question to get an answer.",
        variant: "destructive",
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
      const prompt = `You are NyayaBot, a friendly Indian law assistant. Answer this legal question based on Indian law: "${question}". 

Please structure your response as:
1) Relevant Law/Section
2) Explanation  
3) Important Points
4) Practical Application

Respond in ${language}. Keep it comprehensive but easy to understand.`;

      const result = await callGeminiAPI(prompt, geminiKey);
      setResponse(result);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: "Failed to get response from NyayaBot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/tools")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-yellow-800" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">NyayaBot Q&A</h1>
          </div>
          <p className="text-blue-600 text-lg mb-6">
            Friendly Indian Law Assistant – ask your legal question!
          </p>
          
          <div className="flex justify-center gap-2 mb-8">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">IPC</Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">CRPC</Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">CONTRACT ACT</Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Ask a Legal Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="explain article 245"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] text-lg"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Output Language:</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !question.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Scale className="w-4 h-4 mr-2" />
                {isLoading ? "Getting Answer..." : "Get NyayaBot's Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-orange-600" />
                NyayaBot's Official Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {response}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QABot;
