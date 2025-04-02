
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  AIGeneratedQuestion, 
  ItalianQuestionGenerationParams, 
  AIGenerationResult 
} from '@/types/italian-types';
import { v4 as uuidv4 } from 'uuid';

export interface AIUtilsContextType {
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
}

// Create the initial context
const AIUtilsContext = createContext<AIUtilsContextType>({
  generateQuestions: async () => ({ questions: [] }),
  isGenerating: false,
  remainingCredits: 0,
  usageLimit: 0
});

// Export the hook for using the context
export const useAIUtils = () => useContext(AIUtilsContext);

export interface AIUtilsProviderProps {
  children: ReactNode;
}

export const AIUtilsProvider: React.FC<AIUtilsProviderProps> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(100);
  const [usageLimit, setUsageLimit] = useState(500);

  // Generate questions from Italian content
  const generateQuestions = async (params: ItalianQuestionGenerationParams): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock questions based on params
      const mockQuestions: AIGeneratedQuestion[] = Array(params.count || 5).fill(null).map((_, idx) => {
        // Generate content based on selected category type
        const contentType = params.contentTypes[0];
        let questionText = '';
        let options = ['Option A', 'Option B', 'Option C', 'Option D'];
        let correctAnswer = 'Option A';
        let explanation = '';
        
        if (contentType === 'grammar') {
          questionText = `Which form of the verb is correct in this sentence?`;
          options = [
            "Io sono andato al cinema ieri.",
            "Io ho andato al cinema ieri.",
            "Io ero andato al cinema ieri.",
            "Io fui andato al cinema ieri."
          ];
          correctAnswer = "Io sono andato al cinema ieri.";
          explanation = "The past participle of 'andare' uses the auxiliary verb 'essere', not 'avere'.";
        } else if (contentType === 'vocabulary') {
          questionText = `What does "${['palazzo', 'cittadino', 'legge', 'diritto'][idx % 4]}" mean in English?`;
          options = [
            "Palace/Building",
            "Citizen",
            "Law",
            "Right/Straight"
          ];
          correctAnswer = options[idx % 4];
          explanation = `This is a common word used in Italian citizenship contexts.`;
        } else if (contentType === 'culture') {
          questionText = `Which of the following is true about Italian citizenship?`;
          options = [
            "You must renounce your original citizenship",
            "You need to have lived in Italy for at least 10 years",
            "You can obtain citizenship through Italian ancestry",
            "You must be fluent in Italian at C2 level"
          ];
          correctAnswer = "You can obtain citizenship through Italian ancestry";
          explanation = "Italian citizenship can be obtained through jure sanguinis (by blood).";
        } else {
          questionText = `Sample question ${idx + 1} for ${params.contentTypes[0]}?`;
          explanation = `This is an explanation for ${params.contentTypes[0]} question ${idx + 1}`;
        }
        
        return {
          id: uuidv4(),
          text: questionText,
          options: options,
          correctAnswer: correctAnswer,
          explanation: explanation,
          type: params.contentTypes[0],
          difficulty: params.difficulty,
          questionType: 'multipleChoice',
          isCitizenshipRelevant: params.isCitizenshipFocused || false
        };
      });
      
      // Deduct credits
      setRemainingCredits(prev => Math.max(0, prev - 5));
      
      return { questions: mockQuestions };
    } catch (error) {
      console.error("Error generating questions:", error);
      return { questions: [], error: "Failed to generate questions" };
    } finally {
      setIsGenerating(false);
    }
  };

  const value: AIUtilsContextType = {
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

export default AIUtilsContext;
