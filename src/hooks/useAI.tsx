
import { useState, useEffect, useCallback } from 'react';
import * as AIService from '@/services/AIService';
import { useToast } from '@/components/ui/use-toast';
import { ContentType } from '@/utils/textAnalysis';

type AIStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AIServiceProps {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export const useAI = (options?: AIServiceProps) => {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [lastProcessedAt, setLastProcessedAt] = useState<Date | null>(null);
  const [isCacheEnabled, setIsCacheEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(true); // Default to true for demo purposes
  const { toast } = useToast();

  // Initialize AI on component mount
  useEffect(() => {
    const initializeAI = async () => {
      setStatus('loading');
      try {
        await initialize({
          modelName: options?.modelName || 'gpt-3.5-turbo',
          temperature: options?.temperature || 0.7,
          maxTokens: options?.maxTokens || 2000,
          topP: options?.topP || 0.9,
          frequencyPenalty: options?.frequencyPenalty || 0,
          presencePenalty: options?.presencePenalty || 0
        });
        
        setStatus('ready');
        setIsCacheEnabled(true);
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Failed to initialize AI');
        console.error('AI initialization error:', err);
        toast({
          title: 'AI Initialization Failed',
          description: err.message || 'Could not initialize AI system',
          variant: 'destructive',
        });
      }
    };

    initializeAI();
  }, [options, toast]);

  // Initialize AI with configuration
  const initialize = async (config: any) => {
    try {
      await AIService.initialize(config);
      setIsModelLoaded(true);
      setStatus('ready');
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize');
      setStatus('error');
      throw err;
    }
  };

  // Load a specific AI model
  const loadModel = async (modelType: string) => {
    setIsProcessing(true);
    try {
      console.log(`Loading model: ${modelType}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsModelLoaded(true);
      setStatus('ready');
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to load model');
      setStatus('error');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle AI enabled/disabled state
  const toggleAI = useCallback(() => {
    const newState = !isModelLoaded;
    setIsModelLoaded(newState);
    return newState;
  }, [isModelLoaded]);

  // Generate text using the AI
  const generateText = async (prompt: string, options = {}) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.generateText(prompt, options);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate text');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Classify text content
  const classifyText = async (text: string) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.classifyText(text);
      
      // Update confidence based on highest score
      if (result && result.length > 0) {
        const highestConfidence = Math.max(...result.map(item => item.score));
        setConfidence(highestConfidence * 100);
      }
      
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to classify text');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate questions from content
  const generateQuestions = async (
    content: string,
    contentType: ContentType,
    count: number = 5,
    difficulty: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
  ) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.generateQuestions(content, contentType, count, difficulty);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process text content
  const processText = async (text: string, processingType: string) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.processText(text, processingType);
      setConfidence(result.confidence || 0);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to process text');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process image content
  const processImage = async (imageUrl: string, prompt: string) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.processImage(imageUrl, prompt);
      setConfidence(result.confidence || 0);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Recognize speech from audio
  const recognizeSpeech = async (
    audioBlob: Blob,
    language: 'it' | 'en' = 'it'
  ) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.recognizeSpeech(audioBlob, language);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to recognize speech');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Evaluate speech against reference
  const evaluateSpeech = async (
    spokenText: string,
    referenceText: string,
    language: 'it' | 'en' = 'it'
  ) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.evaluateSpeech(spokenText, referenceText, language);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate speech');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate speech exercises
  const generateSpeechExercises = async (
    level: 'beginner' | 'intermediate' | 'advanced',
    count: number = 5,
    language: 'it' | 'en' = 'it'
  ) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.generateSpeechExercises(level, count, language);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate speech exercises');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Create AI-generated flashcards
  const generateFlashcards = async (
    content: string,
    count: number = 10,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ) => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    try {
      // Simulate generating flashcards
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock flashcards based on difficulty
      const words = {
        beginner: [
          { italian: 'casa', english: 'house' },
          { italian: 'gatto', english: 'cat' },
          { italian: 'cane', english: 'dog' },
          { italian: 'libro', english: 'book' },
          { italian: 'pane', english: 'bread' },
          { italian: 'acqua', english: 'water' },
          { italian: 'uomo', english: 'man' },
          { italian: 'donna', english: 'woman' },
          { italian: 'bambino', english: 'child' },
          { italian: 'città', english: 'city' },
          { italian: 'strada', english: 'street' },
          { italian: 'porta', english: 'door' },
          { italian: 'tavolo', english: 'table' },
          { italian: 'sedia', english: 'chair' },
          { italian: 'finestra', english: 'window' }
        ],
        intermediate: [
          { italian: 'sviluppatore', english: 'developer' },
          { italian: 'esperienza', english: 'experience' },
          { italian: 'conoscenza', english: 'knowledge' },
          { italian: 'progetto', english: 'project' },
          { italian: 'applicazione', english: 'application' },
          { italian: 'intelligenza', english: 'intelligence' },
          { italian: 'artificiale', english: 'artificial' },
          { italian: 'tecnologia', english: 'technology' },
          { italian: 'scienza', english: 'science' },
          { italian: 'sistema', english: 'system' },
          { italian: 'governo', english: 'government' },
          { italian: 'industria', english: 'industry' },
          { italian: 'economia', english: 'economy' },
          { italian: 'società', english: 'society' },
          { italian: 'ambiente', english: 'environment' }
        ],
        advanced: [
          { italian: 'globalizzazione', english: 'globalization' },
          { italian: 'sostenibilità', english: 'sustainability' },
          { italian: 'rivoluzione', english: 'revolution' },
          { italian: 'innovazione', english: 'innovation' },
          { italian: 'infrastruttura', english: 'infrastructure' },
          { italian: 'amministrazione', english: 'administration' },
          { italian: 'responsabilità', english: 'responsibility' },
          { italian: 'interdipendenza', english: 'interdependence' },
          { italian: 'conservazione', english: 'conservation' },
          { italian: 'implementazione', english: 'implementation' },
          { italian: 'contemporaneo', english: 'contemporary' },
          { italian: 'biodiversità', english: 'biodiversity' },
          { italian: 'paradigmatico', english: 'paradigmatic' },
          { italian: 'epistemologia', english: 'epistemology' },
          { italian: 'multidisciplinare', english: 'multidisciplinary' }
        ]
      };
      
      // Select appropriate words based on difficulty
      const wordPool = words[difficulty];
      
      // Generate the requested number of flashcards (or all if less available)
      const randomCards = [];
      const availableIndices = Array.from({ length: wordPool.length }, (_, i) => i);
      
      for (let i = 0; i < Math.min(count, wordPool.length); i++) {
        // Pick a random word from the pool without replacement
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const wordIndex = availableIndices[randomIndex];
        availableIndices.splice(randomIndex, 1);
        
        randomCards.push({
          id: `generated-${i + 1}`,
          ...wordPool[wordIndex],
          mastered: false,
          createdAt: new Date(),
          lastReviewed: new Date()
        });
      }
      
      setLastProcessedAt(new Date());
      return randomCards;
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Get AI confidence score for a content type
  const getContentTypeConfidence = useCallback((contentType: ContentType): number => {
    const scores: Record<ContentType, number> = {
      'multiple-choice': 85,
      'flashcards': 78, 
      'writing': 72,
      'speaking': 68,
      'listening': 80
    };
    
    return scores[contentType] || 70;
  }, []);

  return {
    status,
    error,
    isProcessing,
    confidence,
    lastProcessedAt,
    isCacheEnabled,
    isModelLoaded,
    isEnabled: isModelLoaded,
    toggleAI,
    loadModel,
    initialize,
    generateText,
    classifyText,
    generateQuestions,
    processText,
    processImage,
    recognizeSpeech,
    evaluateSpeech,
    generateSpeechExercises,
    generateFlashcards,
    getContentTypeConfidence
  };
};
