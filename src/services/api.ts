
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
  }
};

export default API;
