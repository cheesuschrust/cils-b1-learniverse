
import React, { useState, useCallback, useEffect } from "react";
import { User } from "@/contexts/shared-types";
import { AuthService, LoginCredentials, RegisterData } from "@/services/AuthService";
import { UserService, UpdateProfileData } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";

export const useAuthManager = () => {
  // Explicitly use React.useState to ensure we're accessing the correct function
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Failed to load user from storage:", err);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await AuthService.login(credentials);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(data);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    setIsLoading(true);
    try {
      const response = await UserService.updateProfile(user.id, data);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Profile update failed";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);
  
  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    setIsLoading(true);
    try {
      await UserService.updatePassword(user.id, currentPassword, newPassword);
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Password update failed";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);
  
  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await AuthService.forgotPassword(email);
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      // Don't show error to prevent email enumeration attacks
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
  };
};
