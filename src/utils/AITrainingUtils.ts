
import { ContentType, ContentFeatures } from '@/types/contentType';

// Training examples for each content type with features
interface TrainingData {
  text: string;
  features: Record<string, number | boolean>;
}

// Multiple-choice specific features
const extractMultipleChoiceFeatures = (text: string): Record<string, number | boolean> => {
  const hasOptions = text.includes('A)') || text.includes('B)') || text.includes('1.') || text.includes('2.');
  const optionCount = (text.match(/\b[A-D]\)|\b\d+\./g) || []).length;
  const hasCorrectAnswer = /correct|answer|right/i.test(text);
  
  const features: Record<string, number | boolean> = {
    hasOptions,
    optionCount,
    hasCorrectAnswer,
    questionMarks: (text.match(/\?/g) || []).length,
    textLength: text.length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
  
  return features;
};

// Flashcard specific features
const extractFlashcardFeatures = (text: string): Record<string, number | boolean> => {
  const lines = text.trim().split('\n').filter(Boolean);
  const hasFrontAndBack = lines.length >= 2;
  const isTermDefinition = lines.length === 2 && lines[0].length < 30 && lines[1].length > 30;
  
  const features: Record<string, number | boolean> = {
    hasFrontAndBack,
    isTermDefinition,
    textLength: text.length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
  
  return features;
};

// Writing specific features
const extractWritingFeatures = (text: string): Record<string, number | boolean> => {
  const paragraphs = text.split('\n\n').filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  
  const features: Record<string, number | boolean> = {
    paragraphCount: paragraphs.length,
    sentenceCount: sentences.length,
    hasPrompt: /prompt|write about|essay on/i.test(text),
    textLength: text.length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
  
  return features;
};

// Speaking specific features
const extractSpeakingFeatures = (text: string): Record<string, number | boolean> => {
  const isDialogue = /Person A|Person B|Speaker 1|Speaker 2|A:|B:/i.test(text);
  const hasPronunciation = /pronunc|accent|stress|intonation/i.test(text);
  
  const features: Record<string, number | boolean> = {
    isDialogue,
    hasPronunciation,
    questionMarks: (text.match(/\?/g) || []).length,
    textLength: text.length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
  
  return features;
};

// Listening specific features
const extractListeningFeatures = (text: string): Record<string, number | boolean> => {
  const hasAudioReference = /listen|audio|recording|hear/i.test(text);
  const hasFillInBlanks = /fill in|blank|missing/i.test(text);
  
  const features: Record<string, number | boolean> = {
    hasAudioReference,
    hasFillInBlanks,
    questionMarks: (text.match(/\?/g) || []).length,
    textLength: text.length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
  
  return features;
};

// Extract features from text based on content type
export const extractFeatures = (text: string, contentType?: ContentType): Record<string, number | boolean> => {
  if (contentType) {
    switch (contentType) {
      case 'multiple-choice':
        return extractMultipleChoiceFeatures(text);
      case 'flashcards':
        return extractFlashcardFeatures(text);
      case 'writing':
        return extractWritingFeatures(text);
      case 'speaking':
        return extractSpeakingFeatures(text);
      case 'listening':
        return extractListeningFeatures(text);
    }
  }
  
  // Extract general features if no content type is provided
  return {
    textLength: text.length,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    questionMarks: (text.match(/\?/g) || []).length,
    sentenceCount: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphCount: text.split('\n\n').filter(Boolean).length,
  };
};

// Detect content type from text features
export const detectContentType = (text: string): ContentType => {
  const multipleChoiceFeatures = extractMultipleChoiceFeatures(text);
  const flashcardFeatures = extractFlashcardFeatures(text);
  const writingFeatures = extractWritingFeatures(text);
  const speakingFeatures = extractSpeakingFeatures(text);
  const listeningFeatures = extractListeningFeatures(text);
  
  // Simple scoring based on feature presence
  let scores = {
    'multiple-choice': 0,
    'flashcards': 0,
    'writing': 0,
    'speaking': 0,
    'listening': 0
  };
  
  // Score multiple-choice
  if (multipleChoiceFeatures.hasOptions) scores['multiple-choice'] += 3;
  if (multipleChoiceFeatures.optionCount >= 3) scores['multiple-choice'] += 2;
  if (multipleChoiceFeatures.hasCorrectAnswer) scores['multiple-choice'] += 1;
  if (multipleChoiceFeatures.questionMarks > 0) scores['multiple-choice'] += 1;
  
  // Score flashcards
  if (flashcardFeatures.hasFrontAndBack) scores['flashcards'] += 3;
  if (flashcardFeatures.isTermDefinition) scores['flashcards'] += 3;
  if ((flashcardFeatures.wordCount as number) < 30) scores['flashcards'] += 1;
  
  // Score writing
  if ((writingFeatures.paragraphCount as number) > 1) scores['writing'] += 2;
  if ((writingFeatures.sentenceCount as number) > 5) scores['writing'] += 2;
  if ((writingFeatures.textLength as number) > 200) scores['writing'] += 3;
  if (writingFeatures.hasPrompt) scores['writing'] += 1;
  
  // Score speaking
  if (speakingFeatures.isDialogue) scores['speaking'] += 3;
  if (speakingFeatures.hasPronunciation) scores['speaking'] += 3;
  if (speakingFeatures.questionMarks as number > 1) scores['speaking'] += 1;
  
  // Score listening
  if (listeningFeatures.hasAudioReference) scores['listening'] += 3;
  if (listeningFeatures.hasFillInBlanks) scores['listening'] += 2;
  
  // Find the content type with the highest score
  let maxScore = 0;
  let detectedType: ContentType = 'writing'; // Default
  
  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type as ContentType;
    }
  });
  
  return detectedType;
};

// Get confidence score for a content type prediction
export const getTypeConfidence = (text: string, contentType: ContentType): number => {
  const features = extractFeatures(text, contentType);
  const detectedType = detectContentType(text);
  
  // Base confidence if detected type matches
  let confidence = detectedType === contentType ? 0.7 : 0.3;
  
  // Adjust confidence based on feature strength
  switch (contentType) {
    case 'multiple-choice':
      if (features.hasOptions) confidence += 0.15;
      if ((features.optionCount as number) >= 3) confidence += 0.1;
      break;
    case 'flashcards':
      if (features.hasFrontAndBack) confidence += 0.2;
      if (features.isTermDefinition) confidence += 0.1;
      break;
    case 'writing':
      if ((features.paragraphCount as number) > 1) confidence += 0.1;
      if ((features.textLength as number) > 200) confidence += 0.15;
      break;
    case 'speaking':
      if (features.isDialogue) confidence += 0.15;
      if (features.hasPronunciation) confidence += 0.15;
      break;
    case 'listening':
      if (features.hasAudioReference) confidence += 0.2;
      if (features.hasFillInBlanks) confidence += 0.1;
      break;
  }
  
  // Cap confidence between 0 and 1
  return Math.min(Math.max(confidence, 0), 1);
};
