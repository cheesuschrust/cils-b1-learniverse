
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, Play, StopCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/components/ui/use-toast';

const SpeakingModule: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { recognizeSpeech, compareTexts, isProcessing } = useAI();
  
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [promptText, setPromptText] = useState('Mi chiamo Marco. Sono uno studente di italiano. Piacere di conoscerti!');
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [practiceMode, setPracticeMode] = useState<'repeat' | 'conversation'>('repeat');
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioChunks(chunks);
        
        try {
          // Process the audio with speech-to-text
          const text = await recognizeSpeech(audioBlob);
          setTranscript(text);
          
          // Compare with prompt text if in repeat mode
          if (practiceMode === 'repeat') {
            const score = await compareTexts(promptText, text);
            setSimilarity(score);
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          toast({
            title: "Error Processing Audio",
            description: "There was a problem processing your recording.",
            variant: "destructive"
          });
        }
      };
      
      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access Error",
        description: "Please allow microphone access to use the speaking practice.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const playPrompt = () => {
    // Text-to-speech functionality would be implemented here
    const utterance = new SpeechSynthesisUtterance(promptText);
    utterance.lang = "it-IT";
    speechSynthesis.speak(utterance);
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Italian Speaking Practice</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Practice Mode</CardTitle>
          <CardDescription>Choose how you want to practice your Italian speaking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              variant={practiceMode === 'repeat' ? "default" : "outline"} 
              onClick={() => setPracticeMode('repeat')}
            >
              Repeat Phrases
            </Button>
            <Button 
              variant={practiceMode === 'conversation' ? "default" : "outline"} 
              onClick={() => setPracticeMode('conversation')}
            >
              Conversation Practice
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Speak Italian</CardTitle>
            <CardDescription>
              {practiceMode === 'repeat' 
                ? 'Listen and repeat the Italian phrase' 
                : 'Practice speaking Italian in a conversation'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {practiceMode === 'repeat' ? 'Phrase to repeat:' : 'Conversation topic:'}
              </label>
              <div className="p-3 bg-muted rounded-md relative">
                <p className="italic">{promptText}</p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute right-2 top-2"
                  onClick={playPrompt}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center my-8">
              {recording ? (
                <Button 
                  size="lg" 
                  variant="destructive"
                  className="rounded-full p-8"
                  onClick={stopRecording}
                >
                  <StopCircle className="h-8 w-8" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="rounded-full bg-primary p-8"
                  onClick={startRecording}
                >
                  <Mic className="h-8 w-8" />
                </Button>
              )}
            </div>
            
            {isProcessing && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Processing audio...</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Click the microphone button and start speaking in Italian
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Speech</CardTitle>
            <CardDescription>
              Recorded audio and transcription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {audioURL && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your recording:</label>
                <audio controls src={audioURL} className="w-full" />
              </div>
            )}
            
            {transcript && (
              <div>
                <label className="block text-sm font-medium mb-2">Transcription:</label>
                <div className="p-3 bg-muted rounded-md">
                  <p>{transcript}</p>
                </div>
              </div>
            )}
            
            {similarity !== null && practiceMode === 'repeat' && (
              <div>
                <label className="block text-sm font-medium mb-2">Accuracy:</label>
                <div className="bg-muted rounded-md p-3">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${similarity * 100}%` }} 
                    />
                  </div>
                  <p className="mt-2 text-center">
                    {similarity < 0.3 ? 'Try again' : 
                     similarity < 0.6 ? 'Getting better' : 
                     similarity < 0.8 ? 'Good job!' : 
                     'Excellent!'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeakingModule;
