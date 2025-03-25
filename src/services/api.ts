
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
      
      // Rethrow with more context for better error handling
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      } else {
        throw new Error(`API Error: Unknown error occurred`);
      }
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
    
    try {
      const db = await getDatabase();
      
      // Handle different endpoints
      if (endpoint.startsWith("/auth")) {
        return this.handleAuthEndpoints(endpoint, method, data, db) as unknown as T;
      } else if (endpoint.startsWith("/user")) {
        return this.handleUserEndpoints(endpoint, method, data, db) as unknown as T;
      } else if (endpoint.startsWith("/content")) {
        return this.handleContentEndpoints(endpoint, method, data) as unknown as T;
      } else if (endpoint.startsWith("/quiz")) {
        return this.handleQuizEndpoints(endpoint, method, data) as unknown as T;
      }
      
      throw new Error(`Endpoint not implemented: ${endpoint}`);
    } catch (error) {
      console.error("API Simulation Error:", error);
      throw error;
    }
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
      const hashedPassword = await bcrypt.hash(password, 10);
      
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
      // Store password hash
      passwordHash.set(email, hashedPassword);
      
      return { user: newUser };
    }
    
    if (endpoint === "/auth/verify" && method === "POST") {
      const { token } = data;
      const email = db.verificationTokens.get(token);
      
      if (!email) {
        throw new Error("Invalid or expired verification token");
      }
      
      // Find user
      const userIndex = db.users.findIndex((u: User) => u.email === email);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update verification status
      db.users[userIndex].isVerified = true;
      
      // Remove token
      db.verificationTokens.delete(token);
      
      return { success: true };
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
    
    if (endpoint === "/user/stats" && method === "GET") {
      const { userId } = data;
      const user = db.users.find((u: User) => u.id === userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Return user metrics
      return { 
        metrics: user.metrics,
        dailyCounts: user.dailyQuestionCounts 
      };
    }
    
    if (endpoint === "/user/increment-count" && method === "POST") {
      const { userId, type, correct = false } = data;
      const userIndex = db.users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update daily count for specified question type
      if (type in db.users[userIndex].dailyQuestionCounts) {
        db.users[userIndex].dailyQuestionCounts[type]++;
      }
      
      // Update metrics
      db.users[userIndex].metrics.totalQuestions++;
      if (correct) {
        db.users[userIndex].metrics.correctAnswers++;
      }
      
      return { success: true };
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
    
    if (endpoint === "/content/flashcards/import" && method === "POST") {
      const { cards } = data;
      
      // Validate imported cards
      if (!Array.isArray(cards) || cards.length === 0) {
        throw new Error("Invalid flashcard data");
      }
      
      // Process and return flashcards
      return {
        success: true,
        count: cards.length,
        data: cards.map(card => ({
          ...card,
          id: card.id || crypto.randomUUID(),
          mastered: false
        }))
      };
    }
    
    if (endpoint === "/content/listening" && method === "GET") {
      return {
        data: [
          {
            id: crypto.randomUUID(),
            title: "Basic Conversation",
            audioUrl: "https://example.com/audio/conversation1.mp3",
            transcript: "Ciao! Come stai?",
            translation: "Hello! How are you?",
            difficulty: "beginner"
          },
          {
            id: crypto.randomUUID(),
            title: "At the Restaurant",
            audioUrl: "https://example.com/audio/restaurant.mp3",
            transcript: "Vorrei ordinare, per favore.",
            translation: "I would like to order, please.",
            difficulty: "beginner"
          }
        ]
      };
    }
    
    throw new Error(`Content endpoint not implemented: ${endpoint}`);
  }
  
  private static async handleQuizEndpoints(
    endpoint: string,
    method: string,
    data: any
  ) {
    if (endpoint === "/quiz/generate" && method === "POST") {
      const { language, difficulty, count = 5, category } = data;
      
      // Generate quiz questions based on parameters
      const questions = [];
      
      for (let i = 0; i < count; i++) {
        questions.push({
          id: crypto.randomUUID(),
          question: `Sample question ${i + 1} (${difficulty})`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "This is a sample explanation",
          difficulty,
          category: category || "General",
          language: language || "english"
        });
      }
      
      return {
        data: questions
      };
    }
    
    if (endpoint === "/quiz/submit" && method === "POST") {
      const { answers, userId, totalTime } = data;
      
      // Calculate score
      const score = Math.floor(Math.random() * answers.length);
      
      return {
        score,
        totalQuestions: answers.length,
        correctAnswers: score,
        timeSpent: totalTime,
        submittedAt: new Date()
      };
    }
    
    throw new Error(`Quiz endpoint not implemented: ${endpoint}`);
  }
}
