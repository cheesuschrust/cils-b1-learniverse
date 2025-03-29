
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader2, Volume, Info } from "lucide-react";
import ConfidenceIndicator from "@/components/ai/ConfidenceIndicator";
import SpeakableWord from "@/components/learning/SpeakableWord";
import { FlashcardPronunciation } from "@/components/flashcards/FlashcardPronunciation";

const SpeakingPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [confidenceLevel, setConfidenceLevel] = useState(75);
  const [volume, setVolume] = useState(50);
  const [useAIAnalysis, setUseAIAnalysis] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'it-IT', label: 'Italian (IT)' },
    { value: 'es-ES', label: 'Spanish (ES)' },
    { value: 'fr-FR', label: 'French (FR)' },
    { value: 'de-DE', label: 'German (DE)' },
  ];

  const startRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }

        setIsAudioPlaying(true);
        setIsRecording(false);

        // Simulate transcription (replace with actual transcription logic)
        setTimeout(() => {
          setTranscription('This is a sample transcription of your speech.');
          setIsLoading(false);
        }, 2000);
        setIsLoading(true);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Speaking Practice</h1>

      <div className="mb-4">
        <Label htmlFor="language">Select Language</Label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-md text-white ${isRecording ? 'bg-red-600' : 'bg-blue-500 hover:bg-blue-700'
            } focus:outline-none`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
          {isLoading && <Loader2 className="ml-2 inline-block animate-spin" size={16} />}
        </button>

        {audioRef.current?.src && (
          <div className="mt-4">
            <button
              className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700 focus:outline-none mr-2"
              onClick={playAudio}
              disabled={isAudioPlaying}
            >
              Play
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-700 focus:outline-none"
              onClick={pauseAudio}
              disabled={!isAudioPlaying}
            >
              Pause
            </button>
          </div>
        )}

        <audio ref={audioRef} hidden controls />
      </div>

      <div className="mb-4">
        <Label htmlFor="volume">Volume</Label>
        <div className="flex items-center space-x-2">
          <Volume className="text-gray-500" size={16} />
          <Slider
            id="volume"
            defaultValue={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="w-64"
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="ai-analysis">
          Use AI Analysis
          <Switch id="ai-analysis" checked={useAIAnalysis} onCheckedChange={setUseAIAnalysis} className="ml-2" />
        </Label>
      </div>

      {useAIAnalysis && (
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <ConfidenceIndicator contentType="speaking" score={75} />
          </div>
        </div>
      )}

      {transcription && (
        <div className="mb-4">
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p>Transcription:</p>
              <SpeakableWord text={transcription} language={selectedLanguage} />
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default SpeakingPage;
