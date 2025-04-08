
import { useState } from 'react';
import AIService from '@/services/AIService';
import * as AIUtils from '@/utils/huggingFaceIntegration';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useFeatureLimits } from './useFeatureLimits';
import { useToast } from '@/components/ui/use-toast';

export type AIProcessingOptions = {
  confidenceThreshold?: number;
  language?: 'italian' | 'english' | 'both';
  includeTranslation?: boolean;
  includeFeedback?: boolean;
  maxTokens?: number;
  processingType?: 'grammar' | 'vocabulary' | 'culture' | 'citizenship';
};

export type QuestionGenerationParams = {
  contentTypes: string[];
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count: number;
  isCitizenshipFocused?: boolean;
};

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const { user } = useAuth();
  const { hasReachedLimit, incrementUsage } = useFeatureLimits();
  const { toast } = useToast();

  const generateUniqueRequestId = () => {
    return `req_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  };

  // Process text content for classification and analysis
  const processContent = async (content: string, options?: AIProcessingOptions) => {
    if (hasReachedLimit('aiSuggestions')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your AI processing limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      throw new Error("AI usage limit reached");
    }

    setIsProcessing(true);
    const requestId = generateUniqueRequestId();
    setCurrentRequestId(requestId);

    try {
      const result = await AIService.classifyText(content);
      await incrementUsage('aiSuggestions');
      return result;
    } finally {
      setIsProcessing(false);
      setCurrentRequestId(null);
    }
  };

  // Generate questions based on parameters
  const generateQuestions = async (params: QuestionGenerationParams) => {
    if (hasReachedLimit('aiSuggestions')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your AI question generation limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      return { questions: [], error: "AI usage limit reached" };
    }

    setIsProcessing(true);

    try {
      // Generate sample content for question generation
      const sampleContent = `This is sample content about ${params.topics.join(', ')} 
      in Italian at ${params.difficulty} level, focusing on ${params.contentTypes.join(', ')}.
      ${params.isCitizenshipFocused ? 'This is specifically for Italian citizenship exam preparation.' : ''}`;

      const questions = await AIService.generateQuestions(
        sampleContent, 
        params.count, 
        params.contentTypes[0] === 'writing' ? 'open_ended' : 'multiple_choice'
      );

      await incrementUsage('aiSuggestions');
      
      return { questions };
    } catch (error: any) {
      console.error('Error generating questions:', error);
      return { 
        questions: [], 
        error: error instanceof Error ? error.message : 'Unknown error generating questions' 
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate flashcards for a topic
  const generateFlashcards = async (topic: string, count: number = 5, difficulty: string = 'intermediate') => {
    if (hasReachedLimit('flashcards')) {
      toast({
        title: "Flashcard Limit Reached",
        description: "You've reached your flashcard generation limit. Upgrade to premium for unlimited flashcards.",
        variant: "destructive"
      });
      return [];
    }

    setIsProcessing(true);

    try {
      const flashcards = await AIService.generateFlashcards(topic, count, difficulty);
      await incrementUsage('flashcards');
      return flashcards;
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process uploaded documents
  const processDocument = async (content: string, includeInTraining: boolean = false) => {
    if (hasReachedLimit('aiSuggestions')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your document processing limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      throw new Error("AI usage limit reached");
    }

    setIsProcessing(true);

    try {
      if (!user) {
        throw new Error("User authentication required for document processing");
      }

      const result = await AIService.processDocument(content, user.id, includeInTraining);
      await incrementUsage('aiSuggestions');
      
      return result;
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate speech from text
  const generateSpeech = async (text: string, voice?: string) => {
    if (hasReachedLimit('listeningExercises')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your text-to-speech limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      throw new Error("Text-to-speech usage limit reached");
    }

    setIsProcessing(true);

    try {
      const audioContent = await AIService.generateSpeech(text, voice);
      await incrementUsage('listeningExercises');
      return audioContent;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze speech from recording
  const analyzeSpeech = async (audioBlob: Blob, expectedText: string) => {
    if (hasReachedLimit('speakingExercises')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your speech analysis limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      throw new Error("Speech analysis usage limit reached");
    }

    setIsProcessing(true);

    try {
      const transcribedText = await AIService.recognizeSpeech(audioBlob);
      const similarityScore = await AIService.comparePronunciation(expectedText, transcribedText);
      
      await incrementUsage('speakingExercises');
      
      return {
        transcribedText,
        similarityScore,
        feedback: generatePronunciationFeedback(similarityScore)
      };
    } catch (error) {
      console.error('Error analyzing speech:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze grammar and provide feedback
  const analyzeGrammar = async (text: string, language: 'en' | 'it' = 'it') => {
    if (hasReachedLimit('writingExercises')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your grammar analysis limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      throw new Error("Grammar analysis usage limit reached");
    }

    setIsProcessing(true);

    try {
      const result = await AIService.analyzeGrammar(text, language);
      await incrementUsage('writingExercises');
      return result;
    } catch (error) {
      console.error('Error analyzing grammar:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel ongoing requests
  const cancelProcessing = () => {
    if (currentRequestId) {
      AIService.abortRequest(currentRequestId);
      setCurrentRequestId(null);
      setIsProcessing(false);
    }
  };

  // Helper function to generate pronunciation feedback
  const generatePronunciationFeedback = (similarityScore: number): string => {
    if (similarityScore > 0.9) {
      return "Excellent pronunciation! Your Italian sounds very natural.";
    } else if (similarityScore > 0.75) {
      return "Good pronunciation. You're on the right track!";
    } else if (similarityScore > 0.6) {
      return "Your pronunciation needs some work. Try focusing on the difficult sounds.";
    } else {
      return "Try practicing the pronunciation more. Focus on speaking clearly and slowly at first.";
    }
  };

  return {
    processContent,
    generateQuestions,
    generateFlashcards,
    processDocument,
    generateSpeech,
    analyzeSpeech,
    analyzeGrammar,
    cancelProcessing,
    isProcessing
  };
};

export default useAI;
