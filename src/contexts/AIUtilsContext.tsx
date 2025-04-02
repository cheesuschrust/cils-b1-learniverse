
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  AIGeneratedQuestion, 
  ItalianQuestionGenerationParams, 
  AIGenerationResult 
} from '@/types/italian-types';
import { v4 as uuidv4 } from 'uuid';
import * as HuggingFace from '@/utils/huggingFaceIntegration';

export interface AIUtilsContextType {
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  classifyText: (text: string) => Promise<Array<{ label: string; score: number }>>;
  generateText: (prompt: string) => Promise<string>;
  isProcessing: boolean;
  analyzeContent: (content: string) => Promise<{type: string; confidence: number}>;
  evaluateContent: (content: string, criteria: string) => Promise<{score: number; feedback: string}>;
}

// Create the initial context
const AIUtilsContext = createContext<AIUtilsContextType>({
  generateQuestions: async () => ({ questions: [] }),
  isGenerating: false,
  remainingCredits: 0,
  usageLimit: 0,
  classifyText: async () => [],
  generateText: async () => "",
  isProcessing: false,
  analyzeContent: async () => ({ type: "", confidence: 0 }),
  evaluateContent: async () => ({ score: 0, feedback: "" })
});

// Export the hook for using the context
export const useAIUtils = () => useContext(AIUtilsContext);

export interface AIUtilsProviderProps {
  children: ReactNode;
}

export const AIUtilsProvider: React.FC<AIUtilsProviderProps> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(100);
  const [usageLimit, setUsageLimit] = useState(500);

  // Initialize Hugging Face models
  const initializeHuggingFace = async () => {
    try {
      await HuggingFace.initialize();
      console.log("HuggingFace initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing HuggingFace:", error);
      return false;
    }
  };

  // Call initialize on first render
  React.useEffect(() => {
    initializeHuggingFace();
  }, []);

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

  // Text classification with Hugging Face
  const classifyText = async (text: string) => {
    setIsProcessing(true);
    try {
      // Try to use Hugging Face for classification
      try {
        const results = await HuggingFace.classifyText(text, 'distilbert-base-uncased-finetuned-sst-2-english');
        return results;
      } catch (err) {
        console.warn('HuggingFace classification failed, using fallback:', err);
        // Fallback classification based on text content
        return [
          { label: text.length > 100 ? 'Long Text' : 'Short Text', score: 0.95 },
          { label: text.includes('?') ? 'Question' : 'Statement', score: 0.85 },
          { label: /[àèéìíòóùú]/g.test(text) ? 'Italian' : 'English', score: 0.75 }
        ];
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate text using AI
  const generateText = async (prompt: string): Promise<string> => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate appropriate response based on prompt content
      if (prompt.includes('feedback')) {
        return `Feedback sul testo: Il tuo testo mostra una buona conoscenza base dell'italiano. Ecco alcuni suggerimenti:
        
        - Utilizza più forme verbali diverse
        - Arricchisci il vocabolario con termini specifici
        - Fai attenzione alla concordanza di genere e numero
        
        Continua a praticare, stai facendo progressi!`;
      }
      
      if (prompt.includes('translate')) {
        return `Traduzione: ${prompt.replace('translate', 'traduzione di')}`;
      }
      
      // Default response
      return `Risposta generata per: "${prompt}"\n\nQuesto è un esempio di contenuto generato dall'AI che analizza il testo italiano, identifica strutture grammaticali, vocaboli utilizzati e fornisce suggerimenti per migliorare.`;
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze content
  const analyzeContent = async (content: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic heuristic to determine content type and confidence
      let type = 'general';
      let confidence = 0.5;
      
      if (content.includes('?')) {
        type = 'question';
        confidence = 0.7;
      } else if (content.length > 100) {
        type = 'essay';
        confidence = 0.8;
      } else if (content.includes('cittadinanza') || content.includes('Italia')) {
        type = 'citizenship';
        confidence = 0.9;
      }
      
      return { type, confidence };
    } finally {
      setIsProcessing(false);
    }
  };

  // Evaluate content
  const evaluateContent = async (content: string, criteria: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Basic scoring based on content length and criteria
      const lengthScore = Math.min(0.9, content.length / 200);
      const criteriaMatch = criteria === 'grammar' ? 0.7 : 
                           criteria === 'vocabulary' ? 0.8 : 
                           criteria === 'citizenship' ? 0.75 : 0.6;
      
      const score = (lengthScore + criteriaMatch) / 2;
      
      return {
        score,
        feedback: `Il contenuto è stato valutato con un punteggio di ${(score * 10).toFixed(1)}/10. ${
          score > 0.8 ? 'Eccellente lavoro!' : 
          score > 0.6 ? 'Buon lavoro, ma c\'è spazio per migliorare.' : 
          'Continua a praticare per migliorare.'
        }`
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const value: AIUtilsContextType = {
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit,
    classifyText,
    generateText,
    isProcessing,
    analyzeContent,
    evaluateContent
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

export default AIUtilsContext;
