
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
  const [showTranscriptionEdit, setShowTranscriptionEdit] = useState(false);

  const handleDocumentFormatted = (document: string) => {
    setFormattedDocument(document);
    setShowEditor(true);
  };

  const handleDocumentChange = (document: string) => {
    setFormattedDocument(document);
  };

  const handleBackToRecording = () => {
    setShowEditor(false);
    setShowTranscriptionEdit(false);
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    setShowTranscriptionEdit(true);
  };

  const handleEditTranscription = () => {
    setShowTranscriptionEdit(true);
  };

  const handleTranscriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscription(e.target.value);
  };

  const handleSaveTranscription = () => {
    setShowTranscriptionEdit(false);
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
                  onTranscriptionComplete={handleTranscriptionComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>

            {/* Transcription Edit Section */}
            {transcription && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Transcribed Text</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleEditTranscription}
                    >
                      Edit Text
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showTranscriptionEdit ? (
                    <div className="space-y-4">
                      <textarea
                        value={transcription}
                        onChange={handleTranscriptionChange}
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        placeholder="Edit your transcribed text here..."
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveTranscription}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setShowTranscriptionEdit(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-md border">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {transcription}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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
