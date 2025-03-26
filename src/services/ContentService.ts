
import { ContentType, ContentFeatures } from '@/types/contentType';
import AIService from './AIService';
import { analyzeContent } from '@/utils/AITrainingUtils';

export interface ContentServiceOptions {
  cacheResults?: boolean;
  returnRawData?: boolean;
}

// Cache for content analysis results
const contentAnalysisCache = new Map<string, any>();

// Helper to create a simple hash for caching
const createContentHash = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

// Extract content features
export const extractContentFeatures = (content: string): ContentFeatures => {
  if (!content || typeof content !== 'string') {
    return {
      wordCount: 0,
      sentenceCount: 0
    };
  }
  
  // Calculate basic text statistics
  const wordCount = content.trim().split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = content.split(/\n\s*\n/).filter(Boolean).length;
  const questionMarks = (content.match(/\?/g) || []).length;
  
  // Language detection
  const italianWords = ['il', 'la', 'di', 'e', 'che', 'un', 'una', 'sono', 'è', 'per', 'non', 'mi', 'si', 'ti', 'ci'];
  const englishWords = ['the', 'and', 'of', 'to', 'is', 'in', 'that', 'it', 'for', 'you', 'are', 'with', 'on', 'as', 'not'];
  
  const words = content.toLowerCase().match(/\b(\w+)\b/g) || [];
  let italianCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (italianWords.includes(word)) italianCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  let language: 'english' | 'italian' | 'mixed' = 'english';
  
  if (italianCount > englishCount) {
    language = 'italian';
  } else if (italianCount > 0 && englishCount > 0) {
    language = 'mixed';
  }
  
  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    questionMarks,
    language
  };
};

// Detect the type of content
export const detectContentType = async (content: string, options: ContentServiceOptions = {}): Promise<{
  type: ContentType;
  confidence: number;
  features: ContentFeatures;
}> => {
  if (!content || typeof content !== 'string') {
    return {
      type: 'writing',
      confidence: 0.5,
      features: extractContentFeatures('')
    };
  }
  
  // Check cache first if caching is enabled
  if (options.cacheResults) {
    const contentHash = createContentHash(content);
    const cachedResult = contentAnalysisCache.get(contentHash);
    if (cachedResult) {
      return cachedResult;
    }
  }
  
  // Use local analysis
  const analysis = analyzeContent(content);
  
  // Convert to the expected return format
  const result = {
    type: analysis.contentType,
    confidence: analysis.confidence,
    features: analysis.features
  };
  
  // Cache the result if caching is enabled
  if (options.cacheResults) {
    const contentHash = createContentHash(content);
    contentAnalysisCache.set(contentHash, result);
  }
  
  return result;
};

// Parse structured content
export const parseStructuredContent = (content: string, type: ContentType): any => {
  // Different parsing strategies based on content type
  if (type === 'multiple-choice') {
    return parseMultipleChoiceContent(content);
  } else if (type === 'flashcards') {
    return parseFlashcardContent(content);
  } else if (type === 'writing') {
    return parseWritingContent(content);
  } else if (type === 'speaking') {
    return parseSpeakingContent(content);
  } else if (type === 'listening') {
    return parseListeningContent(content);
  }
  
  // Default parsing just returns the content
  return { text: content };
};

// Parse multiple choice content
const parseMultipleChoiceContent = (content: string): any => {
  const lines = content.split('\n').filter(line => line.trim());
  const questions = [];
  let currentQuestion: any = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // New question starts with a number or a question mark
    if (/^\d+[\.\)]/.test(trimmedLine) || /^Q[\.\:]/i.test(trimmedLine) || trimmedLine.endsWith('?')) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      currentQuestion = {
        question: trimmedLine.replace(/^\d+[\.\)]/, '').trim(),
        options: [],
        correctAnswer: null
      };
    } 
    // Option line
    else if (/^[A-D][\.\)]/.test(trimmedLine) && currentQuestion) {
      const option = trimmedLine.replace(/^[A-D][\.\)]/, '').trim();
      currentQuestion.options.push(option);
      
      // If this line has a marker for correct answer
      if (trimmedLine.includes('(correct)') || trimmedLine.includes('*')) {
        currentQuestion.correctAnswer = option.replace('(correct)', '').replace('*', '').trim();
      }
    }
    // Explanation line
    else if (/^explanation:/i.test(trimmedLine) && currentQuestion) {
      currentQuestion.explanation = trimmedLine.replace(/^explanation:/i, '').trim();
    }
    // Assume it's part of the current question or option
    else if (currentQuestion) {
      if (currentQuestion.options.length > 0) {
        currentQuestion.options[currentQuestion.options.length - 1] += ' ' + trimmedLine;
      } else {
        currentQuestion.question += ' ' + trimmedLine;
      }
    }
  }
  
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  return { 
    questions,
    count: questions.length
  };
};

// Parse flashcard content
const parseFlashcardContent = (content: string): any => {
  const lines = content.split('\n').filter(line => line.trim());
  const cards = [];
  
  // Handle tab/comma-separated format (term\tdefinition)
  if (content.includes('\t') || (content.includes(',') && !content.includes('\n\n'))) {
    const separator = content.includes('\t') ? '\t' : ',';
    
    for (const line of lines) {
      const parts = line.split(separator);
      if (parts.length >= 2) {
        cards.push({
          term: parts[0].trim(),
          definition: parts[1].trim()
        });
      }
    }
  } 
  // Handle block format (term\n\ndefinition\n\nterm\n\ndefinition)
  else {
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        cards.push({
          term: lines[i].trim(),
          definition: lines[i + 1].trim()
        });
      }
    }
  }
  
  return {
    cards,
    count: cards.length
  };
};

// Parse writing content
const parseWritingContent = (content: string): any => {
  const paragraphs = content.split(/\n\s*\n/).filter(para => para.trim());
  
  return {
    text: content,
    paragraphs,
    paragraphCount: paragraphs.length,
    wordCount: content.split(/\s+/).filter(Boolean).length
  };
};

// Parse speaking content
const parseSpeakingContent = (content: string): any => {
  // Detect if it's a dialogue
  const isDialogue = /^[A-Za-z]+\s*:/.test(content) || content.includes(':\n');
  let speakers = [];
  
  if (isDialogue) {
    const speakerMatches = content.match(/^([A-Za-z]+)\s*:/gm) || [];
    speakers = [...new Set(speakerMatches.map(match => match.replace(':', '').trim()))];
  }
  
  return {
    text: content,
    isDialogue,
    speakers,
    speakerCount: speakers.length,
    wordCount: content.split(/\s+/).filter(Boolean).length
  };
};

// Parse listening content
const parseListeningContent = (content: string): any => {
  // Detect if it's a script with time codes
  const hasTimeCodes = /\[\d{2}:\d{2}\]/.test(content);
  const segments = hasTimeCodes ? content.split(/\[\d{2}:\d{2}\]/).filter(Boolean) : [];
  
  return {
    text: content,
    hasTimeCodes,
    segments: segments.length > 0 ? segments : [content],
    segmentCount: segments.length > 0 ? segments.length : 1,
    wordCount: content.split(/\s+/).filter(Boolean).length
  };
};

// Generate content based on parameters
export const generateContent = async (
  contentType: ContentType,
  parameters: any,
  options: ContentServiceOptions = {}
): Promise<any> => {
  const prompt = buildGenerationPrompt(contentType, parameters);
  
  try {
    const generatedText = await AIService.generateText(prompt, {
      temperature: 0.7,
      maxLength: 2048
    });
    
    const parsedContent = parseStructuredContent(generatedText, contentType);
    
    return {
      rawText: options.returnRawData ? generatedText : undefined,
      content: parsedContent,
      contentType
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error(`Failed to generate ${contentType} content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Build prompt for content generation
const buildGenerationPrompt = (contentType: ContentType, parameters: any): string => {
  let basePrompt = `Generate ${contentType} content `;
  
  // Add common parameters
  if (parameters.topic) {
    basePrompt += `on the topic of "${parameters.topic}" `;
  }
  
  if (parameters.level) {
    basePrompt += `at ${parameters.level} level `;
  }
  
  if (parameters.language) {
    basePrompt += `in ${parameters.language} `;
  }
  
  // Add type-specific parameters
  if (contentType === 'multiple-choice') {
    basePrompt += `\nGenerate ${parameters.count || 5} multiple choice questions `;
    basePrompt += `each with ${parameters.optionCount || 4} options. `;
    basePrompt += 'Mark the correct answer with (correct).';
  } else if (contentType === 'flashcards') {
    basePrompt += `\nGenerate ${parameters.count || 5} flashcards in the format: `;
    basePrompt += 'term\ndefinition\n\n';
    
    if (parameters.language === 'italian') {
      basePrompt += 'The term should be in Italian and the definition in English.';
    }
  } else if (contentType === 'writing') {
    basePrompt += `\nGenerate a writing prompt `;
    
    if (parameters.wordCount) {
      basePrompt += `suggesting a response of approximately ${parameters.wordCount} words. `;
    }
    
    if (parameters.paragraphCount) {
      basePrompt += `It should inspire a response with about ${parameters.paragraphCount} paragraphs. `;
    }
  } else if (contentType === 'speaking') {
    basePrompt += `\nGenerate a speaking exercise `;
    
    if (parameters.isDialogue) {
      basePrompt += 'in dialogue format with speaker names followed by colons. ';
      basePrompt += `Include ${parameters.speakerCount || 2} speakers. `;
    } else {
      basePrompt += 'as a monologue or speech exercise. ';
    }
  } else if (contentType === 'listening') {
    basePrompt += `\nGenerate a listening comprehension exercise `;
    
    if (parameters.hasTimeCodes) {
      basePrompt += 'with time codes in the format [MM:SS]. ';
    }
    
    if (parameters.questionCount) {
      basePrompt += `Include ${parameters.questionCount} comprehension questions at the end. `;
    }
  }
  
  // Finalize the prompt
  basePrompt += `\nMake it educational and appropriate for language learning.`;
  
  return basePrompt;
};

// Export the service as an object
const ContentService = {
  extractContentFeatures,
  detectContentType,
  parseStructuredContent,
  generateContent
};

export default ContentService;
