
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, StopCircle } from 'lucide-react';
import { useAIUtils } from '@/hooks/useAIUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface FlashcardPronunciationProps {
  text: string;
  language?: 'it' | 'en';
  showFeedback?: boolean;
  onPronunciationScore?: (score: number) => void;
  className?: string;
}

const FlashcardPronunciation: React.FC<FlashcardPronunciationProps> = ({
  text,
  language = 'it',
  showFeedback = true,
  onPronunciationScore,
  className = ''
}) => {
  const { isAIEnabled, speakText, isSpeaking, analyzePronunciation } = useAIUtils();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [pronunciationResult, setPronunciationResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  const handlePlayPronunciation = async () => {
    if (isSpeaking) return;
    try {
      await speakText(text, language);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    }
  };

  const startRecording = async () => {
    if (isRecording || !isAIEnabled) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        try {
          // Analyze pronunciation
          const result = await analyzePronunciation(text, audioBlob, language);
          setPronunciationResult(result);
          
          if (onPronunciationScore && result.score) {
            onPronunciationScore(result.score);
          }
          
          // Cleanup the stream tracks
          stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          console.error('Error analyzing pronunciation:', error);
          setPronunciationResult({
            score: 0,
            feedback: 'Error analyzing pronunciation'
          });
        }
      };
      
      recorder.start();
      setIsRecording(true);
      setAudioChunks([]);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const getPronunciationBadge = () => {
    if (!pronunciationResult) return null;
    
    const { score } = pronunciationResult;
    
    let variant = "outline";
    let label = "Poor";
    
    if (score >= 0.9) {
      variant = "default";
      label = "Excellent";
    } else if (score >= 0.75) {
      variant = "secondary";
      label = "Good";
    } else if (score >= 0.6) {
      variant = "outline";
      label = "Fair";
    } else {
      variant = "destructive";
      label = "Needs Work";
    }
    
    return (
      <Badge variant={variant as any}>
        {label} ({Math.round(score * 100)}%)
      </Badge>
    );
  };

  if (!isAIEnabled) return null;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlayPronunciation}
                disabled={isSpeaking}
              >
                <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Listen to pronunciation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isRecording ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stopRecording}
                  className="text-red-500 animate-pulse"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={startRecording}
                  disabled={isSpeaking}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRecording ? 'Stop recording' : 'Record your pronunciation'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {showFeedback && pronunciationResult && (
        <div className="flex flex-col items-center gap-1 mt-2">
          {getPronunciationBadge()}
          <p className="text-xs text-muted-foreground">{pronunciationResult.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default FlashcardPronunciation;
