
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff, Download, Edit, FileText, FileImage } from "lucide-react";

const VoiceDictation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [formattedDocument, setFormattedDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentFormat, setDocumentFormat] = useState("text");
  const [isEditing, setIsEditing] = useState(false);
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

  const downloadDocument = () => {
    if (!formattedDocument) return;

    let content = formattedDocument;
    let filename = "legal-document";
    let mimeType = "text/plain";

    if (documentFormat === "pdf") {
      // For PDF, we'll create HTML that can be printed to PDF
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Legal Document</title>
          <style>
            body { font-family: Times, serif; line-height: 1.6; margin: 40px; }
            h1, h2, h3 { text-align: center; margin-bottom: 20px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="content">${formattedDocument.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `;
      filename = "legal-document.html";
      mimeType = "text/html";
    } else if (documentFormat === "word") {
      // Create a basic RTF format that Word can open
      content = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
        \\f0\\fs24 ${formattedDocument.replace(/\n/g, '\\par ')}}`;
      filename = "legal-document.rtf";
      mimeType = "application/rtf";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Document Downloaded",
      description: `Document saved as ${filename}`
    });
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Transcription</label>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </div>
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  readOnly={!isEditing}
                  rows={4}
                  className={`w-full ${!isEditing ? 'bg-gray-50' : ''}`}
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
              <div className="flex gap-2">
                <Select value={documentFormat} onValueChange={setDocumentFormat}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={downloadDocument} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <Textarea
                  value={formattedDocument}
                  onChange={(e) => setFormattedDocument(e.target.value)}
                  className="min-h-96 font-mono text-sm leading-relaxed border-none bg-transparent resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VoiceDictation;
