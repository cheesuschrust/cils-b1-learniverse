
import { User } from '@/types/user';
import { DocumentMeta } from '@/types/document';

/**
 * Standard test fixtures for consistent testing
 */

/**
 * Standard test users
 */
export const users = {
  standard: {
    id: 'user-1',
    email: 'user@example.com',
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    role: 'user',
    isVerified: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-01'),
    lastActive: new Date('2023-01-01'),
    preferences: {
      theme: 'light',
      emailNotifications: true,
      language: 'en',
      difficulty: 'intermediate'
    },
    subscription: 'free',
    status: 'active',
    preferredLanguage: 'english',
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
  } as User,
  
  admin: {
    id: 'admin-1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    username: 'adminuser',
    role: 'admin',
    isVerified: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-01'),
    lastActive: new Date('2023-01-01'),
    preferences: {
      theme: 'dark',
      emailNotifications: true,
      language: 'en',
      difficulty: 'advanced'
    },
    subscription: 'premium',
    status: 'active',
    preferredLanguage: 'english',
    dailyQuestionCounts: {
      flashcards: 10,
      multipleChoice: 5,
      listening: 3,
      writing: 2,
      speaking: 1
    },
    metrics: {
      totalQuestions: 100,
      correctAnswers: 80,
      streak: 7
    }
  } as User,
  
  premium: {
    id: 'premium-1',
    email: 'premium@example.com',
    firstName: 'Premium',
    lastName: 'User',
    username: 'premiumuser',
    role: 'user',
    isVerified: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-01'),
    lastActive: new Date('2023-01-01'),
    preferences: {
      theme: 'light',
      emailNotifications: true,
      language: 'en',
      difficulty: 'intermediate'
    },
    subscription: 'premium',
    status: 'active',
    preferredLanguage: 'english',
    dailyQuestionCounts: {
      flashcards: 5,
      multipleChoice: 3,
      listening: 2,
      writing: 1,
      speaking: 0
    },
    metrics: {
      totalQuestions: 50,
      correctAnswers: 40,
      streak: 3
    }
  } as User
};

/**
 * Standard test documents
 */
export const documents = {
  pdf: {
    id: 'doc-1',
    title: 'Test PDF Document',
    type: 'pdf',
    size: 2048,
    uploadedBy: 'user-1',
    contentType: 'flashcards',
    language: 'english',
    createdAt: new Date('2023-01-01').toISOString(),
    parsedContent: {
      text: 'This is a test PDF document content.',
      metadata: {
        title: 'Test PDF Document',
        author: 'Test User',
        creationDate: new Date('2023-01-01').toISOString(),
        pageCount: 5,
        wordCount: 1000,
        keyTerms: ['test', 'pdf', 'document'],
        language: 'english'
      },
      sections: [
        {
          title: 'Introduction',
          content: 'This is the introduction of the PDF document.',
          level: 1
        }
      ]
    },
    difficulty: 'intermediate',
    tags: ['test', 'document', 'pdf']
  } as DocumentMeta,
  
  docx: {
    id: 'doc-2',
    title: 'Test Word Document',
    type: 'docx',
    size: 1536,
    uploadedBy: 'user-1',
    contentType: 'multipleChoice',
    language: 'english',
    createdAt: new Date('2023-01-02').toISOString(),
    parsedContent: {
      text: 'This is a test Word document content.',
      metadata: {
        title: 'Test Word Document',
        author: 'Test User',
        creationDate: new Date('2023-01-02').toISOString(),
        pageCount: 3,
        wordCount: 750,
        keyTerms: ['test', 'word', 'document'],
        language: 'english'
      },
      sections: [
        {
          title: 'Introduction',
          content: 'This is the introduction of the Word document.',
          level: 1
        }
      ]
    },
    difficulty: 'beginner',
    tags: ['test', 'document', 'word']
  } as DocumentMeta
};

/**
 * Standard test API responses
 */
export const apiResponses = {
  login: {
    success: {
      user: users.standard,
      token: 'jwt-token-example'
    },
    error: {
      message: 'Invalid credentials',
      code: 'AUTH_ERROR',
      status: 401
    }
  },
  documents: {
    success: {
      documents: [documents.pdf, documents.docx],
      total: 2,
      page: 1,
      pageSize: 10
    },
    error: {
      message: 'Failed to fetch documents',
      code: 'FETCH_ERROR',
      status: 500
    }
  }
};
