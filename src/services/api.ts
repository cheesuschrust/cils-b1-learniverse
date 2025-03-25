
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
      } else if (endpoint.startsWith("/lesson")) {
        return this.handleLessonEndpoints(endpoint, method, data) as unknown as T;
      } else if (endpoint.startsWith("/ai")) {
        return this.handleAIEndpoints(endpoint, method, data) as unknown as T;
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
      
      // Validate password
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
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
    
    if (endpoint === "/auth/reset-password" && method === "POST") {
      const { email } = data;
      const user = db.users.find((u: User) => u.email === email);
      
      if (!user) {
        // For security, don't reveal if the email exists or not
        return { success: true, message: "If your email is in our system, you will receive a reset link shortly." };
      }
      
      // Generate reset token
      const resetToken = crypto.randomUUID();
      db.passwordResetTokens.set(resetToken, email);
      
      // In a real app, send email with reset link
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      return { 
        success: true, 
        message: "If your email is in our system, you will receive a reset link shortly.",
        // For testing only:
        token: resetToken
      };
    }
    
    if (endpoint === "/auth/set-password" && method === "POST") {
      const { token, password } = data;
      const email = db.passwordResetTokens.get(token);
      
      if (!email) {
        throw new Error("Invalid or expired reset token");
      }
      
      // Validate password
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password
      passwordHash.set(email, hashedPassword);
      
      // Remove token
      db.passwordResetTokens.delete(token);
      
      return { success: true };
    }
    
    if (endpoint === "/auth/change-password" && method === "POST") {
      const { userId, currentPassword, newPassword } = data;
      const user = db.users.find((u: User) => u.id === userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Verify current password
      const storedHash = passwordHash.get(user.email);
      const isValid = await bcrypt.compare(currentPassword, storedHash || "");
      
      if (!isValid) {
        throw new Error("Current password is incorrect");
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long");
      }
      
      // Hash and update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      passwordHash.set(user.email, hashedPassword);
      
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
      
      // Update last active timestamp
      user.lastActive = new Date();
      
      return { user };
    }
    
    if (endpoint === "/user/update" && method === "PUT") {
      const { userId, userData } = data;
      const userIndex = db.users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Validate email isn't already taken if changing email
      if (userData.email && userData.email !== db.users[userIndex].email) {
        const existingUser = db.users.find((u: User) => u.email === userData.email);
        if (existingUser) {
          throw new Error("Email already in use");
        }
      }
      
      // Update user data
      db.users[userIndex] = {
        ...db.users[userIndex],
        ...userData,
        lastActive: new Date()
      };
      
      return { user: db.users[userIndex] };
    }
    
    if (endpoint === "/user/preferences" && method === "PUT") {
      const { userId, preferences } = data;
      const userIndex = db.users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update user preferences
      db.users[userIndex] = {
        ...db.users[userIndex],
        preferences: {
          ...db.users[userIndex].preferences,
          ...preferences
        },
        lastActive: new Date()
      };
      
      return { 
        preferences: db.users[userIndex].preferences 
      };
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
        dailyCounts: user.dailyQuestionCounts,
        streak: user.metrics.streak || 0
      };
    }
    
    if (endpoint === "/user/streak" && method === "PUT") {
      const { userId, increment = true } = data;
      const userIndex = db.users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update streak
      if (increment) {
        db.users[userIndex].metrics.streak = (db.users[userIndex].metrics.streak || 0) + 1;
      } else {
        db.users[userIndex].metrics.streak = 0;
      }
      
      return { 
        streak: db.users[userIndex].metrics.streak 
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
      
      // Update last active timestamp
      db.users[userIndex].lastActive = new Date();
      
      return { 
        dailyCounts: db.users[userIndex].dailyQuestionCounts,
        metrics: db.users[userIndex].metrics
      };
    }
    
    if (endpoint === "/user/reset-daily-counts" && method === "POST") {
      const { userId } = data;
      const userIndex = db.users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Reset daily counts
      db.users[userIndex].dailyQuestionCounts = {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
      };
      
      return { 
        dailyCounts: db.users[userIndex].dailyQuestionCounts 
      };
    }
    
    throw new Error(`User endpoint not implemented: ${endpoint}`);
  }
  
  private static async handleContentEndpoints(
    endpoint: string,
    method: string,
    data: any
  ) {
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
    
    if (endpoint === "/content/vocabulary" && method === "GET") {
      const { category, limit = 10 } = data || {};
      
      // Generate vocabulary based on category
      const words = [
        { italian: "casa", english: "house", category: "household" },
        { italian: "tavolo", english: "table", category: "household" },
        { italian: "sedia", english: "chair", category: "household" },
        { italian: "cucina", english: "kitchen", category: "household" },
        { italian: "letto", english: "bed", category: "household" },
        { italian: "mela", english: "apple", category: "food" },
        { italian: "pane", english: "bread", category: "food" },
        { italian: "acqua", english: "water", category: "food" },
        { italian: "carne", english: "meat", category: "food" },
        { italian: "riso", english: "rice", category: "food" },
        { italian: "cane", english: "dog", category: "animals" },
        { italian: "gatto", english: "cat", category: "animals" },
        { italian: "uccello", english: "bird", category: "animals" },
        { italian: "pesce", english: "fish", category: "animals" },
        { italian: "cavallo", english: "horse", category: "animals" },
      ];
      
      const filteredWords = category 
        ? words.filter(word => word.category === category)
        : words;
      
      return {
        data: filteredWords.slice(0, limit).map(word => ({
          ...word,
          id: crypto.randomUUID()
        }))
      };
    }
    
    if (endpoint === "/content/grammar" && method === "GET") {
      const { topic } = data || {};
      
      const grammarTopics = [
        {
          id: "present-tense",
          title: "Present Tense",
          description: "The Italian present tense (il presente) is used to talk about actions happening now or habits.",
          examples: [
            { italian: "Io parlo italiano.", english: "I speak Italian." },
            { italian: "Tu mangi la pizza.", english: "You eat pizza." },
            { italian: "Lei studia molto.", english: "She studies a lot." }
          ]
        },
        {
          id: "articles",
          title: "Articles",
          description: "Italian has definite articles (the) and indefinite articles (a/an).",
          examples: [
            { italian: "Il libro è sul tavolo.", english: "The book is on the table." },
            { italian: "Una ragazza cammina nel parco.", english: "A girl walks in the park." },
            { italian: "L'uomo parla al telefono.", english: "The man speaks on the phone." }
          ]
        }
      ];
      
      if (topic) {
        const selectedTopic = grammarTopics.find(t => t.id === topic);
        if (!selectedTopic) {
          throw new Error("Grammar topic not found");
        }
        return { data: selectedTopic };
      }
      
      return { data: grammarTopics };
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
      
      // Validate required fields
      if (!answers || !Array.isArray(answers)) {
        throw new Error("Invalid answers format");
      }
      
      // Calculate score
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      
      return {
        score: correctAnswers,
        totalQuestions: answers.length,
        correctAnswers,
        timeSpent: totalTime,
        submittedAt: new Date()
      };
    }
    
    if (endpoint === "/quiz/history" && method === "GET") {
      const { userId, limit = 10 } = data;
      
      // In a real app, this would fetch from a database
      return {
        data: [
          {
            id: crypto.randomUUID(),
            date: new Date(Date.now() - 86400000 * 1), // 1 day ago
            score: 8,
            totalQuestions: 10,
            timeSpent: 240, // seconds
            category: "Vocabulary",
            difficulty: "Beginner"
          },
          {
            id: crypto.randomUUID(),
            date: new Date(Date.now() - 86400000 * 3), // 3 days ago
            score: 7,
            totalQuestions: 10,
            timeSpent: 300, // seconds
            category: "Grammar",
            difficulty: "Beginner"
          }
        ]
      };
    }
    
    throw new Error(`Quiz endpoint not implemented: ${endpoint}`);
  }
  
  private static async handleLessonEndpoints(
    endpoint: string,
    method: string,
    data: any
  ) {
    if (endpoint === "/lesson/available" && method === "GET") {
      const { language, difficulty } = data || {};
      
      // Sample lessons data
      const lessons = [
        {
          id: "intro-basics",
          title: "Introduction to Italian Basics",
          description: "Learn essential phrases and greetings in Italian",
          difficulty: "beginner",
          duration: 15, // minutes
          modules: 3,
          category: "basics",
          language: "english",
        },
        {
          id: "food-vocab",
          title: "Food and Dining Vocabulary",
          description: "Learn important food-related words and restaurant phrases",
          difficulty: "beginner",
          duration: 20,
          modules: 4,
          category: "vocabulary",
          language: "english",
        },
        {
          id: "present-tense",
          title: "Present Tense Verbs",
          description: "Learn how to conjugate and use present tense verbs",
          difficulty: "intermediate",
          duration: 25,
          modules: 5,
          category: "grammar",
          language: "english",
        }
      ];
      
      // Filter by criteria if provided
      let filteredLessons = [...lessons];
      
      if (language) {
        filteredLessons = filteredLessons.filter(l => l.language === language);
      }
      
      if (difficulty) {
        filteredLessons = filteredLessons.filter(l => l.difficulty === difficulty);
      }
      
      return { 
        data: filteredLessons.map(lesson => ({
          ...lesson,
          imageUrl: `https://example.com/images/lessons/${lesson.id}.jpg`
        }))
      };
    }
    
    if (endpoint === "/lesson/details" && method === "GET") {
      const { lessonId } = data;
      
      if (!lessonId) {
        throw new Error("Lesson ID is required");
      }
      
      // Simulate fetching lesson details
      return {
        data: {
          id: lessonId,
          title: "Introduction to Italian Basics",
          description: "Learn essential phrases and greetings in Italian",
          difficulty: "beginner",
          duration: 15,
          modules: [
            {
              id: "greetings",
              title: "Common Greetings",
              content: "In this module, you'll learn basic Italian greetings...",
              exercises: [
                {
                  type: "multiple-choice",
                  question: "How do you say 'hello' in Italian?",
                  options: ["Ciao", "Grazie", "Prego", "Arrivederci"],
                  correctAnswer: "Ciao"
                }
              ]
            },
            {
              id: "introductions",
              title: "Introducing Yourself",
              content: "Learn how to introduce yourself in Italian...",
              exercises: [
                {
                  type: "fill-in-blank",
                  question: "Mi chiamo _____. (My name is _____)",
                  correctAnswer: "[USER INPUT]"
                }
              ]
            }
          ]
        }
      };
    }
    
    if (endpoint === "/lesson/progress" && method === "POST") {
      const { userId, lessonId, moduleId, completed } = data;
      
      // Validate required fields
      if (!userId || !lessonId || !moduleId) {
        throw new Error("Missing required fields");
      }
      
      // Update lesson progress (in a real app, store in database)
      return {
        success: true,
        progress: {
          userId,
          lessonId,
          moduleId,
          completed,
          timestamp: new Date()
        }
      };
    }
    
    throw new Error(`Lesson endpoint not implemented: ${endpoint}`);
  }
  
  private static async handleAIEndpoints(
    endpoint: string,
    method: string,
    data: any
  ) {
    if (endpoint === "/ai/analyze-text" && method === "POST") {
      const { text, language } = data;
      
      if (!text) {
        throw new Error("Text is required");
      }
      
      // Simulate AI text analysis
      return {
        data: {
          language: language || "italian",
          wordCount: text.split(/\s+/).length,
          readability: "intermediate",
          topics: ["grammar", "vocabulary"],
          sentiment: "neutral",
          complexity: 0.65,
          analysis: "This is sample text analysis that would be provided by an AI model."
        }
      };
    }
    
    if (endpoint === "/ai/translate" && method === "POST") {
      const { text, sourceLanguage, targetLanguage } = data;
      
      if (!text) {
        throw new Error("Text is required");
      }
      
      if (!sourceLanguage || !targetLanguage) {
        throw new Error("Source and target languages are required");
      }
      
      // Simulate translation (in a real app, call translation API)
      const translations = {
        "Hello": "Ciao",
        "Thank you": "Grazie",
        "Goodbye": "Arrivederci",
        "How are you?": "Come stai?",
        "My name is": "Mi chiamo",
        "I would like": "Vorrei",
        "Where is": "Dov'è",
        "How much": "Quanto",
        "Please": "Per favore",
        "You're welcome": "Prego"
      };
      
      // Determine translation direction and provide simple "translation"
      if (sourceLanguage === "english" && targetLanguage === "italian") {
        // For demo purposes, just look up in our simple dictionary or return original
        for (const [eng, ita] of Object.entries(translations)) {
          if (text.includes(eng)) {
            return { data: { translation: text.replace(eng, ita) } };
          }
        }
        return { data: { translation: `[Italian translation of: ${text}]` } };
      } else if (sourceLanguage === "italian" && targetLanguage === "english") {
        // Reverse lookup
        for (const [eng, ita] of Object.entries(translations)) {
          if (text.includes(ita)) {
            return { data: { translation: text.replace(ita, eng) } };
          }
        }
        return { data: { translation: `[English translation of: ${text}]` } };
      }
      
      return { data: { translation: text } }; // fallback same language
    }
    
    if (endpoint === "/ai/generate-content" && method === "POST") {
      const { prompt, type, language, count } = data;
      
      if (!prompt || !type) {
        throw new Error("Prompt and content type are required");
      }
      
      // Simulate generating content based on type
      switch (type) {
        case "flashcards":
          return {
            data: Array(count || 5).fill(null).map(() => ({
              id: crypto.randomUUID(),
              italian: `[Italian word based on: ${prompt}]`,
              english: `[English word based on: ${prompt}]`
            }))
          };
          
        case "multiple-choice":
          return {
            data: Array(count || 3).fill(null).map((_, i) => ({
              id: crypto.randomUUID(),
              question: `[Generated question ${i+1} about: ${prompt}]`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: "Option A",
              explanation: `[Explanation for question ${i+1}]`
            }))
          };
          
        case "conversation":
          return {
            data: {
              id: crypto.randomUUID(),
              title: `[Generated conversation about: ${prompt}]`,
              participants: ["Speaker 1", "Speaker 2"],
              exchanges: [
                { speaker: "Speaker 1", text: "[Italian phrase 1]", translation: "[English translation 1]" },
                { speaker: "Speaker 2", text: "[Italian phrase 2]", translation: "[English translation 2]" },
                { speaker: "Speaker 1", text: "[Italian phrase 3]", translation: "[English translation 3]" }
              ]
            }
          };
          
        default:
          throw new Error(`Unsupported content type: ${type}`);
      }
    }
    
    if (endpoint === "/ai/feedback" && method === "POST") {
      const { text, language, type } = data;
      
      if (!text) {
        throw new Error("Text is required");
      }
      
      // Simulate AI feedback based on type
      switch (type) {
        case "grammar":
          return {
            data: {
              corrected: `[Corrected version of: ${text}]`,
              errors: [
                { type: "subject-verb-agreement", suggestion: "Correct form..." },
                { type: "article-usage", suggestion: "Consider using..." }
              ],
              feedback: "Overall feedback about grammar would appear here..."
            }
          };
          
        case "pronunciation":
          return {
            data: {
              accuracy: 0.85,
              areas_to_improve: ["r sound", "stress pattern"],
              feedback: "Your pronunciation is good, but pay attention to..."
            }
          };
          
        case "vocabulary":
          return {
            data: {
              suggestions: [
                { original: "good", suggestion: "excellent", reason: "More specific" },
                { original: "nice", suggestion: "beautiful", reason: "More descriptive" }
              ],
              feedback: "Consider using more varied vocabulary..."
            }
          };
          
        default:
          return {
            data: {
              feedback: `General feedback about your ${text} would appear here.`
            }
          };
      }
    }
    
    throw new Error(`AI endpoint not implemented: ${endpoint}`);
  }
}
