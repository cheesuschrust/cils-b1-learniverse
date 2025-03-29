
import React from 'react';
import { useAIUtils } from '@/hooks/useAIUtils';
import { Alert } from "@/components/ui/alert";

interface ListeningExercise {
  audio: {
    transcript: string;
  };
}

const ListeningPage: React.FC = () => {
  const { speakText } = useAIUtils();
  const currentExercise: ListeningExercise = {
    audio: {
      transcript: "Sample text for listening practice"
    }
  };

  const handleSpeak = async () => {
    try {
      await speakText(currentExercise.audio.transcript, 'it');
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Listening Practice</h1>
      <Alert>Click play to start the listening exercise</Alert>
    </div>
  );
};

export default ListeningPage;
