
import React, { useState } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, MicOff, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FlashcardPronunciationProps {
  italian: string;
  showScore?: boolean;
}

const FlashcardPronunciation: React.FC<FlashcardPronunciationProps> = ({
  italian,
  showScore = true
}) => {
  const { speak, recognizeSpeech, compareTexts } = useAIUtils();
  
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  
  const MAX_RECORDING_SECONDS = 5;
  
  const playWord = async () => {
    await speak(italian, 'it');
  };
  
  const startRecording = async () => {
    try {
      // Reset state
      setSimilarityScore(null);
      setRecordingProgress(0);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const audioChunks: BlobPart[] = [];
      
      // Save audio chunks
      recorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      // When recording stops
      recorder.addEventListener('stop', async () => {
        setIsRecording(false);
        setProcessing(true);
        
        // Create audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        try {
          // Convert speech to text
          const transcription = await recognizeSpeech(audioBlob);
          
          // Compare transcription with expected text
          const similarity = await compareTexts(italian.toLowerCase(), transcription.toLowerCase());
          setSimilarityScore(similarity);
        } catch (error) {
          console.error('Error processing speech:', error);
        } finally {
          setProcessing(false);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        }
      });
      
      // Start recording
      recorder.start();
      setIsRecording(true);
      
      // Setup timer for progress bar
      let elapsed = 0;
      const timer = setInterval(() => {
        elapsed += 0.1;
        const progress = (elapsed / MAX_RECORDING_SECONDS) * 100;
        setRecordingProgress(progress);
        
        if (elapsed >= MAX_RECORDING_SECONDS) {
          clearInterval(timer);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 100);
      
      setRecordingTimer(timer);
      
      // Auto-stop after max duration
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, MAX_RECORDING_SECONDS * 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
  };
  
  const getSimilarityLabel = (score: number): string => {
    if (score >= 0.9) return 'Excellent!';
    if (score >= 0.8) return 'Very good';
    if (score >= 0.7) return 'Good';
    if (score >= 0.6) return 'Fair';
    if (score >= 0.5) return 'Needs practice';
    return 'Keep trying';
  };
  
  const getSimilarityColor = (score: number): string => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.7) return 'text-yellow-500';
    if (score >= 0.6) return 'text-orange-500';
    return 'text-red-500';
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={playWord}
          className="flex-none"
        >
          <Volume2 className="h-4 w-4 mr-1" />
          Listen
        </Button>
        
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={processing}
          className="flex-none"
        >
          {isRecording ? (
            <>
              <MicOff className="h-4 w-4 mr-1" />
              Stop
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-1" />
              Record
            </>
          )}
        </Button>
        
        {(isRecording || processing) && (
          <div className="flex-1">
            <Progress value={recordingProgress} className="h-2" />
          </div>
        )}
      </div>
      
      {showScore && similarityScore !== null && (
        <div className="flex items-center gap-2 text-sm">
          <div className="font-medium">Pronunciation:</div>
          <div className={`flex items-center ${getSimilarityColor(similarityScore)}`}>
            {similarityScore >= 0.7 ? 
              <Check className="h-4 w-4 mr-1" /> : 
              <X className="h-4 w-4 mr-1" />
            }
            {getSimilarityLabel(similarityScore)} 
            ({Math.round(similarityScore * 100)}%)
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPronunciation;
