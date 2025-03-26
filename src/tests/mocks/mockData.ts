
import { User } from '@/types/user';
import { Flashcard, FlashcardSet } from '@/types/flashcard';
import { AIPreferences } from '@/types/ai';

// Mock User
export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: '/avatar.png',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  language: 'en',
  preferences: {
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    language: 'en',
    difficulty: 'intermediate'
  },
};

export const mockAdminUser: User = {
  ...mockUser,
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
};

// Mock AI Preferences
export const mockAIPreferences: AIPreferences = {
  enabled: true,
  modelSize: 'medium',
  cacheResponses: true,
  voiceEnabled: true,
  defaultLanguage: 'english',
  voiceRate: 1.0,
  voicePitch: 1.0,
  italianVoiceURI: 'Italian Voice',
  englishVoiceURI: 'English Voice',
  defaultModelSize: 'medium',
  useWebGPU: false,
  anonymousAnalytics: true
};

// Mock Flashcards
export const mockFlashcards: Flashcard[] = [
  {
    id: 'card-1',
    italian: 'Ciao',
    english: 'Hello',
    explanation: 'A common greeting in Italian',
    level: 1,
    mastered: false,
    tags: ['greeting', 'common'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    nextReview: new Date('2023-01-02'),
    lastReviewed: null,
    examples: ['Ciao, come stai?']
  },
  {
    id: 'card-2',
    italian: 'Grazie',
    english: 'Thank you',
    explanation: 'Used to express gratitude',
    level: 2,
    mastered: false,
    tags: ['common', 'politeness'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    nextReview: new Date('2023-01-03'),
    lastReviewed: null,
    examples: ['Grazie mille!']
  },
  {
    id: 'card-3',
    italian: 'Per favore',
    english: 'Please',
    explanation: 'Used when making a request',
    level: 1,
    mastered: true,
    tags: ['common', 'politeness'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    nextReview: new Date('2023-01-04'),
    lastReviewed: new Date('2023-01-01'),
    examples: ['Per favore, mi puoi aiutare?']
  }
];

// Mock Flashcard Sets
export const mockFlashcardSets: FlashcardSet[] = [
  {
    id: 'set-1',
    name: 'Basic Greetings',
    description: 'Common Italian greetings and expressions',
    tags: ['beginner', 'greetings'],
    cards: mockFlashcards,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    totalCards: 3,
    masteredCards: 1,
    category: 'Basics',
    difficulty: 'beginner',
    isPublic: true,
    creator: 'user-1',
    isFavorite: true
  }
];

// Mock Exercises
export const mockExercises = [
  {
    id: 'ex-1',
    title: 'Basic Conversation Practice',
    type: 'speaking',
    difficulty: 'beginner',
    description: 'Practice basic Italian conversation',
    content: {
      prompts: [
        'Come ti chiami?',
        'Come stai?',
        'Di dove sei?'
      ]
    },
    duration: 5,
    points: 10,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'ex-2',
    title: 'Food Vocabulary',
    type: 'flashcards',
    difficulty: 'beginner',
    description: 'Learn common Italian food vocabulary',
    content: {
      cards: [
        { italian: 'Pane', english: 'Bread' },
        { italian: 'Vino', english: 'Wine' },
        { italian: 'Pasta', english: 'Pasta' }
      ]
    },
    duration: 3,
    points: 5,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'ex-3',
    title: 'Present Tense Conjugation',
    type: 'multiple-choice',
    difficulty: 'intermediate',
    description: 'Practice conjugating verbs in the present tense',
    content: {
      questions: [
        {
          question: 'Io ___ al cinema. (andare)',
          options: ['vai', 'vado', 'va', 'andiamo'],
          correctAnswer: 'vado'
        },
        {
          question: 'Tu ___ felice. (essere)',
          options: ['sei', 'sono', 'è', 'siamo'],
          correctAnswer: 'sei'
        }
      ]
    },
    duration: 8,
    points: 15,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

// Mock Analytics Data
export const mockAnalyticsData = {
  userStats: {
    total: 1200,
    active: 850,
    growth: 12,
    premium: 350,
    newToday: 45,
    retentionRate: 82
  },
  contentStats: {
    totalExercises: 250,
    totalFlashcards: 1500,
    avgCompletionRate: 68,
    topCategories: [
      { name: 'Grammar', value: 35 },
      { name: 'Vocabulary', value: 28 },
      { name: 'Conversation', value: 22 },
      { name: 'Reading', value: 15 }
    ]
  },
  userTrends: [
    { name: 'Jan', users: 800, newUsers: 120 },
    { name: 'Feb', users: 850, newUsers: 100 },
    { name: 'Mar', users: 900, newUsers: 90 },
    { name: 'Apr', users: 950, newUsers: 80 },
    { name: 'May', users: 1000, newUsers: 100 },
    { name: 'Jun', users: 1100, newUsers: 130 },
    { name: 'Jul', users: 1200, newUsers: 150 }
  ],
  revenueTrends: [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 16500 },
    { month: 'Mar', revenue: 17200 },
    { month: 'Apr', revenue: 18000 },
    { month: 'May', revenue: 19500 },
    { month: 'Jun', revenue: 21000 },
    { month: 'Jul', revenue: 22500 }
  ],
  aiUsage: {
    totalRequests: 25000,
    avgResponseTime: 280,
    modelDistribution: [
      { name: 'Small', value: 30 },
      { name: 'Medium', value: 55 },
      { name: 'Large', value: 15 }
    ],
    accuracyMetrics: {
      overall: 92,
      grammar: 94,
      vocabulary: 90,
      translation: 89
    },
    featureUsage: [
      { name: 'Grammar Check', value: 42 },
      { name: 'Translation', value: 30 },
      { name: 'Exercise Generation', value: 18 },
      { name: 'Conversation', value: 10 }
    ]
  }
};

// Mock Notification
export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'New Exercise Available',
    message: 'A new speaking exercise has been added to your learning path.',
    type: 'info',
    isRead: false,
    createdAt: new Date('2023-07-01T10:00:00Z'),
    action: '/app/speaking'
  },
  {
    id: 'notif-2',
    title: 'Streak Reminder',
    message: "Don't forget to complete today's exercises to maintain your streak!",
    type: 'warning',
    isRead: true,
    createdAt: new Date('2023-07-01T08:30:00Z'),
    action: '/app/dashboard'
  },
  {
    id: 'notif-3',
    title: 'Achievement Unlocked',
    message: 'Congratulations! You\'ve completed 50 exercises.',
    type: 'success',
    isRead: false,
    createdAt: new Date('2023-06-30T15:45:00Z'),
    action: '/app/profile'
  }
];
