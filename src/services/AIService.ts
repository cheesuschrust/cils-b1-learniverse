
// This is a simplified mock version of the AIService

export const generateText = async (
  prompt: string, 
  options: any = {}
): Promise<string> => {
  // Mock implementation
  return `Generated text for: ${prompt}`;
};

export const classifyText = async (
  text: string
): Promise<{ label: string; score: number }[]> => {
  // Mock implementation
  return [
    { label: "multiple-choice", score: 0.8 },
    { label: "flashcards", score: 0.3 },
  ];
};

export const generateQuestions = async (
  content: string,
  contentType: string,
  count: number = 5,
  difficulty: string = "Intermediate"
): Promise<any[]> => {
  // Mock implementation
  return Array(count).fill(null).map((_, i) => ({
    id: `q-${i}`,
    question: `Sample question ${i+1} about ${content.substring(0, 20)}...`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswerIndex: 0,
    difficulty,
    type: contentType
  }));
};

export const initialize = async (config: any): Promise<boolean> => {
  // Mock implementation
  return true;
};

export const testConnection = async (): Promise<{ success: boolean, message: string }> => {
  // Mock implementation
  return { success: true, message: "AI service connection successful" };
};

export const processText = async (
  text: string, 
  processingType: string
): Promise<any> => {
  // Mock implementation
  return {
    text,
    processingType,
    confidence: Math.random() * 100
  };
};

export const processImage = async (
  imageUrl: string, 
  prompt: string
): Promise<any> => {
  // Mock implementation
  return {
    imageUrl,
    prompt,
    confidence: Math.random() * 100
  };
};

// Add the missing functions needed by AITrainingUtils.ts
export const addTrainingExamples = (
  contentType: string,
  examples: any[]
): number => {
  // Mock implementation
  console.log(`Added ${examples.length} training examples for ${contentType}`);
  return examples.length;
};

export const getConfidenceScore = (contentType: string): number => {
  // Mock implementation
  const scores: Record<string, number> = {
    'multiple-choice': 85,
    'flashcards': 80,
    'writing': 75,
    'speaking': 70,
    'listening': 90
  };
  
  return scores[contentType] || 60;
};

export const isCacheEnabled = true;
