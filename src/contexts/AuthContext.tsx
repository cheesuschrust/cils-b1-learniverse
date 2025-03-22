
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  refreshSession: () => void; // Added refreshSession function type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to check if user is logged in
  const checkUserLoggedIn = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("userToken");

      if (storedUser && token) {
        // In a real app, we would validate the token with the backend
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Function to refresh the user session
  const refreshSession = () => {
    checkUserLoggedIn();
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app this would come from the backend
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
      };
      
      // Store user data and token securely
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userToken", `fake-token-${Date.now()}`);
      
      setUser(userData);
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app this would come from the backend
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'user',
      };
      
      // Store user data and token securely
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userToken", `fake-token-${Date.now()}`);
      
      setUser(userData);
      
      toast({
        title: "Success",
        description: "Your account has been created",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
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
        refreshSession, // Added refreshSession to context value
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
