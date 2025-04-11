
import { useCallback } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { 
  AIProcessingOptions,
  ItalianQuestionGenerationParams,
  AIGeneratedQuestion,
  TextToSpeechOptions,
  TTSOptions,
  AIGenerationResult
} from '@/types/ai-types';

export function useAI() {
  const aiUtils = useAIUtils();
  
  // Rename or destructure all the fields for clarity
  const {
    processContent: processContentAI,
    generateQuestions: generateQuestionsAI,
    analyzeGrammar: analyzeGrammarAI,
    translateText: translateTextAI,
    generateText: generateTextAI,
    evaluateWriting: evaluateWritingAI,
    isProcessing,
    isGenerating,
    remainingCredits,
    usageLimit,
    isAIEnabled,
    speak: speakAI,
    isSpeaking,
    status,
    isModelLoaded,
    compareTexts: compareTextsAI,
    loadModel: loadModelAI,
    classifyText: classifyTextAI,
    transcribeSpeech: transcribeSpeechAI,
    processAudioStream: processAudioStreamAI,
    stopAudioProcessing: stopAudioProcessingAI,
    isTranscribing,
    hasActiveMicrophone,
    checkMicrophoneAccess: checkMicrophoneAccessAI,
    generateContent: generateContentAI,
    analyzeContent: analyzeContentAI
  } = aiUtils;

  // Wrap all functions to maintain consistent naming
  const processContent = useCallback(async (content: string, options?: AIProcessingOptions) => {
    return await processContentAI(content, options);
  }, [processContentAI]);

  const generateQuestions = useCallback(async (params: ItalianQuestionGenerationParams) => {
    const result = await generateQuestionsAI(params);
    return result.questions as AIGeneratedQuestion[];
  }, [generateQuestionsAI]);

  const analyzeGrammar = useCallback(async (text: string, language?: string) => {
    return await analyzeGrammarAI(text, language);
  }, [analyzeGrammarAI]);

  const translateText = useCallback(async (text: string, targetLanguage?: string) => {
    return await translateTextAI(text, targetLanguage);
  }, [translateTextAI]);

  const generateText = useCallback(async (prompt: string, options?: any) => {
    return await generateTextAI?.(prompt, options) || '';
  }, [generateTextAI]);

  const evaluateWriting = useCallback(async (text: string, level?: string) => {
    return await evaluateWritingAI(text, level);
  }, [evaluateWritingAI]);

  const speak = useCallback(async (text: string | TextToSpeechOptions, options?: string | TTSOptions) => {
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

  // Return all the functions and properties with consistent naming
  return {
    processContent,
    generateQuestions,
    analyzeGrammar,
    translateText,
    generateText,
    evaluateWriting,
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
