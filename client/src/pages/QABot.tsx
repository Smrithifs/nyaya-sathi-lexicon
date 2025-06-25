
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { callGeminiAPI } from "@/utils/geminiApi";

const QABot = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: geminiKey } = useGeminiKey();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load chat history from local storage on component mount
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    // Save chat history to local storage whenever messages change
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key to use this feature.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      console.log('Processing Legal Q&A for:', userMessage);
      
      const systemInstruction = "You are an expert Indian legal assistant. Provide comprehensive legal answers for Indian law, including relevant sections, case law, and practical guidance where applicable.";
      
      const prompt = `${systemInstruction}

**User Question:** ${userMessage}

Please provide a comprehensive legal answer for Indian law, including relevant sections, case law, and practical guidance where applicable.

Format your response as:
1. 📜 **Legal Answer**
2. ✨ **Simplified Explanation**`;

      const result = await callGeminiAPI(prompt, geminiKey);

      setMessages(prev => [...prev, { role: "assistant", content: result }]);
      
      toast({
        title: "Response Generated",
        description: "Legal response generated using AI analysis"
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Legal AI Chatbot</h1>
      </div>

      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>Chat History</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : ""
                      }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar>
                        <AvatarImage src="/bot.png" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-md p-3 text-sm max-w-[75%] ${message.role === "user"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">
                        {message.content}
                      </pre>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <Avatar>
                      <AvatarImage src="/bot.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-md p-3 text-sm max-w-[75%] bg-gray-100 text-gray-800">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="mt-4">
          <Card>
            <CardContent className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Ask me anything about Indian law..."
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                Send
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QABot;
