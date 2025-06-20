
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import DocumentFormatter from "@/components/voice/DocumentFormatter";
import DocumentEditor from "@/components/voice/DocumentEditor";

const VoiceDictation = () => {
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState("");
  const [formattedDocument, setFormattedDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranscriptionComplete = (newTranscription: string) => {
    setTranscription(newTranscription);
  };

  const handleDocumentFormatted = (newDocument: string) => {
    setFormattedDocument(newDocument);
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
        <VoiceRecorder
          onTranscriptionComplete={handleTranscriptionComplete}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <DocumentFormatter
          transcription={transcription}
          setTranscription={setTranscription}
          onDocumentFormatted={handleDocumentFormatted}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <DocumentEditor
          formattedDocument={formattedDocument}
          setFormattedDocument={setFormattedDocument}
        />
      </div>
    </div>
  );
};

export default VoiceDictation;
