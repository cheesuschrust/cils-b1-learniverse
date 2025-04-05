
import { useCallback, useState } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { AIProcessingOptions, ItalianQuestionGenerationParams, AIGeneratedQuestion } from '@/types';

export function useAI() {
  const {
    processContent: processContentAI,
    generateQuestions: generateQuestionsAI,
    analyzeGrammar: analyzeGrammarAI,
    translateText: translateTextAI,
    generateText: generateTextAI,
    evaluateWriting: evaluateWritingAI,
    isProcessing,
    speak: speakAI,
    isAIEnabled,
    status,
    isModelLoaded,
    compareTexts: compareTextsAI,
    loadModel: loadModelAI,
    classifyText: classifyTextAI,
    transcribeSpeech: transcribeSpeechAI
  } = useAIUtils();
  
  const [lastResult, setLastResult] = useState<any>(null);

  const processContent = useCallback(async (content: string, options?: AIProcessingOptions) => {
    const result = await processContentAI(content, options);
    setLastResult(result);
    return result;
  }, [processContentAI]);

  const generateQuestions = useCallback(async (params: ItalianQuestionGenerationParams) => {
    const result = await generateQuestionsAI(params);
    return result as AIGeneratedQuestion[];
  }, [generateQuestionsAI]);

  const analyzeGrammar = useCallback(async (text: string, language?: string) => {
    const result = await analyzeGrammarAI(text, language);
    return result;
  }, [analyzeGrammarAI]);

  const translateText = useCallback(async (text: string, targetLanguage?: string) => {
    const result = await translateTextAI(text, targetLanguage);
    return result;
  }, [translateTextAI]);

  const generateText = useCallback(async (prompt: string, options?: any) => {
    const result = await generateTextAI(prompt, options);
    return result;
  }, [generateTextAI]);

  const evaluateWriting = useCallback(async (text: string, level?: string) => {
    const result = await evaluateWritingAI(text, level);
    return result;
  }, [evaluateWritingAI]);

  const speak = useCallback(async (text: string, options?: any) => {
    if (speakAI) {
      return await speakAI(text, options);
    }
  }, [speakAI]);
  
  const compareTexts = useCallback(async (text1: string, text2: string) => {
    if (compareTextsAI) {
      return await compareTextsAI(text1, text2);
    }
    return { similarity: 0, differences: [] };
  }, [compareTextsAI]);
  
  const loadModel = useCallback(async () => {
    if (loadModelAI) {
      return await loadModelAI();
    }
  }, [loadModelAI]);
  
  const classifyText = useCallback(async (text: string, categories: string[]) => {
    if (classifyTextAI) {
      return await classifyTextAI(text, categories);
    }
    return { category: '', confidence: 0 };
  }, [classifyTextAI]);
  
  const transcribeSpeech = useCallback(async (audioData: Blob) => {
    if (transcribeSpeechAI) {
      return await transcribeSpeechAI(audioData);
    }
    return { text: '', confidence: 0 };
  }, [transcribeSpeechAI]);

  return {
    processContent,
    generateQuestions,
    analyzeGrammar,
    translateText,
    generateText,
    evaluateWriting,
    lastResult,
    isProcessing,
    speak,
    isAIEnabled,
    status,
    isModelLoaded,
    compareTexts,
    loadModel,
    classifyText,
    transcribeSpeech
  };
}

export default useAI;
