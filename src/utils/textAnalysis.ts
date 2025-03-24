
export type ContentType = 'multiple-choice' | 'flashcards' | 'writing' | 'speaking' | 'listening';

export interface AnalysisResult {
  contentType: ContentType;
  confidenceScore: number;
  language: string;
  wordCount: number;
  metadata: Record<string, any>;
}

/**
 * Analyzes text content to determine its type and other properties
 */
export const analyzeContent = (text: string): AnalysisResult => {
  // Default result
  const result: AnalysisResult = {
    contentType: 'writing',
    confidenceScore: 0,
    language: detectLanguage(text),
    wordCount: countWords(text),
    metadata: {}
  };
  
  // Detect multiple choice content
  if (containsMultipleChoicePatterns(text)) {
    result.contentType = 'multiple-choice';
    result.confidenceScore = calculateMultipleChoiceConfidence(text);
    result.metadata.questionCount = countQuestions(text);
  } 
  // Detect flashcards content
  else if (containsFlashcardPatterns(text)) {
    result.contentType = 'flashcards';
    result.confidenceScore = calculateFlashcardConfidence(text);
    result.metadata.cardCount = countPotentialCards(text);
  }
  // Detect speaking exercise
  else if (containsSpeakingExercisePatterns(text)) {
    result.contentType = 'speaking';
    result.confidenceScore = calculateSpeakingConfidence(text);
    result.metadata.phraseCount = countPhrases(text);
  }
  // Detect listening exercise
  else if (containsListeningExercisePatterns(text)) {
    result.contentType = 'listening';
    result.confidenceScore = calculateListeningConfidence(text);
    result.metadata.audioTranscript = extractPotentialTranscript(text);
  }
  // Default to writing
  else {
    result.confidenceScore = calculateWritingConfidence(text);
    result.metadata.paragraphCount = countParagraphs(text);
  }
  
  return result;
};

/**
 * Detects the primary language of the text (very simple implementation)
 */
const detectLanguage = (text: string): string => {
  // Simple detection based on common Italian words
  const italianWords = ['il', 'lo', 'la', 'i', 'gli', 'le', 'e', 'ed', 'un', 'una', 'sono', 'questo', 'quello', 'perché', 'come'];
  const words = text.toLowerCase().split(/\s+/);
  let italianWordCount = 0;
  
  for (const word of words) {
    if (italianWords.includes(word.replace(/[.,?!;:]/g, ''))) {
      italianWordCount++;
    }
  }
  
  // If more than 10% of the words are in the Italian list, consider it Italian
  return (italianWordCount / words.length) > 0.1 ? 'it' : 'en';
};

/**
 * Counts words in text
 */
const countWords = (text: string): number => {
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Detects if text contains patterns typical of multiple choice questions
 */
const containsMultipleChoicePatterns = (text: string): boolean => {
  // Check for patterns like "1. Option", "A)", "a.", multiple lines with "[ ]" or similar
  const mcPatterns = [
    /[A-D]\)\s.+/im,                  // A) Option
    /[A-D]\.\s.+/im,                  // A. Option
    /[1-9][0-9]*\.\s.+/m,             // 1. Option
    /\[\s*\]/m,                       // [ ]
    /\(\s*\)/m,                       // ( )
    /[Qq]uestion\s*[0-9]+/m,          // Question 1
    /[Cc]hoose\s+(the\s+)?(correct|right|best)\s+answer/m,  // Choose the correct answer
  ];
  
  return mcPatterns.some(pattern => pattern.test(text));
};

/**
 * Calculates confidence score for multiple choice content
 */
const calculateMultipleChoiceConfidence = (text: string): number => {
  let score = 50; // Base score
  
  // Check for strong indicators
  if (/[A-D]\)\s.+[\r\n]+[A-D]\)\s.+/im.test(text)) score += 20;
  if (/[Qq]uestion\s*[0-9]+/.test(text)) score += 15;
  if (/[Cc]hoose\s+(the\s+)?(correct|right|best)\s+answer/.test(text)) score += 15;
  
  // Check for question numbering
  if (/[1-9][0-9]*\.\s.+[\r\n]+[1-9][0-9]*\.\s.+/.test(text)) score += 10;
  
  // Check for answer keys or correct answers being marked
  if (/[Aa]nswer\s*[Kk]ey|[Cc]orrect\s*[Aa]nswers/.test(text)) score += 10;
  
  return Math.min(score, 95); // Cap at 95%
};

/**
 * Counts potential questions in text
 */
const countQuestions = (text: string): number => {
  // Count question marks
  const questionMarks = (text.match(/\?/g) || []).length;
  
  // Count numbered items that look like questions
  const numberedQuestions = (text.match(/[1-9][0-9]*\.\s+[A-Z].+[^.]$/gm) || []).length;
  
  // Count "Question X" patterns
  const questionLabels = (text.match(/[Qq]uestion\s*[0-9]+/g) || []).length;
  
  return Math.max(questionMarks, numberedQuestions, questionLabels);
};

/**
 * Detects if text contains patterns typical of flashcards
 */
const containsFlashcardPatterns = (text: string): boolean => {
  // Patterns that suggest flashcard content
  const fcPatterns = [
    /[\w\s]+\s*[-–—:]\s*[\w\s]+/m,   // Word - Definition
    /[\w\s]+\s*[=]\s*[\w\s]+/m,      // Word = Translation
    /[\w\s]+\s*[|]\s*[\w\s]+/m,      // Word | Translation
    /[\w\s]+\s*[,]\s*[\w\s]+/m,      // Word, Translation (in CSV-like format)
    /\b[a-zA-Z]+\b\s*\t\s*\b[a-zA-Z]+\b/m,  // Word TAB Translation
  ];
  
  return fcPatterns.some(pattern => pattern.test(text));
};

/**
 * Calculates confidence score for flashcard content
 */
const calculateFlashcardConfidence = (text: string): number => {
  let score = 40; // Base score
  
  // Look for patterns that strongly suggest vocabulary lists
  if (/(vocab|vocabulary|flashcard|dictionary|glossary)/i.test(text)) score += 20;
  
  // Check if there are multiple lines with a consistent separator
  const separators = ['-', '–', '—', ':', '=', '|', ',', '\t'];
  for (const sep of separators) {
    const regex = new RegExp(`[^${sep}]+${sep}[^${sep}]+`, 'gm');
    const matches = text.match(regex) || [];
    if (matches.length > 3) {
      score += 20;
      break;
    }
  }
  
  // Check if it has a table-like structure (words in columns)
  const lines = text.split(/[\r\n]+/);
  let consistentFormatCount = 0;
  let prevFormat = '';
  
  for (const line of lines) {
    const format = line.replace(/[a-zA-Z0-9]+/g, 'W').replace(/\s+/g, 'S');
    if (prevFormat && format === prevFormat) {
      consistentFormatCount++;
    }
    prevFormat = format;
  }
  
  if (consistentFormatCount > 3) score += 20;
  
  return Math.min(score, 95); // Cap at 95%
};

/**
 * Counts potential flashcards in text
 */
const countPotentialCards = (text: string): number => {
  // Count lines with common separators
  const separatorPattern = /[^\s]+\s*[-–—:|=,\t]\s*[^\s]+/g;
  const separatorMatches = text.match(separatorPattern) || [];
  
  // Count non-empty lines (as a fallback)
  const nonEmptyLines = text.split(/[\r\n]+/).filter(line => line.trim().length > 0).length;
  
  return separatorMatches.length > 0 ? separatorMatches.length : nonEmptyLines;
};

/**
 * Detects if text contains patterns typical of speaking exercises
 */
const containsSpeakingExercisePatterns = (text: string): boolean => {
  // Check for patterns suggesting speaking practice
  const speakingPatterns = [
    /[Rr]epeat\s+(after\s+me|the\s+following)/,
    /[Pp]ractice\s+saying/,
    /[Pp]ronounce\s+the\s+following/,
    /[Ss]peak\s+(the|these|following)/,
    /[Oo]ral\s+exercise/,
    /[Pp]ronunciation/,
    /[Ss]peaking\s+practice/,
  ];
  
  return speakingPatterns.some(pattern => pattern.test(text));
};

/**
 * Calculates confidence score for speaking content
 */
const calculateSpeakingConfidence = (text: string): number => {
  let score = 40; // Base score
  
  // Check for strong indicators of speaking practice
  if (/[Rr]epeat\s+(after\s+me|the\s+following)/.test(text)) score += 25;
  if (/[Pp]ractice\s+saying|[Pp]ronounce/.test(text)) score += 20;
  if (/[Pp]ronunciation|[Ss]peaking\s+practice/.test(text)) score += 15;
  
  // Check for dialog patterns
  if (/[A-Z][a-z]+\s*:\s*["']/.test(text)) score += 15;
  
  // Check for phrases separated for practice
  const bulletedPhrases = (text.match(/[-•*]\s+[^-•*\n\r]+/g) || []).length;
  if (bulletedPhrases > 2) score += 10;
  
  return Math.min(score, 95); // Cap at 95%
};

/**
 * Counts phrases that are likely to be speaking practice items
 */
const countPhrases = (text: string): number => {
  // Count things that look like isolated phrases for practice
  const patterns = [
    /["'].+["']/g,                  // Quoted phrases
    /[-•*]\s+[^-•*\n\r]+/g,         // Bulleted items
    /[1-9][0-9]*\.\s+[^.\n\r]+/g,   // Numbered items
    /^[A-Z].{5,50}[.!?]$/gm,        // Sentences that stand alone on a line (5-50 chars)
  ];
  
  let totalPhrases = 0;
  for (const pattern of patterns) {
    const matches = text.match(pattern) || [];
    totalPhrases += matches.length;
  }
  
  return totalPhrases;
};

/**
 * Detects if text contains patterns typical of listening exercises
 */
const containsListeningExercisePatterns = (text: string): boolean => {
  // Check for patterns suggesting listening comprehension
  const listeningPatterns = [
    /[Ll]isten(\s+to)?(\s+the)?(\s+audio|\s+recording)/,
    /[Aa]udio\s+(file|exercise|transcript)/,
    /[Tt]ranscript/,
    /[Ll]istening\s+(exercise|comprehension)/,
    /[Aa]fter\s+listening/,
    /[Hh]ear(ing)?\s+the\s+(audio|recording)/,
  ];
  
  return listeningPatterns.some(pattern => pattern.test(text));
};

/**
 * Calculates confidence score for listening content
 */
const calculateListeningConfidence = (text: string): number => {
  let score = 40; // Base score
  
  // Check for strong indicators of listening practice
  if (/[Ll]isten(\s+to)?(\s+the)?(\s+audio|\s+recording)/.test(text)) score += 25;
  if (/[Aa]udio\s+(file|exercise|transcript)|[Tt]ranscript/.test(text)) score += 20;
  if (/[Ll]istening\s+(exercise|comprehension)/.test(text)) score += 15;
  
  // Check for question pattern following transcript
  if (/[Tt]ranscript:[\s\S]+\n\s*[Qq]uestions?:/.test(text)) score += 20;
  
  return Math.min(score, 95); // Cap at 95%
};

/**
 * Extracts potential transcript from text
 */
const extractPotentialTranscript = (text: string): string => {
  // Try to find content that looks like a transcript
  const transcriptMatch = text.match(/[Tt]ranscript:?\s*\n([\s\S]+?)(?:\n\s*[A-Z][a-z]+:|\n\s*[Qq]uestions?:|\Z)/);
  
  if (transcriptMatch && transcriptMatch[1]) {
    return transcriptMatch[1].trim();
  }
  
  // Fallback: return empty string
  return '';
};

/**
 * Calculates confidence score for writing content
 */
const calculateWritingConfidence = (text: string): number => {
  let score = 30; // Base score
  
  // Check for indicators of writing exercises
  if (/[Ww]rite\s+(a|an|the|your)/.test(text)) score += 20;
  if (/[Ww]riting\s+(exercise|prompt|assignment)/.test(text)) score += 15;
  if (/[Ee]ssay|[Cc]omposition|[Pp]aragraph/.test(text)) score += 15;
  
  // Check for instructional language typical in writing prompts
  if (/[Dd]escribe|[Ee]xplain|[Dd]iscuss/.test(text)) score += 10;
  if (/[Ii]n\s+your\s+own\s+words/.test(text)) score += 10;
  
  // Check for structural elements of writing exercises
  if (/[Ii]ntroduction|[Cc]onclusion|[Bb]ody\s+paragraph/.test(text)) score += 10;
  
  return Math.min(score, 90); // Cap at 90% since writing is harder to detect
};

/**
 * Counts paragraphs in text
 */
const countParagraphs = (text: string): number => {
  // Split by double line breaks and count non-empty paragraphs
  return text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
};
