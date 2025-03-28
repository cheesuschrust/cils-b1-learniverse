
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  updateProfile: (data: any) => Promise<any>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  socialLogin: (provider: string) => Promise<boolean>;
  addSystemLog: (action: string, details: string, level?: string) => void;
  incrementDailyQuestionCount: (questionType: string) => Promise<boolean>;
  getEmailSettings: () => Promise<any>;
  updateEmailSettings: (settings: any) => Promise<void>;
  getSystemLogs: () => Promise<any[]>;
  updateSystemLog: (id: string, data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  // Implementing required methods for UserManagementComponent
  getAllUsers: () => Promise<User[]>;
  createUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  resetPassword: async () => {},
  forgotPassword: async () => {},
  verifyEmail: async () => {},
  resendVerificationEmail: async () => false,
  updateProfile: async () => ({}),
  updatePassword: async () => {},
  socialLogin: async () => false,
  addSystemLog: () => {},
  incrementDailyQuestionCount: async () => false,
  getEmailSettings: async () => ({}),
  updateEmailSettings: async () => {},
  getSystemLogs: async () => [],
  updateSystemLog: async () => {},
  refreshUser: async () => {},
  // Implement the required methods
  getAllUsers: async () => {
    // Mock implementation for demo purposes
    return Promise.resolve([
      { 
        id: '1', 
        email: 'admin@example.com', 
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as UserRole,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: '2', 
        email: 'user@example.com', 
        firstName: 'Regular',
        lastName: 'User',
        role: 'user' as UserRole,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  createUser: async (userData) => {
    // Mock implementation for demo purposes
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || 'user',
      isVerified: userData.isVerified || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    };
    return Promise.resolve(newUser);
  },
  updateUser: async (userId, userData) => {
    // Mock implementation for demo purposes
    return Promise.resolve({
      id: userId,
      ...userData,
      updatedAt: new Date()
    } as User);
  },
  deleteUser: async () => {
    // Mock implementation for demo purposes
    return Promise.resolve();
  }
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ... implement the actual auth logic here ...

  // Mock user management implementations
  const getAllUsers = async (): Promise<User[]> => {
    try {
      // In a real implementation, this would fetch from an API
      return [
        { 
          id: '1', 
          email: 'admin@example.com', 
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin' as UserRole,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: '2', 
          email: 'user@example.com', 
          firstName: 'Regular',
          lastName: 'User',
          role: 'user' as UserRole,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  };

  const createUser = async (userData: Partial<User>): Promise<User> => {
    try {
      // In a real implementation, this would call an API
      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role || 'user',
        isVerified: userData.isVerified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userData
      };
      return newUser;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
      // In a real implementation, this would call an API
      return {
        id: userId,
        ...userData,
        updatedAt: new Date()
      } as User;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      // In a real implementation, this would call an API
      console.log(`Deleted user with ID: ${userId}`);
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  // Return the provider with the context value
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: async () => {},
        logout: async () => {},
        signup: async () => {},
        resetPassword: async () => {},
        forgotPassword: async () => {},
        verifyEmail: async () => {},
        resendVerificationEmail: async () => false,
        updateProfile: async () => ({}),
        updatePassword: async () => {},
        socialLogin: async () => false,
        addSystemLog: () => {},
        incrementDailyQuestionCount: async () => false,
        getEmailSettings: async () => ({}),
        updateEmailSettings: async () => {},
        getSystemLogs: async () => [],
        updateSystemLog: async () => {},
        refreshUser: async () => {},
        // Add implementations for user management
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
