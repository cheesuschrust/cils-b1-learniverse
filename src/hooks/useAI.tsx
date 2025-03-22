
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as AIService from '@/services/AIService';

export type AIState = {
  isModelLoaded: boolean;
  isProcessing: boolean;
  error: string | null;
  loadModel: (modelType: AIService.AIModelType, modelName?: string) => Promise<void>;
  generateText: (prompt: string, options?: any) => Promise<AIService.AITextGenerationResult>;
  answerQuestion: (question: string, context: string) => Promise<AIService.AIQuestionAnsweringResult>;
  classifyText: (text: string) => Promise<AIService.AITextClassificationResult[]>;
  transcribeAudio: (audioData: string | Blob | ArrayBuffer) => Promise<AIService.AISpeechRecognitionResult>;
  generateFeedback: (userInput: string, expectedAnswer: string, language?: "english" | "italian" | "both") => Promise<string>;
  generateQuestions: (content: string, type: "flashcards" | "multipleChoice" | "listening" | "writing" | "speaking", count?: number, difficulty?: "Beginner" | "Intermediate" | "Advanced") => Promise<any[]>;
}

export function useAI(): AIState {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Pre-load the most commonly used model on mount
    const preloadModel = async () => {
      try {
        await AIService.initModel({ 
          modelType: 'text-generation',
          modelName: 'Xenova/distilgpt2'
        });
        setIsModelLoaded(true);
        console.log("Default model pre-loaded successfully");
      } catch (err) {
        console.error("Error pre-loading model:", err);
      }
    };

    preloadModel();
  }, []);

  const loadModel = async (modelType: AIService.AIModelType, modelName?: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      await AIService.initModel({ modelType, modelName });
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
    setIsProcessing(true);
    setError(null);
    try {
      const result = await AIService.generateFeedback(userInput, expectedAnswer, language);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to generate feedback");
      setIsProcessing(false);
      throw err;
    }
  };

  const generateQuestions = async (
    content: string, 
    type: "flashcards" | "multipleChoice" | "listening" | "writing" | "speaking",
    count: number = 5,
    difficulty: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
  ): Promise<any[]> => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await AIService.generateQuestions(content, type, count, difficulty);
      setIsProcessing(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to generate questions");
      setIsProcessing(false);
      throw err;
    }
  };

  return {
    isModelLoaded,
    isProcessing,
    error,
    loadModel,
    generateText,
    answerQuestion,
    classifyText,
    transcribeAudio,
    generateFeedback,
    generateQuestions
  };
}
