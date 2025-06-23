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
import { searchIndianKanoon, getIndianKanoonDocument } from "@/utils/indianKanoonApi";

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
      
      // Check if this is a section-related query
      let legalOutput = "";
      let indianKanoonResults = [];
      
      try {
        // Search Indian Kanoon for relevant legal documents
        indianKanoonResults = await searchIndianKanoon(userMessage);
        
        if (indianKanoonResults.length > 0) {
          // Get detailed content from top result
          const topResult = indianKanoonResults[0];
          const doc = await getIndianKanoonDocument(topResult.tid);
          
          if (doc && doc.content) {
            legalOutput = `📘 **Legal Output (Indian Kanoon):**\n\n**${doc.title}**\n${doc.citation ? `Citation: ${doc.citation}` : ''}\n\n${doc.content.substring(0, 2000)}...`;
          }
        }
      } catch (indianKanoonError) {
        console.warn('Indian Kanoon API error:', indianKanoonError);
      }

      // Prepare enhanced prompt for Gemini
      const systemInstruction = "You are an expert Indian legal assistant. Use the provided legal documents to answer questions accurately. Always cite sources when available.";
      
      const enhancedPrompt = legalOutput 
        ? `${systemInstruction}

**Legal Context from Indian Kanoon:**
${legalOutput}

**User Question:** ${userMessage}

Please provide:
1. 📜 **Legal Answer** (based on the provided legal content)
2. ✨ **Simplified Explanation** (in plain language for non-lawyers)

Use the actual legal content provided above to give accurate answers about Indian law.`
        : `${systemInstruction}

**User Question:** ${userMessage}

Please provide a comprehensive legal answer for Indian law, including relevant sections, case law, and practical guidance where applicable.

Format your response as:
1. 📜 **Legal Answer**
2. ✨ **Simplified Explanation**`;

      const result = await callGeminiAPI(enhancedPrompt, geminiKey);

      let responseContent = result;
      
      // If we have Indian Kanoon results, add them as additional context
      if (indianKanoonResults.length > 0) {
        const formattedResults = indianKanoonResults.slice(0, 3).map(result => 
          `• **${result.title}**${result.citation ? ` (${result.citation})` : ''}\n  ${result.snippet}`
        ).join('\n\n');
        
        responseContent = `${result}\n\n---\n**📚 Additional Legal Sources:**\n\n${formattedResults}`;
      }

      setMessages(prev => [...prev, { role: "assistant", content: responseContent }]);
      
      toast({
        title: "Response Generated",
        description: indianKanoonResults.length > 0 
          ? `Enhanced with ${indianKanoonResults.length} legal sources from Indian Kanoon`
          : "Generated response using AI analysis"
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
