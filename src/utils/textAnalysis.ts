
import natural from 'natural';
import { z } from 'zod';

// Define content types for the application
export type ContentType = 'multiple-choice' | 'flashcards' | 'writing' | 'speaking' | 'listening';

// Simple language detection
export const detectLanguage = (text: string): 'english' | 'italian' | 'spanish' | 'french' | 'german' | 'unknown' => {
  if (!text || text.trim().length < 5) {
    return 'unknown';
  }
  
  // Count occurrences of language-specific characters or patterns
  const italianPatterns = [
    /\bsono\b/i, /\bsei\b/i, /\bè\b/i, /\bsiamo\b/i, /\bsiete\b/i, 
    /\bche\b/i, /\bbambino\b/i, /\bbuon(a|o)\b/i, /\bmolt(o|a)\b/i,
    /\bgiorno\b/i, /\bquesto\b/i, /\bella\b/i, /\btutt(i|o|a|e)\b/i,
    /\bcosa\b/i, /\bquando\b/i, /\bperché\b/i, /\bdove\b/i,
    /\bcome\b/i, /\bqui\b/i, /\bchi\b/i, /\bpiacere\b/i
  ];
  
  const englishPatterns = [
    /\bis\b/i, /\bare\b/i, /\bwas\b/i, /\bwere\b/i, /\bthe\b/i, 
    /\ba\b/i, /\ban\b/i, /\bto\b/i, /\bin\b/i, /\bfor\b/i,
    /\bwith\b/i, /\byou\b/i, /\bthey\b/i, /\bwe\b/i, /\bhe\b/i,
    /\bshe\b/i, /\bit\b/i, /\band\b/i, /\bor\b/i, /\bnot\b/i
  ];
  
  const spanishPatterns = [
    /\bes\b/i, /\bson\b/i, /\bestá\b/i, /\bestán\b/i, /\bel\b/i, 
    /\bla\b/i, /\blos\b/i, /\blas\b/i, /\bun\b/i, /\buna\b/i,
    /\bunos\b/i, /\bunas\b/i, /\by\b/i, /\bo\b/i, /\bpero\b/i,
    /\bque\b/i, /\bcuando\b/i, /\bcómo\b/i, /\bdónde\b/i, /\bporqué\b/i
  ];
  
  const frenchPatterns = [
    /\best\b/i, /\bsont\b/i, /\bétait\b/i, /\bétaient\b/i, /\ble\b/i, 
    /\bla\b/i, /\bles\b/i, /\bun\b/i, /\bune\b/i, /\bdes\b/i,
    /\bet\b/i, /\bou\b/i, /\bmais\b/i, /\bque\b/i, /\bquand\b/i,
    /\bcomment\b/i, /\boù\b/i, /\bpourquoi\b/i, /\bqui\b/i, /\bavec\b/i
  ];
  
  const germanPatterns = [
    /\bist\b/i, /\bsind\b/i, /\bwar\b/i, /\bwaren\b/i, /\bder\b/i, 
    /\bdie\b/i, /\bdas\b/i, /\bein\b/i, /\beine\b/i, /\bund\b/i,
    /\boder\b/i, /\baber\b/i, /\bwenn\b/i, /\bwann\b/i, /\bwie\b/i,
    /\bwo\b/i, /\bwarum\b/i, /\bwer\b/i, /\bmit\b/i, /\bfür\b/i
  ];
  
  // Function to count matches for a set of patterns
  const countMatches = (patterns: RegExp[]) => {
    return patterns.reduce((count, pattern) => {
      const matches = text.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
  };
  
  // Count matches for each language
  const italianCount = countMatches(italianPatterns);
  const englishCount = countMatches(englishPatterns);
  const spanishCount = countMatches(spanishPatterns);
  const frenchCount = countMatches(frenchPatterns);
  const germanCount = countMatches(germanPatterns);
  
  // Find the maximum count
  const maxCount = Math.max(italianCount, englishCount, spanishCount, frenchCount, germanCount);
  
  // If no significant pattern is detected, return unknown
  if (maxCount < 2) {
    return 'unknown';
  }
  
  // Return the language with the highest count
  if (italianCount === maxCount) return 'italian';
  if (englishCount === maxCount) return 'english';
  if (spanishCount === maxCount) return 'spanish';
  if (frenchCount === maxCount) return 'french';
  if (germanCount === maxCount) return 'german';
  
  return 'unknown';
};

// Detect content type from text
export const detectContentType = (text: string): ContentType => {
  if (!text || text.trim().length < 20) {
    // Default to writing if text is too short to analyze
    return 'writing';
  }
  
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Check for patterns indicating multiple choice questions
  const mcQuestionPatterns = [
    /\?.*\ba\)|\bb\)|\bc\)|\bd\)/i,
    /\bwhich of the following\b/i,
    /\bchoose the correct\b/i,
    /\bchoose the best\b/i,
    /\bselect the\b.*\boption\b/i,
    /\bcorrect answer\b/i,
    /\bmultiple choice\b/i,
    /\s[a-d]\.\s/g, // a. b. c. d. format
  ];
  
  // Check for patterns indicating flashcards
  const flashcardPatterns = [
    /\btranslation\b/i,
    /\bvocabulary\b/i,
    /\bword list\b/i,
    /\bglossary\b/i,
    /\bterm\b.*\bdefinition\b/i,
    /\bitali[a-z]*\s*:\s*english\b/i, // Italian: English pattern
    /\benglish\s*:\s*itali[a-z]*\b/i, // English: Italian pattern
    /\b\w+\s*-\s*\w+\b/g, // word - definition format
    /\b\w+\s*:\s*\w+\b/g, // word: definition format
    /\b\w+\s*=\s*\w+\b/g, // word = definition format
  ];
  
  // Check for patterns indicating speaking exercises
  const speakingPatterns = [
    /\bspeak\b/i,
    /\bsay\b/i,
    /\bpronounce\b/i,
    /\bpronunciation\b/i,
    /\bconversation\b/i,
    /\bdialogue\b/i,
    /\brepeat\b/i,
    /\blistening\b/i,
    /\baudio\b/i,
  ];
  
  // Check for patterns indicating listening exercises
  const listeningPatterns = [
    /\blisten\b/i,
    /\baudio\b/i,
    /\bsound\b/i,
    /\brecording\b/i,
    /\bheadphones\b/i,
    /\bspeaker\b/i,
    /\bheadset\b/i,
    /\bplay\b.*\baudio\b/i,
  ];
  
  // Count pattern matches for each type
  const mcMatches = mcQuestionPatterns.filter(pattern => pattern.test(lowerText)).length;
  const flashcardMatches = flashcardPatterns.filter(pattern => pattern.test(lowerText)).length;
  const speakingMatches = speakingPatterns.filter(pattern => pattern.test(lowerText)).length;
  const listeningMatches = listeningPatterns.filter(pattern => pattern.test(lowerText)).length;
  
  // Check for tab/comma-separated values which often indicate flashcards
  const hasTabbedFormat = /\w+\t\w+/.test(text); // Word<tab>Word format
  const hasCSVFormat = /\w+,\w+/.test(text) && text.split(',').length > 2; // CSV format
  
  if (hasTabbedFormat || hasCSVFormat) {
    flashcardMatches += 3; // Add weight for structured formats
  }
  
  // Check for question mark prevalence which might indicate multiple choice
  const questionMarkCount = (text.match(/\?/g) || []).length;
  const lineCount = text.split('\n').filter(line => line.trim().length > 0).length;
  const questionRatio = lineCount > 0 ? questionMarkCount / lineCount : 0;
  
  if (questionRatio > 0.3) {
    mcMatches += 2; // Add weight if many lines have question marks
  }
  
  // Additional weight for content with numbered questions
  const numberedQuestions = text.match(/\b\d+\s*[.)\]]\s*\w+/g);
  if (numberedQuestions && numberedQuestions.length > 3) {
    mcMatches += 2;
  }
  
  // Count headings (# in markdown) which are common in writing exercises
  const headingCount = (text.match(/^#{1,6}\s+.+$/gm) || []).length;
  
  // Find the dominant type
  const maxMatches = Math.max(mcMatches, flashcardMatches, speakingMatches, listeningMatches);
  
  // If no clear pattern is detected, default to writing
  if (maxMatches < 2) {
    return 'writing';
  }
  
  // Return the content type with the most matches
  if (mcMatches === maxMatches) return 'multiple-choice';
  if (flashcardMatches === maxMatches) return 'flashcards';
  if (speakingMatches === maxMatches) return 'speaking';
  if (listeningMatches === maxMatches) return 'listening';
  
  // Default to writing
  return 'writing';
};

// Parse content based on detected type
export const parseContent = (content: string, contentType: ContentType): any => {
  switch (contentType) {
    case 'multiple-choice':
      return parseMultipleChoice(content);
    case 'flashcards':
      return parseFlashcards(content);
    case 'speaking':
    case 'listening':
    case 'writing':
    default:
      return { text: content.trim() };
  }
};

// Parse multiple choice content
const parseMultipleChoice = (content: string): any => {
  const questions = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  let currentQuestion: any = null;
  
  for (const line of lines) {
    const questionMatch = line.match(/^\s*(\d+)[.)\]]\s+(.+)/);
    const optionMatch = line.match(/^\s*([A-D])[.)\]]\s+(.+)/i) || line.match(/^\s*([a-d])\.\s+(.+)/i);
    
    if (questionMatch) {
      // Save previous question if exists
      if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
      }
      
      // Start a new question
      currentQuestion = {
        id: questions.length + 1,
        question: questionMatch[2].trim(),
        options: [],
        correctAnswer: null,
        explanation: "",
      };
    } else if (optionMatch && currentQuestion) {
      // Add option to current question
      const optionLetter = optionMatch[1].toUpperCase();
      const optionText = optionMatch[2].trim();
      
      currentQuestion.options.push({
        id: optionLetter,
        text: optionText,
      });
      
      // Check if this option is marked as correct
      if (optionText.includes('*CORRECT*') || optionText.includes('(correct)')) {
        currentQuestion.correctAnswer = optionLetter;
        currentQuestion.options[currentQuestion.options.length - 1].text = optionText
          .replace('*CORRECT*', '')
          .replace('(correct)', '')
          .trim();
      }
    } else if (line.toLowerCase().includes('answer:') && currentQuestion) {
      // Parse answer indicator
      const answerMatch = line.match(/answer:\s*([A-D])/i);
      if (answerMatch) {
        currentQuestion.correctAnswer = answerMatch[1].toUpperCase();
      }
    } else if (line.toLowerCase().includes('explanation:') && currentQuestion) {
      // Parse explanation
      currentQuestion.explanation = line.replace(/explanation:/i, '').trim();
    } else if (currentQuestion && currentQuestion.explanation) {
      // Append to existing explanation
      currentQuestion.explanation += ' ' + line.trim();
    }
  }
  
  // Add the last question
  if (currentQuestion && currentQuestion.options.length > 0) {
    questions.push(currentQuestion);
  }
  
  // If no correct answers were marked, make a reasonable guess for each question
  questions.forEach(q => {
    if (!q.correctAnswer && q.options.length > 0) {
      // Default to first option if no correct answer was identified
      q.correctAnswer = q.options[0].id;
    }
  });
  
  return questions;
};

// Parse flashcard content
const parseFlashcards = (content: string): any => {
  const cards = [];
  
  // Try to determine the format
  const hasTabs = content.includes('\t');
  const hasCommas = content.includes(',');
  const hasSemicolons = content.includes(';');
  const hasColons = content.includes(':');
  const hasDashes = content.includes(' - ');
  
  let separator: string;
  let hasHeader = false;
  
  // Determine the most likely separator
  if (hasTabs) {
    separator = '\t';
  } else if (hasCommas && content.split(',').length > 2) {
    separator = ',';
    
    // Check if the first line looks like a header
    const firstLine = content.split('\n')[0].toLowerCase();
    if (firstLine.includes('italian') || firstLine.includes('english') || 
        firstLine.includes('term') || firstLine.includes('definition')) {
      hasHeader = true;
    }
  } else if (hasSemicolons) {
    separator = ';';
  } else if (hasColons) {
    separator = ':';
  } else if (hasDashes) {
    separator = ' - ';
  } else {
    // Fallback to newlines as separator between pairs
    const lines = content.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        cards.push({
          italian: lines[i].trim(),
          english: lines[i + 1].trim(),
        });
      }
    }
    
    return cards;
  }
  
  // Process with the identified separator
  const lines = content.split('\n').filter(line => line.trim());
  const startIndex = hasHeader ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(separator);
    
    if (parts.length >= 2) {
      const italian = parts[0].trim();
      const english = parts[1].trim();
      
      if (italian && english) {
        cards.push({
          italian,
          english,
        });
      }
    }
  }
  
  return cards;
};

// Format detection function
export const detectFileFormat = (filename: string): 'text' | 'image' | 'audio' | 'video' | 'data' | 'unknown' => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const formatMap: Record<string, 'text' | 'image' | 'audio' | 'video' | 'data'> = {
    // Text formats
    'txt': 'text',
    'md': 'text',
    'doc': 'text',
    'docx': 'text',
    'pdf': 'text',
    'rtf': 'text',
    'html': 'text',
    'htm': 'text',
    
    // Image formats
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'bmp': 'image',
    'svg': 'image',
    'webp': 'image',
    
    // Audio formats
    'mp3': 'audio',
    'wav': 'audio',
    'ogg': 'audio',
    'm4a': 'audio',
    'flac': 'audio',
    
    // Video formats
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video',
    'wmv': 'video',
    'mkv': 'video',
    'webm': 'video',
    
    // Data formats
    'csv': 'data',
    'json': 'data',
    'xml': 'data',
    'xlsx': 'data',
    'xls': 'data',
    'tsv': 'data',
  };
  
  return formatMap[extension] || 'unknown';
};

// Schema for content validation
export const contentSchema = z.object({
  type: z.enum(['multiple-choice', 'flashcards', 'writing', 'speaking', 'listening']),
  language: z.enum(['english', 'italian', 'spanish', 'french', 'german', 'unknown']).default('unknown'),
  content: z.string(),
  parsedContent: z.any().optional(),
});

export type ValidatedContent = z.infer<typeof contentSchema>;

// Analyze text readability
export const analyzeReadability = (text: string): { 
  readabilityScore: number;
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  uniqueWordCount: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  keywords: string[];
} => {
  if (!text || text.length === 0) {
    return {
      readabilityScore: 0,
      wordCount: 0,
      sentenceCount: 0,
      averageSentenceLength: 0,
      uniqueWordCount: 0,
      level: 'beginner',
      keywords: []
    };
  }
  
  // Count sentences (split by .!?)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Count words
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const wordCount = words.length;
  
  // Count unique words
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')));
  const uniqueWordCount = uniqueWords.size;
  
  // Calculate average sentence length
  const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  // Simple readability formula based on average sentence length and unique word ratio
  const uniqueWordRatio = wordCount > 0 ? uniqueWordCount / wordCount : 0;
  const readabilityScore = Math.round((averageSentenceLength * 0.6 + uniqueWordRatio * 50) * 10) / 10;
  
  // Determine level based on readability score
  let level: 'beginner' | 'intermediate' | 'advanced';
  if (readabilityScore < 15) {
    level = 'beginner';
  } else if (readabilityScore < 30) {
    level = 'intermediate';
  } else {
    level = 'advanced';
  }
  
  // Extract potential keywords (longer words that appear multiple times)
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    if (cleanWord.length > 3) { // Only count words with more than 3 characters
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  // Sort by frequency and get top keywords
  const keywords = Object.entries(wordFrequency)
    .filter(([_, count]) => count > 1) // Only include words that appear more than once
    .sort((a, b) => b[1] - a[1]) // Sort by frequency
    .slice(0, 10) // Get top 10
    .map(([word, _]) => word);
  
  return {
    readabilityScore,
    wordCount,
    sentenceCount,
    averageSentenceLength,
    uniqueWordCount,
    level,
    keywords
  };
};
