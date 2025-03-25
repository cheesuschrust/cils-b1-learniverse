
import natural from 'natural';

// Define content types
export type ContentType = 'multiple-choice' | 'flashcards' | 'writing' | 'speaking' | 'listening';

// Define file formats
export type FileFormat = 'text' | 'csv' | 'json' | 'anki' | 'pdf' | 'audio' | 'image' | 'unknown';

// Define language types
export type LanguageType = 'english' | 'italian' | 'spanish' | 'french' | 'german' | 'unknown';

// Function to detect language from text
export const detectLanguage = (text: string): LanguageType => {
  if (!text || text.trim().length < 10) {
    return 'unknown';
  }
  
  // Use Natural library for language detection
  const language = new natural.LanguageDetect();
  const guesses = language.detect(text, 2); // Get top 2 guesses
  
  if (guesses.length === 0) {
    return 'unknown';
  }
  
  // Get the top guess
  const [topLanguage, confidence] = guesses[0];
  
  // Map detected language to supported languages
  switch (topLanguage) {
    case 'english':
      return 'english';
    case 'italian':
      return 'italian';
    case 'spanish':
      return 'spanish';
    case 'french':
      return 'french';
    case 'german':
      return 'german';
    default:
      // If confidence is low, check for Italian and English common words
      if (confidence < 0.3) {
        const italianWords = ['ciao', 'buongiorno', 'grazie', 'prego', 'si', 'no', 'e', 'il', 'la', 'di', 'che', 'è'];
        const englishWords = ['hello', 'good', 'thank', 'yes', 'no', 'and', 'the', 'of', 'a', 'is', 'to', 'in'];
        
        const words = text.toLowerCase().split(/\W+/);
        let italianCount = 0;
        let englishCount = 0;
        
        for (const word of words) {
          if (italianWords.includes(word)) italianCount++;
          if (englishWords.includes(word)) englishCount++;
        }
        
        if (italianCount > englishCount && italianCount > 3) return 'italian';
        if (englishCount > italianCount && englishCount > 3) return 'english';
      }
      
      return 'unknown';
  }
};

// Function to detect content type
export const detectContentType = (content: string): ContentType => {
  if (!content) return 'writing';
  
  // Convert to lowercase for easier pattern matching
  const lowerContent = content.toLowerCase();
  
  // Check for flashcard patterns
  if (
    (lowerContent.includes('front:') && lowerContent.includes('back:')) ||
    (lowerContent.includes('term') && lowerContent.includes('definition')) ||
    (lowerContent.includes('question') && lowerContent.includes('answer') && !lowerContent.includes('multiple choice')) ||
    /\w+,\w+/.test(lowerContent) // Simple CSV format
  ) {
    return 'flashcards';
  }
  
  // Check for multiple choice patterns
  if (
    (lowerContent.includes('a)') || lowerContent.includes('b)') || lowerContent.includes('c)') || lowerContent.includes('d)')) ||
    (lowerContent.includes('option a') || lowerContent.includes('option b')) ||
    lowerContent.includes('multiple choice') ||
    lowerContent.includes('correct answer:') ||
    (lowerContent.includes('question') && lowerContent.includes('options'))
  ) {
    return 'multiple-choice';
  }
  
  // Check for listening exercise patterns
  if (
    lowerContent.includes('listen') ||
    lowerContent.includes('audio') ||
    lowerContent.includes('pronunciation') ||
    lowerContent.includes('spoken')
  ) {
    return 'listening';
  }
  
  // Check for speaking exercise patterns
  if (
    lowerContent.includes('speaking') ||
    lowerContent.includes('repeat') ||
    lowerContent.includes('pronunciation practice') ||
    lowerContent.includes('say the following')
  ) {
    return 'speaking';
  }
  
  // Default to writing
  return 'writing';
};

// Function to detect file format from filename or content
export const detectFileFormat = (filename: string, content?: string): FileFormat => {
  if (!filename) return 'unknown';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
      return 'text';
    case 'csv':
      return 'csv';
    case 'json':
      return 'json';
    case 'apkg':
      return 'anki';
    case 'pdf':
      return 'pdf';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
      return 'audio';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'image';
    default:
      // Try to detect from content
      if (content) {
        if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
          try {
            JSON.parse(content);
            return 'json';
          } catch (e) {
            // Not valid JSON
          }
        }
        
        if (content.includes(',') && content.split('\n').length > 1) {
          const lines = content.split('\n');
          const commaCount = lines[0].split(',').length;
          // If consistent comma count across lines, likely CSV
          if (lines.length > 1 && lines[1].split(',').length === commaCount) {
            return 'csv';
          }
        }
      }
      
      return 'text'; // Default to text
  }
};

// Function to parse content based on content type
export const parseContent = (content: string, contentType: ContentType): any => {
  if (!content) return null;
  
  try {
    switch (contentType) {
      case 'flashcards':
        // Try to parse as CSV first
        if (content.includes(',')) {
          const lines = content.trim().split('\n');
          return lines.map(line => {
            const [front, back, ...rest] = line.split(',').map(item => item.trim());
            return { front, back, notes: rest.join(' ') };
          });
        }
        
        // Try to parse structured format (front: back:)
        if (content.includes('front:') && content.includes('back:')) {
          const cards = [];
          const regex = /front:\s*([^\n]*)\s*back:\s*([^\n]*)/gi;
          let match;
          
          while ((match = regex.exec(content)) !== null) {
            cards.push({
              front: match[1].trim(),
              back: match[2].trim()
            });
          }
          
          return cards;
        }
        
        // Default simple format (one line front, one line back)
        const lines = content.trim().split('\n');
        const cards = [];
        
        for (let i = 0; i < lines.length; i += 2) {
          if (i + 1 < lines.length) {
            cards.push({
              front: lines[i].trim(),
              back: lines[i + 1].trim()
            });
          }
        }
        
        return cards;
        
      case 'multiple-choice':
        // Try to parse JSON first
        if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
          try {
            return JSON.parse(content);
          } catch (e) {
            // Not valid JSON
          }
        }
        
        // Try to parse structured format
        const questions = [];
        const questionRegex = /(?:question|q):\s*([^\n]*)\s*(?:options|choices):\s*([^\n]*)\s*(?:answer|correct):\s*([^\n]*)/gi;
        let questionMatch;
        
        while ((questionMatch = questionRegex.exec(content)) !== null) {
          questions.push({
            question: questionMatch[1].trim(),
            options: questionMatch[2].split(/[,;]/).map(o => o.trim()),
            correctAnswer: questionMatch[3].trim()
          });
        }
        
        if (questions.length > 0) {
          return questions;
        }
        
        // Default to returning the raw content for further processing
        return content;
        
      case 'writing':
      case 'speaking':
      case 'listening':
        // Return raw content for these types
        return content;
        
      default:
        return content;
    }
  } catch (error) {
    console.error('Error parsing content:', error);
    return content; // Return raw content on error
  }
};

// Calculate confidence score for content type detection
export const calculateConfidenceScore = (content: string, detectedType: ContentType): number => {
  if (!content) return 50; // Default medium confidence
  
  const lowerContent = content.toLowerCase();
  
  // Initialize with base confidence
  let confidence = 50;
  
  switch (detectedType) {
    case 'flashcards':
      // Increase confidence based on patterns
      if (lowerContent.includes('front:') && lowerContent.includes('back:')) confidence += 30;
      if (lowerContent.includes('term') && lowerContent.includes('definition')) confidence += 25;
      
      // Check CSV format
      const lines = content.split('\n');
      if (lines.length > 1) {
        const firstLine = lines[0];
        const secondLine = lines[1];
        
        if (firstLine.includes(',') && secondLine.includes(',')) {
          if (firstLine.split(',').length === secondLine.split(',').length) {
            confidence += 20;
          }
        }
      }
      
      // Check for even number of lines (potentially front/back pairs)
      if (lines.length >= 4 && lines.length % 2 === 0) confidence += 10;
      
      break;
      
    case 'multiple-choice':
      // Increase confidence based on patterns
      if (lowerContent.match(/a\)\s.*b\)\s.*c\)\s.*d\)\s/s)) confidence += 35;
      if (lowerContent.includes('multiple choice')) confidence += 20;
      if (lowerContent.includes('correct answer')) confidence += 20;
      if (lowerContent.includes('question') && lowerContent.includes('options')) confidence += 25;
      
      // Check for JSON structure
      if ((lowerContent.trim().startsWith('{') || lowerContent.trim().startsWith('[')) && 
          (lowerContent.trim().endsWith('}') || lowerContent.trim().endsWith(']'))) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0 && 
              (parsed[0].question || parsed[0].options)) {
            confidence += 30;
          }
        } catch (e) {
          // Not valid JSON
        }
      }
      
      break;
      
    case 'listening':
      if (lowerContent.includes('listening')) confidence += 20;
      if (lowerContent.includes('audio')) confidence += 15;
      if (lowerContent.includes('pronunciation')) confidence += 15;
      if (lowerContent.includes('transcript')) confidence += 25;
      break;
      
    case 'speaking':
      if (lowerContent.includes('speaking')) confidence += 20;
      if (lowerContent.includes('pronunciation practice')) confidence += 25;
      if (lowerContent.includes('repeat')) confidence += 15;
      if (lowerContent.includes('say these')) confidence += 20;
      break;
      
    case 'writing':
      // Writing is harder to detect positively, so we'll detect by absence of other indicators
      if (!lowerContent.includes('front:') && 
          !lowerContent.includes('question') && 
          !lowerContent.includes('option') &&
          !lowerContent.includes('listen') &&
          !lowerContent.includes('speak')) {
        confidence += 15;
      }
      
      // Check for paragraph structure
      if (content.split('\n\n').length > 1) {
        confidence += 20;
      }
      
      break;
  }
  
  // Clamp confidence between 0 and 100
  return Math.min(100, Math.max(0, confidence));
};

// Function to extract keywords from text
export const extractKeywords = (text: string, count: number = 10): string[] => {
  const tokenizer = new natural.WordTokenizer();
  const stopwords = natural.stopwords;
  
  // Tokenize and convert to lowercase
  const tokens = tokenizer.tokenize(text) || [];
  const words = tokens.map(token => token.toLowerCase());
  
  // Filter out stopwords and non-alphabetic tokens
  const filteredWords = words.filter(word => 
    !stopwords.includes(word) && 
    word.length > 2 && 
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ]+$/.test(word)
  );
  
  // Count word frequency
  const wordFreq: {[key: string]: number} = {};
  
  for (const word of filteredWords) {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }
  
  // Convert to array of [word, frequency] pairs and sort by frequency
  const pairs = Object.entries(wordFreq);
  pairs.sort((a, b) => b[1] - a[1]);
  
  // Return the top keywords
  return pairs.slice(0, count).map(pair => pair[0]);
};

// Calculate readability score (Flesch-Kincaid)
export const calculateReadabilityScore = (text: string): number => {
  try {
    // Count sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    
    if (sentenceCount === 0) return 50;
    
    // Count words
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const wordCount = words.length;
    
    if (wordCount === 0) return 50;
    
    // Count syllables (approximate)
    let syllableCount = 0;
    for (const word of words) {
      syllableCount += countSyllables(word);
    }
    
    // Calculate Flesch-Kincaid Reading Ease
    const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Error calculating readability:', error);
    return 50; // Default medium score
  }
};

// Helper function to count syllables
function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  
  // Remove punctuation
  word = word.replace(/[.,?!;:()'"]/g, '');
  
  // Count vowel groups
  const vowels = 'aeiouy';
  let count = 0;
  let isLastVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !isLastVowel) {
      count++;
    }
    isLastVowel = isVowel;
  }
  
  // Handle silent e at the end
  if (word.length > 2 && word.endsWith('e') && !vowels.includes(word[word.length - 2])) {
    count--;
  }
  
  // Ensure at least one syllable
  return Math.max(1, count);
}
