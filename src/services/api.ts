
// Simple API service with common methods
import { mockDatabase } from './MockDatabase';
import { AdConfiguration, EmailSettings, LogEntry, SEOConfiguration, SalesConfiguration, User } from '@/contexts/shared-types';

// Mock data for admin dashboard
const mockAdminData = {
  users: {
    count: 250,
    active: 180,
    new: 35,
  },
  content: {
    count: 500,
    lessons: 320,
    exercises: 180,
  },
  revenue: {
    lastMonth: 2450.75,
    thisMonth: 1890.50,
    projected: 3200.25,
  },
  dailyUsers: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 100) + 50
  })),
  performanceData: [
    { section: 'Reading', score: Math.floor(Math.random() * 40) + 60 },
    { section: 'Writing', score: Math.floor(Math.random() * 40) + 60 },
    { section: 'Listening', score: Math.floor(Math.random() * 40) + 60 },
    { section: 'Speaking', score: Math.floor(Math.random() * 40) + 60 }
  ]
};

// Mock email settings
const mockEmailSettings: EmailSettings = {
  provider: 'smtp',
  fromEmail: 'no-reply@italianapp.com',
  fromName: 'Italian Language App',
  config: {
    enableSsl: true,
    host: 'smtp.example.com',
    port: 587,
    username: 'smtp-user',
    password: 'smtp-password'
  },
  templates: {
    verification: {
      subject: 'Verify Your Email',
      body: 'Hello {{name}}, please verify your email by clicking this link: {{verificationLink}}'
    },
    passwordReset: {
      subject: 'Reset Your Password',
      body: 'Hello {{name}}, click this link to reset your password: {{resetLink}}. This link will expire in {{expiry}} hours.'
    },
    welcome: {
      subject: 'Welcome to Italian Language App',
      body: 'Welcome {{name}}! We\'re excited to have you on board. Start learning today: {{loginLink}}'
    }
  },
  dailyDigest: true,
  notifications: true,
  marketing: false,
  newFeatures: true
};

// Mock advertising settings
const mockAdSettings: AdConfiguration = {
  enabled: true,
  provider: 'google',
  adUnits: [
    {
      id: '1',
      name: 'Header Banner',
      type: 'banner',
      placement: 'header',
      active: true
    },
    {
      id: '2',
      name: 'Sidebar Ad',
      type: 'native',
      placement: 'sidebar',
      active: true
    }
  ],
  settings: {
    frequency: 3,
    showToFreeUsers: true,
    showToPremiumUsers: false
  }
};

// Mock SEO settings
const mockSeoSettings: SEOConfiguration = {
  defaultTitle: 'Italian Language Learning Platform',
  defaultDescription: 'Learn Italian with interactive lessons, quizzes, and exercises.',
  defaultKeywords: ['italian', 'language', 'learning', 'lessons', 'vocabulary', 'grammar'],
  siteMap: {
    enabled: true,
    lastGenerated: new Date().toISOString(),
  },
  robotsTxt: {
    enabled: true,
    content: 'User-agent: *\nAllow: /'
  },
  analytics: {
    provider: 'google',
    trackingId: 'G-EXAMPLE123',
    enabled: true
  }
};

// Mock sales settings
const mockSalesSettings: SalesConfiguration = {
  products: [
    {
      id: '1',
      name: 'Monthly Premium',
      description: 'Unlimited access to all lessons and exercises',
      price: 9.99,
      currency: 'USD',
      type: 'subscription',
      features: ['Unlimited lessons', 'No ads', 'Premium content'],
      active: true
    },
    {
      id: '2',
      name: 'Annual Premium',
      description: 'Unlimited access with 20% discount',
      price: 95.88,
      currency: 'USD',
      type: 'subscription',
      features: ['Everything in Monthly', 'Save 20%', 'Priority support'],
      active: true
    }
  ],
  discounts: [
    {
      id: '1',
      name: 'Summer Sale',
      code: 'SUMMER20',
      amount: 20,
      type: 'percentage',
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: true
    }
  ],
  paymentProviders: [
    {
      name: 'stripe',
      enabled: true,
      testMode: false
    },
    {
      name: 'paypal',
      enabled: true,
      testMode: false
    }
  ]
};

export const API = {
  // User-related endpoints
  users: {
    getCount: async (): Promise<number> => {
      return mockAdminData.users.count;
    },
    getActive: async (): Promise<number> => {
      return mockAdminData.users.active;
    }
  },
  
  // Content-related endpoints
  content: {
    getCount: async (): Promise<number> => {
      return mockAdminData.content.count;
    }
  },
  
  // Analytics endpoints
  analytics: {
    getDailyUsers: async (): Promise<any[]> => {
      return mockAdminData.dailyUsers;
    },
    
    getPerformanceData: async (): Promise<any[]> => {
      return mockAdminData.performanceData;
    }
  },
  
  // Generic request handler for all service functions
  handleRequest: async <T>(endpoint: string, method: string, data?: any): Promise<T> => {
    console.log(`API Request: ${method} ${endpoint}`, data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Auth endpoints
    if (endpoint.includes('auth/login')) {
      return {
        user: mockDatabase.users[0]
      } as unknown as T;
    }
    
    if (endpoint.includes('auth/register')) {
      const userData = data as any;
      const newUser: User = {
        ...mockDatabase.users[1],
        id: String(Date.now()),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      return {
        user: newUser
      } as unknown as T;
    }
    
    // User profile
    if (endpoint.includes('user/profile')) {
      return {
        user: mockDatabase.users.find(user => user.id === data.userId) || mockDatabase.users[0]
      } as unknown as T;
    }
    
    // Admin email settings
    if (endpoint.includes('admin/email/settings')) {
      if (method === 'GET') {
        return mockEmailSettings as unknown as T;
      } else if (method === 'PUT') {
        return {
          ...mockEmailSettings,
          ...data
        } as unknown as T;
      }
    }
    
    // Admin advertising settings
    if (endpoint.includes('admin/advertising/settings')) {
      if (method === 'GET') {
        return mockAdSettings as unknown as T;
      } else if (method === 'PUT') {
        return {
          ...mockAdSettings,
          ...data
        } as unknown as T;
      }
    }
    
    // Admin SEO settings
    if (endpoint.includes('admin/seo/settings')) {
      if (method === 'GET') {
        return mockSeoSettings as unknown as T;
      } else if (method === 'PUT') {
        return {
          ...mockSeoSettings,
          ...data
        } as unknown as T;
      }
    }
    
    // Admin sales settings
    if (endpoint.includes('admin/sales/settings')) {
      if (method === 'GET') {
        return mockSalesSettings as unknown as T;
      } else if (method === 'PUT') {
        return {
          ...mockSalesSettings,
          ...data
        } as unknown as T;
      }
    }
    
    // System logs
    if (endpoint.includes('admin/logs')) {
      return {
        logs: mockDatabase.logs
      } as unknown as T;
    }
    
    // Admin data request
    if (endpoint.includes('admin/dashboard')) {
      return {
        users: mockAdminData.users,
        content: mockAdminData.content,
        revenue: mockAdminData.revenue,
        dailyUsers: mockAdminData.dailyUsers,
        performanceData: mockAdminData.performanceData
      } as unknown as T;
    }
    
    // Default response for other endpoints
    return { success: true } as unknown as T;
  }
};

export default API;
