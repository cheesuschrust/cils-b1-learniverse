
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

const VoiceEnabledAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const { processAudioStream, stopAudioProcessing, isTranscribing, hasActiveMicrophone, speak, isSpeaking } = useAI();
  const { toast } = useToast();
  
  const microphoneRef = useRef<MediaStream | null>(null);
  
  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneRef.current = stream;
        setIsListening(true);
        
        processAudioStream(stream).then((result) => {
          if (result && result.text) {
            setTranscript(result.text);
            handleUserInput(result.text);
          }
        }).catch(error => {
          console.error("Error processing audio:", error);
          toast({
            title: "Error processing audio",
            description: "Please try again or check microphone permissions",
            variant: "destructive"
          });
        });
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast({
          title: "Microphone access denied",
          description: "Please enable microphone access to use voice features",
          variant: "destructive"
        });
      }
    }
  };
  
  const stopListening = () => {
    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop());
      microphoneRef.current = null;
    }
    stopAudioProcessing();
    setIsListening(false);
  };
  
  const handleUserInput = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // This is a placeholder for actual AI processing
      // In a real implementation, this would call a backend API
      setResponse("I'm sorry, I couldn't process that request right now. Voice response generation will be available soon.");
      
      if (!isMuted) {
        speak("I'm sorry, I couldn't process that request right now. Voice response generation will be available soon.");
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const resetConversation = () => {
    setTranscript('');
    setResponse('');
  };
  
  useEffect(() => {
    return () => {
      if (microphoneRef.current) {
        microphoneRef.current.getTracks().forEach(track => track.stop());
      }
      stopAudioProcessing();
    };
  }, [stopAudioProcessing]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Assistant</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {transcript && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">You said:</p>
            <p className="text-muted-foreground">{transcript}</p>
          </div>
        )}
        
        {isProcessing ? (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : response ? (
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm font-medium">Assistant:</p>
            <p>{response}</p>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Press the microphone button and speak to the assistant</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetConversation}
          disabled={!transcript && !response}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        
        <Button 
          onClick={toggleListening}
          disabled={isProcessing || !hasActiveMicrophone}
          variant={isListening ? "destructive" : "default"}
          className={isListening ? "animate-pulse" : ""}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Listening
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceEnabledAssistant;
