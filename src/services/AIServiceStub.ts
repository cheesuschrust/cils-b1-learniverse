
import { AIServiceInterface, AIServiceOptions } from '@/types/ai';

/**
 * Stub implementation of AI Service for development and testing
 */
class AIServiceStub implements AIServiceInterface {
  private activeRequests: Map<string, AbortController> = new Map();
  
  /**
   * Generate text using a mock implementation
   */
  async generateText(prompt: string, options: AIServiceOptions = {}): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a simple response based on prompt
    if (prompt.includes('hello') || prompt.includes('hi')) {
      return 'Hello! How can I help you today?';
    }
    
    if (prompt.includes('translate')) {
      return 'Here is the translation: "Ciao, come stai oggi?"';
    }
    
    if (prompt.includes('explain')) {
      return 'Here is an explanation of the requested topic...';
    }
    
    // Default response
    return `AI generated response for: ${prompt.substring(0, 50)}...`;
  }
  
  /**
   * Classify text with mock classification
   */
  async classifyText(text: string): Promise<Array<{ label: string; score: number }>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple classification based on text content
    const classifications = [];
    
    if (text.includes('?')) {
      classifications.push({ label: 'Question', score: 0.91 });
    }
    
    if (text.length > 100) {
      classifications.push({ label: 'Long Text', score: 0.85 });
    } else {
      classifications.push({ label: 'Short Text', score: 0.92 });
    }
    
    if (text.includes('ciao') || text.includes('buongiorno')) {
      classifications.push({ label: 'Italian Content', score: 0.94 });
    } else if (text.includes('hello') || text.includes('good morning')) {
      classifications.push({ label: 'English Content', score: 0.89 });
    }
    
    return classifications;
  }
  
  /**
   * Get confidence score for a content type
   */
  getConfidenceScore(contentType: string): number {
    // Return mock confidence scores based on content type
    const scores: Record<string, number> = {
      'multiple-choice': 78,
      'flashcards': 82,
      'writing': 69,
      'speaking': 74,
      'listening': 65
    };
    
    return scores[contentType] || 60;
  }
  
  /**
   * Add training examples for content type recognition
   */
  addTrainingExamples(contentType: string, examples: any[]): number {
    // Simulate adding examples to training data
    console.log(`Added ${examples.length} examples for ${contentType}`);
    return examples.length;
  }
  
  /**
   * Generate flashcards based on a topic
   */
  async generateFlashcards(topic: string, count: number = 5, difficulty: string = 'intermediate'): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock flashcards based on topic
    const mockFlashcards = [];
    
    for (let i = 0; i < count; i++) {
      mockFlashcards.push({
        id: `card-${i}`,
        italian: `Italian term ${i + 1} for ${topic}`,
        english: `English definition ${i + 1} for ${topic}`,
        tags: [topic.toLowerCase()],
        level: difficulty === 'advanced' ? 2 : difficulty === 'intermediate' ? 1 : 0,
        mastered: false
      });
    }
    
    return mockFlashcards;
  }
  
  /**
   * Generate questions based on content
   */
  async generateQuestions(content: string, count: number = 5, type: string = 'multiple-choice'): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate mock questions
    const mockQuestions = [];
    
    for (let i = 0; i < count; i++) {
      if (type === 'multiple-choice') {
        mockQuestions.push({
          id: `q-${i}`,
          type: 'multiple-choice',
          question: `Sample question ${i+1} about ${content.substring(0, 20)}...?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A',
          explanation: 'This is a sample explanation.'
        });
      } else if (type === 'text-input') {
        mockQuestions.push({
          id: `q-${i}`,
          type: 'text-input',
          question: `Sample fill-in question ${i+1} about ${content.substring(0, 20)}...?`,
          correctAnswers: ['Answer 1', 'Answer 2'],
          caseSensitive: false,
          explanation: 'This is a sample explanation.'
        });
      }
    }
    
    return mockQuestions;
  }
  
  /**
   * Abort ongoing request
   */
  abortRequest(requestId: string): void {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }
  
  /**
   * Abort all ongoing requests
   */
  abortAllRequests(): void {
    this.activeRequests.forEach(controller => {
      controller.abort();
    });
    this.activeRequests.clear();
  }
}

export default new AIServiceStub();
