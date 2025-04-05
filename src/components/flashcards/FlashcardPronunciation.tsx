
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, Play, Square, Volume2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface FlashcardPronunciationProps {
  text: string;
  language?: string;
  onScoreUpdate?: (score: number) => void;
}

const FlashcardPronunciation: React.FC<FlashcardPronunciationProps> = ({ text, language = 'italian', onScoreUpdate }) => {
  const { speak, compareTexts, transcribeSpeech } = useAI();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userRecording, setUserRecording] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Play the correct pronunciation
  const handlePlay = async () => {
    if (isPlaying || !speak) return;
    
    setIsPlaying(true);
    try {
      await speak(text, { language });
    } finally {
      setIsPlaying(false);
    }
  };
  
  // Start recording user's pronunciation
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Your browser does not support audio recording');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        if (transcribeSpeech) {
          try {
            const { text: transcribedText } = await transcribeSpeech(audioBlob);
            setUserRecording(transcribedText);
            
            if (compareTexts) {
              const { similarity } = await compareTexts(text, transcribedText);
              const score = Math.round(similarity * 100);
              setSimilarityScore(score);
              
              if (onScoreUpdate) {
                onScoreUpdate(score);
              }
            }
          } catch (error) {
            console.error('Error processing speech:', error);
          }
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };
  
  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-md bg-muted/20">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Practice Pronunciation</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlay}
          disabled={isPlaying}
          className="flex items-center gap-2"
        >
          {isPlaying ? <Volume2 className="animate-pulse" /> : <Play size={16} />}
          <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
        </Button>
      </div>
      
      <div className="text-center italic text-lg my-2 p-2 bg-muted/30 rounded">
        {text}
      </div>
      
      <div className="flex justify-center gap-2">
        {isRecording ? (
          <Button
            variant="destructive"
            onClick={handleStopRecording}
            className="flex items-center gap-2"
          >
            <Square size={16} />
            <span>Stop Recording</span>
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleStartRecording}
            className="flex items-center gap-2"
          >
            <Mic size={16} />
            <span>Record Your Voice</span>
          </Button>
        )}
      </div>
      
      {userRecording && (
        <div className="space-y-2 mt-2">
          <div className="p-2 bg-muted/30 rounded text-center">
            <p className="font-medium">You said:</p>
            <p className="italic">{userRecording}</p>
          </div>
          
          {similarityScore !== null && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Accuracy</span>
                <span className="font-semibold">{similarityScore}%</span>
              </div>
              <Progress value={similarityScore} className="h-2" />
              
              <div className="mt-2 text-sm">
                {similarityScore >= 85 ? (
                  <p className="text-green-600">Excellent pronunciation!</p>
                ) : similarityScore >= 60 ? (
                  <p className="text-yellow-600">Good effort, keep practicing!</p>
                ) : (
                  <p className="text-red-600">Try listening again and repeating slowly.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardPronunciation;
