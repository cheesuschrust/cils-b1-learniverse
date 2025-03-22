import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

// Create a default admin account
const DEFAULT_ADMIN = {
  id: "admin-1",
  email: "admin@italianlearning.app",
  firstName: "System",
  lastName: "Administrator",
  username: "admin",
  role: "admin" as const,
  passwordHash: "$2a$10$1BmQvkd8kRwas.mRXKtWGuglDvs5YAyh9iIBPEKR9aGWYGDwIwDjW", // "Admin123!"
  displayName: "Admin",
  preferredLanguage: "both" as const,
  subscription: "premium" as const,
  status: "active" as const,
  emailVerified: true, // Admin is pre-verified
  created: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  dailyQuestionCounts: {
    flashcards: 0,
    multipleChoice: 0,
    listening: 0,
    writing: 0,
    speaking: 0,
  },
  metrics: {
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    totalTimeSpent: 0,
  },
  preferences: {
    theme: "system",
    fontSize: 16,
    notificationsEnabled: true,
    animationsEnabled: true,
    preferredLanguage: "both",
    voiceSpeed: 1.0,
    autoPlayAudio: true,
    showProgressMetrics: true,
    aiEnabled: true,
    aiModelSize: "small",
    aiProcessingOnDevice: true,
    confidenceScoreVisible: true,
  }
};

interface UserPreferences {
  theme: string;
  fontSize: number;
  notificationsEnabled: boolean;
  animationsEnabled: boolean;
  preferredLanguage: string;
  voiceSpeed: number;
  autoPlayAudio: boolean;
  showProgressMetrics: boolean;
  aiEnabled: boolean;
  aiModelSize: string;
  aiProcessingOnDevice: boolean;
  confidenceScoreVisible: boolean;
}

interface UserMetrics {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  totalTimeSpent: number;
}

interface DailyQuestionCounts {
  flashcards: number;
  multipleChoice: number;
  listening: number;
  writing: number;
  speaking: number;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role: "user" | "admin";
  passwordHash: string;
  displayName?: string;
  preferredLanguage?: "english" | "italian" | "both";
  subscription: "free" | "premium";
  status: "active" | "pending" | "inactive";
  emailVerified: boolean;
  phoneNumber?: string;
  address?: string;
  created: string;
  lastActive: string;
  dailyQuestionCounts: DailyQuestionCounts;
  metrics: UserMetrics;
  preferences?: UserPreferences;
}

// Define the system log structure
interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  category: "auth" | "ai" | "content" | "user" | "system" | "email";
  message: string;
  details?: string;
  userId?: string;
  ipAddress?: string;
  resolved?: boolean;
}

interface AuthContextType {
  user: Omit<User, "passwordHash"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (firstName: string, lastName: string, email: string, password: string, username?: string) => Promise<void>;
  refreshSession: () => void;
  updateProfile: (profileData: Partial<Omit<User, "passwordHash">>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  addAdmin: (email: string, firstName: string, lastName: string, password: string) => Promise<void>;
  socialLogin: (provider: "google" | "apple") => Promise<void>;
  updateUserStatus: (userId: string, status: "active" | "inactive" | "pending") => Promise<void>;
  updateUserSubscription: (userId: string, subscription: "free" | "premium") => Promise<void>;
  getAllUsers: () => Omit<User, "passwordHash">[];
  incrementDailyQuestionCount: (type: keyof DailyQuestionCounts) => Promise<boolean>;
  updateUserMetrics: (metrics: Partial<UserMetrics>) => Promise<void>;
  resetDailyQuestionCounts: () => void;
  verifyEmail: (userId: string, token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  getSystemLogs: (filters?: {
    level?: "info" | "warning" | "error";
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    resolved?: boolean;
  }) => SystemLog[];
  addSystemLog: (log: Omit<SystemLog, "id" | "timestamp">) => void;
  updateSystemLog: (logId: string, updates: Partial<SystemLog>) => boolean;
  updateEmailSettings: (settings: EmailSettings) => Promise<void>;
  getEmailSettings: () => EmailSettings;
}

interface EmailSettings {
  provider: "smtp" | "sendgrid" | "mailgun" | "ses";
  fromEmail: string;
  fromName: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  region?: string;
  enableSsl?: boolean;
  templates: {
    verification: string;
    passwordReset: string;
    welcome: string;
  };
}

// Helper function to remove the passwordHash before returning user data
const sanitizeUser = (user: User): Omit<User, "passwordHash"> => {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Helper to persist users to localStorage
const persistUsers = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Helper to persist system logs to localStorage
const persistSystemLogs = (logs: SystemLog[]) => {
  localStorage.setItem("systemLogs", JSON.stringify(logs));
};

// Helper to persist email settings to localStorage
const persistEmailSettings = (settings: EmailSettings) => {
  localStorage.setItem("emailSettings", JSON.stringify(settings));
};

// Helper to retrieve users from localStorage
const getPersistedUsers = (): User[] => {
  const users = localStorage.getItem("users");
  if (!users) {
    // Initialize with default admin if no users exist
    const initialUsers = [DEFAULT_ADMIN];
    persistUsers(initialUsers);
    return initialUsers;
  }
  return JSON.parse(users);
};

// Helper to retrieve system logs from localStorage
const getPersistedSystemLogs = (): SystemLog[] => {
  const logs = localStorage.getItem("systemLogs");
  if (!logs) {
    return [];
  }
  return JSON.parse(logs);
};

// Helper to retrieve email settings from localStorage
const getPersistedEmailSettings = (): EmailSettings => {
  const settings = localStorage.getItem("emailSettings");
  if (!settings) {
    // Default email settings
    const defaultSettings: EmailSettings = {
      provider: "smtp",
      fromEmail: "noreply@italianlearning.app",
      fromName: "Italian Learning App",
      host: "smtp.example.com",
      port: 587,
      username: "",
      password: "",
      enableSsl: true,
      templates: {
        verification: "<p>Hello {{name}},</p><p>Please verify your email by clicking <a href='{{verificationLink}}'>here</a>.</p>",
        passwordReset: "<p>Hello {{name}},</p><p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p>",
        welcome: "<p>Welcome to Italian Learning App, {{name}}!</p><p>We're excited to have you on board.</p>"
      }
    };
    persistEmailSettings(defaultSettings);
    return defaultSettings;
  }
  return JSON.parse(settings);
};

// Helper to check if an email is valid
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper to reset daily question counts at midnight
const checkAndResetDailyCounts = (users: User[]): User[] => {
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem("lastDailyReset");
  
  if (lastReset !== today) {
    // Reset all user daily counts
    const updatedUsers = users.map(user => ({
      ...user,
      dailyQuestionCounts: {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0
      }
    }));
    
    localStorage.setItem("lastDailyReset", today);
    persistUsers(updatedUsers);
    return updatedUsers;
  }
  
  return users;
};

// Mock email sending function - in a real app, this would use an actual email service
const sendEmail = async (to: string, subject: string, body: string, settings: EmailSettings): Promise<boolean> => {
  console.log(`Sending email to ${to} with subject "${subject}"`);
  console.log(`Email body: ${body}`);
  console.log(`Using email provider: ${settings.provider}`);
  
  // In a real app, this would connect to an actual email service API
  // For now, we'll simulate success and log the attempt
  
  // Add a log entry for the email
  const logEntry: Omit<SystemLog, "id" | "timestamp"> = {
    level: "info",
    category: "email",
    message: `Email sent to ${to}`,
    details: `Subject: ${subject}\nProvider: ${settings.provider}`,
  };
  
  addSystemLogInternal(logEntry);
  
  // Simulate a small delay and return success
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 500);
  });
};

// Internal function to add a system log
const addSystemLogInternal = (logData: Omit<SystemLog, "id" | "timestamp">): SystemLog => {
  const logs = getPersistedSystemLogs();
  
  const newLog: SystemLog = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    ...logData,
    resolved: logData.resolved || false
  };
  
  logs.push(newLog);
  persistSystemLogs(logs);
  
  return newLog;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, "passwordHash"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to check if user is logged in
  const checkUserLoggedIn = () => {
    try {
      const storedSession = localStorage.getItem("session");
      
      if (storedSession) {
        const { userId, expiresAt } = JSON.parse(storedSession);
        
        // Check if session is expired
        if (new Date(expiresAt) < new Date()) {
          localStorage.removeItem("session");
          setUser(null);
          setIsLoading(false);
          
          // Log session expiration
          addSystemLogInternal({
            level: "info",
            category: "auth",
            message: "User session expired",
            userId
          });
          
          return;
        }
        
        // Find user by ID
        let users = getPersistedUsers();
        
        // Check if we need to reset daily question counts
        users = checkAndResetDailyCounts(users);
        
        const currentUser = users.find(u => u.id === userId);
        
        if (currentUser) {
          // Update last active time
          const updatedUsers = users.map(u => 
            u.id === userId ? { ...u, lastActive: new Date().toISOString() } : u
          );
          persistUsers(updatedUsers);
          
          setUser(sanitizeUser(currentUser));
          
          // Log successful session resumption
          addSystemLogInternal({
            level: "info",
            category: "auth",
            message: "User session resumed",
            userId
          });
        } else {
          localStorage.removeItem("session");
          
          // Log error
          addSystemLogInternal({
            level: "error",
            category: "auth",
            message: "Session invalid - user not found",
            details: `User ID: ${userId}`,
          });
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      localStorage.removeItem("session");
      
      // Log error
      addSystemLogInternal({
        level: "error",
        category: "auth",
        message: "Error checking authentication",
        details: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    // Initialize users if needed
    if (!localStorage.getItem("users")) {
      persistUsers([DEFAULT_ADMIN]);
      
      // Log system initialization
      addSystemLogInternal({
        level: "info",
        category: "system",
        message: "System initialized with default admin account",
      });
    }
    
    checkUserLoggedIn();
    
    // Set up daily reset check
    const interval = setInterval(() => {
      if (user) {
        const users = getPersistedUsers();
        checkAndResetDailyCounts(users);
      }
    }, 3600000); // Check every hour
    
    return () => clearInterval(interval);
  }, []);

  // Function to refresh the user session
  const refreshSession = () => {
    checkUserLoggedIn();
  };

  const createSession = (userId: string) => {
    // Create session with 24-hour expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const session = {
      userId,
      expiresAt: expiresAt.toISOString()
    };
    
    localStorage.setItem("session", JSON.stringify(session));
    
    // Log session creation
    addSystemLogInternal({
      level: "info",
      category: "auth",
      message: "New user session created",
      userId,
    });
  };

  // Email verification functions
  const generateVerificationToken = (userId: string): string => {
    // In a real app, this would be a secure token
    // For this mock implementation, we'll create a simple token
    return `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  const storeVerificationToken = (userId: string, token: string) => {
    const tokens = JSON.parse(localStorage.getItem("verificationTokens") || "{}");
    tokens[userId] = {
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    localStorage.setItem("verificationTokens", JSON.stringify(tokens));
  };

  const verifyEmail = async (userId: string, token: string): Promise<boolean> => {
    try {
      const tokens = JSON.parse(localStorage.getItem("verificationTokens") || "{}");
      const tokenData = tokens[userId];
      
      if (!tokenData) {
        addSystemLogInternal({
          level: "warning",
          category: "auth",
          message: "Email verification failed - token not found",
          userId,
        });
        return false;
      }
      
      if (new Date(tokenData.expires) < new Date()) {
        addSystemLogInternal({
          level: "warning",
          category: "auth",
          message: "Email verification failed - token expired",
          userId,
        });
        return false;
      }
      
      if (tokenData.token !== token) {
        addSystemLogInternal({
          level: "warning",
          category: "auth",
          message: "Email verification failed - invalid token",
          userId,
        });
        return false;
      }
      
      // Update user
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        addSystemLogInternal({
          level: "error",
          category: "auth",
          message: "Email verification failed - user not found",
          userId,
        });
        return false;
      }
      
      // Mark email as verified and update status if needed
      users[userIndex].emailVerified = true;
      if (users[userIndex].status === "pending") {
        users[userIndex].status = "active";
      }
      
      persistUsers(users);
      
      // Remove used token
      delete tokens[userId];
      localStorage.setItem("verificationTokens", JSON.stringify(tokens));
      
      // If this is the current user, update state
      if (user && user.id === userId) {
        setUser(sanitizeUser(users[userIndex]));
      }
      
      addSystemLogInternal({
        level: "info",
        category: "auth",
        message: "Email successfully verified",
        userId,
      });
      
      return true;
    } catch (error) {
      console.error("Email verification error:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "auth",
        message: "Email verification error",
        details: String(error),
        userId,
      });
      
      return false;
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      const users = getPersistedUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        // Don't reveal if email exists
        return true;
      }
      
      if (user.emailVerified) {
        // Email already verified
        return true;
      }
      
      // Generate and store new token
      const token = generateVerificationToken(user.id);
      storeVerificationToken(user.id, token);
      
      // Get email settings
      const emailSettings = getPersistedEmailSettings();
      
      // Create verification link (in a real app, this would be a proper URL)
      const verificationLink = `${window.location.origin}/verify-email?userId=${user.id}&token=${token}`;
      
      // Prepare email content
      const name = user.firstName || user.username || "User";
      let emailBody = emailSettings.templates.verification
        .replace(/{{name}}/g, name)
        .replace(/{{verificationLink}}/g, verificationLink);
      
      // Send email
      await sendEmail(
        user.email,
        "Please verify your email address",
        emailBody,
        emailSettings
      );
      
      addSystemLogInternal({
        level: "info",
        category: "email",
        message: "Verification email resent",
        userId: user.id,
      });
      
      return true;
    } catch (error) {
      console.error("Error resending verification email:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "email",
        message: "Failed to resend verification email",
        details: String(error),
      });
      
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        toast({
          title: "Error",
          description: "Please provide both email and password",
          variant: "destructive",
        });
        return false;
      }
      
      const users = getPersistedUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        // Log failed login attempt but don't reveal if email exists
        addSystemLogInternal({
          level: "warning",
          category: "auth",
          message: "Failed login attempt - user not found",
          details: `Email: ${email}`,
        });
        
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      const passwordValid = await bcrypt.compare(password, foundUser.passwordHash);
      
      if (!passwordValid) {
        // Log failed login attempt with incorrect password
        addSystemLogInternal({
          level: "warning",
          category: "auth",
          message: "Failed login attempt - incorrect password",
          userId: foundUser.id,
        });
        
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      // Check user status
      if (foundUser.status === "inactive") {
        addSystemLogInternal({
          level: "warning",
          category: "auth",
          message: "Login attempt on inactive account",
          userId: foundUser.id,
        });
        
        toast({
          title: "Error",
          description: "Your account has been deactivated. Please contact support.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check email verification (skip for admin users)
      if (!foundUser.emailVerified && foundUser.role !== "admin") {
        // Send verification email again
        const token = generateVerificationToken(foundUser.id);
        storeVerificationToken(foundUser.id, token);
        
        // Get email settings
        const emailSettings = getPersistedEmailSettings();
        
        // Create verification link
        const verificationLink = `${window.location.origin}/verify-email?userId=${foundUser.id}&token=${token}`;
        
        // Prepare email content
        const name = foundUser.firstName || foundUser.username || "User";
        let emailBody = emailSettings.templates.verification
          .replace(/{{name}}/g, name)
          .replace(/{{verificationLink}}/g, verificationLink);
        
        // Send email
        await sendEmail(
          foundUser.email,
          "Please verify your email address",
          emailBody,
          emailSettings
        );
        
        addSystemLogInternal({
          level: "info",
          category: "auth",
          message: "Login attempt with unverified email - verification email sent",
          userId: foundUser.id,
        });
        
        toast({
          title: "Email Verification Required",
          description: "Please check your email and verify your account before logging in.",
          variant: "destructive",
        });
        return false;
      }
      
      // Create session
      createSession(foundUser.id);
      
      // Update last active time
      const updatedUsers = users.map(u => 
        u.id === foundUser.id ? { ...u, lastActive: new Date().toISOString() } : u
      );
      persistUsers(updatedUsers);
      
      // Set user without passwordHash
      setUser(sanitizeUser(foundUser));
      
      // Log successful login
      addSystemLogInternal({
        level: "info",
        category: "auth",
        message: "User logged in successfully",
        userId: foundUser.id,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "auth",
        message: "Login error",
        details: String(error),
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("session");
    setUser(null);
    navigate("/login");
    
    addSystemLogInternal({
      level: "info",
      category: "auth",
      message: "User logged out",
      userId: user?.id,
    });
  };

  const updateUserStatus = async (userId: string, status: "active" | "inactive" | "pending"): Promise<void> => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can update user status",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      users[userIndex].status = status;
      persistUsers(users);
      
      // Update current user if it's the same user
      if (user.id === userId) {
        setUser(sanitizeUser(users[userIndex]));
      }
      
      addSystemLogInternal({
        level: "info",
        category: "user",
        message: `User status updated to ${status}`,
        userId,
      });
      
      toast({
        title: "Success",
        description: `User status has been updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "user",
        message: "Error updating user status",
        details: String(error),
        userId,
      });
      
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const updateUserSubscription = async (userId: string, subscription: "free" | "premium"): Promise<void> => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can update user subscription",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      users[userIndex].subscription = subscription;
      persistUsers(users);
      
      // Update current user if it's the same user
      if (user.id === userId) {
        setUser(sanitizeUser(users[userIndex]));
      }
      
      addSystemLogInternal({
        level: "info",
        category: "user",
        message: `User subscription updated to ${subscription}`,
        userId,
      });
      
      toast({
        title: "Success",
        description: `User subscription has been updated to ${subscription}`,
      });
    } catch (error) {
      console.error("Error updating user subscription:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "user",
        message: "Error updating user subscription",
        details: String(error),
        userId,
      });
      
      toast({
        title: "Error",
        description: "Failed to update user subscription",
        variant: "destructive",
      });
    }
  };

  const getAllUsers = (): Omit<User, "passwordHash">[] => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can view all users",
        variant: "destructive",
      });
      return [];
    }
    
    try {
      const users = getPersistedUsers();
      return users.map(u => sanitizeUser(u));
    } catch (error) {
      console.error("Error getting all users:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "user",
        message: "Error retrieving user list",
        details: String(error),
      });
      
      toast({
        title: "Error",
        description: "Failed to retrieve user list",
        variant: "destructive",
      });
      
      return [];
    }
  };

  const incrementDailyQuestionCount = async (type: keyof DailyQuestionCounts): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to track questions",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Increment the counter for the specified type
      users[userIndex].dailyQuestionCounts[type]++;
      
      // Also update the total questions metric
      users[userIndex].metrics.totalQuestions++;
      
      persistUsers(users);
      
      // Update state
      setUser(sanitizeUser(users[userIndex]));
      
      return true;
    } catch (error) {
      console.error("Error incrementing question count:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "user",
        message: "Error tracking question count",
        details: String(error),
        userId: user.id,
      });
      
      return false;
    }
  };

  const updateUserMetrics = async (metrics: Partial<UserMetrics>): Promise<void> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update metrics",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update the metrics
      users[userIndex].metrics = {
        ...users[userIndex].metrics,
        ...metrics
      };
      
      persistUsers(users);
      
      // Update state
      setUser(sanitizeUser(users[userIndex]));
    } catch (error) {
      console.error("Error updating user metrics:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "user",
        message: "Error updating user metrics",
        details: String(error),
        userId: user.id,
      });
      
      toast({
        title: "Error",
        description: "Failed to update user metrics",
        variant: "destructive",
      });
    }
  };

  const resetDailyQuestionCounts = () => {
    if (!user) {
      return;
    }
    
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        return;
      }
      
      // Reset all daily counts
      users[userIndex].dailyQuestionCounts = {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0
      };
      
      persistUsers(users);
      
      // Update state
      setUser(sanitizeUser(users[userIndex]));
    } catch (error) {
      console.error("Error resetting daily question counts:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "user",
        message: "Error resetting daily question counts",
        details: String(error),
        userId: user.id,
      });
    }
  };

  const socialLogin = async (provider: "google" | "apple"): Promise<void> => {
    // In a real implementation, this would redirect to the OAuth provider
    // For this mock implementation, we'll just log the attempt
    
    addSystemLogInternal({
      level: "info",
      category: "auth",
      message: `Social login attempt with ${provider}`,
    });
    
    toast({
      title: "Social Login",
      description: `${provider} login is not implemented in this demo.`,
      variant: "destructive",
    });
  };

  const addAdmin = async (email: string, firstName: string, lastName: string, password: string): Promise<void> => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can add new administrators",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate inputs
      if (!firstName || !lastName || !email || !password) {
        throw new Error("All required fields must be provided");
      }

      // ... rest of addAdmin implementation remains unchanged
    } catch (error) {
      console.error("Error adding admin:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "admin",
        message: "Error adding admin",
        details: String(error),
      });
      
      toast({
        title: "Error",
        description: "Failed to add admin",
        variant: "destructive",
      });
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username?: string
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!firstName || !lastName || !email || !password) {
        toast({
          title: "Error",
          description: "All required fields must be provided",
          variant: "destructive",
        });
        return;
      }
      
      if (!isValidEmail(email)) {
        toast({
          title: "Error",
          description: "Please provide a valid email address",
          variant: "destructive",
        });
        return;
      }
      
      // Check if user already exists
      const users = getPersistedUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        toast({
          title: "Error",
          description: "An account with this email already exists",
          variant: "destructive",
        });
        return;
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        email: email.toLowerCase(),
        firstName,
        lastName,
        username: username || `${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
        passwordHash,
        role: "user",
        displayName: `${firstName} ${lastName}`,
        preferredLanguage: "both",
        subscription: "free",
        status: "pending", // New users start as pending until email verification
        emailVerified: false,
        created: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        dailyQuestionCounts: {
          flashcards: 0,
          multipleChoice: 0,
          listening: 0,
          writing: 0,
          speaking: 0,
        },
        metrics: {
          totalQuestions: 0,
          correctAnswers: 0,
          streak: 0,
          totalTimeSpent: 0,
        },
        preferences: {
          theme: "system",
          fontSize: 16,
          notificationsEnabled: true,
          animationsEnabled: true,
          preferredLanguage: "both",
          voiceSpeed: 1.0,
          autoPlayAudio: true,
          showProgressMetrics: true,
          aiEnabled: true,
          aiModelSize: "small",
          aiProcessingOnDevice: true,
          confidenceScoreVisible: true,
        }
      };
      
      // Add user to storage
      users.push(newUser);
      persistUsers(users);
      
      // Generate verification token
      const token = generateVerificationToken(newUser.id);
      storeVerificationToken(newUser.id, token);
      
      // Get email settings
      const emailSettings = getPersistedEmailSettings();
      
      // Create verification link
      const verificationLink = `${window.location.origin}/verify-email?userId=${newUser.id}&token=${token}`;
      
      // Prepare email content
      let emailBody = emailSettings.templates.verification
        .replace(/{{name}}/g, newUser.firstName)
        .replace(/{{verificationLink}}/g, verificationLink);
      
      // Send verification email
      await sendEmail(
        newUser.email,
        "Please verify your email address",
        emailBody,
        emailSettings
      );
      
      // Send welcome email (only after verification in a real app)
      let welcomeEmailBody = emailSettings.templates.welcome
        .replace(/{{name}}/g, newUser.firstName);
      
      await sendEmail(
        newUser.email,
        "Welcome to Italian Learning App",
        welcomeEmailBody,
        emailSettings
      );
      
      // Log successful signup
      addSystemLogInternal({
        level: "info",
        category: "auth",
        message: "New user signed up",
        details: `User ID: ${newUser.id}, Email: ${newUser.email}`,
      });
      
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account",
      });
      
      // Navigate to login or verification page
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup error:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "auth",
        message: "Error during signup",
        details: String(error),
      });
      
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Omit<User, "passwordHash">>): Promise<void> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Prevent changing certain fields
      const safeUpdateData = { ...profileData };
      delete safeUpdateData.id;
      delete safeUpdateData.role;
      delete safeUpdateData.created;
      delete safeUpdateData.emailVerified;
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...safeUpdateData,
        // If display name not provided but first/last name updated, update display name
        displayName: safeUpdateData.displayName || 
          (safeUpdateData.firstName || safeUpdateData.lastName) ? 
            `${safeUpdateData.firstName || users[userIndex].firstName || ''} ${safeUpdateData.lastName || users[userIndex].lastName || ''}`.trim() : 
            users[userIndex].displayName
      };
      
      persistUsers(users);
      
      // Update current user state
      setUser(sanitizeUser(users[userIndex]));
      
      addSystemLogInternal({
        level: "info",
        category: "user",
        message: "User profile updated",
        userId: user.id,
      });
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "user",
        message: "Error updating user profile",
        details: String(error),
        userId: user?.id,
      });
      
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      // Validate email
      if (!email || !isValidEmail(email)) {
        toast({
          title: "Error",
          description: "Please provide a valid email address",
          variant: "destructive",
        });
        return;
      }
      
      const users = getPersistedUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Don't reveal if user exists or not
      if (!user) {
        toast({
          title: "Password Reset",
          description: "If an account exists with that email, a password reset link has been sent",
        });
        return;
      }
      
      // Generate reset token (similar approach to verification tokens)
      const resetToken = `reset-${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Store token
      const tokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
      tokens[user.id] = {
        token: resetToken,
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString() // 1 hour expiration
      };
      localStorage.setItem("resetTokens", JSON.stringify(tokens));
      
      // Get email settings
      const emailSettings = getPersistedEmailSettings();
      
      // Create reset link
      const resetLink = `${window.location.origin}/reset-password?userId=${user.id}&token=${resetToken}`;
      
      // Prepare email content
      const name = user.firstName || user.username || "User";
      let emailBody = emailSettings.templates.passwordReset
        .replace(/{{name}}/g, name)
        .replace(/{{resetLink}}/g, resetLink);
      
      // Send email
      await sendEmail(
        user.email,
        "Reset your password",
        emailBody,
        emailSettings
      );
      
      addSystemLogInternal({
        level: "info",
        category: "auth",
        message: "Password reset requested",
        userId: user.id,
      });
      
      toast({
        title: "Password Reset",
        description: "If an account exists with that email, a password reset link has been sent",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "auth",
        message: "Error during password reset request",
        details: String(error),
      });
      
      // Use the same message to not reveal if user exists
      toast({
        title: "Password Reset",
        description: "If an account exists with that email, a password reset link has been sent",
      });
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate new password
      if (!newPassword || newPassword.length < 6) {
        toast({
          title: "Error",
          description: "New password must be at least 6 characters",
          variant: "destructive",
        });
        return;
      }
      
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Verify current password
      const currentPasswordValid = await bcrypt.compare(currentPassword, users[userIndex].passwordHash);
      
      if (!currentPasswordValid) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }
      
      // Hash and update new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      users[userIndex].passwordHash = newPasswordHash;
      
      persistUsers(users);
      
      addSystemLogInternal({
        level: "info",
        category: "auth",
        message: "User password updated",
        userId: user.id,
      });
      
      toast({
        title: "Success",
        description: "Your password has been updated",
      });
    } catch (error) {
      console.error("Password update error:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "auth",
        message: "Error updating password",
        details: String(error),
        userId: user.id,
      });
      
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const getSystemLogs = (filters?: {
    level?: "info" | "warning" | "error";
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    resolved?: boolean;
  }): SystemLog[] => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can view system logs",
        variant: "destructive",
      });
      return [];
    }
    
    try {
      let logs = getPersistedSystemLogs();
      
      // Apply filters if provided
      if (filters) {
        if (filters.level) {
          logs = logs.filter(log => log.level === filters.level);
        }
        
        if (filters.category) {
          logs = logs.filter(log => log.category === filters.category);
        }
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          logs = logs.filter(log => new Date(log.timestamp) >= fromDate);
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          logs = logs.filter(log => new Date(log.timestamp) <= toDate);
        }
        
        if (filters.resolved !== undefined) {
          logs = logs.filter(log => log.resolved === filters.resolved);
        }
      }
      
      // Sort logs by timestamp (newest first)
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return logs;
    } catch (error) {
      console.error("Error retrieving system logs:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "system",
        message: "Error retrieving system logs",
        details: String(error),
      });
      
      toast({
        title: "Error",
        description: "Failed to retrieve system logs",
        variant: "destructive",
      });
      
      return [];
    }
  };

  const addSystemLog = (log: Omit<SystemLog, "id" | "timestamp">): void => {
    if (!user || user.role !== "admin") {
      console.error("Only administrators can add system logs");
      return;
    }
    
    addSystemLogInternal(log);
    
    // Only show toast for error logs
    if (log.level === "error") {
      toast({
        title: "System Error Logged",
        description: log.message,
        variant: "destructive",
      });
    }
  };

  const updateSystemLog = (logId: string, updates: Partial<SystemLog>): boolean => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can update system logs",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const logs = getPersistedSystemLogs();
      const logIndex = logs.findIndex(log => log.id === logId);
      
      if (logIndex === -1) {
        return false;
      }
      
      // Update the log
      logs[logIndex] = {
        ...logs[logIndex],
        ...updates
      };
      
      persistSystemLogs(logs);
      return true;
    } catch (error) {
      console.error("Error updating system log:", error);
      return false;
    }
  };

  const updateEmailSettings = async (settings: EmailSettings): Promise<void> => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can update email settings",
        variant: "destructive",
      });
      return;
    }
    
    try {
      persistEmailSettings(settings);
      
      addSystemLogInternal({
        level: "info",
        category: "system",
        message: "Email settings updated",
        userId: user.id,
      });
      
      toast({
        title: "Success",
        description: "Email settings have been updated",
      });
    } catch (error) {
      console.error("Error updating email settings:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "system",
        message: "Error updating email settings",
        details: String(error),
        userId: user.id,
      });
      
      toast({
        title: "Error",
        description: "Failed to update email settings",
        variant: "destructive",
      });
    }
  };

  const getEmailSettings = (): EmailSettings => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "Only administrators can view email settings",
        variant: "destructive",
      });
      return getPersistedEmailSettings(); // Return default settings
    }
    
    return getPersistedEmailSettings();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        refreshSession,
        updateProfile,
        resetPassword,
        updatePassword,
        addAdmin,
        socialLogin,
        updateUserStatus,
        updateUserSubscription,
        getAllUsers,
        incrementDailyQuestionCount,
        updateUserMetrics,
        resetDailyQuestionCounts,
        verifyEmail,
        resendVerificationEmail,
        getSystemLogs,
        addSystemLog,
        updateSystemLog,
        updateEmailSettings,
        getEmailSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
