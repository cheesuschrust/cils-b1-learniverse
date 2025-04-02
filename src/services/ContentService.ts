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
  
  // Add the last question
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  return questions;
};

// Parse flashcard content
const parseFlashcardContent = (content: string): any => {
  const lines = content.split('\n').filter(line => line.trim());
  const flashcards = [];
  
  // Look for patterns like "term - definition" or "term: definition"
  for (const line of lines) {
    const termDefSeparators = [' - ', ':', '=', '\t'];
    let foundSeparator = false;
    
    for (const separator of termDefSeparators) {
      if (line.includes(separator)) {
        const [term, definition] = line.split(separator).map(s => s.trim());
        if (term && definition) {
          flashcards.push({
            term,
            definition
          });
          foundSeparator = true;
          break;
        }
      }
    }
    
    if (!foundSeparator && line.trim()) {
      // Try to handle cases where each term/definition is on separate lines
      if (flashcards.length > 0 && !flashcards[flashcards.length - 1].definition) {
        flashcards[flashcards.length - 1].definition = line.trim();
      } else {
        flashcards.push({
          term: line.trim(),
          definition: ''
        });
      }
    }
  }
  
  return flashcards;
};

// Parse writing prompt content
const parseWritingContent = (content: string): any => {
  const lines = content.split('\n').filter(line => line.trim());
  const topics = [];
  
  let currentTopic: any = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line looks like a topic or prompt
    if (trimmedLine.endsWith('?') || /^[0-9]+\./.test(trimmedLine)) {
      if (currentTopic) {
        topics.push(currentTopic);
      }
      
      currentTopic = {
        prompt: trimmedLine,
        instructions: '',
        wordLimit: null
      };
    }
    // Check for word limit instructions
    else if (/word(s)?\s+limit|limit.*word/i.test(trimmedLine) && currentTopic) {
      const wordLimitMatch = trimmedLine.match(/\d+/);
      if (wordLimitMatch) {
        currentTopic.wordLimit = parseInt(wordLimitMatch[0], 10);
      }
      currentTopic.instructions += ' ' + trimmedLine;
    }
    // Otherwise, treat as part of instructions
    else if (currentTopic) {
      currentTopic.instructions += ' ' + trimmedLine;
    }
    // If no current topic but line is not empty, start a new topic
    else if (trimmedLine) {
      currentTopic = {
        prompt: trimmedLine,
        instructions: '',
        wordLimit: null
      };
    }
  }
  
  // Add the last topic
  if (currentTopic) {
    topics.push(currentTopic);
  }
  
  return topics.map(topic => ({
    ...topic,
    instructions: topic.instructions.trim()
  }));
};

// Parse speaking exercise content
const parseSpeakingContent = (content: string): any => {
  // Similar structure to writing, but we'll assume these might have dialogue patterns
  const sections = content.split('\n\n').filter(section => section.trim());
  const exercises = [];
  
  for (const section of sections) {
    const lines = section.split('\n').filter(line => line.trim());
    
    if (lines.length > 0) {
      const prompt = lines[0].trim();
      const instructions = lines.slice(1).join(' ').trim();
      
      exercises.push({
        prompt,
        instructions,
        type: 'speaking'
      });
    }
  }
  
  return exercises;
};

// Parse listening content
const parseListeningContent = (content: string): any => {
  // For listening content, we'll split it into sections like a script
  const sections = content.split('\n\n').filter(section => section.trim());
  const exercises = [];
  
  for (const section of sections) {
    const lines = section.split('\n').filter(line => line.trim());
    const script = lines.join(' ').trim();
    
    if (script) {
      // Try to identify questions in the script
      const questions = script.match(/\?/g) ? script.split(/\?/).map(q => q.trim() + '?').filter(q => q !== '?') : [];
      
      exercises.push({
        script,
        questions: questions.length > 0 ? questions : [script + '?'],
        type: 'listening'
      });
    }
  }
  
  return exercises;
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
