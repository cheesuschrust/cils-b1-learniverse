
import { useCallback, useState } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { 
  AIProcessingOptions, 
  ItalianQuestionGenerationParams, 
  AIGeneratedQuestion,
  TTSOptions,
  AIGenerationResult
} from '@/types/ai';

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
    transcribeSpeech: transcribeSpeechAI,
    isGenerating,
    remainingCredits,
    usageLimit,
    isSpeaking,
    processAudioStream: processAudioStreamAI,
    stopAudioProcessing: stopAudioProcessingAI,
    isTranscribing,
    hasActiveMicrophone,
    checkMicrophoneAccess: checkMicrophoneAccessAI,
    generateContent: generateContentAI,
    analyzeContent: analyzeContentAI
  } = useAIUtils();
  
  const [lastResult, setLastResult] = useState<any>(null);

  const processContent = useCallback(async (content: string, options?: AIProcessingOptions) => {
    const result = await processContentAI(content, options);
    setLastResult(result);
    return result;
  }, [processContentAI]);

  const generateQuestions = useCallback(async (params: ItalianQuestionGenerationParams) => {
    const result = await generateQuestionsAI(params);
    return result.questions as AIGeneratedQuestion[];
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

  const speak = useCallback(async (text: string, options?: string | TTSOptions) => {
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

  const processAudioStream = useCallback(async (stream: MediaStream) => {
    if (processAudioStreamAI) {
      return await processAudioStreamAI(stream);
    }
  }, [processAudioStreamAI]);

  const stopAudioProcessing = useCallback(() => {
    if (stopAudioProcessingAI) {
      stopAudioProcessingAI();
    }
  }, [stopAudioProcessingAI]);

  const checkMicrophoneAccess = useCallback(async () => {
    if (checkMicrophoneAccessAI) {
      return await checkMicrophoneAccessAI();
    }
    return false;
  }, [checkMicrophoneAccessAI]);

  const generateContent = useCallback(async (prompt: string, options?: any) => {
    if (generateContentAI) {
      return await generateContentAI(prompt, options);
    }
    return { content: "" };
  }, [generateContentAI]);

  const analyzeContent = useCallback(async (content: string, contentType: string) => {
    if (analyzeContentAI) {
      return await analyzeContentAI(content, contentType);
    }
    return { analysis: {} };
  }, [analyzeContentAI]);

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
    transcribeSpeech,
    isGenerating,
    remainingCredits,
    usageLimit,
    isSpeaking,
    processAudioStream,
    stopAudioProcessing,
    isTranscribing,
    hasActiveMicrophone,
    checkMicrophoneAccess,
    generateContent,
    analyzeContent
  };
}

export default useAI;
