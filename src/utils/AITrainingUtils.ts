
import { ContentType } from '@/types/interface-fixes';

// Text sample analysis for content type detection
interface TextAnalysisResult {
  contentType: ContentType;
  confidence: number;
  features: {
    [key: string]: number | boolean;
  };
}

// Features used to detect content types
interface ContentFeatures {
  hasHeaders: boolean;
  csvPattern: boolean;
  jsonPattern: boolean;
  italianWords: number;
  englishWords: number;
  questionMarks: number;
  multipleChoiceOptions: boolean;
  paragraphCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  dialoguePattern: boolean;
}

// Italian language detection words
const ITALIAN_COMMON_WORDS = [
  'e', 'il', 'la', 'di', 'che', 'è', 'non', 'un', 'per', 'sono', 'ma', 'mi', 'si', 'ho', 'lo',
  'hai', 'ci', 'ha', 'come', 'con', 'questo', 'se', 'cosa', 'anche', 'perché', 'qui', 'sei',
  'della', 'sono', 'quando', 'bene', 'ciao', 'grazie', 'molto'
];

// English language detection words
const ENGLISH_COMMON_WORDS = [
  'the', 'and', 'is', 'in', 'it', 'you', 'that', 'was', 'for', 'on', 'are', 'with', 'as', 'they',
  'be', 'at', 'have', 'this', 'from', 'by', 'had', 'not', 'what', 'but', 'when', 'if', 'well', 'hi',
  'thank', 'very'
];

/**
 * Analyze a text sample to detect its content type
 */
export const analyzeContentType = (text: string): TextAnalysisResult => {
  if (!text || text.trim().length === 0) {
    return {
      contentType: 'unknown',
      confidence: 0.8,
      features: {}
    };
  }

  const features = extractFeatures(text);
  
  // Detect based on features
  if (features.csvPattern) {
    return {
      contentType: 'csv',
      confidence: 0.9,
      features
    };
  }
  
  if (features.jsonPattern) {
    return {
      contentType: 'json',
      confidence: 0.95,
      features
    };
  }
  
  if (text.includes('.mp3') || text.includes('.wav') || text.includes('audio')) {
    return {
      contentType: 'audio',
      confidence: 0.85,
      features
    };
  }
  
  if (text.includes('.pdf') || text.includes('PDF')) {
    return {
      contentType: 'pdf',
      confidence: 0.85,
      features
    };
  }
  
  if (text.includes('.txt') || (features.paragraphCount > 0 && !features.csvPattern && !features.jsonPattern)) {
    return {
      contentType: 'txt',
      confidence: 0.75,
      features
    };
  }
  
  // Detect flashcards content
  if ((features.italianWords > 3 && features.englishWords > 3) || 
      text.includes('flashcard') || 
      text.includes('flash card') ||
      (text.includes('italian') && text.includes('english'))) {
    return {
      contentType: 'flashcards',
      confidence: 0.85,
      features
    };
  }
  
  // Detect listening exercises
  if ((text.includes('listen') || text.includes('audio') || text.includes('pronunciation')) &&
      (features.dialoguePattern || features.italianWords > 5)) {
    return {
      contentType: 'listening',
      confidence: 0.8,
      features
    };
  }
  
  // Detect writing exercises
  if (text.includes('write') || text.includes('essay') || text.includes('writing') || 
      (features.paragraphCount > 2 && features.averageSentenceLength > 10)) {
    return {
      contentType: 'writing',
      confidence: 0.7,
      features
    };
  }
  
  // Detect speaking exercises
  if (text.includes('speak') || text.includes('pronunciation') || text.includes('repeat') ||
      (features.dialoguePattern && features.italianWords > 5)) {
    return {
      contentType: 'speaking',
      confidence: 0.75,
      features
    };
  }
  
  // Detect multiple choice
  if (features.multipleChoiceOptions || features.questionMarks > 2 || 
      text.includes('quiz') || text.includes('multiple choice')) {
    return {
      contentType: 'multiple-choice',
      confidence: 0.8,
      features
    };
  }
  
  // Default if no better match
  return {
    contentType: 'unknown',
    confidence: 0.6,
    features
  };
};

/**
 * Extract features from text for content type analysis
 */
const extractFeatures = (text: string): ContentFeatures => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const words = text.toLowerCase().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // CSV detection: first line has commas and possibly headers
  const hasHeaders = lines.length > 0 && /^[a-zA-Z,]+$/.test(lines[0]);
  const csvPattern = lines.length > 1 && lines.filter(line => line.includes(',')).length > lines.length * 0.7;
  
  // JSON detection
  const jsonPattern = (text.trim().startsWith('{') && text.trim().endsWith('}')) || 
                     (text.trim().startsWith('[') && text.trim().endsWith(']'));
  
  // Language detection
  const italianWords = words.filter(word => ITALIAN_COMMON_WORDS.includes(word)).length;
  const englishWords = words.filter(word => ENGLISH_COMMON_WORDS.includes(word)).length;
  
  // Multiple choice detection
  const questionMarks = (text.match(/\?/g) || []).length;
  const multipleChoiceOptions = /[A-D]\)\s|\d\)\s|[A-D]\.\s/.test(text);
  
  // Text structure analysis
  const paragraphCount = lines.length;
  const sentenceCount = sentences.length;
  const averageSentenceLength = words.length / Math.max(1, sentenceCount);
  
  // Dialogue pattern detection (for conversations, listening exercises)
  const dialoguePattern = /^[A-Z][a-z]+:.*\n/.test(text) || text.split(':').length > 3;
  
  return {
    hasHeaders,
    csvPattern,
    jsonPattern,
    italianWords,
    englishWords,
    questionMarks,
    multipleChoiceOptions,
    paragraphCount,
    sentenceCount,
    averageSentenceLength,
    dialoguePattern
  };
};

/**
 * Detect the content type of a file based on its name and content
 */
export const detectFileContentType = async (file: File): Promise<ContentType> => {
  // First check by file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') return 'csv';
  if (extension === 'json') return 'json';
  if (extension === 'txt') return 'txt';
  if (extension === 'pdf') return 'pdf';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) return 'audio';
  
  // If extension doesn't clearly indicate type, check content
  try {
    // Read first 4KB of the file to detect content type
    const chunk = await readFileChunk(file, 4096);
    const textContent = new TextDecoder().decode(chunk);
    const analysis = analyzeContentType(textContent);
    
    return analysis.contentType;
  } catch (error) {
    console.error('Error detecting file content type:', error);
    return 'unknown';
  }
};

/**
 * Read a chunk of a file as an ArrayBuffer
 */
const readFileChunk = (file: File, size: number): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const blob = file.slice(0, size);
    
    reader.onload = (e) => {
      resolve(e.target?.result as ArrayBuffer);
    };
    
    reader.onerror = (e) => {
      reject(new Error('Error reading file chunk'));
    };
    
    reader.readAsArrayBuffer(blob);
  });
};

/**
 * Process uploaded content to extract relevant information
 */
export const processUploadedContent = async (file: File): Promise<{
  contentType: ContentType;
  content: string | ArrayBuffer;
  metadata: Record<string, any>;
}> => {
  const contentType = await detectFileContentType(file);
  let content: string | ArrayBuffer;
  const metadata: Record<string, any> = {
    filename: file.name,
    filesize: file.size,
    lastModified: new Date(file.lastModified),
    contentType
  };
  
  if (['csv', 'json', 'txt'].includes(contentType) || contentType === 'unknown') {
    // Read text files
    content = await readFileAsText(file);
  } else {
    // Read binary files
    content = await readFileAsArrayBuffer(file);
  }
  
  return {
    contentType,
    content,
    metadata
  };
};

/**
 * Read a file as text
 */
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    
    reader.onerror = (e) => {
      reject(new Error('Error reading file as text'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Read a file as ArrayBuffer
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target?.result as ArrayBuffer);
    };
    
    reader.onerror = (e) => {
      reject(new Error('Error reading file as ArrayBuffer'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
