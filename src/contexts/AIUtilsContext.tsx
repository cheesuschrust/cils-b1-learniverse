
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIUtilsContextType, AISettings, DifficultyLevel } from '@/types/core-types';
import AIService from '@/services/AIService';
import * as HuggingFace from '@/utils/huggingFaceIntegration';
import { useToast } from '@/components/ui/use-toast';

// Default settings for AI processing
const defaultSettings: AISettings = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 500,
  topP: 0.9,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  contentFiltering: true
};

// Create context with default values
const AIUtilsContext = createContext<AIUtilsContextType>({
  generateQuestions: async () => ({ questions: [] }),
  isGenerating: false,
  remainingCredits: 100,
  usageLimit: 100,
  processContent: async () => ({}),
  settings: defaultSettings,
  updateSettings: () => {},
  generateContent: async () => "",
  isSpeaking: false,
  processAudioStream: async () => "",
  translateText: async () => "",
  analyzeGrammar: async () => ({}),
  getVoices: () => [],
  stopSpeaking: () => {},
  detectLanguage: async () => "",
  getConfidenceLevel: async () => 0,
  createEmbeddings: async () => [],
  compareSimilarity: async () => 0,
  isProcessing: false,
  error: null,
  abort: () => {},
  classifyText: async () => ({}),
  generateFlashcards: async () => []
});

export function AIUtilsProvider({ children }: { children: React.ReactNode }) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [remainingCredits, setRemainingCredits] = useState<number>(100);
  const [settings, setSettings] = useState<AISettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  // Initialize HuggingFace transformers
  useEffect(() => {
    const initializeAI = async () => {
      try {
        setIsProcessing(true);
        await HuggingFace.initializeHuggingFace();
        setIsAIEnabled(true);
        setIsInitialized(true);
        toast({
          title: "AI System Ready",
          description: "Successfully initialized AI models"
        });
      } catch (err) {
        console.error("Error initializing AI models:", err);
        toast({
          title: "AI Initialization Failed",
          description: "Couldn't initialize AI models. Some features may be limited.",
          variant: "destructive"
        });
        setError(err instanceof Error ? err : new Error("Unknown error initializing AI"));
        setIsAIEnabled(false);
      } finally {
        setIsProcessing(false);
      }
    };
    
    initializeAI();
  }, [toast]);
  
  // Load a specific model
  const loadModel = async (modelName: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      // This implementation would depend on the specific AI service being used
      // For now, let's simulate a model loading process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsModelLoaded(true);
      return true;
    } catch (err) {
      console.error("Error loading model:", err);
      setError(err instanceof Error ? err : new Error("Unknown error loading model"));
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Update AI settings
  const updateSettings = (newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Generate questions based on parameters
  const generateQuestions = async (params: any) => {
    if (!isAIEnabled) {
      return { 
        questions: [], 
        error: "AI functionality is currently disabled" 
      };
    }
    
    if (remainingCredits <= 0) {
      return { 
        questions: [], 
        error: "You've reached your usage limit for today" 
      };
    }
    
    setIsGenerating(true);
    
    try {
      // Simulated API call for generating questions
      // In a real app, this would call the backend AI service
      const questions = await AIService.generateQuestions(
        `Generate CILS B1 Italian citizenship questions about ${params.contentTypes.join(", ")}`,
        params.count || 5, 
        "multiple_choice"
      );
      
      // Deduct credits
      setRemainingCredits(prev => Math.max(0, prev - 1));
      
      return { questions };
    } catch (err) {
      console.error("Error generating questions:", err);
      return { 
        questions: [], 
        error: err instanceof Error ? err.message : "Error generating questions" 
      };
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Process content for AI analysis
  const processContent = async (content: string, options?: any) => {
    setIsProcessing(true);
    try {
      const result = await AIService.classifyText(content);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error processing content"));
      return {};
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate AI content from prompt
  const generateContent = async (prompt: string, options?: any) => {
    setIsProcessing(true);
    try {
      const result = await AIService.generateText(prompt, {
        temperature: options?.temperature || settings.temperature,
        maxLength: options?.maxTokens || settings.maxTokens,
        model: options?.model || settings.model
      });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error generating content"));
      return "";
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Process audio stream for speech recognition
  const processAudioStream = async (stream: MediaStream) => {
    setIsProcessing(true);
    try {
      // Convert stream to blob
      const audioChunks: BlobPart[] = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      // Create a promise that resolves when recording stops
      const audioPromise = new Promise<string>((resolve) => {
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks);
          try {
            const transcription = await AIService.recognizeSpeechAI(audioBlob);
            resolve(transcription);
          } catch (err) {
            console.error("Error transcribing speech:", err);
            resolve("");
          }
        };
      });
      
      // Start and stop recording to get a short audio sample
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000);
      
      return await audioPromise;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error processing audio"));
      return "";
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Translate text between languages
  const translateText = async (text: string, targetLanguage: string) => {
    setIsProcessing(true);
    try {
      const sourceLanguage = targetLanguage === 'it' ? 'en' : 'it';
      const translation = await AIService.translateTextAI(
        text,
        sourceLanguage as 'en' | 'it',
        targetLanguage as 'en' | 'it'
      );
      return translation;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error translating text"));
      return "";
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Grammar analysis for written text
  const analyzeGrammar = async (text: string, language: string) => {
    setIsProcessing(true);
    try {
      // Simulated grammar analysis
      const analysis = {
        score: AIService.getConfidenceScore('grammar'),
        errors: [],
        suggestions: []
      };
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error analyzing grammar"));
      return {};
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get available voice options for speech synthesis
  const getVoices = () => {
    if (typeof window === 'undefined') return [];
    return window.speechSynthesis?.getVoices() || [];
  };
  
  // Text-to-speech functionality
  const speakText = async (text: string, language = 'it-IT') => {
    if (typeof window === 'undefined') return;
    
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes(language.substring(0, 2)));
    if (voice) utterance.voice = voice;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Stop ongoing speech
  const stopSpeaking = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };
  
  // Language detection
  const detectLanguage = async (text: string) => {
    setIsProcessing(true);
    try {
      // For a simple approach, we'll check for common Italian words
      const italianWords = ['il', 'la', 'e', 'che', 'di', 'a', 'per', 'in', 'con', 'su', 'da'];
      const words = text.toLowerCase().split(/\s+/);
      
      const italianWordCount = words.filter(word => italianWords.includes(word)).length;
      const isItalian = italianWordCount / words.length > 0.15;
      
      return isItalian ? 'italian' : 'english';
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error detecting language"));
      return "unknown";
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get confidence score for a particular content type
  const getConfidenceLevel = async (text: string, type: string) => {
    setIsProcessing(true);
    try {
      return AIService.getConfidenceScore(type);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error getting confidence score"));
      return 0;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate text embeddings
  const createEmbeddings = async (text: string) => {
    setIsProcessing(true);
    try {
      const embeddings = await HuggingFace.getTextEmbeddings(text);
      return Array.isArray(embeddings) ? embeddings : [embeddings];
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error creating embeddings"));
      return [];
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Compare similarity between texts
  const compareSimilarity = async (text1: string, text2: string) => {
    setIsProcessing(true);
    try {
      const similarity = await HuggingFace.getTextSimilarity(text1, text2);
      return similarity;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error comparing text similarity"));
      return 0;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Abort ongoing operations
  const abort = () => {
    AIService.abortAllRequests();
    setIsProcessing(false);
    setIsSpeaking(false);
    setIsGenerating(false);
  };
  
  // Classify text
  const classifyText = async (text: string) => {
    setIsProcessing(true);
    try {
      const result = await AIService.classifyText(text);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error classifying text"));
      return [];
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate flashcards for a topic
  const generateFlashcards = async (topic: string, count: number = 5, difficulty: string = 'intermediate') => {
    setIsProcessing(true);
    try {
      const flashcards = await AIService.generateFlashcards(topic, count, difficulty);
      return flashcards;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error generating flashcards"));
      return [];
    } finally {
      setIsProcessing(false);
    }
  };
  
  const contextValue: AIUtilsContextType = {
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit: 100,
    processContent,
    settings,
    updateSettings,
    generateContent,
    isSpeaking,
    processAudioStream,
    translateText,
    analyzeGrammar,
    getVoices,
    stopSpeaking,
    detectLanguage,
    getConfidenceLevel,
    createEmbeddings,
    compareSimilarity,
    isProcessing,
    error,
    abort,
    classifyText,
    generateFlashcards,
    
    // Additional AI utilities that might be referenced in components
    loadModel,
    speak: speakText,
    recognizeSpeech: processAudioStream,
    compareTexts: compareSimilarity,
    isAIEnabled,
    status: isAIEnabled ? "ready" : "disabled",
    isModelLoaded
  };
  
  return <AIUtilsContext.Provider value={contextValue}>{children}</AIUtilsContext.Provider>;
}

export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error("useAIUtils must be used within an AIUtilsProvider");
  }
  return context;
};

export default AIUtilsContext;
