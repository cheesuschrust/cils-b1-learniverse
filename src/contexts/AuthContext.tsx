
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

// Create a default admin account
const DEFAULT_ADMIN = {
  id: "admin-1",
  email: "admin@italianlearning.app",
  name: "System Administrator",
  role: "admin" as const,
  passwordHash: "$2a$10$1BmQvkd8kRwas.mRXKtWGuglDvs5YAyh9iIBPEKR9aGWYGDwIwDjW", // "Admin123!"
  displayName: "Admin",
  preferredLanguage: "both" as const,
};

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  passwordHash: string;
  displayName?: string;
  preferredLanguage?: "english" | "italian" | "both";
  phoneNumber?: string;
  address?: string;
}

interface AuthContextType {
  user: Omit<User, "passwordHash"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  refreshSession: () => void;
  updateProfile: (profileData: Partial<Omit<User, "passwordHash">>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  addAdmin: (email: string, name: string, password: string) => Promise<void>;
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
        const users = getPersistedUsers();
        const currentUser = users.find(u => u.id === userId);
        
        if (currentUser) {
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const users = getPersistedUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser || !(await bcrypt.compare(password, foundUser.passwordHash))) {
        throw new Error("Invalid email or password");
      }
      
      // Create session
      createSession(foundUser.id);
      
      // Set user without passwordHash
      setUser(sanitizeUser(foundUser));
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const users = getPersistedUsers();
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already exists");
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser: User = {
        id: `user-${uuidv4()}`,
        email,
        name,
        role: 'user',
        passwordHash,
        preferredLanguage: "both",
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
      const { role, ...updatableFields } = profileData;
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

  const addAdmin = async (email: string, name: string, password: string) => {
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
        name,
        role: 'admin',
        passwordHash,
        preferredLanguage: "both",
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
