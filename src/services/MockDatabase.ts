
import { MockDatabase, User, EmailSettings } from "@/contexts/shared-types";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

let dbInstance: MockDatabase;

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
    role: 'admin',
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
    }
  };
  
  const regularUser: User = {
    id: uuidv4(),
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'user@italianlearning.app',
    role: 'user',
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
    }
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
  
  // Create mock database with users
  dbInstance = {
    users: [admin, regularUser],
    logs: [],
    emailSettings,
    resetTokens: new Map(),
    verificationTokens: new Map()
  };
  
  // Hash the passwords and store them
  const passwordMap = new Map();
  passwordMap.set(admin.email, adminPasswordHash);
  passwordMap.set(regularUser.email, userPasswordHash);
  
  // Attach the passwords to the db instance for authentication
  (dbInstance as any).passwords = passwordMap;
  
  return dbInstance;
};
