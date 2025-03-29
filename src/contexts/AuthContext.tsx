
import React, { createContext, useContext, useState, useEffect } from 'react';  
import { User, UserRole } from '@/types/user';  
import {   
  getCurrentUser,   
  getSession,   
  signInWithEmail,   
  signInWithOAuth,   
  signOut,   
  signUp,   
  resetPassword as supaResetPassword,  
  updatePassword as supaUpdatePassword  
} from '@/lib/supabase';  


// Add this directly after your useState declarations in the AuthProvider component  

// EMERGENCY FIX - Force exit loading state IMMEDIATELY  
useEffect(() => {  
  console.log("🚨 EMERGENCY LOADING FIX ACTIVATED");  
  
  // Force the loading state to false immediately  
  setLoading(false);  
  console.log("🚨 FORCED LOADING STATE TO FALSE");  
  
  // Set an emergency user to allow navigation  
  const emergencyUser = {  
    id: 'emergency-user-id',  
    email: 'emergency@example.com',  
    firstName: 'Emergency',  
    lastName: 'User',  
    role: 'user' as UserRole,  
    isVerified: true,  
    createdAt: new Date(),  
    updatedAt: new Date(),  
    preferences: {  
      theme: 'light',  
      language: 'en',  
      notifications: true,  
      onboardingCompleted: true  
    },  
    dailyQuestionCounts: {  
      flashcards: 0,  
      multipleChoice: 0,  
      speaking: 0,  
      writing: 0,  
      listening: 0  
    }  
  };  
  
  setUser(emergencyUser);  
  console.log("🚨 SET EMERGENCY USER:", emergencyUser);  
}, []); // Empty dependency array means this runs once on mount  

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
  getAllUsers: async () => [],  
  createUser: async () => ({ id: '', email: '' } as User),  
  updateUser: async () => ({ id: '' } as User),  
  deleteUser: async () => {},  
});  

// Create a provider component  
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [user, setUser] = useState<User | null>(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState<Error | null>(null);  
  const [systemLogs, setSystemLogs] = useState<any[]>([]);  
  const [emailSettings, setEmailSettings] = useState({  
    dailyDigest: true,  
    weeklyProgress: true,  
    newFeatures: true,  
  });  

  // Initialize auth state - check if user is already logged in  
  useEffect(() => {  
    async function loadUser() {  
      try {  
        // This would normally check with Supabase if a session exists  
        const session = await getSession();  
        
        if (session?.user) {  
          // We have a logged in user  
          const userData = await getCurrentUser();  
          
          // Create a mock user that matches your User type  
          setUser({  
            id: userData?.id || 'mock-user-id',  
            email: userData?.email || 'user@example.com',  
            firstName: 'Demo',  
            lastName: 'User',  
            role: 'user' as UserRole,  
            isVerified: true,  
            createdAt: new Date(),  
            updatedAt: new Date(),  
            preferences: {  
              theme: 'light',  
              language: 'en',  
              notifications: true  
            },  
            dailyQuestionCounts: {  
              flashcards: 0,  
              multipleChoice: 0,  
              speaking: 0,  
              writing: 0,  
              listening: 0  
            }  
          });  
        }  
      } catch (err) {  
        console.error("Error loading user:", err);  
        setError(err instanceof Error ? err : new Error('Failed to load user'));  
      } finally {  
        // Always set loading to false when done  
        setLoading(false);  
      }  
    }  

    loadUser();  
    
    // Set a timeout to prevent infinite loading  
    const timer = setTimeout(() => {  
      if (loading) {  
        console.warn("Auth loading timeout - forcing completion");  
        setLoading(false);  
      }  
    }, 3000);  
    
    return () => clearTimeout(timer);  
  }, []);  

  // Authentication methods  
  const login = async (email: string, password: string) => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      // Call mock Supabase sign in  
      const { data, error } = await signInWithEmail(email, password);  
      
      if (error) throw new Error(error.message || 'Login failed');  
      
      if (data?.user) {  
        // Set user data based on login response  
        setUser({  
          id: data.user.id,  
          email: data.user.email || email,  
          firstName: 'Demo',  
          lastName: 'User',  
          role: email.includes('admin') ? 'admin' : 'user' as UserRole,  
          isVerified: true,  
          createdAt: new Date(),  
          updatedAt: new Date(),  
          preferences: {  
            theme: 'light',  
            language: 'en',  
            notifications: true  
          },  
          dailyQuestionCounts: {  
            flashcards: 0,  
            multipleChoice: 0,  
            speaking: 0,  
            writing: 0,  
            listening: 0  
          }  
        });  
        
        addSystemLog('login', `User logged in: ${email}`, 'info');  
      }  
    } catch (err) {  
      console.error("Login error:", err);  
      setError(err instanceof Error ? err : new Error('Login failed'));  
    } finally {  
      setLoading(false);  
    }  
  };  

  const logout = async () => {  
    try {  
      setLoading(true);  
      await signOut();  
      setUser(null);  
      addSystemLog('logout', 'User logged out', 'info');  
    } catch (err) {  
      console.error("Logout error:", err);  
      setError(err instanceof Error ? err : new Error('Logout failed'));  
    } finally {  
      setLoading(false);  
    }  
  };  

  const signup = async (data: any) => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      const { email, password } = data;  
      const { data: signupData, error } = await signUp(email, password);  
      
      if (error) throw new Error(error.message || 'Signup failed');  
      
      // In a real app, you would typically not log the user in immediately  
      // They would need to verify their email first  
      if (signupData?.user) {  
        setUser({  
          id: signupData.user.id,  
          email: signupData.user.email || email,  
          firstName: data.firstName || 'New',  
          lastName: data.lastName || 'User',  
          role: 'user' as UserRole,  
          isVerified: false, // Needs verification  
          createdAt: new Date(),  
          updatedAt: new Date(),  
          preferences: {  
            theme: 'light',  
            language: 'en',  
            notifications: true  
          },  
          dailyQuestionCounts: {  
            flashcards: 0,  
            multipleChoice: 0,  
            speaking: 0,  
            writing: 0,  
            listening: 0  
          }  
        });  
        
        addSystemLog('signup', `New user registered: ${email}`, 'info');  
      }  
    } catch (err) {  
      console.error("Signup error:", err);  
      setError(err instanceof Error ? err : new Error('Signup failed'));  
    } finally {  
      setLoading(false);  
    }  
  };  

  const socialLogin = async (provider: string): Promise<boolean> => {  
    try {  
      setLoading(true);  
      await signInWithOAuth(provider as any);  
      
      // In a real implementation, the redirect would happen here  
      // For our mock, we'll just set a default user  
      setUser({  
        id: 'social-mock-id',  
        email: `${provider}-user@example.com`,  
        firstName: provider.charAt(0).toUpperCase() + provider.slice(1),  
        lastName: 'User',  
        role: 'user' as UserRole,  
        isVerified: true,  
        createdAt: new Date(),  
        updatedAt: new Date(),  
        preferences: {  
          theme: 'light',  
          language: 'en',  
          notifications: true  
        },  
        dailyQuestionCounts: {  
          flashcards: 0,  
          multipleChoice: 0,  
          speaking: 0,  
          writing: 0,  
          listening: 0  
        }  
      });  
      
      addSystemLog('socialLogin', `User logged in via ${provider}`, 'info');  
      return true;  
    } catch (err) {  
      console.error(`${provider} login error:`, err);  
      setError(err instanceof Error ? err : new Error(`${provider} login failed`));  
      return false;  
    } finally {  
      setLoading(false);  
    }  
  };  

  const forgotPassword = async (email: string) => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      await supaResetPassword(email);  
      addSystemLog('forgotPassword', `Password reset requested for: ${email}`, 'info');  
    } catch (err) {  
      console.error("Forgot password error:", err);  
      setError(err instanceof Error ? err : new Error('Forgot password request failed'));  
    } finally {  
      setLoading(false);  
    }  
  };  

  const resetPassword = async (token: string, newPassword: string) => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      // In a real app, you would verify the token and then reset the password  
      // For our mock, we'll just assume it worked  
      await supaUpdatePassword(newPassword);  
      addSystemLog('resetPassword', 'Password was reset successfully', 'info');  
    } catch (err) {  
      console.error("Reset password error:", err);  
      setError(err instanceof Error ? err : new Error('Password reset failed'));  
    } finally {  
      setLoading(false);  
    }  
  };  

  const updatePassword = async (currentPassword: string, newPassword: string) => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      // In a real app, you would verify the current password first  
      await supaUpdatePassword(newPassword);  
      addSystemLog('updatePassword', 'Password was updated', 'info');  
    } catch (err) {  
      console.error("Update password error:", err);  
      setError(err instanceof Error ? err : new Error('Password update failed'));  
    } finally {  
      setLoading(false);  
    }  
  };  

  const verifyEmail = async (token: string) => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      // Mock email verification  
      console.log(`Verifying email with token: ${token}`);  
      
      // In a real app, you would verify the token with your backend  
      // For our mock, we'll just update the user state if it exists  
      if (user) {  
        setUser({  
          ...user,  
          isVerified: true,  
          updatedAt: new Date()  
        });  
      }  
      
      addSystemLog('verifyEmail', 'Email was verified successfully', 'info');  
    } catch (err) {  
      console.error("Email verification error:", err);  
      setError(err instanceof Error ? err : new Error('Email verification failed'));  
    } finally {  
      setLoading(false);  
    }  
  };  

  const resendVerificationEmail = async (email: string): Promise<boolean> => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      // Mock resending verification email  
      console.log(`Resending verification email to: ${email}`);  
      
      addSystemLog('resendVerification', `Verification email resent to: ${email}`, 'info');  
      return true;  
    } catch (err) {  
      console.error("Resend verification error:", err);  
      setError(err instanceof Error ? err : new Error('Failed to resend verification email'));  
      return false;  
    } finally {  
      setLoading(false);  
    }  
  };  

  const updateProfile = async (data: any) => {  
    try {  
      setLoading(true);  
      setError(null);  
      
      // Update the user profile  
      if (user) {  
        const updatedUser = {  
          ...user,  
          ...data,  
          updatedAt: new Date()  
        };  
        setUser(updatedUser);  
        addSystemLog('updateProfile', 'User profile was updated', 'info');  
        return updatedUser;  
      }  
      throw new Error('No user logged in');  
    } catch (err) {  
      console.error("Update profile error:", err);  
      setError(err instanceof Error ? err : new Error('Profile update failed'));  
      return null;  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const refreshUser = async () => {  
    try {  
      setLoading(true);  
      // In a real app, this would re-fetch the user from the API  
      // For our mock, we'll just update the timestamp  
      if (user) {  
        setUser({  
          ...user,  
          updatedAt: new Date()  
        });  
      }  
    } catch (err) {  
      console.error("Refresh user error:", err);  
    } finally {  
      setLoading(false);  
    }  
  };  

  // System log methods  
  const addSystemLog = (action: string, details: string, level = 'info') => {  
    const newLog = {  
      id: Date.now().toString(),  
      userId: user?.id || 'system',  
      action,  
      details,  
      level,  
      timestamp: new Date()  
    };  
    setSystemLogs(prev => [newLog, ...prev]);  
  };  

  const getSystemLogs = async () => {  
    return systemLogs;  
  };  

  const updateSystemLog = async (id: string, data: any) => {  
    setSystemLogs(prev =>   
      prev.map(log => log.id === id ? { ...log, ...data } : log)  
    );  
  };  

  // Email settings methods  
  const getEmailSettings = async () => {  
    return emailSettings;  
  };  

  const updateEmailSettings = async (settings: any) => {  
    setEmailSettings(prev => ({ ...prev, ...settings }));  
  };  

  // Daily question count methods  
  const incrementDailyQuestionCount = async (questionType: string): Promise<boolean> => {  
    try {  
      if (!user) return false;  
      
      const updatedCounts = {   
        ...user.dailyQuestionCounts,  
        [questionType]: (user.dailyQuestionCounts?.[questionType] || 0) + 1  
      };  
      
      setUser({  
        ...user,  
        dailyQuestionCounts: updatedCounts  
      });  
      
      return true;  
    } catch (err) {  
      console.error("Failed to increment question count:", err);  
      return false;  
    }  
  };  

  // User management methods  
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
        },  
        // Include the current user if they exist  
        ...(user ? [user] : [])  
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
      
      addSystemLog('createUser', `New user created: ${newUser.email}`, 'info');  
      return newUser;  
    } catch (error) {  
      console.error("Failed to create user:", error);  
      throw error;  
    }  
  };  

  const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {  
    try {  
      // In a real implementation, this would call an API  
      const updatedUser = {  
        id: userId,  
        ...userData,  
        updatedAt: new Date()  
      } as User;  
      
      // If we're updating the current user, update state  
      if (user && user.id === userId) {  
        setUser({ ...user, ...userData, updatedAt: new Date() });  
      }  
      
      addSystemLog('updateUser', `User updated: ${userId}`, 'info');  
      return updatedUser;  
    } catch (error) {  
      console.error("Failed to update user:", error);  
      throw error;  
    }  
  };  

  const deleteUser = async (userId: string): Promise<void> => {  
    try {  
      // In a real implementation, this would call an API  
      console.log(`Deleted user with ID: ${userId}`);  
      
      // If we're deleting the current user, log them out  
      if (user && user.id === userId) {  
        await logout();  
      }  
      
      addSystemLog('deleteUser', `User deleted: ${userId}`, 'info');  
    } catch (error) {  
      console.error("Failed to delete user:", error);  
      throw error;  
    }  
  };  

  // Calculate additional properties  
  const isAuthenticated = !!user;  
  const isLoading = loading;  

  // Return the provider with the context value  
  return (  
    <AuthContext.Provider  
      value={{  
        user,  
        loading,  
        error,  
        login,  
        logout,  
        signup,  
        resetPassword,  
        forgotPassword,  
        verifyEmail,  
        resendVerificationEmail,  
        updateProfile,  
        updatePassword,  
        socialLogin,  
        addSystemLog,  
        incrementDailyQuestionCount,  
        getEmailSettings,  
        updateEmailSettings,  
        getSystemLogs,  
        updateSystemLog,  
        refreshUser,  
        // Add implementations for user management  
        getAllUsers,  
        createUser,  
        updateUser,  
        deleteUser,  
        isAuthenticated,  
        isLoading  
      }}  
    >  
      {children}  
    </AuthContext.Provider>  
  );  
};  

// Create a hook to use the auth context  
export const useAuth = () => useContext(AuthContext);  

export default AuthContext;  
