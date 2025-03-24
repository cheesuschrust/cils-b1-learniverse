
import { classifyText } from '@/services/AIService';

// Simple tokenizer (splits text into words)
export const tokenize = (text: string): string[] => {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Extract keywords based on frequency
export const extractKeywords = (text: string, maxKeywords: number = 10): string[] => {
  const tokens = tokenize(text);
  const wordFreq: Record<string, number> = {};
  
  // Calculate word frequencies
  tokens.forEach(token => {
    if (token.length > 3) { // Ignore very short words
      wordFreq[token] = (wordFreq[token] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(entry => entry[0]);
};

// Extract potential entities (capitalized words/phrases)
export const extractEntities = (text: string, maxEntities: number = 10): string[] => {
  const potentialEntities = text.match(/[A-Z][a-z]+(\s[A-Z][a-z]+)*/g) || [];
  return [...new Set(potentialEntities)].slice(0, maxEntities);
};

// Generate a simple summary (first few sentences)
export const generateSummary = (text: string, maxSentences: number = 3): string => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, maxSentences).join(' ');
};

// Define a type for content types that's consistent across the application
export type ContentType = "flashcards" | "multiple-choice" | "writing" | "speaking" | "listening";
// Also define an alternative type for the UI which uses camelCase for multipleChoice
export type ContentTypeUI = "flashcards" | "multipleChoice" | "writing" | "speaking" | "listening";

// Helper function to convert between the two content type formats
export const convertContentType = (type: ContentType | ContentTypeUI): ContentType | ContentTypeUI => {
  if (type === "multiple-choice") return "multipleChoice";
  if (type === "multipleChoice") return "multiple-choice";
  return type;
};

// Detect content type based on keywords and patterns using AI
export const detectContentType = async (content: string, fileType: string): Promise<{
  type: ContentType;
  confidence: number;
}> => {
  // Try to use AI for detection
  try {
    const classifications = await classifyText(content.substring(0, 5000)); // Limit length for performance
    
    // Map classifications to content types
    if (classifications.some(c => c.label.includes("listening") || c.label.includes("audio"))) {
      return { type: "listening", confidence: 85 };
    } else if (classifications.some(c => c.label.includes("flashcard") || c.label.includes("vocabulary"))) {
      return { type: "flashcards", confidence: 80 };
    } else if (classifications.some(c => c.label.includes("question") || c.label.includes("quiz"))) {
      return { type: "multiple-choice", confidence: 90 };
    } else if (classifications.some(c => c.label.includes("writing") || c.label.includes("essay"))) {
      return { type: "writing", confidence: 75 };
    } else if (classifications.some(c => c.label.includes("speaking") || c.label.includes("pronunciation"))) {
      return { type: "speaking", confidence: 70 };
    }
  } catch (e) {
    // If AI fails, fallback to rule-based approach
    console.log("AI classification failed, using fallback detection");
  }
  
  // Fallback to rule-based approach
  const contentLower = content.toLowerCase();
  let contentType: ContentType = "multiple-choice";
  let confidence = 50;
  
  // Check for different patterns
  if (fileType.startsWith("audio/") || 
      contentLower.includes("listen") || 
      contentLower.includes("audio") ||
      contentLower.includes("pronunciation")) {
    contentType = "listening";
    confidence = 85;
  } else if (contentLower.includes("vocabulary") || 
            contentLower.includes("words") ||
            contentLower.includes("flashcard") ||
            contentLower.includes("flash card")) {
    contentType = "flashcards";
    confidence = 80;
  } else if (contentLower.includes("speak") || 
            contentLower.includes("pronunciation") ||
            contentLower.includes("conversation")) {
    contentType = "speaking";
    confidence = 75;
  } else if (contentLower.includes("write") || 
            contentLower.includes("essay") ||
            contentLower.includes("writing")) {
    contentType = "writing";
    confidence = 70;
  } else if (content.match(/\?/g)?.length > 3 || 
            content.match(/[A-D]\)/g)?.length > 3 ||
            contentLower.includes("choose") ||
            contentLower.includes("select")) {
    contentType = "multiple-choice";
    confidence = 90;
  }
  
  return { type: contentType, confidence };
};

// Simple function to detect language
export const detectLanguage = (text: string): "english" | "italian" | "unknown" => {
  const italianWords = ['il', 'la', 'e', 'sono', 'che', 'di', 'per', 'non', 'un', 'una', 'è', 'io', 'tu', 'lui', 'lei'];
  const englishWords = ['the', 'and', 'is', 'are', 'that', 'of', 'for', 'not', 'a', 'an', 'i', 'you', 'he', 'she'];
  
  const words = tokenize(text);
  let italianCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (italianWords.includes(word)) italianCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  if (italianCount > englishCount * 1.5) return "italian";
  if (englishCount > italianCount * 1.5) return "english";
  return "unknown";
};

// Helper function to shuffle array
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
