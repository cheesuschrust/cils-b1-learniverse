
import React, { createContext, useState, useCallback, useContext } from 'react';
import { 
  AIUtilsContextType,
  AISettings,
  QuestionGenerationParams,
  AIGenerationResult
} from '@/types/core-types';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

// Create the context with a defined type
export const AIUtilsContext = createContext<AIUtilsContextType | null>(null);

// Default AI settings
const defaultAISettings: AISettings = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  showFeedback: true,
  defaultModelSize: 'medium',
  italianVoiceURI: '',
  englishVoiceURI: '',
  voiceRate: 1.0,
  voicePitch: 1.0,
  features: {
    contentGeneration: true,
    contentAnalysis: true,
    errorCorrection: true,
    personalization: true,
    pronunciationHelp: true,
    conversationalLearning: true,
    progressTracking: true,
    autoTranslation: true
  }
};

// Provider component
export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(defaultAISettings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  const { toast } = useToast();
  const { generateText, getConfidenceScore, error, isLoading, abort } = useAI();

  const updateSettings = useCallback((newSettings: AISettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const processContent = useCallback(async (prompt: string, options?: any) => {
    setIsProcessing(true);
    try {
      const result = await generateText(prompt, {
        model: settings.model,
        temperature: options?.temperature || settings.temperature,
        maxTokens: options?.maxTokens || settings.maxTokens,
        topP: options?.topP || settings.topP,
        frequencyPenalty: options?.frequencyPenalty || settings.frequencyPenalty,
        presencePenalty: options?.presencePenalty || settings.presencePenalty
      });
      return result;
    } catch (err) {
      console.error('Error processing content:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [generateText, settings]);

  const generateContent = useCallback(async (prompt: string, options?: any) => {
    return processContent(prompt, options);
  }, [processContent]);

  const speak = useCallback(async (text: string, language?: string): Promise<void> => {
    if (!text) return;
    
    setIsSpeaking(true);
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language preference based on the argument or settings
      if (language === 'italian') {
        utterance.voice = speechSynthesis.getVoices().find(
          voice => voice.voiceURI === settings.italianVoiceURI
        ) || null;
        utterance.lang = 'it-IT';
      } else {
        utterance.voice = speechSynthesis.getVoices().find(
          voice => voice.voiceURI === settings.englishVoiceURI
        ) || null;
        utterance.lang = 'en-US';
      }
      
      // Apply rate and pitch settings
      utterance.rate = settings.voiceRate || 1;
      utterance.pitch = settings.voicePitch || 1;
      
      // Return a promise that resolves when speech is complete
      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        utterance.onerror = (event) => {
          setIsSpeaking(false);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
        speechSynthesis.speak(utterance);
      });
    } catch (err) {
      setIsSpeaking(false);
      console.error('Speech synthesis error:', err);
      throw err;
    }
  }, [settings]);

  const speakText = useCallback((text: string, language?: string, onComplete?: () => void) => {
    speak(text, language)
      .then(() => {
        if (onComplete) onComplete();
      })
      .catch(err => {
        console.error('Error in speakText:', err);
        if (onComplete) onComplete();
      });
  }, [speak]);

  const processAudioStream = useCallback(async (stream: MediaStream): Promise<string> => {
    setIsTranscribing(true);
    try {
      // Placeholder implementation - in a real app this would connect to a speech recognition service
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "Speech transcription result";
    } catch (err) {
      console.error('Audio processing error:', err);
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const stopAudioProcessing = useCallback(() => {
    // Implementation depends on how audio processing was started
    setIsTranscribing(false);
  }, []);

  const checkMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasActiveMicrophone(true);
      return true;
    } catch (err) {
      console.error('Microphone access error:', err);
      setHasActiveMicrophone(false);
      return false;
    }
  }, []);

  const recognizeSpeech = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      setIsTranscribing(true);
      // Placeholder for speech recognition API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "Speech recognition result";
    } catch (err) {
      console.error('Speech recognition error:', err);
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const compareTexts = useCallback(async (text1: string, text2: string): Promise<number> => {
    // Calculate similarity score (0-100)
    return 85; // Placeholder value
  }, []);

  // Function to generate questions based on parameters
  const generateQuestions = useCallback(async (params: QuestionGenerationParams): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    try {
      // In a real application, this would call an actual API
      // For now, return mock data with the appropriate structure
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        questions: Array(params.count || 3).fill(null).map((_, i) => ({
          id: `question-${i}`,
          text: `Generated question ${i + 1} for ${params.contentTypes?.[0] || 'general'} at ${params.difficulty || 'intermediate'} level.`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "This is the explanation for the correct answer.",
          type: params.contentTypes?.[0] || 'grammar',
          difficulty: params.difficulty || params.italianLevel || 'intermediate',
          isCitizenshipRelevant: params.isCitizenshipFocused || false
        }))
      };
    } catch (err) {
      console.error('Error generating questions:', err);
      return {
        questions: [],
        error: err instanceof Error ? err.message : 'An unknown error occurred'
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Premium limits
  const remainingCredits = 100;
  const usageLimit = 1000;
  
  const resetCredits = useCallback(async () => {
    toast({
      title: "Credits Reset",
      description: "Your AI usage credits have been reset.",
      variant: "default"
    });
    return Promise.resolve();
  }, [toast]);

  // Check if AI features are enabled
  const isAIEnabled = settings.enabled !== false;

  const value: AIUtilsContextType = {
    processContent,
    settings,
    updateSettings,
    generateContent,
    speakText,
    isSpeaking,
    processAudioStream,
    stopAudioProcessing,
    isTranscribing,
    hasActiveMicrophone,
    checkMicrophoneAccess,
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit,
    resetCredits,
    speak,
    recognizeSpeech,
    compareTexts,
    isProcessing,
    isAIEnabled
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Custom hook for using the context
export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export default AIUtilsContext;
