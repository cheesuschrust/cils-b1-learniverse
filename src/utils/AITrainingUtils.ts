import { ContentType } from '@/types/contentType';
import AIService from '@/services/AIService';

interface ContentAnalysisResult {
  contentType: ContentType;
  confidence: number;
  features: {
    wordCount: number;
    sentenceCount: number;
    complexWords: number;
    questionMarks: number;
    languageScore: {
      italian: number;
      english: number;
    };
  };
}

// Italian and English common words for language detection
const ITALIAN_COMMON_WORDS = [
  'il', 'la', 'i', 'le', 'e', 'di', 'a', 'un', 'una', 'in', 'con', 'su', 'per', 
  'tra', 'fra', 'che', 'chi', 'cosa', 'come', 'quando', 'dove', 'perché', 'io', 
  'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'questo', 'quello', 'questi', 'quelli', 
  'mio', 'tuo', 'suo', 'nostro', 'vostro', 'sono', 'sei', 'è', 'siamo', 'siete', 
  'hanno', 'ho', 'hai', 'ha', 'abbiamo', 'avete', 'avere', 'essere', 'fare', 'andare'
];

const ENGLISH_COMMON_WORDS = [
  'the', 'and', 'to', 'of', 'a', 'in', 'is', 'that', 'for', 'it', 'with', 'as', 
  'was', 'on', 'are', 'be', 'by', 'at', 'this', 'have', 'from', 'or', 'had', 'not', 
  'but', 'what', 'all', 'were', 'when', 'we', 'there', 'can', 'an', 'your', 'which', 
  'their', 'said', 'if', 'do', 'will', 'each', 'about', 'how', 'up', 'out', 'them', 
  'then', 'she', 'many', 'some', 'so', 'these', 'would', 'other', 'into', 'has'
];

// Extract features from content for analysis
const extractContentFeatures = (text: string) => {
  // Basic text statistics
  const wordCount = text.trim().split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const complexWords = text.split(/\s+/).filter(word => word.length > 7).length;
  const questionMarks = (text.match(/\?/g) || []).length;
  
  // Language detection
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  let italianCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (ITALIAN_COMMON_WORDS.includes(word)) italianCount++;
    if (ENGLISH_COMMON_WORDS.includes(word)) englishCount++;
  });
  
  const languageScore = {
    italian: words.length > 0 ? italianCount / words.length : 0,
    english: words.length > 0 ? englishCount / words.length : 0
  };
  
  return {
    wordCount,
    sentenceCount,
    complexWords,
    questionMarks,
    languageScore
  };
};

// Determine content type based on features
const determineContentType = (features: any): ContentAnalysisResult => {
  const {
    wordCount,
    sentenceCount,
    questionMarks,
    languageScore
  } = features;
  
  // Initialize scores for each content type
  const scores: Record<ContentType, number> = {
    'multiple-choice': 0,
    'flashcards': 0,
    'writing': 0,
    'speaking': 0,
    'listening': 0
  };
  
  // Logic for multiple-choice
  if (questionMarks > 0) {
    scores['multiple-choice'] += 40;
    if (questionMarks >= 3) scores['multiple-choice'] += 20;
  }
  
  // Logic for flashcards
  if (wordCount < 15) {
    scores['flashcards'] += 30;
    
    // Check if it could be a term-definition pair
    const lines = wordCount.toString().split('\n');
    if (lines.length === 2) scores['flashcards'] += 30;
  }
  
  // Logic for writing
  if (wordCount > 50) {
    scores['writing'] += 30;
    if (sentenceCount > 3) scores['writing'] += 20;
  }
  
  // Logic for speaking
  if (wordCount > 10 && wordCount < 100) {
    scores['speaking'] += 20;
    
    // Simple dialogues are likely speaking exercises
    if ((languageScore.italian > 0.3 || languageScore.english > 0.3) && 
        (text.includes(':') || text.includes('-'))) {
      scores['speaking'] += 40;
    }
  }
  
  // Logic for listening
  if (sentenceCount > 1 && wordCount > 20) {
    scores['listening'] += 20;
    
    // Narration or dialogue transcripts are common in listening exercises
    if (text.includes('"') || text.includes('"') || text.includes('said')) {
      scores['listening'] += 30;
    }
  }
  
  // Find the highest scoring content type
  let maxScore = 0;
  let detectedType: ContentType = 'writing'; // Default
  
  for (const type of Object.keys(scores) as ContentType[]) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      detectedType = type;
    }
  }
  
  return {
    contentType: detectedType,
    confidence: maxScore / 100, // Normalize to 0-1 range
    features
  };
};

// Analyze text content to determine the type
export const analyzeContent = (text: string): ContentAnalysisResult => {
  if (!text || typeof text !== 'string') {
    return {
      contentType: 'writing',
      confidence: 0.5,
      features: {
        wordCount: 0,
        sentenceCount: 0,
        complexWords: 0,
        questionMarks: 0,
        languageScore: { italian: 0, english: 0 }
      }
    };
  }
  
  const features = extractContentFeatures(text);
  return determineContentType(features);
};

// Train the AI model with example content
export const trainWithContent = (text: string, contentType: ContentType): number => {
  if (!text || typeof text !== 'string' || !contentType) return 0;
  
  // Add the training example to our service
  return AIService.addTrainingExamples(contentType, [
    { text, type: contentType, features: extractContentFeatures(text) }
  ]);
};

// Get confidence score for a content type
export const getConfidenceScoreForContent = (contentType: ContentType): number => {
  return AIService.getConfidenceScore(contentType);
};
