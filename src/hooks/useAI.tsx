
import { useCallback, useState } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { AIProcessingOptions, ItalianQuestionGenerationParams, AIGeneratedQuestion } from '@/types/core-types';

export function useAI() {
  const {
    processContent: processContentAI,
    generateQuestions: generateQuestionsAI,
    analyzeGrammar: analyzeGrammarAI,
    translateText: translateTextAI,
    generateText: generateTextAI,
    evaluateWriting: evaluateWritingAI,
    isProcessing
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

  return {
    processContent,
    generateQuestions,
    analyzeGrammar,
    translateText,
    generateText,
    evaluateWriting,
    lastResult,
    isProcessing
  };
}

export default useAI;
