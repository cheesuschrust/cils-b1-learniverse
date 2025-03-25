
import { v4 as uuidv4 } from 'uuid';
import * as AIService from './AIService';
import { ChatMessage, ChatSession, KnowledgeBaseEntry, ChatbotSettings, ChatbotTrainingExample } from '@/types/chatbot';

// Mock knowledge base - in a real application, this would come from a database
const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: "kb-1",
    title: "Free vs Premium Plans",
    content: "Our platform offers both free and premium subscription plans. Free users can access one question per day, while premium users get unlimited questions and an ad-free experience.",
    tags: ["subscription", "pricing", "plans"],
    category: "pricing",
    relevance: 0.9,
    lastUpdated: new Date("2023-06-15"),
    keywords: ["free", "premium", "subscription", "pricing", "plan"],
    version: "1.0"
  },
  {
    id: "kb-2",
    title: "Italian Grammar Lessons",
    content: "Our platform offers comprehensive Italian grammar lessons covering all levels from beginner to advanced. Topics include verb conjugation, article usage, and sentence structure.",
    tags: ["grammar", "lessons", "italian"],
    category: "content",
    relevance: 0.8,
    lastUpdated: new Date("2023-07-20"),
    keywords: ["grammar", "italian", "lessons", "conjugation", "verbs"],
    version: "1.1"
  },
  {
    id: "kb-3",
    title: "Speaking Practice",
    content: "Our speaking practice feature uses AI to evaluate your pronunciation and provide feedback. You can practice with conversation simulations and receive detailed feedback on your pronunciation accuracy.",
    tags: ["speaking", "pronunciation", "practice"],
    category: "features",
    relevance: 0.85,
    lastUpdated: new Date("2023-08-05"),
    keywords: ["speaking", "pronunciation", "practice", "conversation"],
    version: "1.0"
  },
  {
    id: "kb-4",
    title: "Flashcard System",
    content: "Our flashcard system uses spaced repetition to optimize your learning. Cards are scheduled based on your performance, ensuring efficient memorization of vocabulary.",
    tags: ["flashcards", "vocabulary", "spaced repetition"],
    category: "features",
    relevance: 0.75,
    lastUpdated: new Date("2023-09-10"),
    keywords: ["flashcards", "vocabulary", "spaced repetition", "memorization"],
    version: "1.2"
  },
  {
    id: "kb-5",
    title: "Technical Support",
    content: "For technical issues, you can contact our support team through the Support Center. Premium users receive priority support with faster response times.",
    tags: ["support", "help", "technical"],
    category: "support",
    relevance: 0.7,
    lastUpdated: new Date("2023-10-25"),
    keywords: ["support", "help", "technical", "issues"],
    version: "1.0"
  }
];

// Default chatbot settings
const defaultSettings: ChatbotSettings = {
  enabled: true,
  name: "LinguaBot",
  avatarUrl: "/assets/bot-avatar.png",
  welcomeMessage: "Ciao! I'm LinguaBot, your Italian learning assistant. How can I help you today?",
  fallbackMessage: "I'm sorry, I don't have enough information to answer that question. Would you like to speak with our support team?",
  maxContextLength: 10,
  confidenceThreshold: 0.6,
  suggestFeedback: true,
  suggestRelatedQuestions: true,
  escalationThreshold: 3
};

// In-memory storage for active chat sessions
let activeSessions: ChatSession[] = [];
let settings: ChatbotSettings = defaultSettings;

// Find relevant knowledge base entries for a query
const findRelevantKnowledge = async (query: string): Promise<KnowledgeBaseEntry[]> => {
  try {
    // In a real implementation, this would use vector similarity search
    // For now, we'll use a simple keyword matching approach
    const lowercaseQuery = query.toLowerCase();
    const scoredEntries = knowledgeBase.map(entry => {
      let score = 0;
      
      // Check for keyword matches
      entry.keywords.forEach(keyword => {
        if (lowercaseQuery.includes(keyword.toLowerCase())) {
          score += 0.2;
        }
      });
      
      // Check for tag matches
      entry.tags.forEach(tag => {
        if (lowercaseQuery.includes(tag.toLowerCase())) {
          score += 0.15;
        }
      });
      
      // Check title match
      if (lowercaseQuery.includes(entry.title.toLowerCase())) {
        score += 0.3;
      }
      
      // Incorporate the base relevance score
      score = score * 0.7 + entry.relevance * 0.3;
      
      return {
        ...entry,
        matchScore: score
      };
    });
    
    // Filter entries with a minimum score and sort by relevance
    return scoredEntries
      .filter(entry => entry.matchScore > 0.3)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map(({ matchScore, ...entry }) => entry);
  } catch (error) {
    console.error("Error finding relevant knowledge:", error);
    return [];
  }
};

// Generate a response based on the query and relevant knowledge
const generateResponse = async (
  query: string,
  session: ChatSession
): Promise<string> => {
  try {
    // Find relevant knowledge
    const relevantEntries = await findRelevantKnowledge(query);
    
    if (relevantEntries.length === 0) {
      return settings.fallbackMessage;
    }
    
    // Construct context from relevant entries
    const context = relevantEntries
      .map(entry => `${entry.title}: ${entry.content}`)
      .join("\n\n");
    
    // Get recent conversation history for context
    const recentMessages = session.messages
      .slice(-settings.maxContextLength)
      .map(msg => `${msg.isUser ? "User" : "Bot"}: ${msg.text}`)
      .join("\n");
    
    // Generate response using AI service
    const prompt = `
    CONTEXT INFORMATION:
    ${context}
    
    RECENT CONVERSATION:
    ${recentMessages}
    
    USER QUERY: ${query}
    
    Please respond to the user's query based on the provided context information and conversation history. 
    Keep your response helpful, concise, and focused on Italian language learning. 
    If you're not sure about something, acknowledge that rather than making up information.
    `;
    
    const response = await AIService.generateText(prompt);
    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    return settings.fallbackMessage;
  }
};

// Create a new chat session
export const createSession = (userId?: string): ChatSession => {
  const welcomeMessage: ChatMessage = {
    id: uuidv4(),
    text: settings.welcomeMessage,
    isUser: false,
    timestamp: new Date()
  };
  
  const newSession: ChatSession = {
    id: uuidv4(),
    userId,
    messages: [welcomeMessage],
    startedAt: new Date(),
    lastActivityAt: new Date(),
    context: {
      userType: userId ? 'premium' : 'free', // Simplified - in a real app, check user subscription
      language: 'en'
    },
    resolved: false,
    escalatedToHuman: false
  };
  
  activeSessions.push(newSession);
  return newSession;
};

// Get a session by ID
export const getSession = (sessionId: string): ChatSession | undefined => {
  return activeSessions.find(session => session.id === sessionId);
};

// Send a message and get a response
export const sendMessage = async (
  sessionId: string,
  text: string,
  attachments?: ChatMessage['attachments']
): Promise<ChatMessage> => {
  // Find the session
  const session = activeSessions.find(s => s.id === sessionId);
  if (!session) {
    throw new Error(`Chat session not found: ${sessionId}`);
  }
  
  // Create user message
  const userMessage: ChatMessage = {
    id: uuidv4(),
    text,
    isUser: true,
    timestamp: new Date(),
    attachments
  };
  
  // Add message to session
  session.messages.push(userMessage);
  session.lastActivityAt = new Date();
  
  // Generate bot response
  const responseText = await generateResponse(text, session);
  
  // Create bot message
  const botMessage: ChatMessage = {
    id: uuidv4(),
    text: responseText,
    isUser: false,
    timestamp: new Date(),
    context: {
      previousMessageIds: [userMessage.id]
    }
  };
  
  // Add bot message to session
  session.messages.push(botMessage);
  
  return botMessage;
};

// Provide feedback on a message
export const provideFeedback = (
  sessionId: string,
  messageId: string,
  helpful: boolean,
  reason?: string
): boolean => {
  const session = activeSessions.find(s => s.id === sessionId);
  if (!session) return false;
  
  const message = session.messages.find(m => m.id === messageId);
  if (!message) return false;
  
  message.feedback = { helpful, reason };
  return true;
};

// Update chatbot settings
export const updateSettings = (newSettings: Partial<ChatbotSettings>): ChatbotSettings => {
  settings = { ...settings, ...newSettings };
  return settings;
};

// Get current chatbot settings
export const getSettings = (): ChatbotSettings => settings;

// Add a training example
export const addTrainingExample = (example: Omit<ChatbotTrainingExample, 'id' | 'createdAt' | 'updatedAt'>): ChatbotTrainingExample => {
  // In a real implementation, this would be stored in a database
  const newExample: ChatbotTrainingExample = {
    ...example,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  console.log("Added training example:", newExample);
  return newExample;
};

// End a chat session
export const endSession = (sessionId: string): boolean => {
  const index = activeSessions.findIndex(s => s.id === sessionId);
  if (index === -1) return false;
  
  activeSessions[index].resolved = true;
  return true;
};

// Escalate to human support
export const escalateToHuman = (sessionId: string): boolean => {
  const session = activeSessions.find(s => s.id === sessionId);
  if (!session) return false;
  
  session.escalatedToHuman = true;
  return true;
};

// Export these methods as the ChatbotService
export default {
  createSession,
  getSession,
  sendMessage,
  provideFeedback,
  updateSettings,
  getSettings,
  addTrainingExample,
  endSession,
  escalateToHuman
};
