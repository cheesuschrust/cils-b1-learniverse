
import { AIServiceOptions, AIServiceInterface } from "@/types/ai";
import * as HuggingFace from "@/utils/huggingFaceIntegration";
import { supabase } from "@/lib/supabase-client";

// Map to track ongoing requests
const activeRequests = new Map<string, AbortController>();

/**
 * Generate text using an AI model
 */
export const generateText = async (prompt: string, options?: AIServiceOptions): Promise<string> => {
  try {
    console.log("AI Service - Generating text with prompt:", prompt);
    
    const controller = new AbortController();
    const requestId = Math.random().toString(36).substring(2, 15);
    activeRequests.set(requestId, controller);
    
    try {
      const response = await supabase.functions.invoke('ai-text-generation', {
        body: { prompt, options },
        signal: controller.signal
      });
      
      if (response.error) throw new Error(response.error.message);
      return response.data.generatedText;
    } finally {
      activeRequests.delete(requestId);
    }
  } catch (error) {
    console.error("Error generating text:", error);
    
    // Fallback for development/testing
    return `AI generated response based on: ${prompt.substring(0, 50)}...`;
  }
};

/**
 * Classify text into predefined categories
 */
export const classifyText = async (text: string): Promise<Array<{ label: string; score: number }>> => {
  try {
    // Use the HuggingFace integration for text classification
    // We're using a small model suitable for browser execution
    return await HuggingFace.classifyText(text, 'distilbert-base-uncased-finetuned-sst-2-english');
  } catch (error) {
    console.error("Error classifying text:", error);
    
    // Fallback to simulated results if model fails
    return [
      { label: "Grammar", score: 0.85 },
      { label: "Vocabulary", score: 0.76 },
      { label: "Fluency", score: 0.92 }
    ];
  }
};

/**
 * Get a confidence score for a particular content type
 */
export const getConfidenceScore = (contentType: string): number => {
  // Simulated scores for different content types
  const scores: Record<string, number> = {
    "grammar": 0.85,
    "vocabulary": 0.76,
    "fluency": 0.92,
    "writing": 0.88,
    "speaking": 0.79,
    "listening": 0.82,
    "reading": 0.91
  };
  
  return scores[contentType.toLowerCase()] || 0.75;
};

/**
 * Add training examples for a particular content type
 */
export const addTrainingExamples = async (contentType: string, examples: any[]): Promise<number> => {
  console.log("AI Service - Adding training examples for:", contentType);
  
  try {
    // Store examples in the ai_training_data table
    const { data, error } = await supabase
      .from('ai_training_data')
      .insert(
        examples.map(example => ({
          input_text: example.input,
          expected_output: example.output,
          content_type: contentType,
          difficulty: example.difficulty || 'intermediate',
          language: example.language || 'italian'
        }))
      );
      
    if (error) throw error;
    return examples.length;
  } catch (error) {
    console.error("Error adding training examples:", error);
    return 0;
  }
};

/**
 * Generate flashcards for a topic
 */
export const generateFlashcards = async (
  topic: string, 
  count: number = 5, 
  difficulty: string = "intermediate"
): Promise<any[]> => {
  console.log("AI Service - Generating flashcards for:", topic);
  
  try {
    const prompt = `Generate ${count} flashcards for learning Italian vocabulary about "${topic}" at ${difficulty} level. Include the Italian term, English definition, and an example sentence in Italian.`;
    
    const response = await supabase.functions.invoke('ai-text-generation', {
      body: { 
        prompt,
        model: "gpt-4o-mini",
        options: {
          responseFormat: 'json'
        }
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    // Parse and format the generated flashcards
    // This assumes the AI returned properly structured data
    const generatedCards = response.data.generatedContent || [];
    
    return generatedCards.map((card: any, index: number) => ({
      id: `flashcard-${Date.now()}-${index}`,
      front: card.italian || `Italian term ${index + 1} for ${topic}`,
      back: card.english || `English definition ${index + 1} for ${topic}`,
      italian: card.italian || `Italian term ${index + 1} for ${topic}`,
      english: card.english || `English definition ${index + 1} for ${topic}`,
      example: card.example || `Example sentence for ${topic}`,
      difficulty: difficulty === "beginner" ? 1 : difficulty === "advanced" ? 3 : 2,
      level: difficulty === "beginner" ? 1 : difficulty === "advanced" ? 3 : 2,
      mastered: false,
      tags: [topic, difficulty]
    }));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    
    // Fallback for development/testing
    const flashcards = [];
    for (let i = 0; i < count; i++) {
      flashcards.push({
        id: `flashcard-${Date.now()}-${i}`,
        front: `Italian term ${i + 1} for ${topic}`,
        back: `English definition ${i + 1} for ${topic}`,
        italian: `Italian term ${i + 1} for ${topic}`,
        english: `English definition ${i + 1} for ${topic}`,
        difficulty: difficulty === "beginner" ? 1 : difficulty === "advanced" ? 3 : 2,
        level: difficulty === "beginner" ? 1 : difficulty === "advanced" ? 3 : 2,
        mastered: false,
        tags: [topic, difficulty]
      });
    }
    
    return flashcards;
  }
};

/**
 * Generate questions for content
 */
export const generateQuestions = async (
  content: string, 
  count: number = 5, 
  type: string = "multiple_choice"
): Promise<any[]> => {
  console.log("AI Service - Generating questions for content");
  
  try {
    const prompt = `Generate ${count} ${type} questions based on this Italian content: "${content.substring(0, 500)}...". Focus on testing comprehension and language skills.`;
    
    const response = await supabase.functions.invoke('ai-text-generation', {
      body: { 
        prompt,
        model: "gpt-4o-mini",
        options: {
          responseFormat: 'json'
        }
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    // Parse and format the generated questions
    const generatedQuestions = response.data.generatedContent || [];
    
    return generatedQuestions.map((question: any, index: number) => ({
      id: `question-${Date.now()}-${index}`,
      text: question.text || `Question ${index + 1} about the content`,
      options: question.options || ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: question.correctAnswer || "Option A",
      explanation: question.explanation || "Explanation for the correct answer",
      type: question.type || type,
      difficulty: question.difficulty || "intermediate",
      category: question.category || "general",
      tags: question.tags || ["generated"],
      createdAt: new Date(),
      updatedAt: new Date(),
      language: "italian",
      points: 10
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    
    // Fallback for development/testing
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `question-${Date.now()}-${i}`,
        text: `Sample question ${i + 1} about the content`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "Sample explanation for the correct answer",
        type: type,
        difficulty: "intermediate",
        category: "general",
        tags: ["sample", "generated"],
        createdAt: new Date(),
        updatedAt: new Date(),
        language: "italian",
        points: 10
      });
    }
    
    return questions;
  }
};

/**
 * Translate text from one language to another
 */
export const translateText = async (
  text: string, 
  from: 'en' | 'it', 
  to: 'en' | 'it'
): Promise<string> => {
  try {
    const response = await supabase.functions.invoke('ai-translation', {
      body: { 
        text,
        sourceLanguage: from,
        targetLanguage: to
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data.translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    
    // Fallback solution
    return `[Translation from ${from} to ${to}]: ${text}`;
  }
};

/**
 * Analyze grammar and provide feedback
 */
export const analyzeGrammar = async (
  text: string,
  language: 'en' | 'it' = 'it'
): Promise<any> => {
  try {
    const response = await supabase.functions.invoke('ai-grammar-analysis', {
      body: { 
        text,
        language
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error("Error analyzing grammar:", error);
    
    // Fallback solution
    return {
      score: 75,
      feedback: "Unable to analyze grammar in depth. Please try again later.",
      grammarIssues: [],
      vocabularyFeedback: "N/A",
      structureFeedback: "N/A",
      overallScore: 75
    };
  }
};

/**
 * Recognize speech from audio
 */
export const recognizeSpeech = async (audioData: Blob): Promise<string> => {
  try {
    // Convert blob to base64
    const buffer = await audioData.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    
    const response = await supabase.functions.invoke('ai-speech-recognition', {
      body: { audio: base64Audio, language: 'it' }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data.text;
  } catch (error) {
    console.error("Error recognizing speech:", error);
    throw error;
  }
};

/**
 * Generate speech from text
 */
export const generateSpeech = async (
  text: string,
  voice: string = 'alloy',
  model: string = 'tts-1'
): Promise<string> => {
  try {
    const response = await supabase.functions.invoke('ai-text-to-speech', {
      body: { text, voice, model }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data.audioContent;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};

/**
 * Compare pronunciation similarity between original and user audio
 */
export const comparePronunciation = async (
  originalText: string, 
  userTranscription: string
): Promise<number> => {
  try {
    return await HuggingFace.getTextSimilarity(originalText, userTranscription);
  } catch (error) {
    console.error("Error comparing pronunciation:", error);
    return 0.7; // Default fallback similarity
  }
};

/**
 * Process document content
 */
export const processDocument = async (
  content: string,
  userId: string,
  includeInTraining: boolean = false,
  documentType?: string
): Promise<any> => {
  try {
    const response = await supabase.functions.invoke('process-document', {
      body: { 
        documentContent: content, 
        userId,
        includeInTraining,
        documentType
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
};

/**
 * Abort a specific AI request
 */
export const abortRequest = (requestId: string): void => {
  console.log("AI Service - Aborting request:", requestId);
  if (activeRequests.has(requestId)) {
    activeRequests.get(requestId)?.abort();
    activeRequests.delete(requestId);
  }
};

/**
 * Abort all active AI requests
 */
export const abortAllRequests = (): void => {
  console.log("AI Service - Aborting all requests");
  activeRequests.forEach(controller => controller.abort());
  activeRequests.clear();
};

/**
 * Create an AIService object to implement AIServiceInterface
 */
const AIService: AIServiceInterface = {
  generateText,
  classifyText,
  getConfidenceScore,
  addTrainingExamples,
  generateFlashcards,
  generateQuestions,
  abortRequest,
  abortAllRequests
};

export default AIService;
