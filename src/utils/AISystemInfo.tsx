
/**
 * AISystemInfo.ts
 * 
 * This file provides information about the AI system used in the application.
 * It includes details about capabilities, limitations, and usage guidelines.
 */

export const AISystemInfo = {
  name: "AIUtils Internal System",
  version: "1.2.0",
  description: "A client-side AI system for language learning assistance",
  license: "Proprietary (Royalty-free)",
  
  // System capabilities
  capabilities: [
    "Text generation for learning content",
    "Language classification and analysis",
    "Question generation from learning materials",
    "Speech recognition and evaluation",
    "Flashcard generation",
    "Text translation between English and Italian",
    "Pronunciation feedback"
  ],
  
  // System limitations
  limitations: [
    "Limited to client-side processing (browser-based)",
    "Operates primarily on English and Italian languages",
    "No internet connectivity required for basic functions",
    "Performance may vary across browsers and devices",
    "Limited context window compared to server-based AI systems",
    "Cannot perform real-time video analysis",
    "Limited training dataset focused on language learning"
  ],
  
  // Language support
  languageSupport: {
    primary: ["English", "Italian"],
    basic: ["Spanish", "French", "German"],
    translation: {
      from: ["English", "Italian"],
      to: ["English", "Italian"]
    }
  },
  
  // Performance metrics
  performance: {
    textGeneration: {
      speed: "Medium",
      quality: "Good for educational content",
      contextLength: "Up to 2000 tokens"
    },
    speechRecognition: {
      accuracy: "85-90% for clear speech",
      languages: ["English", "Italian"],
      conditions: "Works best in quiet environments"
    }
  },
  
  // Technical requirements
  requirements: {
    browser: "Modern web browser with Web Speech API support",
    storage: "LocalStorage for caching and saving preferences",
    optional: "Microphone access for speech features"
  },
  
  // Usage guidelines
  usageGuidelines: [
    "Designed for educational purposes only",
    "Not suitable for critical decision-making",
    "User data is processed locally and not sent to external servers",
    "Performance optimizations may be necessary for mobile devices"
  ],
  
  // Privacy information
  privacy: {
    dataStorage: "Client-side only (browser storage)",
    dataSharing: "None - data remains on user's device",
    userRecordings: "Temporary and processed locally",
    transparency: "All processing happens in the browser with no external API calls"
  }
};

/**
 * Get a string description of the AI system suitable for display to users
 */
export const getAISystemDescription = (detailed: boolean = false): string => {
  if (detailed) {
    return `${AISystemInfo.name} (v${AISystemInfo.version}) is a royalty-free, client-side AI system designed specifically for language learning. It provides ${AISystemInfo.capabilities.length} key capabilities including ${AISystemInfo.capabilities.slice(0, 3).join(", ")}, and more, while processing all data locally on your device for enhanced privacy. The system primarily supports ${AISystemInfo.languageSupport.primary.join(" and ")} languages and requires no internet connection for its core functionality.`;
  }
  
  return `${AISystemInfo.name} is a royalty-free AI system that helps with language learning. It works entirely within your browser and doesn't send data to external servers. It's designed specifically for Italian language learning with features like question generation, flashcards, and pronunciation feedback.`;
};

/**
 * Get limitations of the AI system as bullet points
 */
export const getAISystemLimitations = (): string[] => {
  return AISystemInfo.limitations;
};

export default AISystemInfo;
