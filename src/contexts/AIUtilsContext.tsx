
      
      check: async (text: string): Promise<GrammarCheckResult> => {
        return grammarService.add(text);
      }
    };
    
    // Use the mock service's add method for backward compatibility
    return grammarService.add(text);
