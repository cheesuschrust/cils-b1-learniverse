
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as AIService from '@/services/AIService';
import { ContentType, ContentTypeUI, convertContentType } from '@/utils/textAnalysis';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export type AIState = {
  isModelLoaded: boolean;
  isProcessing: boolean;
  error: string | null;
  isEnabled: boolean;
  loadModel: (modelType: AIService.AIModelType, modelName?: string) => Promise<void>;
  generateText: (prompt: string, options?: any) => Promise<AIService.AITextGenerationResult>;
  answerQuestion: (question: string, context: string) => Promise<AIService.AIQuestionAnsweringResult>;
  classifyText: (text: string) => Promise<AIService.AITextClassificationResult[]>;
  transcribeAudio: (audioData: string | Blob | ArrayBuffer) => Promise<AIService.AISpeechRecognitionResult>;
  generateFeedback: (userInput: string, expectedAnswer: string, language?: "english" | "italian" | "both") => Promise<string>;
  generateQuestions: (content: string, type: ContentTypeUI, count?: number, difficulty?: "Beginner" | "Intermediate" | "Advanced") => Promise<any[]>;
  toggleAI: (enabled: boolean) => void;
}

export function useAI(): AIState {
  const { aiPreference, setAIPreference } = useUserPreferences();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only pre-load the model if AI is enabled
    if (aiPreference.enabled) {
      const preloadModel = async () => {
        try {
          const modelSize = aiPreference.modelSize;
          let modelName = 'Xenova/distilgpt2'; // small
          
          if (modelSize === 'medium') {
            modelName = 'Xenova/gpt2';
          } else if (modelSize === 'large') {
            modelName = 'Xenova/gpt2-large';
          }
          
          await AIService.initModel({ 
            modelType: 'text-generation',
            modelName: modelName,
            useCache: true
          });
          
          setIsModelLoaded(true);
          console.log("Default model pre-loaded successfully");
        } catch (err) {
          console.error("Error pre-loading model:", err);
          // Don't show toast on initial load failure to prevent annoying the user
        }
      };

      preloadModel();
    }
  }, [aiPreference.enabled, aiPreference.modelSize]);

  const toggleAI = (enabled: boolean) => {
    setAIPreference({
      ...aiPreference,
      enabled
    });
    
    if (enabled && !isModelLoaded) {
      toast({
        title: "AI Enabled",
        description: "Loading AI models in the background...",
      });
    }
  };

  const loadModel = async (modelType: AIService.AIModelType, modelName?: string) => {
    if (!aiPreference.enabled) {
      setError("AI is currently disabled in preferences");
      toast({
        title: "AI is disabled",
        description: "Please enable AI in settings to use this feature",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      await AIService.initModel({ 
        modelType, 
        modelName,
        useCache: true,
        // Only use WebGPU if processOnDevice is enabled
        forceWebGPU: aiPreference.processOnDevice
      });
      setIsModelLoaded(true);
      setIsProcessing(false);
    } catch (err: any) {
      setError(err.message || "Failed to load model");
      toast({
        title: "Model Loading Error",
        description: err.message || "Failed to load the AI model",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const generateText = async (prompt: string, options?: any): Promise<AIService.AITextGenerationResult> => {
    if (!aiPreference.enabled) {
      throw new Error("AI is currently disabled in preferences");
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await AIService.generateText(prompt, options);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to generate text");
      setIsProcessing(false);
      throw err;
    }
  };

  const answerQuestion = async (question: string, context: string): Promise<AIService.AIQuestionAnsweringResult> => {
    if (!aiPreference.enabled) {
      throw new Error("AI is currently disabled in preferences");
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await AIService.answerQuestion(question, context);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to answer question");
      setIsProcessing(false);
      throw err;
    }
  };

  const classifyText = async (text: string): Promise<AIService.AITextClassificationResult[]> => {
    if (!aiPreference.enabled) {
      throw new Error("AI is currently disabled in preferences");
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await AIService.classifyText(text);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to classify text");
      setIsProcessing(false);
      throw err;
    }
  };

  const transcribeAudio = async (audioData: string | Blob | ArrayBuffer): Promise<AIService.AISpeechRecognitionResult> => {
    if (!aiPreference.enabled) {
      throw new Error("AI is currently disabled in preferences");
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await AIService.transcribeAudio(audioData);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to transcribe audio");
      setIsProcessing(false);
      throw err;
    }
  };

  const generateFeedback = async (
    userInput: string, 
    expectedAnswer: string, 
    language: "english" | "italian" | "both" = "both"
  ): Promise<string> => {
    if (!aiPreference.enabled) {
      // Return simple feedback when AI is disabled
      return userInput.toLowerCase() === expectedAnswer.toLowerCase()
        ? "Correct!" 
        : `Incorrect. The correct answer is: ${expectedAnswer}`;
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await AIService.generateFeedback(userInput, expectedAnswer, language);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to generate feedback");
      setIsProcessing(false);
      
      // Fallback to simple feedback in case of error
      return userInput.toLowerCase() === expectedAnswer.toLowerCase()
        ? "Correct!" 
        : `Incorrect. The correct answer is: ${expectedAnswer}`;
    }
  };

  const generateQuestions = async (
    content: string, 
    type: ContentTypeUI,
    count: number = 5,
    difficulty: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
  ): Promise<any[]> => {
    if (!aiPreference.enabled) {
      if (aiPreference.fallbackToManual) {
        // Return dummy data for testing when AI is disabled
        return Array(count).fill(0).map((_, i) => ({
          question: `Sample ${type} question ${i + 1}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswerIndex: Math.floor(Math.random() * 4),
          explanation: "This is a sample explanation."
        }));
      } else {
        throw new Error("AI is currently disabled in preferences");
      }
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      // Convert type if needed before passing to AIService
      const apiType = convertContentType(type) as ContentType;
      const result = await AIService.generateQuestions(content, apiType, count, difficulty);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to generate questions");
      setIsProcessing(false);
      
      if (aiPreference.fallbackToManual) {
        // Fallback to dummy data in case of error
        return Array(count).fill(0).map((_, i) => ({
          question: `Sample ${type} question ${i + 1}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswerIndex: Math.floor(Math.random() * 4),
          explanation: "This is a sample explanation."
        }));
      }
      
      throw err;
    }
  };

  return {
    isModelLoaded,
    isProcessing,
    isEnabled: aiPreference.enabled,
    error,
    loadModel,
    generateText,
    answerQuestion,
    classifyText,
    transcribeAudio,
    generateFeedback,
    generateQuestions,
    toggleAI
  };
}
