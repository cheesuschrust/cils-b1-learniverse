export type ContentType = 
  | 'multiple-choice' 
  | 'flashcards' 
  | 'writing' 
  | 'speaking' 
  | 'listening'
  | 'audio'
  | 'unknown'
  | 'csv'
  | 'json'
  | 'txt'
  | 'pdf';

export const detectContentType = (content: string): ContentType => {
  // Simple detection logic based on content patterns
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('question') && 
      (lowerContent.includes('option') || lowerContent.includes('choice'))) {
    return 'multiple-choice';
  }
  
  if ((lowerContent.includes('term') && lowerContent.includes('definition')) ||
      (lowerContent.includes('front') && lowerContent.includes('back')) ||
      (lowerContent.includes('word') && lowerContent.includes('translation'))) {
    return 'flashcards';
  }
  
  if (lowerContent.includes('listen') && 
      (lowerContent.includes('audio') || lowerContent.includes('transcript'))) {
    return 'listening';
  }
  
  if (lowerContent.includes('speak') || 
      lowerContent.includes('pronunciation') ||
      lowerContent.includes('conversation')) {
    return 'speaking';
  }
  
  if (lowerContent.includes('write') || 
      lowerContent.includes('essay') ||
      lowerContent.includes('paragraph')) {
    return 'writing';
  }
  
  // Detect file type based on content
  if (content.startsWith('{') && content.endsWith('}')) {
    try {
      JSON.parse(content);
      return 'json';
    } catch (e) {
      // Not valid JSON
    }
  }
  
  if (content.includes(',') && content.split('\n').length > 1) {
    // Simple CSV detection
    return 'csv';
  }
  
  if (content.includes('\t') && content.split('\n').length > 1) {
    // Tab-delimited text
    return 'txt';
  }
  
  return 'unknown';
};

export const detectLanguage = (content: string): 'english' | 'italian' | 'spanish' | 'french' | 'german' | 'unknown' => {
  // Very basic language detection based on common words
  const lowerContent = content.toLowerCase();
  
  // Italian common words/patterns
  const italianPatterns = ['il', 'la', 'sono', 'e', 'che', 'di', 'per', 'non', 'un', 'una', 'con', 'mi'];
  // English common words/patterns
  const englishPatterns = ['the', 'is', 'and', 'to', 'of', 'that', 'in', 'it', 'with', 'for', 'you', 'are'];
  // Spanish common words/patterns
  const spanishPatterns = ['el', 'la', 'es', 'y', 'que', 'en', 'de', 'por', 'no', 'un', 'una', 'con'];
  // French common words/patterns
  const frenchPatterns = ['le', 'la', 'est', 'et', 'que', 'en', 'de', 'pour', 'ne', 'un', 'une', 'avec'];
  // German common words/patterns
  const germanPatterns = ['der', 'die', 'das', 'ist', 'und', 'zu', 'in', 'mit', 'für', 'nicht', 'ein', 'eine'];
  
  let italianCount = 0;
  let englishCount = 0;
  let spanishCount = 0;
  let frenchCount = 0;
  let germanCount = 0;
  
  // Count occurrences of language patterns
  for (const word of italianPatterns) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) italianCount += matches.length;
  }
  
  for (const word of englishPatterns) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) englishCount += matches.length;
  }
  
  for (const word of spanishPatterns) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) spanishCount += matches.length;
  }
  
  for (const word of frenchPatterns) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) frenchCount += matches.length;
  }
  
  for (const word of germanPatterns) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) germanCount += matches.length;
  }
  
  // Determine the most likely language
  const max = Math.max(italianCount, englishCount, spanishCount, frenchCount, germanCount);
  
  if (max < 3) return 'unknown'; // Not enough evidence
  
  if (italianCount === max) return 'italian';
  if (englishCount === max) return 'english';
  if (spanishCount === max) return 'spanish';
  if (frenchCount === max) return 'french';
  if (germanCount === max) return 'german';
  
  return 'unknown';
};

export const detectFileFormat = (filename: string): 'csv' | 'json' | 'txt' | 'pdf' | 'audio' | 'unknown' => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv':
      return 'csv';
    case 'json':
      return 'json';
    case 'txt':
      return 'txt';
    case 'pdf':
      return 'pdf';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
      return 'audio';
    default:
      return 'unknown';
  }
};

export const parseContent = (content: string, type: ContentType): any => {
  switch (type) {
    case 'json':
      try {
        return JSON.parse(content);
      } catch (e) {
        throw new Error('Failed to parse JSON content');
      }
    case 'csv':
      // Simple CSV parser
      const lines = content.split('\n').filter(line => line.trim());
      return lines.map(line => line.split(',').map(cell => cell.trim()));
    case 'flashcards':
      // Extract potential flashcard pairs
      try {
        // Try to parse as JSON first
        try {
          const json = JSON.parse(content);
          if (Array.isArray(json)) {
            return json;
          }
        } catch (e) {
          // Not JSON, continue with other methods
        }
        
        // Try to parse as CSV
        const lines = content.split('\n').filter(line => line.trim());
        const pairs = lines.map(line => {
          const parts = line.split(/[,\t]/);
          if (parts.length >= 2) {
            return {
              term: parts[0].trim(),
              definition: parts[1].trim()
            };
          }
          return null;
        }).filter(Boolean);
        
        if (pairs.length > 0) {
          return pairs;
        }
        
        // Fallback: try to detect term-definition patterns
        const termDefPatterns = content.match(/(.+?)[:\-–—]\s*(.+?)(?=\n|$)/g);
        if (termDefPatterns && termDefPatterns.length > 0) {
          return termDefPatterns.map(pattern => {
            const [term, definition] = pattern.split(/[:\-–—]/).map(p => p.trim());
            return { term, definition };
          });
        }
        
        return null;
      } catch (e) {
        console.error('Error parsing flashcards:', e);
        return null;
      }
    default:
      return content;
  }
};

// Text analysis utilities

export const detectContentTypeFromFile = (file: File): Promise<ContentType> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      resolve(detectContentType(content));
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
};

export const detectContentTypeFromText = (text: string): Promise<ContentType> => {
  return Promise.resolve(detectContentType(text));
};

export const isMultipleChoice = (text: string): boolean => {
  const lowerContent = text.toLowerCase();
  return lowerContent.includes('question') && 
         (lowerContent.includes('option') || lowerContent.includes('choice'));
};

export const isFlashcards = (text: string): boolean => {
  const lowerContent = text.toLowerCase();
  return (lowerContent.includes('term') && lowerContent.includes('definition')) ||
         (lowerContent.includes('front') && lowerContent.includes('back')) ||
         (lowerContent.includes('word') && lowerContent.includes('translation'));
};

export const isWritingExercise = (text: string): boolean => {
  const lowerContent = text.toLowerCase();
  return lowerContent.includes('write') || 
         lowerContent.includes('essay') ||
         lowerContent.includes('paragraph');
};

export const isSpeakingExercise = (text: string): boolean => {
  const lowerContent = text.toLowerCase();
  return lowerContent.includes('speak') || 
         lowerContent.includes('pronunciation') ||
         lowerContent.includes('conversation');
};

export const isListeningExercise = (text: string): boolean => {
  const lowerContent = text.toLowerCase();
  return lowerContent.includes('listen') && 
         (lowerContent.includes('audio') || lowerContent.includes('transcript'));
};
