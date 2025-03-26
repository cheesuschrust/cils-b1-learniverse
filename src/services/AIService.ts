
import axios from 'axios';
import { ContentType } from '@/types/contentType';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for training examples
const trainingExamples: Record<string, any[]> = {
  'multiple-choice': [],
  'flashcards': [],
  'writing': [],
  'speaking': [],
  'listening': []
};

// Mock confidence scores
const confidenceScores: Record<string, number> = {
  'multiple-choice': 78,
  'flashcards': 82,
  'writing': 69,
  'speaking': 74,
  'listening': 65
};

interface AIServiceOptions {
  maxLength?: number;
  temperature?: number;
  model?: string;
  stream?: boolean;
}

class AIService {
  private static apiUrl = '/api/ai';
  private static apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  
  /**
   * Generate text using an AI model
   */
  static async generateText(prompt: string, options: AIServiceOptions = {}): Promise<string> {
    try {
      // Use environment variables or fallback to default
      const apiKey = this.apiKey || 'test-api-key';
      
      // For demo purposes, we'll simulate an API call
      if (process.env.NODE_ENV === 'test' || !apiKey) {
        console.log('Simulating AI text generation in test/dev mode');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `AI generated response for: ${prompt.substring(0, 50)}...`;
      }
      
      // Real API call
      const response = await axios.post(this.apiUrl + '/generate', {
        prompt,
        maxLength: options.maxLength || 1024,
        temperature: options.temperature || 0.7,
        model: options.model || 'gpt-4o-mini'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      return response.data.text;
    } catch (error) {
      console.error('Error generating text with AI:', error);
      throw new Error('Failed to generate text. Please try again later.');
    }
  }
  
  /**
   * Classify text content
   */
  static async classifyText(text: string): Promise<{ label: string; score: number }[]> {
    try {
      // For demo/test purposes
      if (process.env.NODE_ENV === 'test' || !this.apiKey) {
        console.log('Simulating AI classification in test/dev mode');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock classification
        return [
          { label: 'Writing Exercise', score: 0.82 },
          { label: 'Conversation', score: 0.65 },
          { label: 'Grammar Example', score: 0.43 }
        ];
      }
      
      // Real API call
      const response = await axios.post(this.apiUrl + '/classify', {
        text
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data.classifications;
    } catch (error) {
      console.error('Error classifying text with AI:', error);
      throw new Error('Failed to classify text. Please try again later.');
    }
  }
  
  /**
   * Generate an image based on a prompt
   */
  static async generateImage(prompt: string, size: '256x256' | '512x512' | '1024x1024' = '512x512'): Promise<string> {
    try {
      // For demo/test purposes
      if (process.env.NODE_ENV === 'test' || !this.apiKey) {
        console.log('Simulating AI image generation in test/dev mode');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Return a placeholder image
        return `https://placehold.co/${size.replace('x', '/')}?text=AI+Image`;
      }
      
      // Real API call
      const response = await axios.post(this.apiUrl + '/generate-image', {
        prompt,
        size
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error generating image with AI:', error);
      throw new Error('Failed to generate image. Please try again later.');
    }
  }
  
  /**
   * Add training examples for content type recognition
   */
  static addTrainingExamples(contentType: ContentType, examples: any[]): number {
    // Add examples to the in-memory storage
    if (!trainingExamples[contentType]) {
      trainingExamples[contentType] = [];
    }
    
    const validExamples = examples.filter(example => 
      example && example.text && typeof example.text === 'string');
    
    trainingExamples[contentType].push(...validExamples);
    
    // Update confidence score
    this.updateConfidenceScore(contentType);
    
    return validExamples.length;
  }
  
  /**
   * Update confidence score for a content type
   */
  private static updateConfidenceScore(contentType: ContentType): void {
    const count = trainingExamples[contentType]?.length || 0;
    
    // Simulate improved confidence with more examples
    // Formula: base score + log(count + 1) * 10, max 100
    const baseScore = confidenceScores[contentType] || 60;
    const newScore = Math.min(baseScore + Math.log(count + 1) * 10, 100);
    
    confidenceScores[contentType] = Math.round(newScore);
  }
  
  /**
   * Get confidence score for a content type
   */
  static getConfidenceScore(contentType: ContentType): number {
    return confidenceScores[contentType] || 60;
  }
}

// Function to get confidence score for a content type
export const getConfidenceScore = (contentType: ContentType): number => {
  return AIService.getConfidenceScore(contentType);
};

// Function to add training examples
export const addTrainingExamples = (contentType: ContentType, examples: any[]): number => {
  return AIService.addTrainingExamples(contentType, examples);
};

export default AIService;
