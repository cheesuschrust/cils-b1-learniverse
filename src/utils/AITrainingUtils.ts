
import { ContentType, ContentFeatures } from '@/types/contentType';

interface ContentAnalysis {
  contentType: ContentType;
  confidence: number;
  features: ContentFeatures;
}

// Simple content analyzer that works without external AI services
export function analyzeContent(content: string): ContentAnalysis {
  if (!content || typeof content !== 'string') {
    return {
      contentType: 'writing',
      confidence: 0.5,
      features: {
        wordCount: 0,
        sentenceCount: 0
      }
    };
  }

  // Extract basic features
  const features = extractContentFeatures(content);
  
  // Determine content type based on features
  let contentType: ContentType = 'writing';
  let confidence = 0.6; // Default confidence
  
  // Check for flashcards pattern (term - definition or term: definition patterns)
  if (
    (content.includes('\n\n') && content.split('\n\n').length > 1 && content.split('\n\n').length % 2 === 0) ||
    (content.includes(' - ') && content.split('\n').some(line => line.includes(' - '))) ||
    (content.includes(': ') && content.split('\n').some(line => line.includes(': ')))
  ) {
    contentType = 'flashcards';
    confidence = 0.75;
  }
  // Check for multiple choice pattern (options starting with A., B., C. or 1., 2., 3.)
  else if (
    (content.match(/[A-D]\.\s/g) && content.match(/[A-D]\.\s/g)!.length >= 3) ||
    (content.match(/\d+\.\s/g) && content.match(/\d+\.\s/g)!.length >= 3) ||
    (content.includes('?') && features.questionMarks! > 0)
  ) {
    contentType = 'multiple-choice';
    confidence = 0.8;
  }
  // Check for listening content (audio script, dialogue with speakers)
  else if (
    content.includes('[') && content.includes(']') || // Might be timestamps or speaker indicators
    content.match(/^\w+:/gm) // Speaker notation at beginning of lines
  ) {
    contentType = 'listening';
    confidence = 0.7;
  }
  // Check for speaking content (conversation prompts, pronunciation guides)
  else if (
    content.includes('Repeat:') ||
    content.includes('Say:') ||
    content.includes('Pronunciation:') ||
    (content.match(/^\w+:/gm) && content.match(/^\w+:/gm)!.length > 3) // Multiple speaker turns
  ) {
    contentType = 'speaking';
    confidence = 0.65;
  }
  
  return {
    contentType,
    confidence,
    features
  };
}

// Extract features from content
function extractContentFeatures(content: string): ContentFeatures {
  if (!content || typeof content !== 'string') {
    return {
      wordCount: 0,
      sentenceCount: 0
    };
  }
  
  // Calculate basic text statistics
  const wordCount = content.trim().split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = content.split(/\n\s*\n/).filter(Boolean).length;
  const questionMarks = (content.match(/\?/g) || []).length;
  
  // Simple language detection
  const italianWords = ['il', 'la', 'di', 'e', 'che', 'un', 'una', 'sono', 'è', 'per', 'non', 'mi', 'si', 'ti', 'ci'];
  const englishWords = ['the', 'and', 'of', 'to', 'is', 'in', 'that', 'it', 'for', 'you', 'are', 'with', 'on', 'as', 'not'];
  
  const words = content.toLowerCase().match(/\b(\w+)\b/g) || [];
  let italianCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (italianWords.includes(word)) italianCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  let language: 'english' | 'italian' | 'mixed' = 'english';
  
  if (italianCount > englishCount) {
    language = 'italian';
  } else if (italianCount > 0 && englishCount > 0) {
    language = 'mixed';
  }
  
  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    questionMarks,
    language
  };
}

// Add additional helper functions for AI training
export function createTrainingExample(content: string, label: ContentType): any {
  return {
    text: content,
    label,
    features: extractContentFeatures(content),
    createdAt: new Date(),
  };
}

export default {
  analyzeContent,
  extractContentFeatures,
  createTrainingExample
};
