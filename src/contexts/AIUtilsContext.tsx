import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import AIService from '@/services/AIService';
import { ContentType, AISettings } from '@/types';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { AIUtilsContextType } from '@/types/app-types';

// Default AI settings
const DEFAULT_AI_SETTINGS: AISettings = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  defaultModelSize: 'medium',
  features: {
    contentGeneration: true,
    contentAnalysis: true,
    errorCorrection: true,
    personalization: true,
    pronunciationHelp: true,
    conversationalLearning: true, 
    progressTracking: true,
    difficultyAdjustment: true,
    languageTranslation: true,
    flashcards: true,
    questions: true,
    listening: true,
    speaking: true,
    writing: true,
    translation: true,
    explanation: true,
    correction: true,
    simplified: true,
  }
};

// Create the context with a default value
export const AIUtilsContext = createContext<AIUtilsContextType | null>(null);

// Provider component
export const AIUtilsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences?.() || { preferences: null };
  
  const [settings, setSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState<boolean>(false);
  const [remainingCredits, setRemainingCredits] = useState<number>(100);
  const [usageLimit] = useState<number>(100);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);
  
  const { toast } = useToast();
  
  // Initialize TTS synthesis
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
      
      // Get available voices
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      updateVoices();
      
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = updateVoices;
      
      // Clean up
      return () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);
  
  useEffect(() => {
    // Load user AI settings from preferences if available
    if (preferences?.aiEnabled !== undefined) {
      setIsAIEnabled(preferences.aiEnabled);
      setSettings({
        ...settings,
        model: preferences.aiModelSize || settings.model,
      });
    }
  }, [preferences]);
  
  // Process content using AI
  const processContent = async (prompt: string, options: any = {}): Promise<string> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use AI features",
        variant: "destructive",
      });
      return '';
    }
    
    try {
      setIsProcessing(true);
      
      // Add user context to the prompt if needed
      const userContext = user.preferredLanguage ? `User preferred language: ${user.preferredLanguage}.` : '';
      const difficultyContext = preferences?.difficulty ? `Content difficulty: ${preferences.difficulty}.` : '';
      const contextualizedPrompt = `${userContext} ${difficultyContext} ${prompt}`;
      
      // Call the AI service
      const response = await AIService.generateText(contextualizedPrompt, {
        temperature: options.temperature || settings.temperature,
        topP: options.topP || settings.topP,
        frequencyPenalty: options.frequencyPenalty || settings.frequencyPenalty,
        presencePenalty: options.presencePenalty || settings.presencePenalty,
        model: options.model || settings.model,
        maxTokens: options.maxTokens || settings.maxTokens,
      });
      
      return response;
    } catch (error) {
      console.error("Error processing content:", error);
      toast({
        title: "Processing Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
      return '';
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Update AI settings
  const updateSettings = (newSettings: AISettings): void => {
    setSettings({
      ...settings,
      ...newSettings
    });
  };
  
  // Generate content (alias for processContent for backward compatibility)
  const generateContent = async (prompt: string, options: any = {}): Promise<string> => {
    return processContent(prompt, options);
  };
  
  // Text-to-speech functionality
  const speakText = (text: string, language = 'english', onComplete?: () => void): void => {
    if (!synth) {
      console.error("Speech synthesis not supported");
      return;
    }
    
    // Cancel any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    let voice: SpeechSynthesisVoice | null = null;
    
    if (language === 'italian') {
      // Try to find an Italian voice
      voice = voices.find(v => v.lang.startsWith('it')) || null;
      // Use the configured Italian voice if available
      if (settings.italianVoiceURI) {
        voice = voices.find(v => v.voiceURI === settings.italianVoiceURI) || voice;
      }
    } else {
      // Default to English
      voice = voices.find(v => v.lang.startsWith('en')) || null;
      // Use the configured English voice if available
      if (settings.englishVoiceURI) {
        voice = voices.find(v => v.voiceURI === settings.englishVoiceURI) || voice;
      }
    }
    
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set rate and pitch if configured
    if (settings.voiceRate) utterance.rate = settings.voiceRate;
    if (settings.voicePitch) utterance.pitch = settings.voicePitch;
    
    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    };
    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      setIsSpeaking(false);
    };
    
    // Speak
    synth.speak(utterance);
  };
  
  // Process audio stream (for speech recognition)
  const processAudioStream = async (stream: MediaStream): Promise<string> => {
    try {
      setIsTranscribing(true);
      
      // Simulate processing audio (in a real app, this would use a speech-to-text API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return "This is a simulated transcription.";
    } catch (error) {
      console.error("Audio processing error:", error);
      toast({
        title: "Transcription Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      });
      return '';
    } finally {
      setIsTranscribing(false);
    }
  };
  
  // Stop audio processing
  const stopAudioProcessing = (): void => {
    // Implementation would depend on the specific audio processing being used
    setIsTranscribing(false);
  };
  
  // Check for microphone access
  const checkMicrophoneAccess = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      
      setHasActiveMicrophone(true);
      return true;
    } catch (error) {
      console.error("Microphone access error:", error);
      setHasActiveMicrophone(false);
      return false;
    }
  };
  
  // Generate questions based on parameters
  const generateQuestions = async (params: any): Promise<any> => {
    try {
      setIsGenerating(true);
      
      // Check if user has remaining credits
      if (remainingCredits <= 0) {
        toast({
          title: "Usage Limit Reached",
          description: "You've reached your AI usage limit. Please upgrade to continue.",
          variant: "warning",
        });
        return { questions: [], error: "Usage limit reached" };
      }
      
      // For this implementation, we'll use the AIService to generate questions
      const questions = await AIService.generateQuestions(
        params.content || "", 
        params.count || 5, 
        params.type || "multiple_choice"
      );
      
      // Deduct credits
      setRemainingCredits(prevCredits => Math.max(0, prevCredits - 1));
      
      return { questions, error: null };
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Question Generation Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
      return { questions: [], error: "Failed to generate questions" };
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Reset usage credits (e.g., at the start of a new billing period)
  const resetCredits = async (): Promise<void> => {
    // In a real app, this would check with a backend service
    setRemainingCredits(usageLimit);
    toast({
      title: "Credits Reset",
      description: "Your AI usage credits have been reset.",
      variant: "default",
    });
  };
  
  // Make features conditional on user settings
  useEffect(() => {
    if (preferences?.aiEnabled === false) {
      // Disable AI features if the user has turned them off
      setIsAIEnabled(false);
      setSettings({
        ...settings,
        defaultModelSize: 'small', // Use smallest model to save resources
        temperature: 0.5,
        maxTokens: 500
      });
    } else if (preferences?.aiEnabled === true) {
      setIsAIEnabled(true);
    }
  }, [preferences?.aiEnabled]);
  
  // Analyze content to determine type and confidence
  const analyzeContent = async (text: string, contentType?: ContentType) => {
    try {
      const result = await AIService.classifyText(text);
      
      // Get the top classification
      const topClassification = result[0] || { label: 'unknown', score: 0.5 };
      
      // Determine language
      const hasItalian = /\b(ciao|buongiorno|arrivederci|grazie)\b/i.test(text);
      const hasEnglish = /\b(hello|good|thanks|welcome|the)\b/i.test(text);
      
      let language = 'unknown';
      if (hasItalian && !hasEnglish) language = 'italian';
      else if (hasEnglish && !hasItalian) language = 'english';
      else if (hasItalian && hasEnglish) language = 'both';
      
      return {
        type: contentType || topClassification.label,
        confidence: topClassification.score,
        language
      };
    } catch (error) {
      console.error("Error analyzing content:", error);
      return {
        type: contentType || 'unknown',
        confidence: 0.5,
        language: 'unknown'
      };
    }
  };
  
  // Speech recognition functionality
  const recognizeSpeech = async (audioBlob: Blob): Promise<string> => {
    try {
      // In a real implementation, this would call a speech-to-text API
      await new Promise(resolve => setTimeout(resolve, 1500));
      return "Simulated speech recognition result.";
    } catch (error) {
      console.error("Speech recognition error:", error);
      return "";
    }
  };
  
  // Text comparison (e.g., for pronunciation accuracy)
  const compareTexts = async (text1: string, text2: string): Promise<number> => {
    // In a real implementation, this would use a text comparison algorithm or API
    // For now, we'll use a simple implementation
    const similarity = 0.8; // Simulated similarity score between 0 and 1
    return similarity;
  };
  
  // Expose speech directly for convenience
  const speak = async (text: string, language?: string): Promise<void> => {
    if (speakText) {
      await new Promise<void>((resolve) => {
        speakText(text, language, resolve);
      });
    }
  };
  
  // Context value
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

// Export for proper usage in other files
export { useAIUtils } from "@/hooks/useAIUtils";

export default AIUtilsContext;
