
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ContentType } from '@/types/contentType';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { speak, stopSpeaking, isSpeechSupported, getVoices } from '@/utils/textToSpeech';
import { useToast } from '@/hooks/use-toast';

// Define the types for AI settings
interface AISettings {
  enabled: boolean;
  model: string;
  temperature: number;
  responseLength: number;
  contextWindow: number;
  learningStyle: string;
  contentTypes: string[];
  preferredVoice: string;
  assistantName: string;
  feedbackLevel: 'detailed' | 'summary' | 'minimal';
}

// Define the context type
interface AIUtilsContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  resetSettings: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  lastQuery: string;
  setLastQuery: (query: string) => void;
  generateContent: (prompt: string, type: string) => Promise<string>;
  analyzePerformance: (data: any) => Promise<any>;
  isAIEnabled: boolean;
  toggleAI: () => boolean;
  speakText: (text: string, language?: string) => Promise<void>;
  isSpeaking: boolean; 
  cancelSpeech: () => void;
  processAudioStream: (callback: (transcript: string, isFinal: boolean) => void) => Promise<() => void>;
  stopAudioProcessing: () => void;
  isTranscribing: boolean;
  translateText: (text: string, targetLang: 'english' | 'italian') => Promise<string>;
  isTranslating: boolean;
  hasActiveMicrophone: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
  // New integration methods
  getPersonalizedTips: (contentType: ContentType, userLevel: string) => Promise<string[]>;
  generateStudyPlan: (topics: string[], timeAvailable: number) => Promise<any>;
  getRecommendedResources: (currentTopic: string, userLevel: string) => Promise<any[]>;
  analyzeUserStrengths: (activityData: any) => Promise<{strengths: string[], weaknesses: string[]}>;
  explainConcept: (concept: string, userLevel: string) => Promise<string>;
  simplifyExplanation: (text: string, targetLevel: string) => Promise<string>;
}

// Default settings
const defaultSettings: AISettings = {
  enabled: true,
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  responseLength: 250,
  contextWindow: 5,
  learningStyle: 'balanced',
  contentTypes: ['writing', 'speaking', 'listening', 'multiple-choice', 'flashcards'],
  preferredVoice: 'natural',
  assistantName: 'LinguaAssistant',
  feedbackLevel: 'summary'
};

// Create the context with default values
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
  toggleAI: () => true,
  speakText: async () => {},
  isSpeaking: false,
  cancelSpeech: () => {},
  processAudioStream: async () => () => {},
  stopAudioProcessing: () => {},
  isTranscribing: false,
  translateText: async () => '',
  isTranslating: false,
  hasActiveMicrophone: false,
  checkMicrophoneAccess: async () => false,
  // New integration methods
  getPersonalizedTips: async () => [],
  generateStudyPlan: async () => ({}),
  getRecommendedResources: async () => [],
  analyzeUserStrengths: async () => ({strengths: [], weaknesses: []}),
  explainConcept: async () => '',
  simplifyExplanation: async () => ''
});

// Provider component
export const AIUtilsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Load settings from local storage or use defaults
  const [settings, setSettings] = useLocalStorage<AISettings>('ai-settings', defaultSettings);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  const { toast } = useToast();

  // Flag for AI features enabled/disabled
  const isAIEnabled = settings.enabled;

  // Check speech synthesis and microphone on init
  useEffect(() => {
    const checkCapabilities = async () => {
      // Check speech synthesis
      if (isSpeechSupported()) {
        // Preload voices
        getVoices();
      }
      
      // Check microphone
      await checkMicrophoneAccess();
    };
    
    checkCapabilities();
  }, []);

  // Toggle AI features on/off
  const toggleAI = useCallback(() => {
    const newEnabled = !settings.enabled;
    updateSettings({ enabled: newEnabled });
    
    toast({
      title: newEnabled ? "AI Features Enabled" : "AI Features Disabled",
      description: newEnabled 
        ? "AI-powered learning features are now active"
        : "AI-powered learning features have been turned off"
    });
    
    return newEnabled;
  }, [settings.enabled, toast]);

  // Update settings and save to localStorage
  const updateSettings = (newSettings: Partial<AISettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
  };

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "AI settings have been reset to defaults"
    });
  };

  // Simulate content generation
  const generateContent = async (prompt: string, type: string): Promise<string> => {
    if (!settings.enabled) {
      return "AI features are currently disabled. Enable them in settings to use this feature.";
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = `Generated ${type} content based on: "${prompt}"`;
      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate performance analysis
  const analyzePerformance = async (data: any): Promise<any> => {
    if (!settings.enabled) {
      return {
        error: "AI features are disabled",
        message: "Enable AI features in settings to use performance analysis."
      };
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        strengths: ['Vocabulary usage', 'Grammar application'],
        weaknesses: ['Pronunciation', 'Listening comprehension'],
        recommendations: ['Practice more listening exercises', 'Focus on pronunciation drills']
      };
    } catch (error) {
      console.error('Error analyzing performance:', error);
      throw new Error('Failed to analyze performance');
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech functionality
  const speakText = async (text: string, language = 'it-IT'): Promise<void> => {
    if (!settings.enabled) {
      throw new Error('AI features are disabled');
    }
    
    try {
      // Cancel any ongoing speech
      if (isSpeaking) {
        cancelSpeech();
      }
      
      setIsSpeaking(true);
      
      // Use our utility function from textToSpeech.ts
      await speak(text, {
        lang: language,
        voiceName: settings.preferredVoice !== 'default' ? settings.preferredVoice : undefined,
        onEnd: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
          toast({
            title: "Speech Error",
            description: "There was an error with the text-to-speech feature",
            variant: "destructive"
          });
        }
      });
      
      return Promise.resolve();
    } catch (error) {
      setIsSpeaking(false);
      console.error('Error speaking text:', error);
      throw new Error('Failed to speak text');
    }
  };

  // Cancel any ongoing speech
  const cancelSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  // Process audio for speech recognition
  const processAudioStream = async (callback: (transcript: string, isFinal: boolean) => void): Promise<() => void> => {
    if (!settings.enabled) {
      throw new Error('AI features are disabled');
    }
    
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition is not supported in this browser');
    }
    
    try {
      setIsTranscribing(true);
      
      // @ts-ignore - SpeechRecognition is not in the standard lib.dom yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;
        const isFinal = lastResult.isFinal;
        
        callback(transcript, isFinal);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsTranscribing(false);
      };
      
      // Start listening
      recognition.start();
      
      // Return a function to stop listening
      return () => {
        recognition.stop();
        setIsTranscribing(false);
      };
    } catch (error) {
      setIsTranscribing(false);
      console.error('Error starting speech recognition:', error);
      throw new Error('Failed to start speech recognition');
    }
  };

  // Stop audio processing
  const stopAudioProcessing = () => {
    // This is a placeholder - the actual stop function is returned by processAudioStream
    setIsTranscribing(false);
  };

  // Translate text between languages
  const translateText = async (text: string, targetLang: 'english' | 'italian'): Promise<string> => {
    if (!settings.enabled) {
      throw new Error('AI features are disabled');
    }
    
    setIsTranslating(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple word replacement for demo purposes
      const italianWords = {
        hello: 'ciao',
        goodbye: 'arrivederci',
        please: 'per favore',
        thanks: 'grazie',
        yes: 'sì',
        no: 'no'
      };
      
      const englishWords = {
        ciao: 'hello',
        arrivederci: 'goodbye',
        'per favore': 'please',
        grazie: 'thanks',
        sì: 'yes',
        no: 'no'
      };
      
      // Very simple translation demo
      let translatedText = text;
      
      if (targetLang === 'italian') {
        Object.entries(italianWords).forEach(([en, it]) => {
          translatedText = translatedText.replace(new RegExp(`\\b${en}\\b`, 'gi'), it);
        });
      } else {
        Object.entries(englishWords).forEach(([it, en]) => {
          translatedText = translatedText.replace(new RegExp(`\\b${it}\\b`, 'gi'), en);
        });
      }
      
      return `[Translated to ${targetLang}]: ${translatedText}`;
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Failed to translate text');
    } finally {
      setIsTranslating(false);
    }
  };

  // Check microphone access
  const checkMicrophoneAccess = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      setHasActiveMicrophone(true);
      return true;
    } catch (error) {
      console.error('Microphone access error:', error);
      setHasActiveMicrophone(false);
      return false;
    }
  };
  
  // New integration methods for enhanced AI functionality
  
  // Get personalized learning tips based on content type and user level
  const getPersonalizedTips = async (
    contentType: ContentType, 
    userLevel: string
  ): Promise<string[]> => {
    if (!settings.enabled) {
      return ["Enable AI features to get personalized tips"];
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return tips based on content type and level
      let tips: string[] = [];
      
      if (contentType === 'writing') {
        if (userLevel === 'beginner') {
          tips = [
            "Focus on basic sentence structures",
            "Learn the most common 500 words first",
            "Practice writing simple daily journal entries"
          ];
        } else if (userLevel === 'intermediate') {
          tips = [
            "Try using connecting words to create longer sentences",
            "Focus on verb tenses and agreements",
            "Incorporate new vocabulary from your recent lessons"
          ];
        } else {
          tips = [
            "Work on nuanced expressions and idioms",
            "Practice writing in different styles and formats",
            "Focus on subtle grammar distinctions"
          ];
        }
      } else if (contentType === 'speaking') {
        if (userLevel === 'beginner') {
          tips = [
            "Practice basic pronunciation every day",
            "Record yourself speaking simple phrases",
            "Focus on the most common greetings and phrases"
          ];
        } else if (userLevel === 'intermediate') {
          tips = [
            "Work on your rhythm and intonation",
            "Try speaking without pausing to translate in your head",
            "Practice with conversation topics you're interested in"
          ];
        } else {
          tips = [
            "Focus on reducing your accent if desired",
            "Practice speaking about complex topics spontaneously",
            "Work on humor and cultural expressions"
          ];
        }
      } else if (contentType === 'flashcards') {
        tips = [
          "Review cards just before you would forget them",
          "Create associations and memory hooks for difficult words",
          "Add example sentences to your flashcards for context"
        ];
      }
      
      return tips;
    } catch (error) {
      console.error('Error getting personalized tips:', error);
      return ["Something went wrong. Please try again later."];
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate a personalized study plan based on topics and available time
  const generateStudyPlan = async (
    topics: string[], 
    timeAvailable: number
  ): Promise<any> => {
    if (!settings.enabled) {
      return {
        error: "AI features are disabled",
        message: "Enable AI features to generate study plans"
      };
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simple study plan generation logic
      const totalTopics = topics.length;
      const timePerTopic = Math.floor(timeAvailable / totalTopics);
      
      const studyPlan = {
        totalTime: timeAvailable,
        sessions: topics.map((topic, index) => ({
          topic,
          duration: timePerTopic,
          priority: index === 0 ? "high" : index < totalTopics / 2 ? "medium" : "low",
          activities: [
            {
              type: "review",
              duration: Math.floor(timePerTopic * 0.3),
              description: `Review ${topic} concepts`
            },
            {
              type: "practice",
              duration: Math.floor(timePerTopic * 0.5),
              description: `Practice ${topic} with exercises`
            },
            {
              type: "test",
              duration: Math.floor(timePerTopic * 0.2),
              description: `Test your knowledge of ${topic}`
            }
          ]
        }))
      };
      
      return studyPlan;
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw new Error('Failed to generate study plan');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get recommended learning resources for a specific topic
  const getRecommendedResources = async (
    currentTopic: string, 
    userLevel: string
  ): Promise<any[]> => {
    if (!settings.enabled) {
      return [];
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock resources based on topic and level
      return [
        {
          title: `${currentTopic} for ${userLevel} learners`,
          type: "article",
          difficulty: userLevel,
          estimatedTime: 10
        },
        {
          title: `Interactive exercises: ${currentTopic}`,
          type: "exercise",
          difficulty: userLevel,
          estimatedTime: 15
        },
        {
          title: `Video lesson: ${currentTopic} made simple`,
          type: "video",
          difficulty: userLevel === "advanced" ? "intermediate" : userLevel,
          estimatedTime: 8
        }
      ];
    } catch (error) {
      console.error('Error getting recommended resources:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Analyze user activity data to identify strengths and weaknesses
  const analyzeUserStrengths = async (
    activityData: any
  ): Promise<{strengths: string[], weaknesses: string[]}> => {
    if (!settings.enabled) {
      return {
        strengths: [],
        weaknesses: []
      };
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock analysis logic - in a real app this would analyze actual user data
      const mockAnalysis = {
        strengths: [
          "Vocabulary retention",
          "Regular practice consistency",
          "Grammar understanding"
        ],
        weaknesses: [
          "Listening comprehension",
          "Speaking fluency",
          "Complex sentence formation"
        ]
      };
      
      return mockAnalysis;
    } catch (error) {
      console.error('Error analyzing user strengths:', error);
      return {
        strengths: [],
        weaknesses: []
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Explain a concept in a user-friendly way
  const explainConcept = async (
    concept: string,
    userLevel: string
  ): Promise<string> => {
    if (!settings.enabled) {
      return "AI explanations are disabled. Enable AI features in settings.";
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock explanation based on level
      const explanation = userLevel === "beginner"
        ? `${concept} is a basic concept in Italian. It's similar to how in English we use...`
        : userLevel === "intermediate"
          ? `${concept} is a moderately advanced feature of Italian grammar that works by...`
          : `${concept} is a nuanced aspect of Italian language that native speakers use to...`;
          
      return explanation;
    } catch (error) {
      console.error('Error explaining concept:', error);
      return "Sorry, I couldn't generate an explanation at this time.";
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Simplify a complex explanation for a specific level
  const simplifyExplanation = async (
    text: string,
    targetLevel: string
  ): Promise<string> => {
    if (!settings.enabled) {
      return text;
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock simplification logic
      let simplified = text;
      if (targetLevel === "beginner") {
        // Reduce sentence length and vocabulary complexity
        simplified = text
          .split('. ')
          .map(sentence => sentence.length > 50 ? sentence.substring(0, 47) + '...' : sentence)
          .join('. ');
      }
      
      return simplified;
    } catch (error) {
      console.error('Error simplifying explanation:', error);
      return text;
    } finally {
      setIsProcessing(false);
    }
  };

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
    isAIEnabled,
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
    // New integration methods
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

// Custom hook to use the context
export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export default AIUtilsContext;
