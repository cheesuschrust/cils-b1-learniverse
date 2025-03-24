
import { addTrainingExamples, getConfidenceScore } from '@/services/AIService';
import { v4 as uuidv4 } from 'uuid';
import { ContentType } from '@/utils/textAnalysis';
import { toast } from 'react-hot-toast';

// Supported file formats for training
export const SUPPORTED_FORMATS = {
  text: ['text/plain', 'application/json', 'text/markdown'],
  audio: ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'],
  document: ['application/pdf']
};

// Maximum file size (20MB)
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface ProcessedContent {
  id: string;
  content: string | ArrayBuffer;
  contentType: ContentType;
  format: string;
  metadata: {
    filename: string;
    filesize: number;
    uploadedAt: Date;
    processingTime: number;
    confidence: number;
    language: 'english' | 'italian' | 'unknown';
  };
}

export const validateFile = (file: File): { valid: boolean; message?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  const supportedTypes = [
    ...SUPPORTED_FORMATS.text,
    ...SUPPORTED_FORMATS.audio,
    ...SUPPORTED_FORMATS.document
  ];
  
  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'Unsupported file format. Please upload text, audio, or PDF files.'
    };
  }

  return { valid: true };
};

export const readFileContent = async (file: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string | ArrayBuffer);
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };
    
    if (SUPPORTED_FORMATS.text.includes(file.type)) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

export const processFileForAITraining = async (
  file: File, 
  contentType: ContentType
): Promise<ProcessedContent> => {
  const startTime = Date.now();
  
  try {
    const content = await readFileContent(file);
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    // Get confidence score for this content type from AI Service
    const confidence = getConfidenceScore(contentType);
    
    // Create a record of the processed content
    const processedContent: ProcessedContent = {
      id: uuidv4(),
      content,
      contentType,
      format: file.type,
      metadata: {
        filename: file.name,
        filesize: file.size,
        uploadedAt: new Date(),
        processingTime,
        confidence,
        language: file.name.toLowerCase().includes('italian') ? 'italian' : 'english'
      }
    };
    
    return processedContent;
  } catch (error) {
    console.error("Error processing file:", error);
    throw new Error(`Failed to process file: ${error.message}`);
  }
};

// Add processed content to AI training examples
export const addContentToAITraining = async (
  processedContent: ProcessedContent,
  examples: any[]
): Promise<number> => {
  try {
    // Add examples to the AI training
    const totalExamples = addTrainingExamples(
      processedContent.contentType,
      examples
    );
    
    // Log the training activity
    console.log(`Added ${examples.length} examples to AI training for ${processedContent.contentType}`);
    
    // Return total count of examples
    return totalExamples;
  } catch (error) {
    console.error("Error adding content to AI training:", error);
    toast.error("Failed to add content to AI training");
    throw error;
  }
};

// Function to extract training examples from different content types
export const extractTrainingExamples = (
  processedContent: ProcessedContent
): any[] => {
  const { contentType, content } = processedContent;
  
  // This would normally involve more sophisticated parsing
  // based on the content type and format
  try {
    if (typeof content === 'string') {
      // For text content, try to parse as JSON first
      try {
        const jsonData = JSON.parse(content);
        if (Array.isArray(jsonData)) {
          return jsonData;
        }
      } catch (e) {
        // Not valid JSON, process as text
        console.log("Content is not valid JSON, processing as text");
      }
      
      // Basic text processing for different content types
      switch (contentType) {
        case 'multiple-choice':
          // Extract questions from text content
          const questions = content.split(/\n{2,}/)
            .filter(q => q.includes('?'))
            .map((q, i) => {
              const lines = q.split('\n');
              const questionText = lines[0];
              const options = lines.slice(1, 5).map(l => l.replace(/^[A-D][.)]\s*/, ''));
              const correctAnswer = lines.find(l => l.toLowerCase().includes('answer'))?.replace(/^.*?:\s*/, '') || options[0];
              
              return {
                id: `auto-${i}`,
                question: questionText,
                options,
                correctAnswer,
                explanation: "Automatically extracted from training content",
                category: "General",
                difficulty: "Intermediate",
                language: processedContent.metadata.language
              };
            });
          return questions;
          
        case 'flashcards':
          // Extract flashcards from text content
          const flashcards = content.split(/\n{2,}/)
            .map((card, i) => {
              const [term, translation] = card.split(/[:-]\s*/);
              return {
                id: `auto-${i}`,
                term: term?.trim(),
                translation: translation?.trim(),
                sampleSentence: "",
                language: processedContent.metadata.language
              };
            })
            .filter(card => card.term && card.translation);
          return flashcards;
          
        default:
          // Generic processing
          return [{
            content,
            type: contentType,
            timestamp: new Date().toISOString()
          }];
      }
    }
    
    // For non-text content (audio, PDF)
    return [{
      id: uuidv4(),
      contentType,
      format: processedContent.format,
      metadata: processedContent.metadata,
      status: 'pending_processing'
    }];
  } catch (error) {
    console.error("Error extracting training examples:", error);
    return [];
  }
};
