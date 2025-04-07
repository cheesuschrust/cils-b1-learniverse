
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface PronunciationExercise {
  id: string;
  text: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
  tips?: string;
}

// Sample data - in a real app, this would come from Supabase
const sampleExercises: PronunciationExercise[] = [
  {
    id: "1",
    text: "Buongiorno, come stai?",
    translation: "Good morning, how are you?",
    difficulty: "beginner",
    tips: "Focus on the 'r' sound in 'buongiorno' and the intonation at the end of the question."
  },
  {
    id: "2",
    text: "Mi piacerebbe visitare Roma quest'anno.",
    translation: "I would like to visit Rome this year.",
    difficulty: "intermediate",
    tips: "Pay attention to the conditional tense 'piacerebbe' and the contraction in 'quest'anno'."
  },
  {
    id: "3",
    text: "Secondo me, il sistema di cittadinanza italiana è abbastanza complicato.",
    translation: "In my opinion, the Italian citizenship system is quite complicated.",
    difficulty: "advanced",
    tips: "Focus on the rhythm and connecting the words fluidly."
  }
];

const SpeakingModule: React.FC = () => {
  const [exercises, setExercises] = useState<PronunciationExercise[]>(sampleExercises);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const currentExercise = exercises[currentExerciseIndex];

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use the speaking module.",
        variant: "destructive"
      });
      return null;
    }
  };

  const startRecording = async () => {
    const stream = await requestMicrophonePermission();
    if (!stream) return;
    
    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordingUrl(audioUrl);
      
      // Generate mock feedback
      generateFeedback();
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    
    toast({
      title: "Recording Started",
      description: "Speak clearly into your microphone.",
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Release microphone
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
      
      toast({
        title: "Recording Stopped",
        description: "Your recording has been saved.",
      });
    }
  };

  const playRecording = () => {
    if (audioPlayerRef.current && recordingUrl) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const generateFeedback = () => {
    // In a real app, this would send the audio to an API for assessment
    // For now, we'll generate random feedback
    const feedbackOptions = [
      "Good pronunciation! Your accent is improving.",
      "Try to emphasize the vowels more, especially at the end of words.",
      "Good attempt, but pay attention to the rhythm of the sentence.",
      "Your intonation is good, but try to roll the 'r' sound more.",
      "Excellent! Your pronunciation is very clear."
    ];
    
    const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    setFeedback(randomFeedback);
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      resetRecording();
    } else {
      // End of exercises
      toast({
        title: "All Exercises Completed",
        description: "You've completed all the speaking exercises for now.",
      });
    }
  };

  const moveToPrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      resetRecording();
    }
  };

  const resetRecording = () => {
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }
    setAudioBlob(null);
    setRecordingUrl(null);
    setFeedback(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pronunciation Practice</CardTitle>
              <CardDescription>
                Speak clearly and practice your Italian pronunciation
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {currentExercise.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Practice This Phrase:</h3>
            <p className="text-xl font-medium">{currentExercise.text}</p>
            <p className="text-sm text-muted-foreground mt-2">{currentExercise.translation}</p>
          </div>
          
          {currentExercise.tips && (
            <div className="bg-muted/50 p-4 rounded-md border border-dashed">
              <h3 className="font-medium mb-2">Pronunciation Tips:</h3>
              <p className="text-sm">{currentExercise.tips}</p>
            </div>
          )}
          
          <div className="flex justify-center py-4">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="rounded-full h-16 w-16 p-0 flex items-center justify-center"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>
          
          {recordingUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <audio 
                  ref={audioPlayerRef} 
                  src={recordingUrl} 
                  onEnded={handleAudioEnded} 
                  className="hidden" 
                />
                <Button
                  variant="outline"
                  onClick={playRecording}
                  className="mr-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? "Pause" : "Play Recording"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetRecording}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              {feedback && (
                <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
                  <h3 className="font-medium mb-2">Feedback:</h3>
                  <p>{feedback}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={moveToPrevExercise}
            disabled={currentExerciseIndex === 0}
          >
            Previous Exercise
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </div>
          
          <Button
            variant="default"
            onClick={moveToNextExercise}
            disabled={currentExerciseIndex === exercises.length - 1 && !recordingUrl}
          >
            {currentExerciseIndex === exercises.length - 1 ? "Finish" : "Next Exercise"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SpeakingModule;
