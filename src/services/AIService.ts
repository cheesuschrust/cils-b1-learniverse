
import * as HuggingFaceService from './HuggingFaceService';
import { ContentType } from '@/types/contentType';

// Store confidence scores for each content type
const confidenceScores: Record<ContentType, number> = {
  'multiple-choice': 85,
  'flashcards': 80,
  'writing': 75,
  'speaking': 70,
  'listening': 90,
  'pdf': 65,
  'audio': 80,
  'csv': 95,
  'json': 95,
  'txt': 85,
  'unknown': 50
};

// Initialize AI service
export const initialize = async (options: {
  preloadModels?: string[];
  useWebGPU?: boolean;
}) => {
  try {
    // Initialize the Hugging Face service
    await HuggingFaceService.initialize();
    
    // Preload requested models
    if (options.preloadModels && options.preloadModels.length > 0) {
      for (const modelInfo of options.preloadModels) {
        const [task, model] = modelInfo.split(':');
        if (task && model) {
          try {
            console.log(`Preloading model: ${model} for task ${task}`);
            await HuggingFaceService.loadModel(task, model, {
              device: options.useWebGPU ? 'webgpu' : 'cpu'
            });
          } catch (error) {
            console.warn(`Failed to preload model ${model}: ${error}`);
            // Continue with other models even if one fails
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing AI service:', error);
    throw error;
  }
};

// Classify text content to determine the type
export const classifyText = async (text: string): Promise<{ label: ContentType; score: number }[]> => {
  try {
    // Map for converting model output labels to our ContentType
    const labelMap: Record<string, ContentType> = {
      'multiple-choice': 'multiple-choice',
      'quiz': 'multiple-choice',
      'flashcard': 'flashcards',
      'vocabulary': 'flashcards',
      'essay': 'writing',
      'composition': 'writing',
      'speaking': 'speaking',
      'pronunciation': 'speaking',
      'listening': 'listening',
      'audio': 'audio',
      'document': 'pdf',
      'text': 'txt'
    };
    
    // Use a small text classification model
    const modelName = 'distilbert-base-uncased';
    
    // Get raw classification results
    const rawResults = await HuggingFaceService.classifyText(text, modelName);
    
    // Process and map the results to our content types
    const processedResults = rawResults.map(result => {
      const label = result.label.toLowerCase();
      const contentType: ContentType = labelMap[label] || 'unknown';
      
      return {
        label: contentType,
        score: result.score * 100  // Convert to percentage
      };
    });
    
    // Sort by score
    return processedResults.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error classifying text:', error);
    
    // Fallback: Try a simple rule-based classification
    const contentType = determineContentTypeFromText(text);
    return [{ label: contentType, score: confidenceScores[contentType] }];
  }
};

// Simple rule-based content type classification as fallback
const determineContentTypeFromText = (text: string): ContentType => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('?') && (lowerText.includes('a)') || lowerText.includes('b)') || lowerText.includes('c)'))) {
    return 'multiple-choice';
  }
  
  if (lowerText.includes(':') && lowerText.length < 200) {
    return 'flashcards';
  }
  
  if (lowerText.includes('write') || lowerText.includes('essay') || lowerText.length > 500) {
    return 'writing';
  }
  
  if (lowerText.includes('listen') || lowerText.includes('audio')) {
    return 'listening';
  }
  
  if (lowerText.includes('speak') || lowerText.includes('pronun')) {
    return 'speaking';
  }
  
  return 'unknown';
};

// Generate questions from content
export const generateQuestions = async (
  content: string,
  contentType: ContentType,
  count: number = 5,
  difficulty: string = 'Intermediate'
): Promise<any[]> => {
  try {
    console.log(`Generating ${count} questions of type ${contentType} at ${difficulty} level`);
    
    // In a full implementation, we'd use a text generation model
    // For now, we'll create structured mock data
    const questions = [];
    
    for (let i = 0; i < count; i++) {
      if (contentType === 'multiple-choice') {
        questions.push({
          id: `q-${Date.now()}-${i}`,
          question: `Sample question ${i+1} about ${content.substring(0, 30)}...`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswerIndex: Math.floor(Math.random() * 4),
          difficulty: difficulty,
          explanation: `This is an explanation for question ${i+1}.`
        });
      } else if (contentType === 'flashcards') {
        const isItalian = Math.random() > 0.5;
        questions.push({
          id: `card-${Date.now()}-${i}`,
          italian: isItalian ? content.substring(i*10, i*10+10) : `Italian term ${i+1}`,
          english: isItalian ? `English translation ${i+1}` : content.substring(i*10, i*10+10),
          difficulty: difficulty.toLowerCase()
        });
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};

// Process text for a specific purpose
export const processText = async (text: string, processingType: string): Promise<any> => {
  try {
    if (processingType === 'summarize') {
      // Simulate text summarization
      return {
        summary: `Summary of: ${text.substring(0, 50)}...`,
        confidence: 80
      };
    } else if (processingType === 'translate') {
      // Use actual translation
      const translated = await HuggingFaceService.translateText(
        text,
        'en',  // source language
        'it'   // target language
      );
      
      return {
        original: text,
        translated: translated,
        confidence: 85
      };
    } else {
      throw new Error(`Unknown processing type: ${processingType}`);
    }
  } catch (error) {
    console.error(`Error processing text (${processingType}):`, error);
    throw error;
  }
};

// Process an image (placeholder)
export const processImage = async (imageUrl: string, prompt: string): Promise<any> => {
  // Image processing is not currently implemented with HuggingFace Transformers.js
  // This is a placeholder
  return {
    result: `Processed image at ${imageUrl} with prompt: ${prompt}`,
    confidence: 60
  };
};

// Speech recognition
export const recognizeSpeech = async (
  audioBlob: Blob,
  language: 'it' | 'en' = 'it'
): Promise<{ text: string; confidence: number }> => {
  try {
    // Select the appropriate model based on language
    const modelName = language === 'en' 
      ? 'onnx-community/whisper-tiny.en'
      : 'onnx-community/whisper-small';  // Has better multilingual support
    
    // Process the audio with HuggingFace
    const result = await HuggingFaceService.recognizeSpeech(audioBlob, modelName);
    
    return {
      text: result.text || '',
      confidence: result.confidence || 75
    };
  } catch (error) {
    console.error('Error recognizing speech:', error);
    
    // Fallback with placeholder
    return {
      text: language === 'it' 
        ? 'Non sono riuscito a riconoscere l\'audio.'
        : 'I was unable to recognize the audio.',
      confidence: 30
    };
  }
};

// Evaluate speech against a reference
export const evaluateSpeech = async (
  spokenText: string,
  referenceText: string,
  language: 'it' | 'en' = 'it'
): Promise<{ score: number; feedback: string; errors: string[] }> => {
  try {
    // Calculate similarity between spoken text and reference
    const similarity = await HuggingFaceService.getTextSimilarity(spokenText, referenceText);
    
    // Convert similarity to score (0-100)
    const score = Math.round(similarity * 100);
    
    // Generate feedback based on score
    let feedback;
    if (score >= 90) {
      feedback = language === 'it'
        ? 'Eccellente pronuncia! Continua così.'
        : 'Excellent pronunciation! Keep it up.';
    } else if (score >= 75) {
      feedback = language === 'it'
        ? 'Buona pronuncia. Ci sono piccoli miglioramenti da fare.'
        : 'Good pronunciation. There are small improvements to make.';
    } else if (score >= 60) {
      feedback = language === 'it'
        ? 'Pronuncia comprensibile. Continua a praticare.'
        : 'Comprehensible pronunciation. Keep practicing.';
    } else {
      feedback = language === 'it'
        ? 'È necessario migliorare la pronuncia. Prova a esercitarti di più.'
        : 'Pronunciation needs improvement. Try to practice more.';
    }
    
    // Identify differences (simplified)
    const errors: string[] = [];
    const spokenWords = spokenText.toLowerCase().split(' ');
    const referenceWords = referenceText.toLowerCase().split(' ');
    
    for (let i = 0; i < referenceWords.length; i++) {
      if (!spokenWords[i] || spokenWords[i] !== referenceWords[i]) {
        errors.push(referenceWords[i]);
      }
    }
    
    return { score, feedback, errors };
  } catch (error) {
    console.error('Error evaluating speech:', error);
    throw error;
  }
};

// Generate speech exercises
export const generateSpeechExercises = async (
  level: 'beginner' | 'intermediate' | 'advanced',
  count: number = 5,
  language: 'it' | 'en' = 'it'
): Promise<any[]> => {
  // Simple phrase generation based on level
  const beginnerPhrases = {
    it: [
      'Buongiorno, come stai?',
      'Mi chiamo Marco',
      'Dove si trova la stazione?',
      'Quanto costa questo?',
      'Un caffè, per favore',
      'Grazie mille',
      'A che ora apre il negozio?',
      'Dov\'è il bagno?',
      'Vorrei prenotare un tavolo',
      'Scusi, non capisco'
    ],
    en: [
      'Good morning, how are you?',
      'My name is Marco',
      'Where is the station?',
      'How much is this?',
      'A coffee, please',
      'Thank you very much',
      'What time does the shop open?',
      'Where is the bathroom?',
      'I would like to book a table',
      'Sorry, I don\'t understand'
    ]
  };
  
  const intermediatePhrases = {
    it: [
      'Potrebbe parlare più lentamente, per favore?',
      'Sto imparando l\'italiano da sei mesi',
      'Qual è il piatto tipico di questa regione?',
      'Potrebbe consigliarmi un buon ristorante in zona?',
      'Mi piacerebbe visitare il centro storico',
      'Quanto tempo ci vuole per arrivare a Roma?',
      'Preferisco viaggiare in treno piuttosto che in aereo',
      'Mi sono trasferito in Italia per lavoro',
      'Quali sono gli orari di apertura del museo?',
      'Ci sono molti turisti in questa stagione'
    ],
    en: [
      'Could you speak more slowly, please?',
      'I\'ve been learning Italian for six months',
      'What\'s the typical dish of this region?',
      'Could you recommend a good restaurant in the area?',
      'I would like to visit the historic center',
      'How long does it take to get to Rome?',
      'I prefer traveling by train rather than by plane',
      'I moved to Italy for work',
      'What are the opening hours of the museum?',
      'There are many tourists in this season'
    ]
  };
  
  const advancedPhrases = {
    it: [
      'Ritengo che la situazione economica attuale richieda interventi strutturali',
      'La digitalizzazione ha trasformato radicalmente il nostro modo di comunicare',
      'Le energie rinnovabili rappresentano una soluzione sostenibile per il futuro',
      'Il patrimonio culturale italiano è riconosciuto in tutto il mondo',
      'La diversità linguistica è una ricchezza che dobbiamo preservare',
      'Lo sviluppo tecnologico deve essere accompagnato da una riflessione etica',
      'La globalizzazione ha portato vantaggi ma anche sfide significative',
      'L\'istruzione è fondamentale per costruire una società più equa',
      'Le politiche ambientali dovrebbero essere una priorità per tutti i governi',
      'L\'arte contemporanea spesso sfida le nostre percezioni tradizionali'
    ],
    en: [
      'I believe that the current economic situation requires structural interventions',
      'Digitization has radically transformed the way we communicate',
      'Renewable energies represent a sustainable solution for the future',
      'Italian cultural heritage is recognized throughout the world',
      'Linguistic diversity is a wealth that we must preserve',
      'Technological development must be accompanied by ethical reflection',
      'Globalization has brought benefits but also significant challenges',
      'Education is fundamental to building a more equitable society',
      'Environmental policies should be a priority for all governments',
      'Contemporary art often challenges our traditional perceptions'
    ]
  };
  
  let phrases;
  if (level === 'beginner') {
    phrases = beginnerPhrases;
  } else if (level === 'intermediate') {
    phrases = intermediatePhrases;
  } else {
    phrases = advancedPhrases;
  }
  
  // Select random phrases
  const sourceLanguage = language === 'it' ? 'it' : 'en';
  const targetLanguage = language === 'it' ? 'en' : 'it';
  
  const exercises = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < Math.min(count, phrases[sourceLanguage].length); i++) {
    // Select a random phrase that hasn't been used yet
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * phrases[sourceLanguage].length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    
    exercises.push({
      id: `ex-${Date.now()}-${i}`,
      text: phrases[sourceLanguage][randomIndex],
      translation: phrases[targetLanguage][randomIndex],
      difficulty: level
    });
  }
  
  return exercises;
};

// Get confidence score for a content type
export const getConfidenceScore = (contentType: ContentType): number => {
  return confidenceScores[contentType] || 50;
};

// Update confidence score for a content type
export const updateConfidenceScore = (contentType: ContentType, score: number): void => {
  if (score >= 0 && score <= 100) {
    confidenceScores[contentType] = score;
  }
};

// Add training examples to improve AI performance
export const addTrainingExamples = (contentType: ContentType, examples: any[]): number => {
  // In a full implementation, this would retrain or fine-tune the models
  // For now, we'll just simulate it by slightly increasing the confidence score
  const currentScore = confidenceScores[contentType];
  const newScore = Math.min(100, currentScore + (examples.length * 0.5));
  confidenceScores[contentType] = newScore;
  
  console.log(`Added ${examples.length} training examples for ${contentType}. Confidence increased from ${currentScore} to ${newScore}.`);
  
  return examples.length;
};

export default {
  initialize,
  classifyText,
  generateQuestions,
  processText,
  processImage,
  recognizeSpeech,
  evaluateSpeech,
  generateSpeechExercises,
  getConfidenceScore,
  updateConfidenceScore,
  addTrainingExamples,
  ...HuggingFaceService
};
