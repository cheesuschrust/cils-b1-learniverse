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
  phoneNumber?: string;
  address?: string;
  created: string;
  lastActive: string;
  dailyQuestionCounts: DailyQuestionCounts;
  metrics: UserMetrics;
  preferences?: UserPreferences;
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
        } else {
          localStorage.removeItem("session");
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      localStorage.removeItem("session");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    // Initialize users if needed
    if (!localStorage.getItem("users")) {
      persistUsers([DEFAULT_ADMIN]);
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
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = getPersistedUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser || !(await bcrypt.compare(password, foundUser.passwordHash))) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      if (foundUser.status === "inactive") {
        toast({
          title: "Error",
          description: "Your account has been deactivated. Please contact support.",
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
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
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
      const users = getPersistedUsers();
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
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
        status: "active",
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
      
      // Create session
      createSession(newUser.id);
      
      // Set user without passwordHash
      setUser(sanitizeUser(newUser));
      
      toast({
        title: "Success",
        description: "Your account has been created",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
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
      const users = getPersistedUsers();
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("A user with this email already exists");
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create new admin user
      const newAdmin: User = {
        id: `admin-${uuidv4()}`,
        email,
        firstName,
        lastName,
        username: `admin${Math.floor(Math.random() * 10000)}`,
        role: 'admin',
        passwordHash,
        preferredLanguage: "both",
        subscription: "premium",
        status: "active",
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
      users.push(newAdmin);
      persistUsers(users);
      
      toast({
        title: "Success",
        description: `Admin account for ${email} has been created`,
      });
    } catch (error) {
      console.error("Add admin error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserStatus = async (userId: string, status: "active" | "inactive" | "pending") => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "You must be an admin to update user status",
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
      
      // Update user status
      users[userIndex].status = status;
      
      // Persist updated users
      persistUsers(users);
      
      toast({
        title: "Success",
        description: `User status updated to ${status}`,
      });
      
      // If current user is updated, refresh state
      if (user.id === userId) {
        setUser(sanitizeUser(users[userIndex]));
      }
      
      return;
    } catch (error) {
      console.error("Update user status error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user status.",
        variant: "destructive",
      });
    }
  };
  
  const updateUserSubscription = async (userId: string, subscription: "free" | "premium") => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "You must be an admin to update user subscription",
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
      
      // Update user subscription
      users[userIndex].subscription = subscription;
      
      // Persist updated users
      persistUsers(users);
      
      toast({
        title: "Success",
        description: `User subscription updated to ${subscription}`,
      });
      
      // If current user is updated, refresh state
      if (user.id === userId) {
        setUser(sanitizeUser(users[userIndex]));
      }
      
      return;
    } catch (error) {
      console.error("Update user subscription error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user subscription.",
        variant: "destructive",
      });
    }
  };
  
  const getAllUsers = () => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Error",
        description: "You must be an admin to view all users",
        variant: "destructive",
      });
      return [];
    }
    
    const users = getPersistedUsers();
    return users.map(u => sanitizeUser(u));
  };
  
  const incrementDailyQuestionCount = async (type: keyof DailyQuestionCounts): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to use this feature",
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
      
      // Check if free user has reached limit
      if (users[userIndex].subscription === "free" && users[userIndex].dailyQuestionCounts[type] >= 1) {
        toast({
          title: "Daily Limit Reached",
          description: "Upgrade to premium for unlimited questions",
          variant: "destructive",
        });
        return false;
      }
      
      // Increment question count
      users[userIndex].dailyQuestionCounts[type]++;
      
      // Update metrics
      users[userIndex].metrics.totalQuestions++;
      
      // Update streak if it's a new day
      const today = new Date().toDateString();
      const lastActiveDate = new Date(users[userIndex].lastActive).toDateString();
      
      if (today !== lastActiveDate) {
        users[userIndex].metrics.streak++;
      }
      
      // Persist updated users
      persistUsers(users);
      
      // Update state
      setUser(sanitizeUser(users[userIndex]));
      
      return true;
    } catch (error) {
      console.error("Increment question count error:", error);
      return false;
    }
  };
  
  const updateUserMetrics = async (metrics: Partial<UserMetrics>) => {
    if (!user) {
      return;
    }
    
    try {
      const users = getPersistedUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        return;
      }
      
      // Update metrics
      users[userIndex].metrics = {
        ...users[userIndex].metrics,
        ...metrics
      };
      
      // Persist updated users
      persistUsers(users);
      
      // Update state
      setUser(sanitizeUser(users[userIndex]));
    } catch (error) {
      console.error("Update metrics error:", error);
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
      
      // Reset daily counts
      users[userIndex].dailyQuestionCounts = {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0
      };
      
      // Persist updated users
      persistUsers(users);
      
      // Update state
      setUser(sanitizeUser(users[userIndex]));
    } catch (error) {
      console.error("Reset daily counts error:", error);
    }
  };
  
  const socialLogin = async (provider: "google" | "apple") => {
    setIsLoading(true);
    try {
      // In a real app, we would integrate with Google/Apple OAuth here
      // For this demo, we'll create a temporary user
      
      const email = `${provider}_user_${Math.floor(Math.random() * 10000)}@example.com`;
      const username = `${provider}User${Math.floor(Math.random() * 10000)}`;
      const firstName = provider === "google" ? "Google" : "Apple";
      const lastName = "User";
      
      const users = getPersistedUsers();
      
      // Create new user with generated credentials
      const newUser: User = {
        id: `user-${uuidv4()}`,
        email,
        firstName,
        lastName,
        username,
        role: 'user',
        passwordHash: await bcrypt.hash(uuidv4(), 10), // Random password hash
        preferredLanguage: "both",
        subscription: "free",
        status: "active",
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
      
      // Create session
      createSession(newUser.id);
      
      // Set user without passwordHash
      setUser(sanitizeUser(newUser));
      
      toast({
        title: "Success",
        description: `Logged in with ${provider}`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Error",
        description: `Failed to login with ${provider}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("session");
    setUser(null);
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
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
        resetDailyQuestionCounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
