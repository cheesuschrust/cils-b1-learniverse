
/**
 * AISystemInfo.ts
 * 
 * This file provides information about the AI system used in the application.
 * It includes details about capabilities, limitations, and usage guidelines.
 */

export const AISystemInfo = {
  name: "HuggingFace Client-Side AI",
  version: "2.0.0",
  description: "A client-side AI system for language learning assistance powered by Hugging Face Transformers",
  license: "Open Source (MIT)",
  
  // System capabilities
  capabilities: [
    "Text generation for learning content",
    "Language classification and analysis",
    "Question generation from learning materials",
    "Speech recognition and evaluation",
    "Flashcard generation with spaced repetition",
    "Text translation between English and Italian",
    "Pronunciation feedback",
    "Sentiment analysis of user content",
    "Grammar checking and correction"
  ],
  
  // System limitations
  limitations: [
    "Limited to client-side processing (browser-based)",
    "Operates primarily on English and Italian languages",
    "No internet connectivity required after models are loaded",
    "Performance may vary across browsers and devices",
    "Limited context window compared to server-based AI systems",
    "Cannot perform real-time video analysis",
    "Initial model loading may take time depending on connection speed",
    "May require significant browser memory for larger models",
    "Not suitable for processing very large documents"
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
    browser: "Modern web browser with Web Speech API and WebGPU support",
    storage: "LocalStorage for caching and saving preferences",
    optional: "Microphone access for speech features",
    memory: "At least 4GB RAM recommended for optimal performance",
    gpu: "WebGPU capable device recommended for faster inference"
  },
  
  // Usage guidelines
  usageGuidelines: [
    "Designed for educational purposes only",
    "Not suitable for critical decision-making",
    "User data is processed locally and not sent to external servers",
    "Performance optimizations may be necessary for mobile devices",
    "Initial model downloading requires internet connection"
  ],
  
  // Privacy information
  privacy: {
    dataStorage: "Client-side only (browser storage)",
    dataSharing: "None - data remains on user's device",
    userRecordings: "Temporary and processed locally",
    transparency: "All processing happens in the browser with minimal external API calls",
    modelStorage: "Models are cached in browser storage after initial download"
  },
  
  // Available models
  models: {
    text: [
      {
        id: "mxbai-embed-xsmall-v1",
        name: "MixedBread AI Embeddings XSmall",
        provider: "MixedBread AI",
        task: "feature-extraction",
        size: "50MB",
        languages: ["English", "Italian", "Spanish", "French", "German"],
        huggingFaceId: "mixedbread-ai/mxbai-embed-xsmall-v1"
      },
      {
        id: "distilbert-base-uncased",
        name: "DistilBERT Base Uncased",
        provider: "Hugging Face",
        task: "text-classification",
        size: "260MB",
        languages: ["English"],
        huggingFaceId: "distilbert-base-uncased"
      }
    ],
    speech: [
      {
        id: "whisper-tiny",
        name: "Whisper Tiny",
        provider: "OpenAI / Hugging Face",
        task: "automatic-speech-recognition",
        size: "75MB",
        languages: ["English"],
        huggingFaceId: "onnx-community/whisper-tiny.en"
      }
    ],
    translation: [
      {
        id: "opus-mt-en-it",
        name: "Opus MT English-Italian",
        provider: "Helsinki NLP",
        task: "translation",
        size: "85MB",
        languages: ["English", "Italian"],
        huggingFaceId: "Helsinki-NLP/opus-mt-en-it"
      },
      {
        id: "opus-mt-it-en",
        name: "Opus MT Italian-English",
        provider: "Helsinki NLP",
        task: "translation",
        size: "85MB",
        languages: ["Italian", "English"],
        huggingFaceId: "Helsinki-NLP/opus-mt-it-en"
      }
    ]
  }
};

/**
 * Get a string description of the AI system suitable for display to users
 */
export const getAISystemDescription = (detailed: boolean = false): string => {
  if (detailed) {
    return `${AISystemInfo.name} (v${AISystemInfo.version}) is an open-source, client-side AI system designed specifically for language learning. It provides ${AISystemInfo.capabilities.length} key capabilities including ${AISystemInfo.capabilities.slice(0, 3).join(", ")}, and more, while processing all data locally on your device for enhanced privacy. The system primarily supports ${AISystemInfo.languageSupport.primary.join(" and ")} languages and requires no internet connection for its core functionality after initial model loading.`;
  }
  
  return `${AISystemInfo.name} is an open-source AI system that helps with language learning. It works entirely within your browser using Hugging Face Transformers and doesn't send data to external servers. It's designed specifically for Italian language learning with features like question generation, flashcards, and pronunciation feedback.`;
};

/**
 * Get limitations of the AI system as bullet points
 */
export const getAISystemLimitations = (): string[] => {
  return AISystemInfo.limitations;
};

/**
 * Get a specific model by ID
 */
export const getModelById = (modelId: string) => {
  // Search through all model categories
  for (const category in AISystemInfo.models) {
    const found = AISystemInfo.models[category].find(model => model.id === modelId);
    if (found) return found;
  }
  return null;
};

/**
 * Get all available models
 */
export const getAllModels = () => {
  const allModels = [];
  for (const category in AISystemInfo.models) {
    allModels.push(...AISystemInfo.models[category]);
  }
  return allModels;
};

/**
 * Get models for a specific task
 */
export const getModelsForTask = (task: string) => {
  const taskModels = [];
  for (const category in AISystemInfo.models) {
    const found = AISystemInfo.models[category].filter(model => model.task === task);
    taskModels.push(...found);
  }
  return taskModels;
};

export default AISystemInfo;
