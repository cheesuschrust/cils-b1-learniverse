
import { pipeline, env } from '@huggingface/transformers';

// Enable WebGPU if available, fallback to WebGL or CPU
env.useBrowserCache = true;
env.allowLocalModels = true;

// Cache for initialized models to avoid reloading
const modelCache: Record<string, any> = {};

export type AIModelType = 
  | 'text-generation' 
  | 'text-classification'
  | 'question-answering'
  | 'feature-extraction'
  | 'automatic-speech-recognition';

export type AIServiceProps = {
  modelType: AIModelType;
  modelName?: string;
  task?: string;
  options?: Record<string, any>;
};

export interface AITextGenerationResult {
  generated_text: string;
  confidenceScore?: number;
}

export interface AIQuestionAnsweringResult {
  answer: string;
  score: number;
  start: number;
  end: number;
}

export interface AIFeatureExtractionResult {
  embeddings: number[][];
}

export interface AITextClassificationResult {
  label: string;
  score: number;
}

export interface AISpeechRecognitionResult {
  text: string;
  chunks?: Array<{text: string}>;
}

// Default models for different tasks
const DEFAULT_MODELS: Record<AIModelType, string> = {
  'text-generation': 'Xenova/distilgpt2',
  'text-classification': 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
  'question-answering': 'Xenova/distilbert-base-cased-distilled-squad',
  'feature-extraction': 'Xenova/all-MiniLM-L6-v2',
  'automatic-speech-recognition': 'Xenova/whisper-tiny.en'
};

/**
 * Initialize a model pipeline
 */
export const initModel = async ({
  modelType,
  modelName,
  task,
  options = { quantized: true }
}: AIServiceProps) => {
  try {
    const model = modelName || DEFAULT_MODELS[modelType];
    const cacheKey = `${modelType}-${model}`;
    
    if (modelCache[cacheKey]) {
      return modelCache[cacheKey];
    }
    
    console.log(`Initializing ${modelType} model: ${model}`);
    const instance = await pipeline(task || modelType as any, model, options);
    modelCache[cacheKey] = instance;
    
    return instance;
  } catch (error) {
    console.error("Error initializing model:", error);
    throw new Error(`Failed to initialize AI model: ${error}`);
  }
};

/**
 * Generate text based on a prompt
 */
export const generateText = async (
  prompt: string,
  options: {
    maxLength?: number;
    minLength?: number;
    temperature?: number;
    modelName?: string;
  } = {}
): Promise<AITextGenerationResult> => {
  try {
    const generator = await initModel({ 
      modelType: 'text-generation',
      modelName: options.modelName
    });
    
    const result = await generator(prompt, {
      max_new_tokens: options.maxLength || 50,
      min_new_tokens: options.minLength,
      temperature: options.temperature || 0.7,
      do_sample: true,
    });
    
    if (Array.isArray(result) && result.length > 0) {
      return {
        generated_text: result[0].generated_text.replace(prompt, '').trim(),
        confidenceScore: 0.85 // Approximated confidence
      };
    }
    
    return {
      generated_text: result.generated_text.replace(prompt, '').trim(),
      confidenceScore: 0.85 // Approximated confidence
    };
  } catch (error) {
    console.error("Text generation error:", error);
    return {
      generated_text: "Sorry, I couldn't generate a response at this time.",
      confidenceScore: 0
    };
  }
};

/**
 * Answer a question based on a context
 */
export const answerQuestion = async (
  question: string,
  context: string,
  options: { modelName?: string } = {}
): Promise<AIQuestionAnsweringResult> => {
  try {
    const qa = await initModel({
      modelType: 'question-answering',
      modelName: options.modelName
    });
    
    const result = await qa({
      question,
      context
    });
    
    return result as AIQuestionAnsweringResult;
  } catch (error) {
    console.error("Question answering error:", error);
    return {
      answer: "Sorry, I couldn't find an answer based on the provided context.",
      score: 0,
      start: 0,
      end: 0
    };
  }
};

/**
 * Generate embeddings for text
 */
export const generateEmbeddings = async (
  texts: string | string[],
  options: { modelName?: string } = {}
): Promise<AIFeatureExtractionResult> => {
  try {
    const extractor = await initModel({
      modelType: 'feature-extraction',
      modelName: options.modelName
    });
    
    const result = await extractor(texts, {
      pooling: 'mean',
      normalize: true
    });
    
    return {
      embeddings: result.tolist()
    };
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw new Error(`Failed to generate embeddings: ${error}`);
  }
};

/**
 * Classify text
 */
export const classifyText = async (
  text: string,
  options: { modelName?: string } = {}
): Promise<AITextClassificationResult[]> => {
  try {
    const classifier = await initModel({
      modelType: 'text-classification',
      modelName: options.modelName
    });
    
    const result = await classifier(text);
    
    if (Array.isArray(result)) {
      return result;
    }
    
    return [result as AITextClassificationResult];
  } catch (error) {
    console.error("Text classification error:", error);
    return [{
      label: "unknown",
      score: 0
    }];
  }
};

/**
 * Transcribe speech from audio
 */
export const transcribeAudio = async (
  audioData: string | Blob | ArrayBuffer,
  options: { modelName?: string } = {}
): Promise<AISpeechRecognitionResult> => {
  try {
    const transcriber = await initModel({
      modelType: 'automatic-speech-recognition',
      modelName: options.modelName
    });
    
    const result = await transcriber(audioData);
    
    return result as AISpeechRecognitionResult;
  } catch (error) {
    console.error("Speech recognition error:", error);
    return {
      text: "Sorry, I couldn't transcribe the audio."
    };
  }
};

/**
 * Generate AI feedback based on user input and expected answer
 */
export const generateFeedback = async (
  userInput: string,
  expectedAnswer: string,
  language: "english" | "italian" | "both" = "both"
): Promise<string> => {
  try {
    const prompt = `
User input: "${userInput}"
Expected answer: "${expectedAnswer}"
Please provide ${language === "both" ? "bilingual feedback in both English and Italian" : language === "italian" ? "feedback in Italian" : "feedback in English"} on the user's answer. Include:
1. What was correct
2. What could be improved
3. Suggestions for better phrasing if needed
`;

    const result = await generateText(prompt, { maxLength: 150 });
    return result.generated_text;
  } catch (error) {
    console.error("Feedback generation error:", error);
    if (language === "italian") {
      return "Mi dispiace, non sono riuscito a generare un feedback al momento. Riprova più tardi.";
    } else if (language === "both") {
      return "Sorry, I couldn't generate feedback at this time. Please try again later.\n\nMi dispiace, non sono riuscito a generare un feedback al momento. Riprova più tardi.";
    } else {
      return "Sorry, I couldn't generate feedback at this time. Please try again later.";
    }
  }
};

/**
 * Generate questions based on content
 */
export const generateQuestions = async (
  content: string,
  type: "flashcards" | "multipleChoice" | "listening" | "writing" | "speaking",
  count: number = 5,
  difficulty: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
): Promise<any[]> => {
  try {
    let prompt = "";
    
    switch (type) {
      case "flashcards":
        prompt = `Extract ${count} vocabulary terms from the following Italian content that would be appropriate for ${difficulty} level learners. For each term, provide the Italian word, its English translation, and a sample sentence in Italian using the word.
Format each as a JSON object with fields: term, translation, sampleSentence.

Content: "${content.substring(0, 500)}"`;
        break;
      
      case "multipleChoice":
        prompt = `Create ${count} multiple-choice questions in Italian about the following content for ${difficulty} level learners. Each question should have 4 options with exactly one correct answer.
Format each as a JSON object with fields: question, options (array of 4 strings), correctAnswerIndex (0-3).

Content: "${content.substring(0, 500)}"`;
        break;
        
      case "writing":
        prompt = `Create ${count} writing prompts in Italian based on the following content for ${difficulty} level learners. Include a prompt and expected answer points to cover.
Format each as a JSON object with fields: prompt, expectedElements (array of strings), minWordCount.

Content: "${content.substring(0, 500)}"`;
        break;
        
      case "speaking":
        prompt = `Create ${count} speaking practice questions in Italian based on the following content for ${difficulty} level learners. Include a question and expected answer elements.
Format each as a JSON object with fields: question, expectedElements (array of strings).

Content: "${content.substring(0, 500)}"`;
        break;
        
      case "listening":
        prompt = `Create ${count} listening comprehension questions based on this Italian audio transcript for ${difficulty} level learners. Include a question and 4 options with exactly one correct answer.
Format each as a JSON object with fields: question, options (array of 4 strings), correctAnswerIndex (0-3).

Transcript: "${content.substring(0, 500)}"`;
        break;
    }
    
    const result = await generateText(prompt, { maxLength: 1000 });
    
    try {
      // Try to parse the result and clean it up
      let jsonStr = result.generated_text;
      
      // Handle case where it returns markdown code blocks
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }
      
      // Handle case where it returns an array directly
      if (jsonStr.trim().startsWith("[") && jsonStr.trim().endsWith("]")) {
        return JSON.parse(jsonStr);
      }
      
      // Handle case where it returns each object on a new line
      if (!jsonStr.trim().startsWith("[")) {
        jsonStr = "[" + jsonStr.trim() + "]";
        // Fix potential JSON issues by replacing multiple objects without commas
        jsonStr = jsonStr.replace(/}[\s\n]*{/g, "},{");
      }
      
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Error parsing generated questions:", e);
      // If we can't parse the json, try to extract objects manually
      const objects = result.generated_text.match(/\{[^{}]*\}/g);
      if (objects && objects.length > 0) {
        return objects.map(obj => {
          try {
            return JSON.parse(obj);
          } catch {
            return null;
          }
        }).filter(Boolean);
      }
      return [];
    }
  } catch (error) {
    console.error("Question generation error:", error);
    return [];
  }
};
