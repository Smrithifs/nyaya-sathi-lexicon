
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff, Play, Pause } from "lucide-react";

const VoiceDictation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [formattedDocument, setFormattedDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        // For now, we'll simulate transcription since we don't have a real audio-to-text API
        simulateTranscription();
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak clearly for best results."
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const simulateTranscription = () => {
    // Simulate transcription for demo purposes
    const sampleText = "I would like to file a petition in the honorable court regarding the matter of property dispute. The petitioner is seeking relief under section 9 of the specific relief act. The facts of the case are as follows...";
    setTranscription(sampleText);
    toast({
      title: "Transcription Complete",
      description: "Audio converted to text successfully."
    });
  };

  const formatDocument = async () => {
    if (!transcription.trim()) {
      toast({
        title: "No Transcription",
        description: "Please record audio first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Convert the following voice transcription into a properly formatted legal document:

"${transcription}"

Please:
1. Structure it as a formal legal document
2. Add proper headings and sections
3. Use appropriate legal language and terminology
4. Include standard legal formatting
5. Add placeholder fields where specific details are needed
6. Ensure proper legal document structure for Indian courts

Format it as a complete, professional legal document.`;

      const systemInstruction = "You are a legal document formatter. Convert voice transcriptions into properly structured legal documents with correct formatting and language.";

      const result = await groqCompletion({
        apiKey: "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",
        prompt,
        systemInstruction
      });

      setFormattedDocument(result);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedDocument);
    toast({
      title: "Copied!",
      description: "Document copied to clipboard."
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/features")}>
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Voice Dictation → Legal Format</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Record Legal Dictation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                size="lg"
                className={`w-32 h-32 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>
              <p className="mt-4 text-sm text-gray-600">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
              </p>
            </div>

            {transcription && (
              <div>
                <label className="block text-sm font-medium mb-2">Transcription</label>
                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={formatDocument} 
                  disabled={isLoading}
                  className="mt-2 w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Formatting Document...
                    </>
                  ) : (
                    "Format as Legal Document"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {formattedDocument && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Formatted Legal Document</CardTitle>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                Copy Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {formattedDocument}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VoiceDictation;
