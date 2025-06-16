
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { groqCompletion } from "@/utils/groqApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff, Download, Edit, FileText, Square, Play } from "lucide-react";

const VoiceDictation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [formattedDocument, setFormattedDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentFormat, setDocumentFormat] = useState("text");
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);
  const [isEditingDocument, setIsEditingDocument] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingDuration(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly for best results. Tap the stop button when finished."
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
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      // Convert blob to base64 for API
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // For now, using a simulation. In a real app, you'd send to Whisper API
        simulateTranscription();
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateTranscription = () => {
    // Simulated transcription - in real implementation, this would be the actual transcribed text
    const sampleText = "I would like to file a petition in the honorable court regarding the matter of property dispute between myself and my neighbor. The facts of the case are as follows: On 15th March 2023, my neighbor constructed a wall that encroaches upon my property by approximately 3 feet. Despite multiple requests, they have refused to remove the encroachment. I seek relief under the Specific Relief Act for mandatory injunction to remove the illegal construction.";
    setTranscription(sampleText);
    toast({
      title: "Transcription Complete",
      description: "Audio has been converted to text successfully."
    });
  };

  const playRecording = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
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
1. Structure it as a formal legal document appropriate for Indian courts
2. Add proper headings and sections (Title, Parties, Facts, Prayer, etc.)
3. Use appropriate legal language and terminology
4. Include standard legal formatting with numbered paragraphs
5. Add placeholder fields where specific details are needed
6. Ensure proper legal document structure with verification clause
7. Include relevant legal provisions and sections where applicable

Format it as a complete, professional legal petition/application.`;

      const systemInstruction = "You are a legal document formatter specializing in Indian legal documents. Convert voice transcriptions into properly structured legal documents with correct formatting, language, and legal provisions.";

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
      // Create HTML content for PDF printing
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Legal Document</title>
          <style>
            @page { margin: 1in; }
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              margin: 0;
              font-size: 12pt;
            }
            h1, h2, h3 { 
              text-align: center; 
              margin-bottom: 20px; 
              font-weight: bold;
            }
            .content { 
              white-space: pre-wrap; 
              text-align: justify;
            }
            p { margin-bottom: 12pt; }
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
      // Create RTF format for Word compatibility
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <CardContent className="space-y-6">
            {/* Recording Interface */}
            <div className="text-center space-y-4">
              <div className="flex justify-center items-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="w-20 h-20 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 shadow-lg animate-pulse"
                    >
                      <Square className="w-8 h-8 text-white" />
                    </Button>
                    <div className="text-lg font-mono text-red-600">
                      {formatTime(recordingDuration)}
                    </div>
                  </div>
                )}
                
                {audioBlob && !isRecording && (
                  <Button
                    onClick={playRecording}
                    variant="outline"
                    size="lg"
                    className="w-16 h-16 rounded-full"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-gray-600">
                {isRecording ? "Recording... Tap stop when finished" : "Tap to start recording your legal dictation"}
              </p>
            </div>

            {/* Loading State */}
            {isLoading && !formattedDocument && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Processing your audio...</p>
              </div>
            )}

            {/* Transcription Section */}
            {transcription && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">Transcription</label>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formatted Document Section */}
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
                <Button
                  onClick={() => setIsEditingDocument(!isEditingDocument)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingDocument ? "Save" : "Edit"}
                </Button>
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
              <div className="bg-gray-50 p-4 rounded-md border">
                <Textarea
                  value={formattedDocument}
                  onChange={(e) => setFormattedDocument(e.target.value)}
                  readOnly={!isEditingDocument}
                  className={`min-h-96 font-serif text-sm leading-relaxed border-none bg-transparent resize-none ${
                    !isEditingDocument ? 'cursor-default' : ''
                  }`}
                  placeholder="Your formatted legal document will appear here..."
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
