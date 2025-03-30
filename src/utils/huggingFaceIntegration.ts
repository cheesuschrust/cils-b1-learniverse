
import { pipeline, env } from '@huggingface/transformers';

// Configure environment
env.allowLocalModels = true;
env.useBrowserCache = true;

// Store loaded models for reuse
const loadedModels = new Map();

/**
 * Initialize HuggingFace Transformers
 */
export const initializeHuggingFace = async (): Promise<boolean> => {
  try {
    console.log('Initializing HuggingFace Transformers');
    
    // Check WebGPU support
    const hasWebGPU = await checkWebGPUSupport();
    console.log(`WebGPU support: ${hasWebGPU ? 'available' : 'unavailable'}`);
    
    return true;
  } catch (error) {
    console.error('Error initializing HuggingFace Transformers:', error);
    throw error;
  }
};

/**
 * Check if WebGPU is supported
 */
export const checkWebGPUSupport = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined') return false;
  
  try {
    // @ts-ignore - TypeScript might not know about GPU yet
    if (navigator.gpu) {
      // @ts-ignore
      const adapter = await navigator.gpu.requestAdapter();
      return adapter !== null;
    }
    return false;
  } catch (error) {
    console.warn('Error checking WebGPU support:', error);
    return false;
  }
};

/**
 * Get the appropriate device type based on capabilities
 */
export const getDeviceType = async (): Promise<'webgpu' | 'cpu'> => {
  const hasWebGPU = await checkWebGPUSupport();
  return hasWebGPU ? 'webgpu' : 'cpu';
};

/**
 * Load a model pipeline for a specific task
 */
export const loadModel = async (
  task: string,
  model: string,
  options: any = {}
): Promise<any> => {
  const deviceType = await getDeviceType();
  const modelKey = `${task}/${model}/${deviceType}`;
  
  try {
    // Check if the model is already loaded
    if (loadedModels.has(modelKey)) {
      console.log(`Using already loaded model: ${modelKey}`);
      return loadedModels.get(modelKey);
    }
    
    console.log(`Loading model: ${model} for task ${task} on ${deviceType}`);
    
    // Set device in options if not specified
    const modelOptions = {
      ...options,
      device: options.device || deviceType
    };
    
    // Load the model
    const model_pipeline = await pipeline(task as any, model, modelOptions);
    
    // Store for reuse
    loadedModels.set(modelKey, model_pipeline);
    
    return model_pipeline;
  } catch (error) {
    console.error(`Error loading model ${model} for task ${task}:`, error);
    throw error;
  }
};

/**
 * Text classification
 */
export const classifyText = async (
  text: string,
  modelName: string = 'distilbert-base-uncased'
): Promise<Array<{ label: string; score: number }>> => {
  try {
    const model = await loadModel('text-classification', modelName);
    const result = await model(text);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error('Error classifying text:', error);
    throw error;
  }
};

/**
 * Text embeddings
 */
export const getTextEmbeddings = async (
  texts: string | string[],
  modelName: string = 'mixedbread-ai/mxbai-embed-xsmall-v1'
): Promise<number[][] | number[]> => {
  try {
    const model = await loadModel('feature-extraction', modelName);
    
    const options = {
      pooling: 'mean',
      normalize: true
    };
    
    const embeddings = await model(texts, options);
    return embeddings.tolist ? embeddings.tolist() : embeddings;
  } catch (error) {
    console.error('Error generating text embeddings:', error);
    throw error;
  }
};

/**
 * Speech recognition
 */
export const recognizeSpeech = async (
  audioData: Blob | string,
  modelName: string = 'onnx-community/whisper-tiny.en'
): Promise<{ text: string }> => {
  try {
    const model = await loadModel('automatic-speech-recognition', modelName);
    const result = await model(audioData);
    return result;
  } catch (error) {
    console.error('Error recognizing speech:', error);
    throw error;
  }
};

/**
 * Text translation
 */
export const translateText = async (
  text: string,
  sourceLanguage: string = 'en',
  targetLanguage: string = 'it'
): Promise<string> => {
  try {
    // Choose the appropriate model based on language direction
    const modelName = sourceLanguage === 'en' && targetLanguage === 'it'
      ? 'Helsinki-NLP/opus-mt-en-it'
      : 'Helsinki-NLP/opus-mt-it-en';
    
    const model = await loadModel('translation', modelName);
    
    const result = await model(text);
    return result[0]?.translation_text || result;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

/**
 * Calculate similarity between texts
 */
export const getTextSimilarity = async (
  text1: string, 
  text2: string
): Promise<number> => {
  try {
    // Get embeddings for both texts
    const embeddings = await getTextEmbeddings([text1, text2]);
    
    // Calculate cosine similarity between the embeddings
    if (Array.isArray(embeddings) && embeddings.length >= 2) {
      return calculateCosineSimilarity(embeddings[0], embeddings[1]);
    }
    throw new Error('Invalid embeddings generated');
  } catch (error) {
    console.error('Error calculating text similarity:', error);
    throw error;
  }
};

/**
 * Calculate cosine similarity between two vectors
 */
export const calculateCosineSimilarity = (
  vec1: number[], 
  vec2: number[]
): number => {
  // Dot product
  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }
  
  // Magnitudes
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  return dotProduct / (mag1 * mag2);
};
