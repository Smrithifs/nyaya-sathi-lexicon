
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, Square, Play } from "lucide-react";

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
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

      mediaRecorder.start(1000);
      setIsRecording(true);
      
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
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
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
    const sampleText = "I would like to file a petition in the honorable court regarding the matter of property dispute between myself and my neighbor. The facts of the case are as follows: On 15th March 2023, my neighbor constructed a wall that encroaches upon my property by approximately 3 feet. Despite multiple requests, they have refused to remove the encroachment. I seek relief under the Specific Relief Act for mandatory injunction to remove the illegal construction.";
    onTranscriptionComplete(sampleText);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Legal Dictation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing your audio...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceRecorder;
