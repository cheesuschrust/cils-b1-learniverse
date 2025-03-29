
import { MockDatabase, User, EmailSettings, UserRole, License, LicenseStatus, ChatSession, ChatbotTrainingExample, AdSettings, AdUnit } from "@/contexts/shared-types";
import { Notification } from "@/types/notification";
import { Flashcard, FlashcardSet } from "@/types/flashcard";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

let dbInstance: MockDatabase;

// Create a password hash map to store user passwords
export const passwordHash = new Map<string, string>();

export const getDatabase = async (): Promise<MockDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  // Create hash for admin password
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const userPasswordHash = await bcrypt.hash('User123!', 10);
  
  // Create mock user data
  const admin: User = {
    id: uuidv4(),
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@italianlearning.app',
    role: 'admin' as UserRole,
    isVerified: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date(),
    lastActive: new Date(),
    preferences: {
      theme: 'system',
      emailNotifications: true,
      language: 'en',
      difficulty: 'intermediate',
    },
    subscription: 'premium',
    status: 'active',
    preferredLanguage: 'both',
    dailyQuestionCounts: {
      flashcards: 0,
      multipleChoice: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
    },
    metrics: {
      totalQuestions: 1250,
      correctAnswers: 980,
      streak: 75,
    },
    name: 'Admin User',
    isAdmin: true
  };
  
  const regularUser: User = {
    id: uuidv4(),
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'user@italianlearning.app',
    role: 'user' as UserRole,
    isVerified: true,
    createdAt: new Date('2023-03-15'),
    lastLogin: new Date(),
    lastActive: new Date(),
    preferences: {
      theme: 'light',
      emailNotifications: false,
      language: 'it',
      difficulty: 'beginner',
    },
    subscription: 'free',
    status: 'active',
    preferredLanguage: 'italian',
    dailyQuestionCounts: {
      flashcards: 0,
      multipleChoice: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
    },
    metrics: {
      totalQuestions: 450,
      correctAnswers: 320,
      streak: 15,
    },
    name: 'Marco Rossi',
    isAdmin: false
  };
  
  // Create mock email settings
  const emailSettings: EmailSettings = {
    provider: 'smtp',
    fromEmail: 'noreply@cittadinanza-b2.com',
    fromName: 'CILS B2 Cittadinanza',
    config: {
      enableSsl: true,
      host: "smtp.example.com",
      port: 587,
      username: "user@example.com",
      password: "password123"
    },
    templates: {
      verification: {
        subject: 'Verify your email for CILS B2 Cittadinanza',
        body: 'Hello {{name}}, please verify your email by clicking on this link: {{verificationLink}}',
      },
      passwordReset: {
        subject: 'Reset your password for CILS B2 Cittadinanza',
        body: 'Hello {{name}}, click this link to reset your password: {{resetLink}}',
      },
      welcome: {
        subject: 'Welcome to CILS B2 Cittadinanza',
        body: 'Hello {{name}}, welcome to CILS B2 Cittadinanza! We are excited to have you on board.',
      }
    },
    temporaryInboxDuration: 24 // hours
  };
  
  // Mock licenses
  const mockLicenses: License[] = [
    {
      id: uuidv4(),
      name: 'University of Florence',
      type: 'university',
      plan: 'premium',
      seats: 500,
      usedSeats: 342,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      status: 'active' as LicenseStatus,
      contactName: 'Prof. Rossi',
      contactEmail: 'rossi@unifi.it',
      domain: 'unifi.it',
      customization: {
        logo: '/logos/unifi.png',
        colors: {
          primary: '#00549F',
          secondary: '#E6B012'
        }
      },
      value: 10000,
      renewalStatus: 'pending'
    }
  ];
  
  // Mock chat sessions
  const mockChatSessions: ChatSession[] = [];
  
  // Mock chatbot training examples
  const mockChatbotTraining: ChatbotTrainingExample[] = [];
  
  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: uuidv4(),
      title: 'Welcome to Italian Learning!',
      message: 'Thank you for joining our platform. Start your learning journey today!',
      type: 'info',
      createdAt: new Date(),
      read: false,
      priority: 'normal',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  ];
  
  // Mock flashcards
  const mockFlashcards: Flashcard[] = [
    {
      id: uuidv4(),
      front: 'casa',
      back: 'house',
      italian: 'casa',
      english: 'house',
      level: 1,
      mastered: false,
      tags: ['basics', 'home'],
      createdAt: new Date(),
      updatedAt: new Date(),
      nextReview: new Date(),
      lastReviewed: null
    }
  ];
  
  // Mock flashcard sets
  const mockFlashcardSets: FlashcardSet[] = [
    {
      id: uuidv4(),
      name: 'Basic Italian Vocabulary',
      description: 'Essential words for beginners',
      cards: mockFlashcards,
      tags: ['basics', 'beginner'],
      creator: admin.id,
      difficulty: 'beginner',
      category: 'vocabulary',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalCards: 1,
      masteredCards: 0,
      isPublic: true,
      isFavorite: false
    }
  ];
  
  // Mock ad settings
  const mockAdSettings: AdSettings = {
    enabled: false,
    placement: ['sidebar', 'footer'],
    frequency: 3,
    userGroupTargeting: ['free_users']
  };
  
  // Mock ad units
  const mockAdUnits: AdUnit[] = [];
  
  // Create mock database with data
  dbInstance = {
    users: [admin, regularUser],
    logs: [],
    emailSettings,
    resetTokens: new Map(),
    verificationTokens: new Map(),
    licenses: mockLicenses,
    chatSessions: mockChatSessions,
    chatbotTraining: mockChatbotTraining,
    notifications: mockNotifications,
    flashcards: mockFlashcards,
    flashcardSets: mockFlashcardSets,
    adSettings: mockAdSettings,
    adUnits: mockAdUnits
  };
  
  // Store the passwords in the exported passwordHash map
  passwordHash.set(admin.email, adminPasswordHash);
  passwordHash.set(regularUser.email, userPasswordHash);
  
  return dbInstance;
};
