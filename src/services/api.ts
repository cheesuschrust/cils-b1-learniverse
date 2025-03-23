
// Simple API service with common methods

export const API = {
  // User-related endpoints
  users: {
    getCount: async (): Promise<number> => {
      // Mock implementation
      return 250;
    },
    getActive: async (): Promise<number> => {
      // Mock implementation
      return 180;
    }
  },
  
  // Content-related endpoints
  content: {
    getCount: async (): Promise<number> => {
      // Mock implementation
      return 500;
    }
  },
  
  // Analytics endpoints
  analytics: {
    getDailyUsers: async (): Promise<any[]> => {
      // Mock implementation
      return Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 100) + 50
      }));
    },
    
    getPerformanceData: async (): Promise<any[]> => {
      // Mock implementation
      return Array.from({ length: 4 }, (_, i) => ({
        section: ['Reading', 'Writing', 'Listening', 'Speaking'][i],
        score: Math.floor(Math.random() * 40) + 60
      }));
    }
  },
  
  // Generic request handler for all service functions
  handleRequest: async <T>(endpoint: string, method: string, data?: any): Promise<T> => {
    console.log(`API Request: ${method} ${endpoint}`, data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock response based on endpoint
    if (endpoint.includes('auth/login')) {
      return {
        user: {
          id: '1',
          email: 'user@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'user',
          displayName: 'Test User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferredLanguage: 'english',
          dailyQuestionCounts: {
            grammar: 5,
            vocabulary: 3,
            listening: 2,
            reading: 4,
            writing: 1
          },
          metrics: {
            totalQuestions: 120,
            correctAnswers: 98,
            wrongAnswers: 22,
            accuracy: 81.6,
            streak: 7
          },
          lastActive: new Date().toISOString(),
          isVerified: true
        }
      } as unknown as T;
    }
    
    if (endpoint.includes('auth/register')) {
      const userData = data as any;
      return {
        user: {
          id: '2',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'user',
          displayName: `${userData.firstName} ${userData.lastName}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferredLanguage: 'english',
          dailyQuestionCounts: {
            grammar: 0,
            vocabulary: 0,
            listening: 0,
            reading: 0,
            writing: 0
          },
          metrics: {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            accuracy: 0,
            streak: 0
          },
          lastActive: new Date().toISOString(),
          isVerified: false
        }
      } as unknown as T;
    }
    
    // Admin data request
    if (endpoint.includes('admin')) {
      return {
        success: true,
        data: {
          users: 250,
          active: 180,
          content: 500,
          dailyUsers: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 100) + 50
          }))
        }
      } as unknown as T;
    }
    
    // Default response for other endpoints
    return { success: true } as unknown as T;
  }
};

export default API;
