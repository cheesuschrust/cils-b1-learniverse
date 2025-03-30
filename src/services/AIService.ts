
import { AIServiceOptions, AIServiceInterface } from "@/types/ai";
import * as HuggingFace from "@/utils/huggingFaceIntegration";

// Map to track ongoing requests
const activeRequests = new Map<string, AbortController>();

/**
 * Generate text using an AI model
 */
export const generateText = async (prompt: string, options?: AIServiceOptions): Promise<string> => {
  try {
    console.log("AI Service - Generating text with prompt:", prompt);
    
    // In a real implementation with a larger model, we would use a proper API
    // For now, we'll simulate generating response text to avoid large downloads
    return `AI generated response based on: ${prompt.substring(0, 50)}...`;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
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
export const addTrainingExamples = (contentType: string, examples: any[]): number => {
  console.log("AI Service - Adding training examples for:", contentType);
  return examples.length;
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
  
  // Simulated flashcard generation
  const flashcards = [];
  for (let i = 0; i < count; i++) {
    flashcards.push({
      id: `flashcard-${i}`,
      front: `Italian term ${i + 1} for ${topic}`,
      back: `English definition ${i + 1} for ${topic}`,
      italian: `Italian term ${i + 1} for ${topic}`,
      english: `English definition ${i + 1} for ${topic}`,
      difficulty: 1,
      level: 1,
      mastered: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      explanation: `Example explanation for ${topic} term ${i + 1}`,
      tags: [topic, difficulty]
    });
  }
  
  return flashcards;
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
  
  // Simulated question generation
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `question-${i}`,
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
      language: "english",
      points: 10
    });
  }
  
  return questions;
};

/**
 * Translate text from one language to another
 */
export const translateTextAI = async (
  text: string, 
  from: 'en' | 'it', 
  to: 'en' | 'it'
): Promise<string> => {
  try {
    // Use HuggingFace for translation
    return await HuggingFace.translateText(text, from, to);
  } catch (error) {
    console.error("Error translating text:", error);
    // Fallback solution
    return `[Translation from ${from} to ${to}]: ${text}`;
  }
};

/**
 * Recognize speech from audio
 */
export const recognizeSpeechAI = async (audioData: Blob): Promise<string> => {
  try {
    // Use HuggingFace for speech recognition
    const result = await HuggingFace.recognizeSpeech(audioData);
    return result.text;
  } catch (error) {
    console.error("Error recognizing speech:", error);
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
