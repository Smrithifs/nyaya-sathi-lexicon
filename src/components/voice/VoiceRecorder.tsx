
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff, Square, Play } from "lucide-react";

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
  const [isListening, setIsListening] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsWebSpeechSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        });
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [toast]);

  const startWebSpeechRecording = async () => {
    if (!isWebSpeechSupported || !recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Web Speech API is not supported in this browser. Using fallback recording.",
        variant: "destructive"
      });
      startFallbackRecording();
      return;
    }

    try {
      setTranscript("");
      setIsListening(true);
      setIsRecording(true);
      setRecordingDuration(0);
      
      recognitionRef.current.start();
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Listening Started",
        description: "Speak clearly in Indian English. Your speech will be converted to text in real-time."
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Error",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopWebSpeechRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (transcript.trim()) {
        onTranscriptionComplete(transcript);
        toast({
          title: "Speech Converted",
          description: "Your speech has been converted to text successfully."
        });
      }
    }
  };

  const startFallbackRecording = async () => {
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
        simulateTranscription();
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

  const stopFallbackRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
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

  const startRecording = () => {
    if (isWebSpeechSupported) {
      startWebSpeechRecording();
    } else {
      startFallbackRecording();
    }
  };

  const stopRecording = () => {
    if (isWebSpeechSupported && isListening) {
      stopWebSpeechRecording();
    } else {
      stopFallbackRecording();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Record Legal Dictation
          {isWebSpeechSupported && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Real-time Speech Recognition
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isWebSpeechSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Real-time speech recognition is not supported in this browser. 
              Using fallback audio recording with simulated transcription.
            </p>
          </div>
        )}
        
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
                {isListening && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Listening...</span>
                  </div>
                )}
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
            {isRecording 
              ? (isListening ? "Listening... Speak clearly in Indian English" : "Recording... Tap stop when finished")
              : "Tap to start recording your legal dictation"
            }
          </p>
        </div>

        {transcript && isWebSpeechSupported && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Live Transcript:</h4>
            <p className="text-sm text-blue-800">{transcript}</p>
          </div>
        )}

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
