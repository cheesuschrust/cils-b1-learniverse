
import { User, EmailSettings } from "@/contexts/shared-types";
import { getDatabase, passwordHash } from "./MockDatabase";
import bcrypt from 'bcryptjs';

// Base API class for all API calls
export class API {
  static async handleRequest<T>(
    endpoint: string,
    method: string = "GET",
    data?: any
  ): Promise<T> {
    try {
      // For now, we're simulating API calls with local data
      // In a real app, this would be replaced with actual fetch calls
      return await this.simulateApiCall<T>(endpoint, method, data);
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // This simulates API calls until real backend is implemented
  private static async simulateApiCall<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const db = await getDatabase();
    
    // Handle different endpoints
    if (endpoint.startsWith("/auth")) {
      return this.handleAuthEndpoints(endpoint, method, data, db) as unknown as T;
    } else if (endpoint.startsWith("/user")) {
      return this.handleUserEndpoints(endpoint, method, data, db) as unknown as T;
    } else if (endpoint.startsWith("/content")) {
      return this.handleContentEndpoints(endpoint, method, data) as unknown as T;
    }
    
    throw new Error(`Endpoint not implemented: ${endpoint}`);
  }
  
  private static async handleAuthEndpoints(
    endpoint: string,
    method: string,
    data: any,
    db: any
  ) {
    if (endpoint === "/auth/login" && method === "POST") {
      const { email, password } = data;
      const user = db.users.find((u: User) => u.email === email);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      const storedHash = passwordHash.get(email);
      const isValid = await bcrypt.compare(password, storedHash || "");
      
      if (!isValid) {
        throw new Error("Invalid credentials");
      }
      
      // Update last login
      user.lastLogin = new Date();
      user.lastActive = new Date();
      
      return { user };
    }
    
    if (endpoint === "/auth/register" && method === "POST") {
      const { email, password, firstName, lastName } = data;
      
      // Check if user already exists
      if (db.users.some((u: User) => u.email === email)) {
        throw new Error("User already exists");
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
        role: "user",
        isVerified: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        lastActive: new Date(),
        preferences: {
          theme: "system",
          emailNotifications: true,
          language: "en",
          difficulty: "beginner",
        },
        subscription: "free",
        status: "active",
        preferredLanguage: "both",
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
        }
      };
      
      // Add user to database
      db.users.push(newUser);
      
      return { user: newUser };
    }
    
    throw new Error(`Auth endpoint not implemented: ${endpoint}`);
  }
  
  private static async handleUserEndpoints(
    endpoint: string,
    method: string,
    data: any,
    db: any
  ) {
    if (endpoint === "/user/profile" && method === "GET") {
      const { userId } = data;
      const user = db.users.find((u: User) => u.id === userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return { user };
    }
    
    if (endpoint === "/user/update" && method === "PUT") {
      const { userId, userData } = data;
      const userIndex = db.users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update user data
      db.users[userIndex] = {
        ...db.users[userIndex],
        ...userData,
        lastActive: new Date()
      };
      
      return { user: db.users[userIndex] };
    }
    
    throw new Error(`User endpoint not implemented: ${endpoint}`);
  }
  
  private static async handleContentEndpoints(
    endpoint: string,
    method: string,
    data: any
  ) {
    // This would be replaced with real API calls to content services
    if (endpoint === "/content/flashcards" && method === "GET") {
      return {
        data: [
          { id: crypto.randomUUID(), italian: "casa", english: "house", mastered: false },
          { id: crypto.randomUUID(), italian: "cibo", english: "food", mastered: false },
          { id: crypto.randomUUID(), italian: "acqua", english: "water", mastered: false },
          { id: crypto.randomUUID(), italian: "cittadino", english: "citizen", mastered: false },
          { id: crypto.randomUUID(), italian: "diritto", english: "right (legal)", mastered: false },
        ]
      };
    }
    
    throw new Error(`Content endpoint not implemented: ${endpoint}`);
  }
}
