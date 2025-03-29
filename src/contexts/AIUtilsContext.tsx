
// Add these interfaces at the top of the file
interface GrammarCorrection {
  original: string;
  suggestion: string;
  explanation: string;
  offset: number;
  length: number;
}

interface GrammarCheckResult {
  text: string;
  corrections: GrammarCorrection[];
}

interface GrammarService {
  add: (text: string) => GrammarCheckResult;
  check: (text: string) => Promise<GrammarCheckResult>;
}
      
// Grammar checker functionality
const grammarCheck = async (text: string): Promise<GrammarCheckResult> => {
  if (!settings.enabled) {
    return { text, corrections: [] };
  }
  
  setIsProcessing(true);
  try {
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a mock grammar service with an add method
    const grammarService: GrammarService = {
      add: (text: string): GrammarCheckResult => {
        // Simple mock implementation
        const corrections: GrammarCorrection[] = [];
        
        // Look for common errors
        if (text.includes('i am')) {
          corrections.push({
            original: 'i am',
            suggestion: 'I am',
            explanation: 'Capitalize the pronoun "I"',
            offset: text.indexOf('i am'),
            length: 4
          });
        }
        
        // Check for double spaces
        const doubleSpaceMatch = text.match(/\s\s+/g);
        if (doubleSpaceMatch) {
          doubleSpaceMatch.forEach(match => {
            corrections.push({
              original: match,
              suggestion: ' ',
              explanation: 'Remove extra space',
              offset: text.indexOf(match),
              length: match.length
            });
          });
        }
        
        return {
          text,
          corrections
        };
      },
      
      check: async (text: string): Promise<GrammarCheckResult> => {
        return grammarService.add(text);
      }
    };
    
    // Use the grammar service
    return grammarService.add(text);
  } catch (error) {
    console.error('Error checking grammar:', error);
    return { text, corrections: [] };
  } finally {
    setIsProcessing(false);
  }
};
