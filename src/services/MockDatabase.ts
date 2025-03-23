
import { generateRandomSeed } from '@/utils/textAnalysis';
import { User, LogEntry, ContentItem } from '@/contexts/shared-types';

// This is a mock database for development purposes
// In a real application, this would be replaced with a backend database

// Create some mock users
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    displayName: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active',
    subscription: 'premium',
    preferredLanguage: 'english',
    isVerified: true,
    dailyQuestionCounts: {
      grammar: 5,
      vocabulary: 3,
      listening: 1,
      reading: 4,
      writing: 2
    },
    metrics: {
      totalQuestions: 250,
      correctAnswers: 200,
      wrongAnswers: 50,
      accuracy: 80,
      streak: 12
    },
    lastActive: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active',
    subscription: 'free',
    preferredLanguage: 'italian',
    isVerified: false,
    dailyQuestionCounts: {
      grammar: 2,
      vocabulary: 1,
      listening: 0,
      reading: 3,
      writing: 0
    },
    metrics: {
      totalQuestions: 85,
      correctAnswers: 60,
      wrongAnswers: 25,
      accuracy: 70.5,
      streak: 3
    },
    lastActive: new Date().toISOString()
  }
];

// Create some mock system logs
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    category: 'auth',
    action: 'user_login',
    details: 'User admin@example.com logged in',
    level: 'info',
    userId: '1'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    category: 'content',
    action: 'content_created',
    details: 'New lesson created: Italian Greetings',
    level: 'info',
    userId: '1'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    category: 'system',
    action: 'system_error',
    details: 'Database connection error',
    level: 'error'
  }
];

// Create some mock content
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Basic Italian Greetings',
    description: 'Learn the essential greetings in Italian',
    content: generateRandomSeed(500),
    type: 'lesson',
    level: 'beginner',
    tags: ['greetings', 'basics', 'beginner'],
    author: 'Admin User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published'
  },
  {
    id: '2',
    title: 'Italian Present Tense',
    description: 'Master the present tense in Italian',
    content: generateRandomSeed(800),
    type: 'lesson',
    level: 'intermediate',
    tags: ['grammar', 'verbs', 'present tense'],
    author: 'Admin User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published'
  },
  {
    id: '3',
    title: 'Italian Food Vocabulary',
    description: 'Essential vocabulary for Italian cuisine',
    content: generateRandomSeed(600),
    type: 'exercise',
    level: 'beginner',
    tags: ['vocabulary', 'food', 'culture'],
    author: 'Admin User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft'
  }
];

// Export the mock database
export const mockDatabase = {
  users: mockUsers,
  logs: mockLogs,
  content: mockContent
};
