
// Content type definitions
export type ContentType = 'multiple-choice' | 'flashcards' | 'writing' | 'speaking' | 'listening';

// Language detection function
export const detectLanguage = (text: string): 'english' | 'italian' | 'unknown' => {
  const italianPatterns = /[àèéìíòóùú]|sono|questo|quello|come|ciao|buongiorno|grazie/i;
  const englishPatterns = /\b(the|is|are|am|was|were|have|has|had|this|that|these|those)\b/i;

  const hasItalianMarkers = italianPatterns.test(text);
  const hasEnglishMarkers = englishPatterns.test(text);

  if (hasItalianMarkers && !hasEnglishMarkers) return 'italian';
  if (hasEnglishMarkers && !hasItalianMarkers) return 'english';
  
  // If text has markers of both languages or neither, do simple word count comparison
  const italianWordCount = (text.match(italianPatterns) || []).length;
  const englishWordCount = (text.match(englishPatterns) || []).length;
  
  if (italianWordCount > englishWordCount) return 'italian';
  if (englishWordCount > italianWordCount) return 'english';
  
  return 'unknown';
};

// Content type detection
export const detectContentType = (text: string): ContentType => {
  // Multiple choice detection
  if (/\b([A-D]\.|\d\.)\s+\w+/.test(text) || 
      /\bChoose the correct answer\b|\bSelect the best option\b|\bWhich of the following\b/i.test(text)) {
    return 'multiple-choice';
  }
  
  // Flashcards detection (typically word-translation pairs)
  if (text.split('\n').length < 3 && text.split('\n').every(line => line.split(/[-:=]/).length === 2)) {
    return 'flashcards';
  }
  
  // Speaking detection
  if (/\bRepeat after me\b|\bpronounce\b|\bsay this\b|\brecord yourself\b/i.test(text)) {
    return 'speaking';
  }
  
  // Listening detection
  if (/\bListen\b|\bAudio\b|\bListen and answer\b|\bListening exercise\b/i.test(text)) {
    return 'listening';
  }
  
  // Default to writing if no other pattern matches
  return 'writing';
};

// File format detection
export const detectFileFormat = (fileName: string): 'csv' | 'json' | 'txt' | 'pdf' | 'audio' | 'unknown' => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv': return 'csv';
    case 'json': return 'json';
    case 'txt': return 'txt';
    case 'pdf': return 'pdf';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a': return 'audio';
    default: return 'unknown';
  }
};

// Content parsing based on file format
export const parseContent = (content: string, format: 'csv' | 'json' | 'txt' | 'pdf' | 'audio' | 'unknown'): any[] => {
  switch (format) {
    case 'csv':
      return parseCSV(content);
    case 'json':
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return [];
      }
    case 'txt':
      return content.split('\n').filter(line => line.trim());
    default:
      return [content]; // For other formats, just return the content as a single item
  }
};

// Helper function to parse CSV
const parseCSV = (csvContent: string): any[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const item: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      item[header] = values[index] || '';
    });
    
    return item;
  });
};
