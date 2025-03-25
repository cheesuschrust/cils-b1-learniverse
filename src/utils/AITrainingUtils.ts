
import { v4 as uuidv4 } from 'uuid';
import { ContentType } from '@/utils/textAnalysis';

interface TrainingExample {
  id: string;
  contentType: ContentType;
  text: string;
  metadata: any;
}

interface ContentTypeConfidence {
  contentType: ContentType;
  confidenceScore: number;
  exampleCount: number;
  lastImproved: Date;
}

// In a real implementation, this would be stored in a database or local storage
const mockDatabase = {
  trainingExamples: [] as TrainingExample[],
  confidenceScores: {
    'multiple-choice': { score: 85, count: 12, lastImproved: new Date() },
    'flashcards': { score: 78, count: 8, lastImproved: new Date() },
    'writing': { score: 72, count: 6, lastImproved: new Date() },
    'speaking': { score: 68, count: 5, lastImproved: new Date() },
    'listening': { score: 80, count: 10, lastImproved: new Date() }
  } as Record<ContentType, { score: number, count: number, lastImproved: Date }>
};

/**
 * Add training examples for a specific content type
 * @param contentType The type of content to train
 * @param examples Array of training examples
 * @returns Number of examples added
 */
export const addTrainingExamples = (contentType: ContentType, examples: TrainingExample[]): number => {
  const validExamples = examples.filter(ex => 
    ex.contentType === contentType && ex.text.trim() !== ''
  );
  
  if (validExamples.length === 0) return 0;
  
  // Add examples to the database
  validExamples.forEach(example => {
    const exampleWithId = {
      ...example,
      id: example.id || uuidv4(),
      contentType // Ensure correct content type
    };
    
    // Check if example already exists
    const existingIndex = mockDatabase.trainingExamples.findIndex(ex => ex.id === exampleWithId.id);
    if (existingIndex >= 0) {
      mockDatabase.trainingExamples[existingIndex] = exampleWithId;
    } else {
      mockDatabase.trainingExamples.push(exampleWithId);
    }
  });
  
  // Update confidence score
  updateConfidenceScore(contentType, validExamples.length);
  
  return validExamples.length;
};

/**
 * Remove a training example
 * @param id Example ID to remove
 * @returns Whether the operation was successful
 */
export const removeTrainingExample = (id: string): boolean => {
  const initialLength = mockDatabase.trainingExamples.length;
  mockDatabase.trainingExamples = mockDatabase.trainingExamples.filter(ex => ex.id !== id);
  return mockDatabase.trainingExamples.length < initialLength;
};

/**
 * Get training examples for a specific content type
 * @param contentType Type of content
 * @returns Array of training examples
 */
export const getTrainingExamples = (contentType: ContentType): TrainingExample[] => {
  return mockDatabase.trainingExamples.filter(ex => ex.contentType === contentType);
};

/**
 * Get the confidence score for a specific content type
 * @param contentType Type of content
 * @returns Confidence score (0-100)
 */
export const getConfidenceScore = (contentType: ContentType): number => {
  return mockDatabase.confidenceScores[contentType]?.score || 50;
};

/**
 * Get detailed confidence information for all content types
 * @returns Object containing confidence details for each content type
 */
export const getContentTypeConfidence = (): Record<ContentType, ContentTypeConfidence> => {
  const contentTypes: ContentType[] = ['multiple-choice', 'flashcards', 'writing', 'speaking', 'listening'];
  
  const result: Record<ContentType, ContentTypeConfidence> = {} as Record<ContentType, ContentTypeConfidence>;
  
  contentTypes.forEach(type => {
    const data = mockDatabase.confidenceScores[type];
    result[type] = {
      contentType: type,
      confidenceScore: data?.score || 50,
      exampleCount: data?.count || 0,
      lastImproved: data?.lastImproved || new Date()
    };
  });
  
  return result;
};

/**
 * Reset all training data
 * @returns Whether the operation was successful
 */
export const resetTrainingData = (): boolean => {
  try {
    mockDatabase.trainingExamples = [];
    
    // Reset confidence scores to default values
    const contentTypes: ContentType[] = ['multiple-choice', 'flashcards', 'writing', 'speaking', 'listening'];
    contentTypes.forEach(type => {
      mockDatabase.confidenceScores[type] = { 
        score: 50, 
        count: 0, 
        lastImproved: new Date() 
      };
    });
    
    return true;
  } catch (error) {
    console.error('Failed to reset training data:', error);
    return false;
  }
};

/**
 * Update the confidence score for a content type based on new training examples
 * @param contentType Type of content
 * @param newExampleCount Number of new examples added
 */
const updateConfidenceScore = (contentType: ContentType, newExampleCount: number): void => {
  const currentData = mockDatabase.confidenceScores[contentType] || { 
    score: 50, 
    count: 0, 
    lastImproved: new Date() 
  };
  
  // Calculate new score based on example count
  // This is a simplified model - in a real implementation this would be based on model performance
  const baseScore = currentData.score;
  const exampleWeight = 0.5; // Weight per example
  const maxBoost = 10; // Maximum boost from a single batch
  
  // Calculate score boost based on new examples (diminishing returns)
  const boost = Math.min(maxBoost, newExampleCount * exampleWeight);
  
  // Cap the score at 95% - final 5% requires actual performance improvements
  const newScore = Math.min(95, baseScore + boost);
  
  mockDatabase.confidenceScores[contentType] = {
    score: newScore,
    count: currentData.count + newExampleCount,
    lastImproved: new Date()
  };
};

export const analyzeContentForTraining = (content: string): ContentType => {
  // This would use the training examples to improve content detection
  // For now, just use the basic detection
  return import('./textAnalysis').then(module => module.detectContentType(content));
};
