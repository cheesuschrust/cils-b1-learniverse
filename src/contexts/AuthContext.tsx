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
        "Verify your email address",
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

  const signup = async (firstName: string, lastName: string, email: string, password: string, username?: string) => {
    setIsLoading(true);
    try {
      // Validate inputs
      if (!firstName || !lastName || !email || !password) {
        throw new Error("All required fields must be provided");
      }
      
      if (!isValidEmail(email)) {
        throw new Error("Please provide a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      const users = getPersistedUsers();
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        addSystemLogInternal({
          level: "warning",
          category: "auth",
          message: "Signup attempt with existing email",
          details: `Email: ${email}`,
        });
        
        throw new Error("Email already exists");
      }
      
      // Check if username already exists (if provided)
      if (username && users.some(u => u.username?.toLowerCase() === username.toLowerCase())) {
        throw new Error("Username already exists");
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser: User = {
        id: `user-${uuidv4()}`,
        email,
        firstName,
        lastName,
        username: username || `user${Math.floor(Math.random() * 10000)}`,
        role: 'user',
        passwordHash,
        preferredLanguage: "both",
        subscription: "free",
        status: "pending", // Start as pending until email is verified
        emailVerified: false,
        created: new Date().toISOString(),
        lastActive: new Date().toISOString(),
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
          streak: 0,
          totalTimeSpent: 0
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
      
      // Add user to the list and persist
      users.push(newUser);
      persistUsers(users);
      
      // Generate verification token
      const token = generateVerificationToken(newUser.id);
      storeVerificationToken(newUser.id, token);
      
      // Get email settings
      const emailSettings = getPersistedEmailSettings();
      
      // Create verification link
      const verificationLink = `${window.location.origin}/verify-email?userId=${newUser.id}&token=${token}`;
      
      // Prepare welcome and verification email
      let emailBody = emailSettings.templates.welcome
        .replace(/{{name}}/g, firstName)
        + '<br><br>'
        + emailSettings.templates.verification
          .replace(/{{name}}/g, firstName)
          .replace(/{{verificationLink}}/g, verificationLink);
      
      // Send email
      await sendEmail(
        email,
        "Welcome to Italian Learning App - Verify Your Email",
        emailBody,
        emailSettings
      );
      
      // Log user creation
      addSystemLogInternal({
        level: "info",
        category: "auth",
        message: "New user account created",
        userId: newUser.id,
      });
      
      // Don't auto-login, require email verification first
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account before logging in.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      
      addSystemLogInternal({
        level: "error",
        category: "auth",
        message: "Signup error",
        details: String(error),
      });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Omit<User, "passwordHash">>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update user data (without changing role or passwordHash)
      const { role, subscription, ...updatableFields } = profileData;
      users[userIndex] = {
        ...users[userIndex],
        ...updatableFields,
      };
      
      // Persist updated users
      persistUsers(users);
      
      // Update state with sanitized user
      setUser(sanitizeUser(users[userIndex]));
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userIndex === -1) {
        // Don't reveal if email exists for security
        setTimeout(() => {
          setIsLoading(false);
          toast({
            title: "Success",
            description: "If an account with that email exists, a password reset link has been sent",
          });
        }, 1000);
        return;
      }
      
      // In a real app, we would send a password reset email here
      // For this demo, we'll just show a success message
      
      toast({
        title: "Success",
        description: "If an account with that email exists, a password reset link has been sent",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "Failed to request password reset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword, 
        users[userIndex].passwordHash
      );
      
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }
      
      // Hash and update new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      users[userIndex].passwordHash = newPasswordHash;
      
      // Persist updated users
      persistUsers(users);
      
      toast({
        title: "Success",
        description: "Your password has been updated",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAdmin = async (email: string, firstName: string, lastName: string, password: string) => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "You must be an admin to add new administrators",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
