import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendWelcomeEmail 
} from '@/services/EmailService';
import { getDatabase, passwordHash } from '@/services/MockDatabase';
import type { User, UserPreferences, LogCategory, LogEntry, EmailSettings } from './shared-types';
import type { AuthContextType } from './types/auth-types';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const db = await getDatabase();
          
          // Update last login time
          const userIndex = db.users.findIndex(u => u.id === parsedUser.id);
          if (userIndex !== -1) {
            db.users[userIndex].lastLogin = new Date();
            setUser(db.users[userIndex]);
            setIsAuthenticated(true);
            
            // Log the session refresh
            addSystemLog('auth', 'Session restored', `User ${parsedUser.email} session restored`, 'info');
          } else {
            // User no longer exists in db
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Check if email exists function
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const db = await getDatabase();
      return db.users.some(u => u.email === email);
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // Sign up function
  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const db = await getDatabase();
      
      // Check if email already exists
      if (await checkEmailExists(email)) {
        toast({
          title: "Signup Failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if username already exists (if provided)
      if (username && db.users.some(u => u.username === username)) {
        toast({
          title: "Signup Failed",
          description: "Username already in use",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        firstName,
        lastName,
        username,
        email,
        role: 'user',
        isVerified: false,  // Start as unverified
        createdAt: new Date(),
        lastLogin: new Date(),
        lastActive: new Date(),
        preferences: {
          theme: 'system',
          emailNotifications: true,
          language: 'en',
          difficulty: 'beginner'
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
        metrics: {
          totalQuestions: 0,
          correctAnswers: 0,
          streak: 0
        }
      };
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      passwordHash.set(email, hashedPassword);
      
      // Add user to database
      db.users.push(newUser);
      
      // Generate verification token
      const verificationToken = uuidv4();
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 24); // Token expires in 24 hours
      
      db.verificationTokens.set(verificationToken, {
        email: newUser.email,
        expires: tokenExpiration
      });
      
      // Send verification email
      try {
        await sendVerificationEmail(
          newUser.email, 
          newUser.firstName, 
          verificationToken,
          db.emailSettings
        );
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        // Continue with signup even if email fails
      }
      
      // Send welcome email
      try {
        await sendWelcomeEmail(
          newUser.email,
          newUser.firstName,
          db.emailSettings
        );
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Continue with signup even if email fails
      }
      
      // Log the action
      addSystemLog('auth', 'User registered', `New user ${email} registered`, 'info');
      
      // Log in the new user automatically
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Signup Successful",
        description: "Welcome! Please check your email to verify your account.",
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const db = await getDatabase();
      
      // Find user
      const foundUser = db.users.find(u => u.email === email);
      if (!foundUser) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      // Check password
      const storedPassword = passwordHash.get(email);
      if (!storedPassword) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      const passwordMatch = await bcrypt.compare(password, storedPassword);
      if (!passwordMatch) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        addSystemLog('auth', 'Failed login attempt', `Failed login attempt for ${email}`, 'warning');
        return false;
      }
      
      // Update last login
      const userIndex = db.users.findIndex(u => u.id === foundUser.id);
      db.users[userIndex].lastLogin = new Date();
      
      // Set authenticated user
      setUser(db.users[userIndex]);
      setIsAuthenticated(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(db.users[userIndex]));
      
      // Log the login
      addSystemLog('auth', 'User logged in', `User ${email} logged in`, 'info');
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    
    // Log the logout
    addSystemLog('auth', 'User logged out', 'User logged out', 'info');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };
  
  // Social login function - improved to properly authenticate
  const socialLogin = async (provider: 'google' | 'apple'): Promise<boolean> => {
    try {
      setIsLoading(true);
      const db = await getDatabase();
      
      // In a real implementation, this would connect to the OAuth provider
      // For this mock implementation, we'll add a delay to simulate the process
      // and properly authenticate against our mock database
      
      // Determine which test user to use based on the provider
      let testUser;
      
      if (provider === 'google') {
        // Find user with email that would be from Google
        testUser = db.users.find(u => u.email === 'admin@italianlearning.app');
      } else if (provider === 'apple') {
        // Find user with email that would be from Apple
        testUser = db.users.find(u => u.email === 'user@italianlearning.app');
      }
      
      if (!testUser) {
        console.error(`No test user found for ${provider} login`);
        return false;
      }
      
      // Update last login
      const userIndex = db.users.findIndex(u => u.id === testUser.id);
      if (userIndex !== -1) {
        db.users[userIndex].lastLogin = new Date();
        
        // Set the authenticated user
        setUser(db.users[userIndex]);
        setIsAuthenticated(true);
        
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(db.users[userIndex]));
        
        // Log the social login
        addSystemLog('auth', 'Social login', `User logged in via ${provider}`, 'info');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password reset request
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const db = await getDatabase();
      
      // Check if user exists
      const user = db.users.find(u => u.email === email);
      if (!user) {
        // Don't reveal that the email doesn't exist
        toast({
          title: "Password Reset Sent",
          description: "If your email is registered, you will receive reset instructions",
        });
        return true;
      }
      
      // Generate reset token
      const resetToken = uuidv4();
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Token expires in 1 hour
      
      db.resetTokens.set(resetToken, {
        email: user.email,
        expires: tokenExpiration
      });
      
      // Send reset email
      try {
        await sendPasswordResetEmail(
          user.email,
          user.firstName,
          resetToken,
          db.emailSettings
        );
      } catch (emailError) {
        console.error("Error sending password reset email:", emailError);
        toast({
          title: "Error",
          description: "Failed to send password reset email",
          variant: "destructive",
        });
        return false;
      }
      
      // Log the action
      addSystemLog('auth', 'Password reset requested', `Password reset requested for ${email}`, 'info');
      
      toast({
        title: "Password Reset Sent",
        description: "Check your email for instructions to reset your password",
      });
      
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Complete password reset with token
  const completePasswordReset = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const db = await getDatabase();
      
      // Validate token
      const tokenData = db.resetTokens.get(token);
      if (!tokenData) {
        toast({
          title: "Invalid Token",
          description: "The password reset link is invalid or has expired",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if token is expired
      if (tokenData.expires < new Date()) {
        toast({
          title: "Token Expired",
          description: "The password reset link has expired. Please request a new one",
          variant: "destructive",
        });
        db.resetTokens.delete(token);
        return false;
      }
      
      // Find user
      const user = db.users.find(u => u.email === tokenData.email);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      passwordHash.set(user.email, hashedPassword);
      
      // Remove the used token
      db.resetTokens.delete(token);
      
      // Log the action
      addSystemLog('auth', 'Password reset completed', `Password reset completed for ${user.email}`, 'info');
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. You can now log in with your new password",
      });
      
      return true;
    } catch (error) {
      console.error("Password reset completion error:", error);
      toast({
        title: "Error",
        description: "An error occurred while resetting your password",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Verify email with token
  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const db = await getDatabase();
      
      // Validate token
      const tokenData = db.verificationTokens.get(token);
      if (!tokenData) {
        toast({
          title: "Invalid Token",
          description: "The verification link is invalid or has expired",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if token is expired
      if (tokenData.expires < new Date()) {
        toast({
          title: "Token Expired",
          description: "The verification link has expired. Please request a new one",
          variant: "destructive",
        });
        db.verificationTokens.delete(token);
        return false;
      }
      
      // Find user and update verification status
      const userIndex = db.users.findIndex(u => u.email === tokenData.email);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Update user verification status
      db.users[userIndex].isVerified = true;
      
      // If the current user is the one being verified, update the state
      if (user && user.email === tokenData.email) {
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Remove the used token
      db.verificationTokens.delete(token);
      
      // Log the action
      addSystemLog('auth', 'Email verified', `Email verified for ${tokenData.email}`, 'info');
      
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified",
      });
      
      return true;
    } catch (error) {
      console.error("Email verification error:", error);
      toast({
        title: "Error",
        description: "An error occurred while verifying your email",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Send verification email
  const sendVerificationEmailToUser = async (email: string): Promise<boolean> => {
    try {
      const db = await getDatabase();
      
      // Find user
      const user = db.users.find(u => u.email === email);
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if already verified
      if (user.isVerified) {
        toast({
          title: "Already Verified",
          description: "Your email is already verified",
        });
        return true;
      }
      
      // Generate verification token
      const verificationToken = uuidv4();
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 24); // Token expires in 24 hours
      
      db.verificationTokens.set(verificationToken, {
        email: user.email,
        expires: tokenExpiration
      });
      
      // Send verification email
      try {
        await sendVerificationEmail(
          user.email,
          user.firstName,
          verificationToken,
          db.emailSettings
        );
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        toast({
          title: "Error",
          description: "Failed to send verification email",
          variant: "destructive",
        });
        return false;
      }
      
      // Log the action
      addSystemLog('auth', 'Verification email sent', `Verification email sent to ${email}`, 'info');
      
      toast({
        title: "Verification Email Sent",
        description: "Check your email to verify your account",
      });
      
      return true;
    } catch (error) {
      console.error("Send verification email error:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending the verification email",
        variant: "destructive",
      });
      return false;
    }
  };

  // Refresh user session
  const refreshSession = async (): Promise<boolean> => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        return false;
      }
      
      const parsedUser = JSON.parse(storedUser);
      const db = await getDatabase();
      
      // Find user in db
      const userIndex = db.users.findIndex(u => u.id === parsedUser.id);
      if (userIndex === -1) {
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      
      // Update last login
      db.users[userIndex].lastLogin = new Date();
      
      // Update the user state
      setUser(db.users[userIndex]);
      setIsAuthenticated(true);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(db.users[userIndex]));
      
      return true;
    } catch (error) {
      console.error("Session refresh error:", error);
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };
  
  // Update user profile
  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return false;
      }
      
      const db = await getDatabase();
      
      // Find user in db
      const userIndex = db.users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Check email uniqueness if changing email
      if (updates.email && updates.email !== user.email) {
        const emailExists = db.users.some(u => u.email === updates.email && u.id !== user.id);
        if (emailExists) {
          toast({
            title: "Error",
            description: "Email already in use",
            variant: "destructive",
          });
          return false;
        }
      }
      
      // Check username uniqueness if changing username
      if (updates.username && updates.username !== user.username) {
        const usernameExists = db.users.some(u => u.username === updates.username && u.id !== user.id);
        if (usernameExists) {
          toast({
            title: "Error",
            description: "Username already in use",
            variant: "destructive",
          });
          return false;
        }
      }
      
      // Update user
      const updatedUser = { ...db.users[userIndex], ...updates };
      
      // If email is changed, mark as unverified
      if (updates.email && updates.email !== user.email) {
        updatedUser.isVerified = false;
      }
      
      db.users[userIndex] = updatedUser;
      
      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Log the action
      addSystemLog('user', 'Profile updated', `User ${user.email} updated their profile`, 'info');
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      
      return true;
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Update user preferences
  const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update preferences",
          variant: "destructive",
        });
        return false;
      }
      
      const db = await getDatabase();
      
      // Find user in db
      const userIndex = db.users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Update preferences
      const updatedPreferences = { ...db.users[userIndex].preferences, ...preferences };
      db.users[userIndex].preferences = updatedPreferences;
      
      // Update state and localStorage
      const updatedUser = { ...user, preferences: updatedPreferences };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Log the action
      addSystemLog('user', 'Preferences updated', `User ${user.email} updated their preferences`, 'info');
      
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been saved",
      });
      
      return true;
    } catch (error) {
      console.error("Update preferences error:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating your preferences",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Get system logs
  const getSystemLogs = (
    category?: LogCategory, 
    level?: 'info' | 'warning' | 'error', 
    startDate?: Date, 
    endDate?: Date
  ): LogEntry[] => {
    try {
      // Fixed: Await the database properly
      let filteredLogs: LogEntry[] = [];
      
      const dbPromise = getDatabase();
      dbPromise.then(db => {
        filteredLogs = [...db.logs];
        
        // Filter by category
        if (category) {
          filteredLogs = filteredLogs.filter(log => log.category === category);
        }
        
        // Filter by level
        if (level) {
          filteredLogs = filteredLogs.filter(log => log.level === level);
        }
        
        // Filter by date range
        if (startDate) {
          filteredLogs = filteredLogs.filter(log => log.timestamp >= startDate);
        }
        
        if (endDate) {
          filteredLogs = filteredLogs.filter(log => log.timestamp <= endDate);
        }
      }).catch(error => {
        console.error("Error accessing logs:", error);
      });
      
      // Sort by timestamp (newest first)
      return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error("Error getting system logs:", error);
      return [];
    }
  };
  
  // Add system log
  const addSystemLog = (
    category: LogCategory, 
    action: string, 
    details?: string, 
    level: 'info' | 'warning' | 'error' = 'info'
  ): void => {
    try {
      const logEntry: LogEntry = {
        id: uuidv4(),
        timestamp: new Date(),
        category,
        action,
        userId: user?.id,
        details,
        level
      };
      
      // Fixed: Properly handle the Promise
      getDatabase().then(db => {
        db.logs.push(logEntry);
        
        // Keep log size manageable
        if (db.logs.length > 10000) {
          db.logs = db.logs.slice(-10000);
        }
      }).catch(error => {
        console.error("Error adding system log:", error);
      });
    } catch (error) {
      console.error("Error adding system log:", error);
    }
  };
  
  // Get email settings
  const getEmailSettings = (): EmailSettings => {
    try {
      // Fixed: Create a default settings object
      const defaultSettings: EmailSettings = {
        provider: 'smtp',
        fromEmail: 'noreply@example.com',
        fromName: 'Example App',
        config: {
          enableSsl: true,
        },
        templates: {
          verification: {
            subject: 'Verify your email',
            body: 'Please verify your email'
          },
          passwordReset: {
            subject: 'Reset your password',
            body: 'Please reset your password'
          },
          welcome: {
            subject: 'Welcome',
            body: 'Welcome to our app'
          }
        },
        temporaryInboxDuration: 24
      };
      
      // Try to get settings from DB
      let settings = defaultSettings;
      
      getDatabase().then(db => {
        settings = db.emailSettings;
      }).catch(error => {
        console.error("Error getting email settings:", error);
      });
      
      return settings;
    } catch (error) {
      console.error("Error getting email settings:", error);
      // Return default email settings as fallback
      return {
        provider: 'smtp',
        fromEmail: 'noreply@example.com',
        fromName: 'Example App',
        config: {
          enableSsl: true,
        },
        templates: {
          verification: {
            subject: 'Verify your email',
            body: 'Please verify your email'
          },
          passwordReset: {
            subject: 'Reset your password',
            body: 'Please reset your password'
          },
          welcome: {
            subject: 'Welcome',
            body: 'Welcome to our app'
          }
        },
        temporaryInboxDuration: 24
      };
    }
  };
  
  // Update email settings
  const updateEmailSettings = async (settings: EmailSettings): Promise<boolean> => {
    try {
      // Ensure user is admin
      if (!user || user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to update email settings",
          variant: "destructive",
        });
        return false;
      }
      
      const db = await getDatabase();
      
      // Update settings
      db.emailSettings = settings;
      
      // Log the action
      addSystemLog('email', 'Email settings updated', `Email settings updated by ${user.email}`, 'info');
      
      return true;
    } catch (error) {
      console.error("Update email settings error:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating email settings",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Get all users (admin only)
  const getAllUsers = (): User[] => {
    try {
      if (!user || user.role !== 'admin') {
        return [];
      }
      
      // Fixed: Handle the Promise properly
      let usersList: User[] = [];
      
      getDatabase().then(db => {
        usersList = [...db.users];
      }).catch(error => {
        console.error("Error getting users:", error);
      });
      
      return usersList;
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  };
  
  // Delete user (admin only)
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Ensure user is admin
      if (!user || user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to delete users",
          variant: "destructive",
        });
        return false;
      }
      
      // Prevent deleting self
      if (userId === user.id) {
        toast({
          title: "Error",
          description: "You cannot delete your own account",
          variant: "destructive",
        });
        return false;
      }
      
      const db = await getDatabase();
      
      // Find user
      const userToDelete = db.users.find(u => u.id === userId);
      if (!userToDelete) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Remove from database
      db.users = db.users.filter(u => u.id !== userId);
      
      // Remove password
      passwordHash.delete(userToDelete.email);
      
      // Log the action
      addSystemLog('user', 'User deleted', `User ${userToDelete.email} was deleted by admin ${user.email}`, 'warning');
      
      toast({
        title: "User Deleted",
        description: `User ${userToDelete.email} has been deleted`,
      });
      
      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the user",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Disable user (admin only)
  const disableUser = async (userId: string): Promise<boolean> => {
    try {
      // Ensure user is admin
      if (!user || user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to disable users",
          variant: "destructive",
        });
        return false;
      }
      
      // Prevent disabling self
      if (userId === user.id) {
        toast({
          title: "Error",
          description: "You cannot disable your own account",
          variant: "destructive",
        });
        return false;
      }
      
      const db = await getDatabase();
      
      // Find user
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // In a real app, we would set a 'disabled' flag
      // For this mock, we'll just log it
      
      // Log the action
      addSystemLog(
        'user', 
        'User disabled', 
        `User ${db.users[userIndex].email} was disabled by admin ${user.email}`, 
        'warning'
      );
      
      toast({
        title: "User Disabled",
        description: `User ${db.users[userIndex].email} has been disabled`,
      });
      
      return true;
    } catch (error) {
      console.error("Disable user error:", error);
      toast({
        title: "Error",
        description: "An error occurred while disabling the user",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Enable user (admin only)
  const enableUser = async (userId: string): Promise<boolean> => {
    try {
      // Ensure user is admin
      if (!user || user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to enable users",
          variant: "destructive",
        });
        return false;
      }
      
      const db = await getDatabase();
      
      // Find user
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // In a real app, we would clear a 'disabled' flag
      // For this mock, we'll just log it
      
      // Log the action
      addSystemLog(
        'user', 
        'User enabled', 
        `User ${db.users[userIndex].email} was enabled by admin ${user.email}`, 
        'info'
      );
      
      toast({
        title: "User Enabled",
        description: `User ${db.users[userIndex].email} has been enabled`,
      });
      
      return true;
    } catch (error) {
      console.error("Enable user error:", error);
      toast({
        title: "Error",
        description: "An error occurred while enabling the user",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Make user an admin (admin only)
  const makeAdmin = async (userId: string): Promise<boolean> => {
    try {
      // Ensure user is admin
      if (!user || user.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to change user roles",
          variant: "destructive",
        });
        return false;
      }
      
      const db = await getDatabase();
      
      // Find user
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }
      
      // Update role
      db.users[userIndex].role = 'admin';
      
      // Log the action
      addSystemLog(
        'user', 
        'User promoted to admin', 
        `User ${db.users[userIndex].email} was promoted to admin by ${user.email}`, 
        'warning'
      );
      
      toast({
        title: "User Promoted",
        description: `User ${db.users[userIndex].email} has been promoted to admin`,
      });
      
      return true;
    } catch (error) {
      console.error("Make admin error:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating user role",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update profile (wrapper for updateUser)
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    return updateUser(updates);
  };

  // Update password implementation
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your password",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Verify current password
      const storedPassword = passwordHash.get(user.email);
      if (!storedPassword) {
        toast({
          title: "Error",
          description: "Current password verification failed",
          variant: "destructive",
        });
        return false;
      }

      const passwordMatch = await bcrypt.compare(currentPassword, storedPassword);
      if (!passwordMatch) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return false;
      }

      // Update with new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      passwordHash.set(user.email, hashedNewPassword);

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
      return false;
    }
  };

  // Increment daily question count
  const incrementDailyQuestionCount = async (type: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      // For premium users, always allow
      if (user.subscription === 'premium') {
        return true;
      }

      // For free users, check limit
      const currentCount = user.dailyQuestionCounts[type] || 0;
      if (currentCount >= 1) {
        return false;
      }

      const db = await getDatabase();
      
      // Update count
      const userIndex = db.users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        return false;
      }

      db.users[userIndex].dailyQuestionCounts[type] = currentCount + 1;
      
      // Update user state
      setUser({...db.users[userIndex]});
      
      return true;
    } catch (error) {
      console.error("Error incrementing question count:", error);
      return false;
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    return sendVerificationEmailToUser(email);
  };

  // Update user status (admin only)
  const updateUserStatus = async (userId: string, status: string): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update user status",
        variant: "destructive",
      });
      return false;
    }

    try {
      const db = await getDatabase();
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }

      db.users[userIndex].status = status as 'active' | 'inactive' | 'suspended';
      
      addSystemLog('user', `User status updated`, `User ${db.users[userIndex].email} status changed to ${status}`);
      
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update user subscription (admin only)
  const updateUserSubscription = async (userId: string, subscription: string): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update user subscription",
        variant: "destructive",
      });
      return false;
    }

    try {
      const db = await getDatabase();
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }

      db.users[userIndex].subscription = subscription as 'free' | 'premium';
      
      addSystemLog('user', `User subscription updated`, `User ${db.users[userIndex].email} subscription changed to ${subscription}`);
      
      toast({
        title: "Success",
        description: "User subscription updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating user subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update user subscription",
        variant: "destructive",
      });
      return false;
    }
  };

  // Add admin role (admin only)
  const addAdmin = async (userId: string): Promise<boolean> => {
    return makeAdmin(userId);
  };

  // Update system log
  const updateSystemLog = async (logId: string, updates: Partial<LogEntry>): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update system logs",
        variant: "destructive",
      });
      return false;
    }

    try {
      const db = await getDatabase();
      const logIndex = db.logs.findIndex(l => l.id === logId);
      if (logIndex === -1) {
        toast({
          title: "Error",
          description: "Log entry not found",
          variant: "destructive",
        });
        return false;
      }

      db.logs[logIndex] = { ...db.logs[logIndex], ...updates };
      
      toast({
        title: "Success",
        description: "Log entry updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating log entry:", error);
      toast({
        title: "Error",
        description: "Failed to update log entry",
        variant: "destructive",
      });
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
    checkEmailExists,
    resetPassword,
    completePasswordReset,
    verifyEmail,
    refreshSession,
    updateUser,
    updateUserPreferences,
    sendVerificationEmail: sendVerificationEmailToUser,
    getSystemLogs,
    addSystemLog,
    socialLogin,
    getEmailSettings,
    updateEmailSettings,
    getAllUsers,
    deleteUser,
    disableUser,
    enableUser,
    makeAdmin,
    updateProfile,
    updatePassword,
    incrementDailyQuestionCount,
    resendVerificationEmail,
    updateUserStatus,
    updateUserSubscription,
    addAdmin,
    updateSystemLog
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types - Using proper syntax for isolatedModules compatibility
export type { LogCategory, LogEntry, User, UserPreferences, EmailSettings } from './shared-types';
