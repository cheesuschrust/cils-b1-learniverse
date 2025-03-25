
import { ContentType } from '@/services/ContentService';

// Simplified NLP functions for text analysis
// In a real app, you might use libraries like natural, compromise, etc.

const MIN_SENTENCE_LENGTH = 4;
const MIN_WORD_LENGTH = 2;

export interface TextAnalysisResult {
  readability: 'Beginner' | 'Intermediate' | 'Advanced';
  wordCount: number;
  sentenceCount: number;
  avgWordLength: number;
  avgSentenceLength: number;
  topKeywords: string[];
  contentType: ContentType | 'unknown';
  languageDetected: 'english' | 'italian' | 'unknown';
  confidence: number;
}

// Calculate text readability
export function analyzeTextReadability(text: string): TextAnalysisResult {
  // Clean the text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Split into sentences and words
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > MIN_SENTENCE_LENGTH);
  const words = cleanText.split(/\s+/).filter(w => w.length > MIN_WORD_LENGTH);
  
  // Calculate basic metrics
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgWordLength = words.length ? words.join('').length / words.length : 0;
  const avgSentenceLength = sentences.length ? wordCount / sentences.length : 0;
  
  // Determine readability
  let readability: 'Beginner' | 'Intermediate' | 'Advanced';
  
  if (avgWordLength < 4.5 && avgSentenceLength < 10) {
    readability = 'Beginner';
  } else if (avgWordLength < 5.5 && avgSentenceLength < 15) {
    readability = 'Intermediate';
  } else {
    readability = 'Advanced';
  }
  
  // Extract top keywords
  const topKeywords = extractKeywords(cleanText, 5);
  
  // Detect content type
  const contentType = detectContentType(cleanText);
  
  // Detect language
  const languageResult = detectLanguage(cleanText);
  
  return {
    readability,
    wordCount,
    sentenceCount,
    avgWordLength,
    avgSentenceLength,
    topKeywords,
    contentType,
    languageDetected: languageResult.language,
    confidence: languageResult.confidence
  };
}

// Extract keywords from text
function extractKeywords(text: string, limit: number = 5): string[] {
  // Remove common stop words
  const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'il', 'la', 'e', 'in', 'che', 'di', 'non', 'un', 'una'];
  
  // Get words and their frequencies
  const words = text.toLowerCase().match(/\b[a-z']{3,}\b/g) || [];
  const wordFreq: Record<string, number> = {};
  
  for (const word of words) {
    if (!stopWords.includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }
  
  // Sort by frequency
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

// Detect if text is more suitable for flashcards, multiple choice, etc.
function detectContentType(text: string): ContentType | 'unknown' {
  const lowercaseText = text.toLowerCase();
  
  // Pattern matching to detect content type
  // Let flashcardMatches be a variable that changes
  let flashcardMatches = 0;
  let mcMatches = 0;
  let listeningMatches = 0;
  let writingMatches = 0;
  let speakingMatches = 0;
  
  // Flashcard detection - vocabulary lists, word-definition pairs
  if (
    lowercaseText.includes('vocabulary') || 
    lowercaseText.includes('word list') ||
    lowercaseText.includes('glossary') ||
    lowercaseText.match(/\b\w+\s*[-:=]\s*\w+\b/g)
  ) {
    flashcardMatches += 2;
  }
  
  // Multiple choice detection - questions with options
  if (
    lowercaseText.includes('question') || 
    lowercaseText.includes('choose') ||
    lowercaseText.includes('select') ||
    lowercaseText.match(/\b[a-d][.)]\s+\w+/gi) ||
    lowercaseText.match(/\d+[.)]\s+\w+/g)
  ) {
    mcMatches += 2;
  }
  
  // More signals for multiple choice - options format
  if (
    lowercaseText.match(/\b(?:options|choices)[:]\s*\w+/gi)
  ) {
    mcMatches += 1;
  }
  
  // Listening exercise detection
  if (
    lowercaseText.includes('listen') ||
    lowercaseText.includes('audio') ||
    lowercaseText.includes('pronunciation') ||
    lowercaseText.includes('dictation')
  ) {
    listeningMatches += 2;
  }
  
  // Writing exercise detection - essays, fill-in-blanks
  if (
    lowercaseText.includes('write') ||
    lowercaseText.includes('essay') ||
    lowercaseText.includes('compose') ||
    lowercaseText.includes('fill in') ||
    lowercaseText.match(/_{2,}/g) // underscores for blanks
  ) {
    writingMatches += 2;
  }
  
  // Speaking exercise detection
  if (
    lowercaseText.includes('speak') ||
    lowercaseText.includes('pronunciation') ||
    lowercaseText.includes('repeat') ||
    lowercaseText.includes('say')
  ) {
    speakingMatches += 2;
  }
  
  // Count sentence-ending with question marks
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount > 3) {
    mcMatches += 1;
  }
  
  // Determine the most likely content type
  const scores = [
    { type: 'flashcards', score: flashcardMatches },
    { type: 'multiple-choice', score: mcMatches },
    { type: 'listening', score: listeningMatches },
    { type: 'writing', score: writingMatches },
    { type: 'speaking', score: speakingMatches }
  ];
  
  const highestScore = scores.sort((a, b) => b.score - a.score)[0];
  
  // Only return a content type if we have a reasonably high confidence
  return highestScore.score >= 2 
    ? highestScore.type as ContentType 
    : 'unknown';
}

// Simple language detection
function detectLanguage(text: string): { language: 'english' | 'italian' | 'unknown', confidence: number } {
  // Very simplified language detection based on common words
  const englishWords = ['the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'was', 'he', 'for', 'it', 'with', 'as', 'his', 'on'];
  const italianWords = ['il', 'la', 'e', 'che', 'di', 'a', 'in', 'un', 'una', 'sono', 'ho', 'non', 'si', 'mi', 'per', 'ti', 'lo'];
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  let englishMatches = 0;
  let italianMatches = 0;
  
  for (const word of words) {
    if (englishWords.includes(word)) englishMatches++;
    if (italianWords.includes(word)) italianMatches++;
  }
  
  const totalWords = words.length;
  
  if (totalWords === 0) return { language: 'unknown', confidence: 0 };
  
  const englishConfidence = englishMatches / totalWords;
  const italianConfidence = italianMatches / totalWords;
  
  // Set threshold for language detection
  const threshold = 0.05; // 5% of words need to be recognized
  
  if (englishConfidence > italianConfidence && englishConfidence > threshold) {
    return { language: 'english', confidence: englishConfidence * 100 };
  } else if (italianConfidence > englishConfidence && italianConfidence > threshold) {
    return { language: 'italian', confidence: italianConfidence * 100 };
  } else {
    return { language: 'unknown', confidence: Math.max(englishConfidence, italianConfidence) * 100 };
  }
}

// Enhanced endpoints for handling content-specific analysis
export function getContentTypeConfidence(text: string, type: ContentType): number {
  // Calculate confidence that the given text is suitable for the specified content type
  const result = analyzeTextReadability(text);
  
  if (result.contentType === type) {
    return Math.min(80 + Math.random() * 20, 100); // High confidence if detected type matches
  }
  
  // Calculate based on text characteristics
  switch (type) {
    case 'flashcards':
      return calculateFlashcardConfidence(text);
    case 'multiple-choice':
      return calculateMultipleChoiceConfidence(text);
    case 'listening':
      return calculateListeningConfidence(text);
    case 'writing':
      return calculateWritingConfidence(text);
    case 'speaking':
      return calculateSpeakingConfidence(text);
    default:
      return 0;
  }
}

// Calculate confidence scores for different content types
function calculateFlashcardConfidence(text: string): number {
  const wordPairs = text.match(/\b\w+\s*[-:=]\s*\w+\b/g) || [];
  const shortLines = text.split('\n').filter(line => line.trim().length > 0 && line.trim().length < 30).length;
  
  return Math.min(
    ((wordPairs.length * 10) + (shortLines * 5)) / 
    Math.max(text.length / 100, 1),
    100
  );
}

function calculateMultipleChoiceConfidence(text: string): number {
  const questionMarks = (text.match(/\?/g) || []).length;
  const options = text.match(/\b[a-d][.)]\s+\w+/gi) || [];
  
  return Math.min(
    ((questionMarks * 15) + (options.length * 10)) /
    Math.max(text.length / 200, 1),
    100
  );
}

function calculateListeningConfidence(text: string): number {
  const listeningKeywords = ['listen', 'audio', 'hear', 'sound', 'pronunciation', 'dictation']
    .filter(keyword => text.toLowerCase().includes(keyword)).length;
  
  return Math.min(listeningKeywords * 20, 100);
}

function calculateWritingConfidence(text: string): number {
  const writingKeywords = ['write', 'essay', 'paragraph', 'compose', 'fill in', 'complete']
    .filter(keyword => text.toLowerCase().includes(keyword)).length;
  
  const blanks = (text.match(/_{2,}/g) || []).length;
  
  return Math.min((writingKeywords * 15) + (blanks * 10), 100);
}

function calculateSpeakingConfidence(text: string): number {
  const speakingKeywords = ['speak', 'say', 'repeat', 'pronounce', 'oral', 'tell']
    .filter(keyword => text.toLowerCase().includes(keyword)).length;
  
  return Math.min(speakingKeywords * 20, 100);
}
