
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import DocumentFormatter from "@/components/voice/DocumentFormatter";
import DocumentEditor from "@/components/legal/DocumentEditor";

const VoiceDictation = () => {
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState("");
  const [formattedDocument, setFormattedDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleDocumentFormatted = (document: string) => {
    setFormattedDocument(document);
    setShowEditor(true);
  };

  const handleDocumentChange = (document: string) => {
    setFormattedDocument(document);
  };

  const handleBackToRecording = () => {
    setShowEditor(false);
  };

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Voice Dictation → Legal Format</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {!showEditor ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Voice Recording</CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceRecorder 
                  onTranscriptionComplete={setTranscription}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>

            <DocumentFormatter
              transcription={transcription}
              setTranscription={setTranscription}
              onDocumentFormatted={handleDocumentFormatted}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </>
        ) : (
          <DocumentEditor
            document={formattedDocument}
            onDocumentChange={handleDocumentChange}
            onBack={handleBackToRecording}
            title="Voice Dictation Legal Document"
          />
        )}
      </div>
    </div>
  );
};

export default VoiceDictation;
