
import { MockDatabase, User, EmailSettings } from "@/contexts/shared-types";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Password hash map (simulating password storage)
export const passwordHash: Map<string, string> = new Map();

// Initialize the mock database with default data
export const initializeDatabase = async (): Promise<MockDatabase> => {
  const db: MockDatabase = {
    users: [
      {
        id: '1',
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
          difficulty: 'intermediate'
        },
        subscription: 'premium',
        status: 'active',
        preferredLanguage: 'both',
        dailyQuestionCounts: {
          flashcards: 0,
          multipleChoice: 0,
          listening: 0,
          writing: 0,
          speaking: 0
        },
        metrics: {
          totalQuestions: 0,
          correctAnswers: 0,
          streak: 0
        }
      },
      {
        id: '2',
        firstName: 'Marco',
        lastName: 'Rossi',
        username: 'marco',
        email: 'marco@example.com',
        role: 'user',
        isVerified: true,
        createdAt: new Date('2023-02-15'),
        lastLogin: new Date(),
        lastActive: new Date(),
        preferences: {
          theme: 'light',
          emailNotifications: true,
          language: 'it',
          difficulty: 'intermediate'
        },
        subscription: 'free',
        status: 'active',
        preferredLanguage: 'both',
        dailyQuestionCounts: {
          flashcards: 0,
          multipleChoice: 0,
          listening: 0,
          writing: 0,
          speaking: 0
        },
        displayName: 'Marco R.',
        metrics: {
          totalQuestions: 15,
          correctAnswers: 12,
          streak: 3
        }
      }
    ],
    logs: [],
    emailSettings: {
      provider: 'temporaryEmail',
      fromEmail: 'noreply@cittadinanza-b2.com',
      fromName: 'CILS B2 Cittadinanza',
      config: {
        enableSsl: true
      },
      templates: {
        verification: {
          subject: "Verify Your Email - CILS B2 Cittadinanza",
          body: "<p>Hello {{name}},</p><p>Please verify your email by clicking <a href='{{verificationLink}}'>here</a>.</p><p>Thank you for joining CILS B2 Cittadinanza Question of the Day!</p>"
        },
        passwordReset: {
          subject: "Reset Your Password - CILS B2 Cittadinanza",
          body: "<p>Hello {{name}},</p><p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p><p>If you didn't request this, please ignore this email.</p>"
        },
        welcome: {
          subject: "Welcome to CILS B2 Cittadinanza Question of the Day!",
          body: "<p>Welcome to CILS B2 Cittadinanza, {{name}}!</p><p>We're excited to have you on board. Get ready to improve your Italian language skills!</p>"
        }
      },
      temporaryInboxDuration: 24
    },
    resetTokens: new Map(),
    verificationTokens: new Map()
  };

  // Initialize default admin password
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  passwordHash.set('admin@italianlearning.app', hashedPassword);
  
  // Add a test user password
  const userPassword = await bcrypt.hash('password123', 10);
  passwordHash.set('marco@example.com', userPassword);

  return db;
};

// Global database instance
let dbInstance: MockDatabase | null = null;

// Get database instance (initialize if needed)
export const getDatabase = async (): Promise<MockDatabase> => {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
};

