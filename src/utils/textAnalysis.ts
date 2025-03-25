
// Export the content type enum for use across the application
export type ContentType = 'multiple-choice' | 'flashcards' | 'writing' | 'speaking' | 'listening';

// Language detection
export const detectLanguage = (text: string): 'english' | 'italian' | 'spanish' | 'french' | 'german' | 'unknown' => {
  // Enhanced language detection based on common words and patterns
  const italianWords = ['il', 'la', 'e', 'che', 'di', 'a', 'è', 'un', 'sono', 'non', 'mi', 'si', 'per', 'con', 'questo', 'ma', 'perché', 'come', 'ci', 'anche'];
  const englishWords = ['the', 'and', 'is', 'that', 'of', 'to', 'a', 'in', 'for', 'it', 'with', 'as', 'was', 'be', 'this', 'but', 'why', 'how', 'us', 'also'];
  const spanishWords = ['el', 'la', 'y', 'que', 'de', 'a', 'es', 'un', 'son', 'no', 'me', 'se', 'por', 'con', 'este', 'pero', 'porque', 'como', 'nos', 'también'];
  const frenchWords = ['le', 'la', 'et', 'que', 'de', 'à', 'est', 'un', 'sont', 'ne', 'me', 'se', 'pour', 'avec', 'ce', 'mais', 'pourquoi', 'comment', 'nous', 'aussi'];
  const germanWords = ['der', 'die', 'und', 'dass', 'von', 'zu', 'ist', 'ein', 'sind', 'nicht', 'mich', 'sich', 'für', 'mit', 'dies', 'aber', 'warum', 'wie', 'uns', 'auch'];
  
  // Convert to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/);
  let italianCount = 0;
  let englishCount = 0;
  let spanishCount = 0;
  let frenchCount = 0;
  let germanCount = 0;
  
  // Count matches for each language
  words.forEach(word => {
    if (italianWords.includes(word)) italianCount++;
    if (englishWords.includes(word)) englishCount++;
    if (spanishWords.includes(word)) spanishCount++;
    if (frenchWords.includes(word)) frenchCount++;
    if (germanWords.includes(word)) germanCount++;
  });
  
  // Find the language with the highest count
  const counts = [
    { lang: 'italian', count: italianCount },
    { lang: 'english', count: englishCount },
    { lang: 'spanish', count: spanishCount },
    { lang: 'french', count: frenchCount },
    { lang: 'german', count: germanCount }
  ];
  
  counts.sort((a, b) => b.count - a.count);
  
  // Return the language with the highest count if it's above a threshold
  if (counts[0].count > 0 && counts[0].count > counts[1].count) {
    return counts[0].lang as 'english' | 'italian' | 'spanish' | 'french' | 'german';
  }
  
  // Default to unknown if can't determine
  return 'unknown';
};

// Content type detection with improved accuracy
export const detectContentType = (text: string): ContentType => {
  // More comprehensive content type detection
  const lowerText = text.toLowerCase();
  
  // Check for multiple choice format with more patterns
  if (
    (lowerText.includes('a)') && lowerText.includes('b)')) ||
    (lowerText.includes('a.') && lowerText.includes('b.')) ||
    (lowerText.includes('option a') && lowerText.includes('option b')) ||
    (lowerText.includes('multiple choice') || lowerText.includes('quiz')) ||
    (lowerText.includes('choose the correct') || lowerText.includes('select the right')) ||
    (/\d+\)\s+[a-zA-Z]/.test(lowerText) && /\d+\)\s+[a-zA-Z]/.test(lowerText))
  ) {
    return 'multiple-choice';
  }
  
  // Enhanced flashcard detection
  if (
    (lowerText.includes('flash') && lowerText.includes('card')) ||
    (lowerText.includes('vocabulary') && (lowerText.includes('list') || lowerText.includes('words'))) ||
    (lowerText.includes('term') && lowerText.includes('definition')) ||
    (lowerText.match(/[a-zA-Z]+\s*[-:=]\s*[a-zA-Z]+/g) && lowerText.match(/[a-zA-Z]+\s*[-:=]\s*[a-zA-Z]+/g)?.length > 3) ||
    (lowerText.includes('front') && lowerText.includes('back')) ||
    (text.split('\n').length > 5 && text.split('\n').every(line => line.includes(',') || line.includes(';') || line.includes('\t')))
  ) {
    return 'flashcards';
  }
  
  // Better listening content detection
  if (
    lowerText.includes('listen') || 
    lowerText.includes('audio') || 
    lowerText.includes('recording') ||
    lowerText.includes('pronunciation') ||
    lowerText.includes('hear') ||
    lowerText.includes('sound') ||
    lowerText.includes('playback') ||
    lowerText.includes('headphones')
  ) {
    return 'listening';
  }
  
  // Improved speaking practice detection
  if (
    lowerText.includes('speak') || 
    lowerText.includes('pronunciation') || 
    lowerText.includes('oral') ||
    lowerText.includes('conversation') ||
    lowerText.includes('repeat') ||
    lowerText.includes('say') ||
    lowerText.includes('voice') ||
    lowerText.includes('microphone') ||
    lowerText.includes('talk')
  ) {
    return 'speaking';
  }
  
  // Check for writing exercises
  if (
    lowerText.includes('write') ||
    lowerText.includes('essay') ||
    lowerText.includes('compose') ||
    lowerText.includes('paragraph') ||
    lowerText.includes('description') ||
    lowerText.includes('text') ||
    lowerText.includes('respond')
  ) {
    return 'writing';
  }
  
  // Default to writing if no other type matches
  return 'writing';
};

// Extract potential flashcards from text content
export const extractFlashcards = (text: string): { italian: string; english: string }[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const flashcards: { italian: string; english: string }[] = [];

  // Try to determine if Italian is on left or right
  let italianOnLeft = true;
  const sampleLine = lines[0] || '';
  if (sampleLine.includes(',') || sampleLine.includes(';') || sampleLine.includes('\t')) {
    const parts = sampleLine.split(/[,;\t]/);
    if (parts.length >= 2) {
      const leftPart = parts[0].trim().toLowerCase();
      const rightPart = parts[1].trim().toLowerCase();
      // Simple heuristic: check if left part contains more Italian-looking words
      const italianWords = ['il', 'la', 'di', 'e', 'che', 'a'];
      const englishWords = ['the', 'of', 'and', 'that', 'to', 'a'];
      
      let italianScore = 0;
      let englishScore = 0;
      
      italianWords.forEach(word => {
        if (leftPart.includes(word)) italianScore++;
        if (rightPart.includes(word)) englishScore++;
      });
      
      englishWords.forEach(word => {
        if (leftPart.includes(word)) englishScore++;
        if (rightPart.includes(word)) italianScore++;
      });
      
      italianOnLeft = italianScore > englishScore;
    }
  }

  // Process each line
  lines.forEach(line => {
    // Skip header rows that might contain column names
    if (line.toLowerCase().includes('italian') && line.toLowerCase().includes('english')) {
      return;
    }
    
    // Try different delimiters
    let parts: string[] = [];
    if (line.includes(',')) {
      parts = line.split(',').map(p => p.trim());
    } else if (line.includes(';')) {
      parts = line.split(';').map(p => p.trim());
    } else if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim());
    } else if (line.includes('-')) {
      parts = line.split('-').map(p => p.trim());
    } else if (line.includes(':')) {
      parts = line.split(':').map(p => p.trim());
    } else if (line.includes('=')) {
      parts = line.split('=').map(p => p.trim());
    }
    
    if (parts.length >= 2) {
      const italian = italianOnLeft ? parts[0] : parts[1];
      const english = italianOnLeft ? parts[1] : parts[0];
      
      if (italian && english) {
        flashcards.push({ italian, english });
      }
    }
  });
  
  return flashcards;
};

// Convert various text formats to structured content
export const parseContent = (content: string, contentType: ContentType): any => {
  switch (contentType) {
    case 'flashcards':
      return extractFlashcards(content);
      
    case 'multiple-choice':
      // Basic parsing for multiple choice questions
      const lines = content.split('\n').filter(line => line.trim() !== '');
      const questions = [];
      let currentQuestion: any = null;
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        if (!line.startsWith(' ') && !line.startsWith('\t')) {
          // This looks like a question
          if (currentQuestion) {
            questions.push(currentQuestion);
          }
          currentQuestion = {
            question: line.trim(),
            options: [],
            correctAnswerIndex: 0
          };
        } else if (currentQuestion) {
          // This looks like an answer option
          const option = line.trim();
          const isCorrect = option.includes('*') || option.includes('(correct)');
          const cleanOption = option.replace('*', '').replace('(correct)', '').trim();
          
          currentQuestion.options.push(cleanOption);
          
          if (isCorrect) {
            currentQuestion.correctAnswerIndex = currentQuestion.options.length - 1;
          }
        }
      }
      
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      return questions;
      
    default:
      return content;
  }
};

// Format detection for import/export
export const detectFileFormat = (filename: string): 'csv' | 'json' | 'txt' => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (extension === 'json') {
    return 'json';
  } else if (extension === 'csv') {
    return 'csv';
  } else {
    return 'txt';
  }
};

// Validate flashcard format
export const validateFlashcards = (cards: any[]): boolean => {
  if (!Array.isArray(cards) || cards.length === 0) {
    return false;
  }
  
  return cards.every(card => 
    typeof card === 'object' && 
    card !== null &&
    typeof card.italian === 'string' && 
    typeof card.english === 'string'
  );
};
