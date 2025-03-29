
import React, { createContext, useState, useCallback, useRef } from 'react';

// Type interfaces
interface AISettings {
  enabled: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface AIUtilsContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  resetSettings: () => void;
  isProcessing: boolean;
  setIsProcessing: (state: boolean) => void;
  lastQuery: string;
  setLastQuery: (query: string) => void;
  generateContent: (prompt: string, contentType: string) => Promise<string>;
  analyzePerformance: (data: any) => Promise<any>;
  isAIEnabled: boolean;
  toggleAI: () => void;
  speakText: (text: string, language: string) => Promise<boolean>;
  isSpeaking: boolean;
  cancelSpeech: () => void;
  processAudioStream: (audioBlob: Blob) => Promise<string>;
  stopAudioProcessing: () => void;
  isTranscribing: boolean;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  isTranslating: boolean;
  hasActiveMicrophone: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
  grammarCheck: (text: string) => Promise<GrammarCheckResult>;
  getPersonalizedTips?: (subject: string) => Promise<string[]>;
  generateStudyPlan?: (subject: string, level: string) => Promise<any>;
  getRecommendedResources?: (topic: string) => Promise<any[]>;
  analyzeUserStrengths?: (userData: any) => Promise<any>;
  explainConcept?: (concept: string, level: string) => Promise<string>;
  simplifyExplanation?: (text: string, level: string) => Promise<string>;
}

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

// Default context values
const defaultSettings: AISettings = {
  enabled: true,
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500,
};

// Create the context
const AIUtilsContext = createContext<AIUtilsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  lastQuery: '',
  setLastQuery: () => {},
  generateContent: async () => '',
  analyzePerformance: async () => ({}),
  isAIEnabled: true,
  toggleAI: () => {},
  speakText: async () => false,
  isSpeaking: false,
  cancelSpeech: () => {},
  processAudioStream: async () => '',
  stopAudioProcessing: () => {},
  isTranscribing: false,
  translateText: async () => '',
  isTranslating: false,
  hasActiveMicrophone: false,
  checkMicrophoneAccess: async () => false,
  grammarCheck: async () => ({ text: '', corrections: [] }),
  getPersonalizedTips: async () => [],
  generateStudyPlan: async () => ({}),
  getRecommendedResources: async () => [],
  analyzeUserStrengths: async () => ({}),
  explainConcept: async () => '',
  simplifyExplanation: async () => ''
});

// Provider component
const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Update AI settings
  const updateSettings = useCallback((newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Reset AI settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Toggle AI enabled state
  const toggleAI = useCallback(() => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  // Generate AI content
  const generateContent = useCallback(async (prompt: string, contentType: string): Promise<string> => {
    if (!settings.enabled) {
      return "AI assistance is currently disabled. Enable it in settings to use this feature.";
    }
    
    setIsProcessing(true);
    setLastQuery(prompt);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on content type
      let response: string;
      
      switch(contentType) {
        case 'flashcard':
          response = `Front: ${prompt}\nBack: [AI generated translation would appear here]`;
          break;
        case 'grammar':
          response = `${prompt} [Grammar corrections would appear here]`;
          break;
        case 'explanation':
          response = `Here's an explanation about "${prompt}": [AI explanation would appear here]`;
          break;
        default:
          response = `AI response to: ${prompt}`;
      }
      
      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      return "Error generating content. Please try again.";
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Analyze user performance
  const analyzePerformance = useCallback(async (data: any): Promise<any> => {
    if (!settings.enabled) {
      return { message: "AI analysis is disabled" };
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock analysis results
      return {
        score: Math.floor(Math.random() * 100),
        strengths: ["Vocabulary", "Grammar"],
        weaknesses: ["Pronunciation", "Listening"],
        recommendations: ["Practice more listening exercises", "Focus on pronunciation drills"]
      };
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return { error: "Failed to analyze performance" };
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Text to speech functionality
  const speakText = useCallback(async (text: string, language: string): Promise<boolean> => {
    if (!settings.enabled) {
      return false;
    }
    
    try {
      setIsSpeaking(true);
      
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language || 'en-US';
      utterance.rate = 0.9; // Slightly slower for language learning
      
      // Store ref for cancellation
      speechSynthesisRef.current = utterance;
      
      // Handle completion
      return new Promise((resolve) => {
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve(true);
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve(false);
        };
        
        // Start speaking
        window.speechSynthesis.speak(utterance);
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      return false;
    }
  }, [settings.enabled]);

  // Cancel ongoing speech
  const cancelSpeech = useCallback(() => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Process audio for speech recognition
  const processAudioStream = useCallback(async (audioBlob: Blob): Promise<string> => {
    if (!settings.enabled) {
      return '';
    }
    
    setIsTranscribing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock transcription result
      return "This is a simulated transcription of the audio.";
    } catch (error) {
      console.error('Error processing audio:', error);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  }, [settings.enabled]);

  // Stop audio processing
  const stopAudioProcessing = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsTranscribing(false);
  }, []);

  // Translate text
  const translateText = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    if (!settings.enabled) {
      return text;
    }
    
    setIsTranslating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock translation result
      return `[Translation of "${text}" to ${targetLanguage}]`;
    } catch (error) {
      console.error('Error translating text:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [settings.enabled]);

  // Check microphone access
  const checkMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Clean up
      stream.getTracks().forEach(track => track.stop());
      
      setHasActiveMicrophone(true);
      return true;
    } catch (error) {
      console.error('Microphone access error:', error);
      setHasActiveMicrophone(false);
      return false;
    }
  }, []);
  
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
  
  // Additional AI utility methods
  const getPersonalizedTips = useCallback(async (subject: string): Promise<string[]> => {
    if (!settings.enabled) return [];
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        `Practice ${subject} for at least 15 minutes daily`,
        `Try speaking with native speakers`,
        `Use flashcards to reinforce vocabulary`
      ];
    } catch (error) {
      console.error('Error getting tips:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);
  
  const generateStudyPlan = useCallback(async (subject: string, level: string): Promise<any> => {
    if (!settings.enabled) return {};
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        schedule: [
          { day: 'Monday', activity: 'Vocabulary', duration: 20 },
          { day: 'Wednesday', activity: 'Grammar', duration: 30 },
          { day: 'Friday', activity: 'Conversation', duration: 15 }
        ],
        resources: ['Textbook Chapter 3', 'Online exercises'],
        goals: ['Master basic conversation', 'Learn 50 new words']
      };
    } catch (error) {
      console.error('Error generating study plan:', error);
      return {};
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);
  
  const getRecommendedResources = useCallback(async (topic: string): Promise<any[]> => {
    if (!settings.enabled) return [];
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        { title: `Learn ${topic} - Beginner's Guide`, type: 'article' },
        { title: `${topic} Practice Exercises`, type: 'exercises' },
        { title: `Advanced ${topic}`, type: 'video' }
      ];
    } catch (error) {
      console.error('Error getting resources:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);
  
  const analyzeUserStrengths = useCallback(async (userData: any): Promise<any> => {
    if (!settings.enabled) return {};
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return {
        strengths: ['Vocabulary', 'Reading'],
        weaknesses: ['Listening', 'Speaking'],
        improvements: ['Grammar has improved by 20%'],
        recommendations: ['Focus more on listening exercises']
      };
    } catch (error) {
      console.error('Error analyzing strengths:', error);
      return {};
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);
  
  const explainConcept = useCallback(async (concept: string, level: string): Promise<string> => {
    if (!settings.enabled) return '';
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Here is an explanation of ${concept} at ${level} level: [Concept explanation would appear here]`;
    } catch (error) {
      console.error('Error explaining concept:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);
  
  const simplifyExplanation = useCallback(async (text: string, level: string): Promise<string> => {
    if (!settings.enabled) return text;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return `Simplified (${level} level): ${text.substring(0, 100)}...`;
    } catch (error) {
      console.error('Error simplifying text:', error);
      return text;
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Combine all values for context
  const value = {
    settings,
    updateSettings,
    resetSettings,
    isProcessing,
    setIsProcessing,
    lastQuery,
    setLastQuery,
    generateContent,
    analyzePerformance,
    isAIEnabled: settings.enabled,
    toggleAI,
    speakText,
    isSpeaking,
    cancelSpeech,
    processAudioStream,
    stopAudioProcessing,
    isTranscribing,
    translateText,
    isTranslating,
    hasActiveMicrophone,
    checkMicrophoneAccess,
    grammarCheck,
    getPersonalizedTips,
    generateStudyPlan,
    getRecommendedResources,
    analyzeUserStrengths,
    explainConcept,
    simplifyExplanation
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

export { AIUtilsContext, AIUtilsProvider };
