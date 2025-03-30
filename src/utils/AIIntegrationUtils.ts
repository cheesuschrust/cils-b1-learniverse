
import * as HuggingFace from '@/utils/huggingFaceIntegration';
import { ContentType } from '@/types/ai';

/**
 * Get the confidence score for a content analysis result
 */
export const getConfidenceScore = (contentType: string, text: string): number => {
  // Implementation of a heuristic confidence calculation based on content and type
  switch(contentType) {
    case 'flashcards':
      return text.includes(':') && text.split('\n').length > 3 ? 90 : 70;
    case 'multiple-choice':
      return text.includes('?') && (text.includes('1)') || text.includes('A)')) ? 85 : 65;
    case 'listening':
      return text.includes('Listen') || text.includes('Audio') ? 80 : 60;
    case 'writing':
      return text.length > 200 && !text.includes('?') ? 75 : 55;
    case 'speaking':
      return text.includes('Speak') || text.includes('Pronounce') ? 80 : 60;
    default:
      return 50;
  }
};

/**
 * Detect the primary language of a text
 */
export const detectLanguage = (text: string): 'english' | 'italian' | 'unknown' => {
  const italianWords = ["il", "la", "i", "gli", "le", "un", "uno", "una", "e", "è", "ma", "se", "perché", "come", "quando"];
  const englishWords = ["the", "a", "an", "and", "but", "if", "because", "how", "when", "what", "where", "who"];
  
  // Normalize and tokenize the input text
  const words = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
  
  let italianCount = 0;
  let englishCount = 0;
  
  // Count occurrences of language-specific words
  words.forEach(word => {
    if (italianWords.includes(word)) italianCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  // Determine the likely language
  if (italianCount > englishCount && italianCount > 2) return 'italian';
  if (englishCount > italianCount && englishCount > 2) return 'english';
  
  // Check for Italian-specific characters
  if (text.match(/[àèéìíòóùú]/g)) return 'italian';
  
  return 'unknown';
};

/**
 * Analyze content to determine its type and language
 */
export const analyzeContent = async (
  text: string,
  contentType?: ContentType
): Promise<{
  type: ContentType;
  confidence: number;
  language: 'english' | 'italian' | 'unknown';
}> => {
  try {
    // Determine language
    const detectedLanguage = detectLanguage(text);
    
    // Use the provided content type or detect it
    let detectedType: ContentType = contentType || 'flashcards';
    
    if (!contentType) {
      // Simple heuristic content type detection
      if (text.includes('?') && (text.includes('1)') || text.includes('A)') || text.includes('a)'))) {
        detectedType = 'multiple-choice';
      } else if (text.includes(':') && text.split('\n').length > 3) {
        detectedType = 'flashcards';
      } else if (text.length > 200 && !text.includes('?')) {
        detectedType = 'writing';
      } else if (text.includes('Listen') || text.includes('Audio')) {
        detectedType = 'listening';
      } else if (text.includes('Speak') || text.includes('Pronounce')) {
        detectedType = 'speaking';
      }
    }
    
    // Get confidence score
    const confidence = getConfidenceScore(detectedType, text);
    
    return {
      type: detectedType,
      confidence,
      language: detectedLanguage
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      type: contentType || 'flashcards',
      confidence: 50,
      language: 'unknown'
    };
  }
};

/**
 * Generate flashcards from content
 */
export const generateFlashcards = async (
  content: string,
  count: number = 10
) => {
  // This would use AI models to extract flashcard data
  // For now, let's use simple patterns
  
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const flashcards = [];
  
  for (let i = 0; i < lines.length && flashcards.length < count; i++) {
    const line = lines[i];
    const parts = line.split(/[:–-]/);
    
    if (parts.length >= 2) {
      flashcards.push({
        front: parts[0].trim(),
        back: parts[1].trim(),
        italian: parts[0].trim(),
        english: parts[1].trim()
      });
    }
  }
  
  return flashcards;
};

/**
 * Generate multiple choice questions from content
 */
export const generateMultipleChoice = async (
  content: string,
  count: number = 5
) => {
  // This would use AI models to generate questions
  // For now, let's return basic question template
  const questions = [];
  
  const sentences = content
    .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .filter(s => s.trim().length > 15);
  
  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    const sentence = sentences[i].trim();
    
    // Extract a key term
    const words = sentence.split(/\s+/).filter(w => w.length > 4);
    const keyWord = words[Math.floor(Math.random() * words.length)] || "term";
    
    questions.push({
      question: `What does "${keyWord}" mean in the context: "${sentence}"?`,
      options: [
        "Definition A",
        "Definition B",
        "Definition C",
        "Definition D"
      ],
      correctAnswerIndex: 0
    });
  }
  
  return questions;
};

/**
 * Compare speech recordings for pronunciation
 */
export const comparePronunciation = async (
  original: string,
  recorded: Blob
): Promise<number> => {
  try {
    // Transcribe the recorded audio
    const transcription = await HuggingFace.recognizeSpeech(recorded);
    
    // Compare the transcription to the original text
    const similarity = await HuggingFace.getTextSimilarity(
      original, 
      transcription.text
    );
    
    return similarity;
  } catch (error) {
    console.error('Error comparing pronunciation:', error);
    return 0.5; // Default similarity
  }
};

/**
 * Parse content to extract vocabulary terms
 */
export const extractVocabulary = (content: string) => {
  const vocabulary = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Look for patterns like "term: definition" or "term - definition"
    const match = line.match(/(.+?)[:–-]\s*(.+)/);
    if (match) {
      vocabulary.push({
        term: match[1].trim(),
        definition: match[2].trim()
      });
    }
  }
  
  return vocabulary;
};

/**
 * Generate contextual suggestions based on user activity and page
 * This function provides personalized suggestions to users based on context
 */
export const getContextualSuggestions = (
  currentPage: string,
  userActivity?: any,
  userPreferences?: any
): string[] => {
  const suggestions: string[] = [];
  
  // Default suggestions that apply to most sections
  const defaultSuggestions = [
    "Try practicing daily for best results",
    "Review your progress in the Analytics section",
    "Set specific goals to track your improvement"
  ];
  
  switch (currentPage.toLowerCase()) {
    case 'dashboard':
      suggestions.push(
        "Welcome back! Continue your learning streak to build fluency",
        "Try a variety of exercise types to strengthen different skills",
        "Set a daily practice goal to maintain consistency"
      );
      break;
      
    case 'flashcards':
      suggestions.push(
        "Regularly reviewing flashcards improves retention",
        "Try to create your own flashcard sets for personalized learning",
        "Use spaced repetition for optimal memory retention"
      );
      
      // Add suggestions based on user activity
      if (userActivity && userActivity.hasUsedSpacedRepetition === false) {
        suggestions.push("Try spaced repetition mode for better memory retention");
      }
      
      if (userActivity && userActivity.dueCards > 10) {
        suggestions.push(`You have ${userActivity.dueCards} cards due for review today`);
      }
      break;
      
    case 'multiple-choice':
      suggestions.push(
        "Take your time to carefully read each question",
        "Review incorrect answers to understand mistakes",
        "Create custom quizzes for targeted practice"
      );
      break;
      
    case 'writing':
      suggestions.push(
        "Regular writing practice improves grammar and vocabulary",
        "Try different writing prompts to broaden your skills",
        "Save your writings to track progress over time"
      );
      break;
      
    case 'speaking':
      suggestions.push(
        "Practice speaking daily, even for just a few minutes",
        "Record yourself to hear your pronunciation",
        "Try shadowing exercises by repeating after native speakers"
      );
      
      // Add suggestions based on user preferences
      if (userPreferences && userPreferences.preferredVoice === 'natural') {
        suggestions.push("Use the natural voice option for more authentic pronunciation");
      }
      break;
      
    case 'listening':
      suggestions.push(
        "Start with slower audio and gradually increase speed",
        "Listen to a variety of accents to improve comprehension",
        "Try dictation exercises to combine listening and writing skills"
      );
      break;
      
    case 'analytics':
      suggestions.push(
        "Review your progress trends to identify areas for improvement",
        "Set specific goals based on your analytics data",
        "Focus on your weakest areas for balanced improvement"
      );
      
      // Add suggestions based on user activity
      if (userActivity && userActivity.questionAttempts < 10) {
        suggestions.push("Complete more exercises to get more detailed analytics");
      }
      break;
      
    case 'achievements':
      suggestions.push(
        "Complete daily exercises to earn more achievements",
        "Try different exercise types to unlock varied badges",
        "Share your achievements to stay motivated"
      );
      break;
      
    case 'ai-assistant':
      suggestions.push(
        "Ask your AI assistant for vocabulary explanations",
        "Use the AI to generate practice examples",
        "Try conversation practice with the AI assistant"
      );
      break;
      
    default:
      // Return default suggestions if page is not recognized
      return defaultSuggestions;
  }
  
  // Ensure we have at least 3 suggestions
  while (suggestions.length < 3 && defaultSuggestions.length > 0) {
    suggestions.push(defaultSuggestions.shift()!);
  }
  
  return suggestions;
};

