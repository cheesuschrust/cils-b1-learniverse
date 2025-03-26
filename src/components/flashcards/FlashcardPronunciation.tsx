
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Volume, StopCircle, Mic, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FlashcardPronunciationProps {
  text: string;
  language?: string;
  showTranscription?: boolean;
}

export const FlashcardPronunciation: React.FC<FlashcardPronunciationProps> = ({
  text,
  language = 'it-IT',
  showTranscription = false,
}) => {
  const { 
    speakText, 
    isSpeaking, 
    cancelSpeech, 
    processAudioStream, 
    stopAudioProcessing, 
    isTranscribing, 
    isAIEnabled 
  } = useAIUtils();
  const { toast } = useToast();
  const [userPronunciation, setUserPronunciation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSpeak = async () => {
    try {
      setError(null);
      await speakText(text, language);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to speak text');
    }
  };
  
  const handleRecord = async () => {
    if (!isAIEnabled) {
      toast({
        title: "Feature Disabled",
        description: "Speech recognition requires AI features to be enabled.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setError(null);
      setIsRecording(true);
      
      const stopRecording = await processAudioStream((transcript, isFinal) => {
        if (isFinal) {
          setUserPronunciation(transcript);
          
          const similarity = calculateSimilarity(text.toLowerCase(), transcript.toLowerCase());
          const message = similarity > 0.7 
            ? "Great pronunciation!" 
            : similarity > 0.4 
              ? "Good attempt, keep practicing." 
              : "Try again, focus on the pronunciation.";
          
          toast({
            title: "Pronunciation Feedback",
            description: message,
          });
        }
      });
      
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
          setIsRecording(false);
        }
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setIsRecording(false);
    }
  };
  
  const handleStopRecording = () => {
    stopAudioProcessing();
    setIsRecording(false);
  };
  
  const calculateSimilarity = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    
    const distance = track[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  };
  
  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={isSpeaking ? cancelSpeech : handleSpeak}
          title={isSpeaking ? "Stop pronunciation" : "Listen to pronunciation"}
          className="w-28"
        >
          {isSpeaking ? (
            <>
              <StopCircle className="mr-1 h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Volume className="mr-1 h-4 w-4" />
              Listen
            </>
          )}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={isRecording ? handleStopRecording : handleRecord}
          disabled={!isAIEnabled}
          title={isRecording ? "Stop recording" : "Practice pronunciation"}
          className="w-28"
        >
          {isRecording || isTranscribing ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Recording...
            </>
          ) : (
            <>
              <Mic className="mr-1 h-4 w-4" />
              Practice
            </>
          )}
        </Button>
      </div>
      
      {showTranscription && userPronunciation && (
        <div className="text-sm text-muted-foreground mt-1">
          <p>Your pronunciation: <span className="font-medium">{userPronunciation}</span></p>
        </div>
      )}
    </div>
  );
};

export default FlashcardPronunciation;
