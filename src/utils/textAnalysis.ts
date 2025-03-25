// Export the content type enum for use across the application
export type ContentType = 'multiple-choice' | 'flashcards' | 'writing' | 'speaking' | 'listening';

// Language detection
export const detectLanguage = (text: string): 'english' | 'italian' | 'unknown' => {
  // Simple language detection based on common words
  const italianWords = ['il', 'la', 'e', 'che', 'di', 'a', 'è', 'un', 'sono', 'non', 'mi', 'si', 'per', 'con'];
  const englishWords = ['the', 'and', 'is', 'that', 'of', 'to', 'a', 'in', 'for', 'it', 'with', 'as', 'was', 'be'];
  
  // Convert to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/);
  let italianCount = 0;
  let englishCount = 0;
  
  // Count matches for each language
  words.forEach(word => {
    if (italianWords.includes(word)) italianCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  // Determine language based on higher count
  if (italianCount > englishCount) return 'italian';
  if (englishCount > italianCount) return 'english';
  
  // Default to unknown if can't determine
  return 'unknown';
};

// Content type detection
export const detectContentType = (text: string): ContentType => {
  // Simple content type detection based on format and keywords
  const lowerText = text.toLowerCase();
  
  // Check for multiple choice format
  if (
    (lowerText.includes('a)') && lowerText.includes('b)')) ||
    (lowerText.includes('a.') && lowerText.includes('b.')) ||
    (lowerText.includes('option a') && lowerText.includes('option b')) ||
    (lowerText.includes('multiple choice') || lowerText.includes('quiz'))
  ) {
    return 'multiple-choice';
  }
  
  // Check for flashcard indicators
  if (
    (lowerText.includes('flash') && lowerText.includes('card')) ||
    (lowerText.includes('vocabulary') && (lowerText.includes('list') || lowerText.includes('words'))) ||
    (lowerText.includes('term') && lowerText.includes('definition'))
  ) {
    return 'flashcards';
  }
  
  // Check for listening content
  if (
    lowerText.includes('listen') || 
    lowerText.includes('audio') || 
    lowerText.includes('recording') ||
    lowerText.includes('pronunciation')
  ) {
    return 'listening';
  }
  
  // Check for speaking practice
  if (
    lowerText.includes('speak') || 
    lowerText.includes('pronunciation') || 
    lowerText.includes('oral') ||
    lowerText.includes('conversation')
  ) {
    return 'speaking';
  }
  
  // Default to writing if no other type matches
  return 'writing';
};

// More utility functions for text analysis can be added here...
