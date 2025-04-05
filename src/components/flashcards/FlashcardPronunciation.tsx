
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
      
      // Listen for data available event
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      // Listen for stop event to process recording
      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (transcribeSpeech) {
          try {
            const transcriptionResult = await transcribeSpeech(audioBlob);
            const transcribedText = typeof transcriptionResult === 'string' 
              ? transcriptionResult 
              : transcriptionResult.text;

            setUserRecording(transcribedText);
            
            // Compare with original text if compareTexts is available
            if (compareTexts) {
              const comparisonResult = await compareTexts(text.toLowerCase(), transcribedText.toLowerCase());
              const similarity = typeof comparisonResult === 'number' 
                ? comparisonResult 
                : comparisonResult.similarity;

              setSimilarityScore(similarity * 100);
              
              if (onScoreUpdate) {
                onScoreUpdate(similarity * 100);
              }
            }
          } catch (error) {
            console.error('Error processing recording:', error);
            alert('Error processing your recording. Please try again.');
          }
        }
      });
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions and try again.');
    }
  };
  
  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks in the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
    }
  };
  
  return (
    <div className="flashcard-pronunciation p-4 border rounded-lg shadow-sm">
      <h4 className="font-medium mb-4">Practice Pronunciation</h4>
      
      <div className="flex flex-col gap-4">
        {/* Original pronunciation */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={handlePlay} 
            disabled={isPlaying}
            variant="outline"
            size="sm"
          >
            {isPlaying ? 'Playing...' : 'Listen'} <Volume2 className="ml-2 h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">Listen to correct pronunciation</span>
        </div>
        
        {/* Recording controls */}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              variant="outline"
              size="sm"
              className="bg-red-50 hover:bg-red-100"
            >
              Record <Mic className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              variant="outline"
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Stop <Square className="ml-2 h-4 w-4" />
            </Button>
          )}
          <span className="text-sm text-gray-500">
            {isRecording ? 'Recording in progress...' : 'Record your pronunciation'}
          </span>
        </div>
        
        {/* Results */}
        {userRecording && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Your pronunciation:</div>
            <div className="p-3 bg-gray-50 rounded text-sm italic">"{userRecording}"</div>
            
            {similarityScore !== null && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Accuracy</span>
                  <span>{Math.round(similarityScore)}%</span>
                </div>
                <Progress value={similarityScore} className="h-2" />
                
                <div className="mt-3 text-sm">
                  {similarityScore >= 80 ? (
                    <span className="text-green-600">Excellent pronunciation!</span>
                  ) : similarityScore >= 60 ? (
                    <span className="text-yellow-600">Good pronunciation. Keep practicing!</span>
                  ) : (
                    <span className="text-red-600">Try again to improve your pronunciation.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardPronunciation;
