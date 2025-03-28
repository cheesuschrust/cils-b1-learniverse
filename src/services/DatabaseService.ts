import { MockDatabase, User, EmailSettings, LogEntry } from "@/contexts/shared-types";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { License, LicenseStatus, RenewalStatus } from "@/types/License";
import { ChatSession, ChatbotTrainingExample } from "@/types/chatbot";
import { Notification } from "@/types/notification";
import { Flashcard, FlashcardSet } from "@/types/flashcard";
import { AdSettings, AdUnit, AdNetwork } from "@/types/ad";

// Create password hash map to store user passwords securely
export const passwordHash = new Map<string, string>();

// Singleton pattern for database access
class DatabaseService {
  private static instance: DatabaseService;
  private database: MockDatabase;
  
  private constructor() {
    this.database = {
      users: [],
      logs: [],
      emailSettings: {
        provider: 'smtp',
        fromEmail: 'noreply@italianlearning.app',
        fromName: 'Italian Learning App',
        config: {
          enableSsl: true,
          host: "smtp.example.com",
          port: 587,
          username: "user@example.com",
          password: "password123"
        },
        templates: {
          verification: {
            subject: 'Verify your email for Italian Learning App',
            body: 'Hello {{name}}, please verify your email by clicking on this link: {{verificationLink}}',
          },
          passwordReset: {
            subject: 'Reset your password for Italian Learning App',
            body: 'Hello {{name}}, click this link to reset your password: {{resetLink}}',
          },
          welcome: {
            subject: 'Welcome to Italian Learning App',
            body: 'Hello {{name}}, welcome to Italian Learning App! We are excited to have you on board.',
          }
        },
        temporaryInboxDuration: 24
      },
      resetTokens: new Map(),
      verificationTokens: new Map(),
      licenses: [],
      chatSessions: [],
      chatbotTraining: [],
      notifications: [],
      flashcards: [],
      flashcardSets: [],
      adSettings: {
        enabled: true,
        defaultNetwork: 'internal' as AdNetwork,
        frequencyCap: 5,
        showToPremiumUsers: false,
        refreshInterval: 60,
        blockList: ['adult', 'gambling', 'politics']
      },
      adUnits: []
    };
  }
  
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      // Initialize with sample data
      DatabaseService.instance.initializeDatabase();
    }
    return DatabaseService.instance;
  }
  
  private async initializeDatabase() {
    // Create hash for admin password
    const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
    const userPasswordHash = await bcrypt.hash('User123!', 10);
    
    // Create mock user data
    const admin: User = {
      id: uuidv4(),
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@italianlearning.app',
      role: 'admin',
      isVerified: true,
      createdAt: new Date('2023-01-01'),
      lastLogin: new Date(),
      lastActive: new Date(),
      preferences: {
        theme: 'system',
        emailNotifications: true,
        language: 'en',
        difficulty: 'intermediate',
      },
      subscription: 'premium',
      status: 'active',
      preferredLanguage: 'both',
      dailyQuestionCounts: {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
      },
      metrics: {
        totalQuestions: 1250,
        correctAnswers: 980,
        streak: 75,
      }
    };
    
    const regularUser: User = {
      id: uuidv4(),
      firstName: 'Marco',
      lastName: 'Rossi',
      email: 'user@italianlearning.app',
      role: 'user',
      isVerified: true,
      createdAt: new Date('2023-03-15'),
      lastLogin: new Date(),
      lastActive: new Date(),
      preferences: {
        theme: 'light',
        emailNotifications: false,
        language: 'it',
        difficulty: 'beginner',
      },
      subscription: 'free',
      status: 'active',
      preferredLanguage: 'italian',
      dailyQuestionCounts: {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
      },
      metrics: {
        totalQuestions: 450,
        correctAnswers: 320,
        streak: 15,
      }
    };

    // Initialize sample licenses
    const licenses: License[] = [
      {
        id: uuidv4(),
        name: "University of Milan",
        type: "university",
        plan: "premium",
        seats: 250,
        usedSeats: 198,
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        status: "active",
        contactName: "Prof. Alessandra Ricci",
        contactEmail: "a.ricci@unimilan.edu",
        customization: {
          logo: "https://example.com/logo.png",
          colors: {
            primary: "#003366",
            secondary: "#990000"
          },
          domain: "italian.unimilan.edu"
        },
        value: 25000,
        renewalStatus: "pending",
        company: "University of Milan",
        createdAt: new Date(),
        updatedAt: new Date(),
        validity: 365
      },
      {
        id: uuidv4(),
        name: "Lincoln High School",
        type: "k12",
        plan: "educational",
        seats: 75,
        usedSeats: 68,
        startDate: "2023-03-15",
        endDate: "2024-03-14",
        status: "active",
        contactName: "Maria Johnson",
        contactEmail: "mjohnson@lincolnhs.edu",
        customization: {
          logo: "https://example.com/lincoln-logo.png",
          colors: {
            primary: "#004d99",
            secondary: "#ffcc00"
          },
          domain: "lincoln.edu"
        },
        value: 7500,
        renewalStatus: "auto-renewal",
        company: "Lincoln High School",
        createdAt: new Date(),
        updatedAt: new Date(),
        validity: 365
      }
    ];

    // Add sample flashcards
    const flashcards: Flashcard[] = [
      {
        id: uuidv4(),
        front: "Buongiorno",
        back: "Good morning",
        italian: "Buongiorno",
        english: "Good morning",
        level: 1,
        mastered: true,
        nextReview: new Date('2023-09-10'),
        lastReviewed: new Date('2023-08-10'),
        tags: ["greeting", "basic", "formal"],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-08-10')
      },
      {
        id: uuidv4(),
        front: "Arrivederci",
        back: "Goodbye",
        italian: "Arrivederci",
        english: "Goodbye",
        level: 1,
        mastered: false,
        nextReview: new Date('2023-08-12'),
        lastReviewed: new Date('2023-08-09'),
        tags: ["greeting", "basic", "formal"],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-08-09')
      }
    ];

    // Add sample flashcard sets
    const flashcardSets: FlashcardSet[] = [
      {
        id: uuidv4(),
        name: "Basic Greetings",
        description: "Essential Italian greetings for beginners",
        tags: ["beginner", "greetings", "essential"],
        cards: flashcards.map(card => card.id),
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-08-10'),
        totalCards: 2,
        masteredCards: 1,
        category: "vocabulary",
        difficulty: "beginner",
        creator: regularUser.id,
        isPublic: true,
        isFavorite: false
      }
    ];

    // Add sample ad units
    const adUnits: AdUnit[] = [
      {
        id: uuidv4(),
        name: "Main Banner",
        type: "banner",
        network: "internal",
        placement: "homepage",
        active: true,
        impressions: 12450,
        clicks: 348,
        revenue: 87.32,
        content: "<div>Premium Banner</div>",
        targetUrl: "/subscription",
        lastUpdated: new Date('2023-08-01'),
        title: "Premium Banner",
        description: "Banner promoting premium features",
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-08-01'),
        adFormat: "horizontal",
        dimensions: "728x90",
        status: "active"
      },
      {
        id: uuidv4(),
        name: "Sidebar Ad",
        type: "native",
        network: "google",
        placement: "lesson-page",
        active: true,
        impressions: 8920,
        clicks: 156,
        revenue: 52.18,
        content: "<div>Sidebar Ad</div>",
        targetUrl: "/plans",
        lastUpdated: new Date('2023-08-05'),
        title: "Sidebar Promotion",
        description: "Sidebar promotion for lesson materials",
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-08-05'),
        adFormat: "vertical",
        dimensions: "300x600",
        status: "active"
      }
    ];

    // Add sample notifications
    const notifications: Notification[] = [
      {
        id: uuidv4(),
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been successfully updated.",
        read: true,
        createdAt: new Date('2023-08-01'),
        priority: "low"
      },
      {
        id: uuidv4(),
        type: "achievement",
        title: "Streak Achievement",
        message: "Congratulations! You've maintained a 7-day learning streak.",
        read: false,
        createdAt: new Date('2023-08-07'),
        priority: "medium",
        icon: "🏆"
      }
    ];

    // Store users in the database
    this.database.users = [admin, regularUser];
    
    // Store the passwords in the exported passwordHash map
    passwordHash.set(admin.email, adminPasswordHash);
    passwordHash.set(regularUser.email, userPasswordHash);
    
    // Store other data
    this.database.licenses = licenses;
    this.database.flashcards = flashcards;
    this.database.flashcardSets = flashcardSets;
    this.database.adUnits = adUnits;
    this.database.notifications = notifications;
  }
  
  // Data access methods
  
  // User methods
  public async getUsers(): Promise<User[]> {
    return this.database.users;
  }
  
  public async getUserById(id: string): Promise<User | undefined> {
    return this.database.users.find(user => user.id === id);
  }
  
  public async getUserByEmail(email: string): Promise<User | undefined> {
    return this.database.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }
  
  public async createUser(userData: Partial<User>, password: string): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      username: userData.username,
      role: userData.role || 'user',
      isVerified: userData.isVerified || false,
      createdAt: new Date(),
      lastLogin: new Date(),
      lastActive: new Date(),
      preferences: userData.preferences || {
        theme: 'system',
        emailNotifications: true,
        language: 'en',
        difficulty: 'beginner',
      },
      subscription: userData.subscription || 'free',
      status: userData.status || 'active',
      preferredLanguage: userData.preferredLanguage || 'english',
      dailyQuestionCounts: userData.dailyQuestionCounts || {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
      },
      metrics: userData.metrics || {
        totalQuestions: 0,
        correctAnswers: 0,
        streak: 0,
      }
    };
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    passwordHash.set(newUser.email, hashedPassword);
    
    // Add the user to the database
    this.database.users.push(newUser);
    
    // Add a log entry
    this.addLog({
      category: 'user',
      action: 'create',
      userId: newUser.id,
      details: `User ${newUser.email} created`,
      level: 'info'
    });
    
    return newUser;
  }
  
  public async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const userIndex = this.database.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return undefined;
    }
    
    const updatedUser = {
      ...this.database.users[userIndex],
      ...userData,
      updatedAt: new Date()
    };
    
    this.database.users[userIndex] = updatedUser;
    
    // Add a log entry
    this.addLog({
      category: 'user',
      action: 'update',
      userId: id,
      details: `User ${updatedUser.email} updated`,
      level: 'info'
    });
    
    return updatedUser;
  }
  
  public async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.database.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }
    
    const deletedUser = this.database.users[userIndex];
    
    // Remove the user from the database
    this.database.users.splice(userIndex, 1);
    
    // Remove the password from the hash map
    passwordHash.delete(deletedUser.email);
    
    // Add a log entry
    this.addLog({
      category: 'user',
      action: 'delete',
      userId: id,
      details: `User ${deletedUser.email} deleted`,
      level: 'info'
    });
    
    return true;
  }
  
  // Authentication methods
  public async verifyPassword(email: string, password: string): Promise<boolean> {
    const hashedPassword = passwordHash.get(email);
    
    if (!hashedPassword) {
      return false;
    }
    
    return bcrypt.compare(password, hashedPassword);
  }
  
  public async changePassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      return false;
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    passwordHash.set(email, hashedPassword);
    
    // Add a log entry
    this.addLog({
      category: 'auth',
      action: 'password-change',
      userId: user.id,
      details: `Password changed for ${email}`,
      level: 'info'
    });
    
    return true;
  }
  
  // Reset token methods
  public createResetToken(email: string): string {
    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
    
    this.database.resetTokens.set(token, { email, expires });
    
    return token;
  }
  
  public validateResetToken(token: string): string | null {
    const tokenData = this.database.resetTokens.get(token);
    
    if (!tokenData) {
      return null;
    }
    
    if (new Date() > tokenData.expires) {
      // Token has expired
      this.database.resetTokens.delete(token);
      return null;
    }
    
    return tokenData.email;
  }
  
  public consumeResetToken(token: string): void {
    this.database.resetTokens.delete(token);
  }
  
  // Verification token methods
  public createVerificationToken(email: string): string {
    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in a day
    
    this.database.verificationTokens.set(token, { email, expires });
    
    return token;
  }
  
  public validateVerificationToken(token: string): string | null {
    const tokenData = this.database.verificationTokens.get(token);
    
    if (!tokenData) {
      return null;
    }
    
    if (new Date() > tokenData.expires) {
      // Token has expired
      this.database.verificationTokens.delete(token);
      return null;
    }
    
    return tokenData.email;
  }
  
  public consumeVerificationToken(token: string): void {
    this.database.verificationTokens.delete(token);
  }
  
  // Email settings methods
  public getEmailSettings(): EmailSettings {
    return this.database.emailSettings;
  }
  
  public updateEmailSettings(settings: Partial<EmailSettings>): EmailSettings {
    this.database.emailSettings = {
      ...this.database.emailSettings,
      ...settings
    };
    
    // Add a log entry
    this.addLog({
      category: 'email',
      action: 'settings-update',
      details: 'Email settings updated',
      level: 'info'
    });
    
    return this.database.emailSettings;
  }
  
  // License methods
  public getLicenses(): License[] {
    return this.database.licenses;
  }
  
  public getLicenseById(id: string): License | undefined {
    return this.database.licenses.find(license => license.id === id);
  }
  
  public createLicense(licenseData: Partial<License>): License {
    const newLicense: License = {
      id: licenseData.id || uuidv4(),
      name: licenseData.name || '',
      type: licenseData.type || 'university',
      plan: licenseData.plan || '',
      seats: licenseData.seats || 0,
      usedSeats: licenseData.usedSeats || 0,
      startDate: licenseData.startDate || new Date().toISOString(),
      endDate: licenseData.endDate || new Date().toISOString(),
      status: licenseData.status || 'active',
      contactName: licenseData.contactName || '',
      contactEmail: licenseData.contactEmail || '',
      customization: licenseData.customization || {
        logo: '',
        colors: {
          primary: '',
          secondary: ''
        },
        domain: ''
      },
      value: licenseData.value || 0,
      renewalStatus: licenseData.renewalStatus || 'auto-renewal',
      userId: licenseData.userId || '',
      company: licenseData.company || '',
      createdAt: licenseData.createdAt || new Date(),
      updatedAt: licenseData.updatedAt || new Date(),
      validity: licenseData.validity || 365,
      features: licenseData.features || []
    };
    
    this.database.licenses.push(newLicense);
    
    // Add a log entry
    this.addLog({
      category: 'system',
      action: 'license-create',
      details: `License ${newLicense.name} created`,
      level: 'info'
    });
    
    return newLicense;
  }
  
  public updateLicense(id: string, licenseData: Partial<License>): License | undefined {
    const licenseIndex = this.database.licenses.findIndex(license => license.id === id);
    
    if (licenseIndex === -1) {
      return undefined;
    }
    
    // Ensure customization.domain exists if customization is being updated
    if (licenseData.customization && !licenseData.customization.domain) {
      licenseData.customization.domain = this.database.licenses[licenseIndex].customization.domain || '';
    }
    
    const updatedLicense = {
      ...this.database.licenses[licenseIndex],
      ...licenseData,
      updatedAt: new Date()
    };
    
    this.database.licenses[licenseIndex] = updatedLicense;
    
    // Add a log entry
    this.addLog({
      category: 'system',
      action: 'license-update',
      details: `License ${updatedLicense.name} updated`,
      level: 'info'
    });
    
    return updatedLicense;
  }
  
  public deleteLicense(id: string): boolean {
    const licenseIndex = this.database.licenses.findIndex(license => license.id === id);
    
    if (licenseIndex === -1) {
      return false;
    }
    
    const deletedLicense = this.database.licenses[licenseIndex];
    
    // Remove the license from the database
    this.database.licenses.splice(licenseIndex, 1);
    
    // Add a log entry
    this.addLog({
      category: 'system',
      action: 'license-delete',
      details: `License ${deletedLicense.name} deleted`,
      level: 'info'
    });
    
    return true;
  }
  
  // Chatbot methods
  public getChatSessions(): ChatSession[] {
    return this.database.chatSessions;
  }
  
  public getChatSessionById(id: string): ChatSession | undefined {
    return this.database.chatSessions.find(session => session.id === id);
  }
  
  public getChatSessionsByUserId(userId: string): ChatSession[] {
    return this.database.chatSessions.filter(session => session.userId === userId);
  }
  
  public createChatSession(sessionData: Partial<ChatSession>): ChatSession {
    const newSession: ChatSession = {
      id: uuidv4(),
      userId: sessionData.userId || '',
      messages: sessionData.messages || [],
      startedAt: new Date(),
      lastActivityAt: new Date(),
      context: sessionData.context || {},
      resolved: false,
      escalatedToHuman: false
    };
    
    this.database.chatSessions.push(newSession);
    
    return newSession;
  }
  
  public updateChatSession(id: string, sessionData: Partial<ChatSession>): ChatSession | undefined {
    const sessionIndex = this.database.chatSessions.findIndex(session => session.id === id);
    
    if (sessionIndex === -1) {
      return undefined;
    }
    
    const updatedSession = {
      ...this.database.chatSessions[sessionIndex],
      ...sessionData,
      lastActivityAt: new Date()
    };
    
    this.database.chatSessions[sessionIndex] = updatedSession;
    
    return updatedSession;
  }
  
  public deleteChatSession(id: string): boolean {
    const sessionIndex = this.database.chatSessions.findIndex(session => session.id === id);
    
    if (sessionIndex === -1) {
      return false;
    }
    
    // Remove the session from the database
    this.database.chatSessions.splice(sessionIndex, 1);
    
    return true;
  }
  
  // Chatbot training examples
  public getChatbotTrainingExamples(): ChatbotTrainingExample[] {
    return this.database.chatbotTraining;
  }
  
  public getChatbotTrainingExampleById(id: string): ChatbotTrainingExample | undefined {
    return this.database.chatbotTraining.find(example => example.id === id);
  }
  
  public createChatbotTrainingExample(exampleData: Partial<ChatbotTrainingExample>): ChatbotTrainingExample {
    const newExample: ChatbotTrainingExample = {
      id: uuidv4(),
      question: exampleData.question || '',
      answer: exampleData.answer || '',
      alternatives: exampleData.alternatives || [],
      category: exampleData.category || '',
      tags: exampleData.tags || [],
      createdAt: new Date(),
      approved: exampleData.approved || false,
      language: exampleData.language || 'english',
      difficulty: exampleData.difficulty || 'beginner'
    };
    
    this.database.chatbotTraining.push(newExample);
    
    // Add a log entry
    this.addLog({
      category: 'ai',
      action: 'training-example-create',
      details: `Training example created: ${newExample.question}`,
      level: 'info'
    });
    
    return newExample;
  }
  
  public updateChatbotTrainingExample(id: string, exampleData: Partial<ChatbotTrainingExample>): ChatbotTrainingExample | undefined {
    const exampleIndex = this.database.chatbotTraining.findIndex(example => example.id === id);
    
    if (exampleIndex === -1) {
      return undefined;
    }
    
    const updatedExample = {
      ...this.database.chatbotTraining[exampleIndex],
      ...exampleData,
      updatedAt: new Date()
    };
    
    this.database.chatbotTraining[exampleIndex] = updatedExample;
    
    // Add a log entry
    this.addLog({
      category: 'ai',
      action: 'training-example-update',
      details: `Training example updated: ${updatedExample.question}`,
      level: 'info'
    });
    
    return updatedExample;
  }
  
  public deleteChatbotTrainingExample(id: string): boolean {
    const exampleIndex = this.database.chatbotTraining.findIndex(example => example.id === id);
    
    if (exampleIndex === -1) {
      return false;
    }
    
    const deletedExample = this.database.chatbotTraining[exampleIndex];
    
    // Remove the example from the database
    this.database.chatbotTraining.splice(exampleIndex, 1);
    
    // Add a log entry
    this.addLog({
      category: 'ai',
      action: 'training-example-delete',
      details: `Training example deleted: ${deletedExample.question}`,
      level: 'info'
    });
    
    return true;
  }
  
  // Ad settings methods
  public getAdSettings(): AdSettings {
    return this.database.adSettings;
  }
  
  public updateAdSettings(settings: Partial<AdSettings>): AdSettings {
    this.database.adSettings = {
      ...this.database.adSettings,
      ...settings
    };
    
    // Add a log entry
    this.addLog({
      category: 'system',
      action: 'ad-settings-update',
      details: 'Ad settings updated',
      level: 'info'
    });
    
    return this.database.adSettings;
  }
  
  // Ad unit methods
  public getAdUnits(): AdUnit[] {
    return this.database.adUnits;
  }
  
  public getAdUnitById(id: string): AdUnit | undefined {
    return this.database.adUnits.find(unit => unit.id === id);
  }
  
  public createAdUnit(unitData: Partial<AdUnit>): AdUnit {
    const newUnit: AdUnit = {
      id: unitData.id || uuidv4(),
      name: unitData.name || '',
      type: unitData.type || 'banner',
      network: unitData.network || 'internal',
      placement: unitData.placement || '',
      active: unitData.active ?? true,
      impressions: unitData.impressions || 0,
      clicks: unitData.clicks || 0,
      revenue: unitData.revenue || 0,
      content: unitData.content || '',
      targetUrl: unitData.targetUrl || '',
      lastUpdated: new Date(),
      title: unitData.title || '',
      description: unitData.description || '',
      startDate: unitData.startDate || new Date(),
      endDate: unitData.endDate || new Date(),
      createdAt: unitData.createdAt || new Date(),
      updatedAt: unitData.updatedAt || new Date(),
      adFormat: unitData.adFormat || '',
      dimensions: unitData.dimensions || '',
      placements: unitData.placements || [],
      targeting: unitData.targeting || [],
      price: unitData.price || 0,
      currency: unitData.currency || 'USD',
      company: unitData.company || '',
      status: unitData.status || 'active',
      owner: unitData.owner || '',
      impression: unitData.impressions || 0
    };
    
    this.database.adUnits.push(newUnit);
    
    // Add a log entry
    this.addLog({
      category: 'system',
      action: 'ad-unit-create',
      details: `Ad unit ${newUnit.name} created`,
      level: 'info'
    });
    
    return newUnit;
  }
  
  public updateAdUnit(id: string, unitData: Partial<AdUnit>): AdUnit | undefined {
    const unitIndex = this.database.adUnits.findIndex(unit => unit.id === id);
    
    if (unitIndex === -1) {
      return undefined;
    }
    
    const updatedUnit: AdUnit = {
      ...this.database.adUnits[unitIndex],
      ...unitData,
      lastUpdated: new Date(),
      updatedAt: new Date()
    };
    
    this.database.adUnits[unitIndex] = updatedUnit;
    
    // Add a log entry
    this.addLog({
      category: 'system',
      action: 'ad-unit-update',
      details: `Ad unit ${updatedUnit.name} updated`,
      level: 'info'
    });
    
    return updatedUnit;
  }
  
  public deleteAdUnit(id: string): boolean {
    const unitIndex = this.database.adUnits.findIndex(unit => unit.id === id);
    
    if (unitIndex === -1) {
      return false;
    }
    
    const deletedUnit = this.database.adUnits[unitIndex];
    
    // Remove the unit from the database
    this.database.adUnits.splice(unitIndex, 1);
    
    // Add a log entry
    this.addLog({
      category: 'system',
      action: 'ad-unit-delete',
      details: `Ad unit ${deletedUnit.name} deleted`,
      level: 'info'
    });
    
    return true;
  }
  
  // Notification methods
  public getNotifications(): Notification[] {
    return this.database.notifications;
  }
  
  public getNotificationById(id: string): Notification | undefined {
    return this.database.notifications.find(notification => notification.id === id);
  }
  
  public createNotification(notificationData: Partial<Notification>): Notification {
    const newNotification: Notification = {
      id: uuidv4(),
      type: notificationData.type || 'info',
      title: notificationData.title || '',
      message: notificationData.message || '',
      read: notificationData.read || false,
      createdAt: new Date(),
      expiresAt: notificationData.expiresAt,
      actions: notificationData.actions,
      metadata: notificationData.metadata,
      priority: notificationData.priority || 'low',
      icon: notificationData.icon,
      link: notificationData.link
    };
    
    this.database.notifications.push(newNotification);
    
    return newNotification;
  }
  
  public updateNotification(id: string, notificationData: Partial<Notification>): Notification | undefined {
    const notificationIndex = this.database.notifications.findIndex(notification => notification.id === id);
    
    if (notificationIndex === -1) {
      return undefined;
    }
    
    const updatedNotification = {
      ...this.database.notifications[notificationIndex],
      ...notificationData
    };
    
    this.database.notifications[notificationIndex] = updatedNotification;
    
    return updatedNotification;
  }
  
  public deleteNotification(id: string): boolean {
    const notificationIndex = this.database.notifications.findIndex(notification => notification.id === id);
    
    if (notificationIndex === -1) {
      return false;
    }
    
    // Remove the notification from the database
    this.database.notifications.splice(notificationIndex, 1);
    
    return true;
  }
  
  // Flashcard methods
  public getFlashcards(): Flashcard[] {
    return this.database.flashcards;
  }
  
  public getFlashcardById(id: string): Flashcard | undefined {
    return this.database.flashcards.find(card => card.id === id);
  }
  
  public createFlashcard(cardData: Partial<Flashcard>): Flashcard {
    const newCard: Flashcard = {
      id: uuidv4(),
      italian: cardData.italian || '',
      english: cardData.english || '',
      explanation: cardData.explanation,
      examples: cardData.examples || [],
      level: cardData.level || 0,
      mastered: cardData.mastered || false,
      lastReviewed: cardData.lastReviewed,
      nextReview: cardData.nextReview,
      dueDate: cardData.dueDate,
      tags: cardData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.database.flashcards.push(newCard);
    
    return newCard;
  }
  
  public updateFlashcard(id: string, cardData: Partial<Flashcard>): Flashcard | undefined {
    const cardIndex = this.database.flashcards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      return undefined;
    }
    
    const updatedCard = {
      ...this.database.flashcards[cardIndex],
      ...cardData,
      updatedAt: new Date()
    };
    
    this.database.flashcards[cardIndex] = updatedCard;
    
    return updatedCard;
  }
  
  public deleteFlashcard(id: string): boolean {
    const cardIndex = this.database.flashcards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      return false;
    }
    
    // Remove the card from the database
    this.database.flashcards.splice(cardIndex, 1);
    
    // Also remove the card from any flashcard sets
    this.database.flashcardSets = this.database.flashcardSets.map(set => ({
      ...set,
      cards: set.cards.filter(cardId => cardId !== id),
      totalCards: set.cards.filter(cardId => cardId !== id).length
    }));
    
    return true;
  }
  
  // Flashcard set methods
  public getFlashcardSets(): FlashcardSet[] {
    return this.database.flashcardSets;
  }
  
  public getFlashcardSetById(id: string): FlashcardSet | undefined {
    return this.database.flashcardSets.find(set => set.id === id);
  }
  
  public createFlashcardSet(setData: Partial<FlashcardSet>): FlashcardSet {
    const newSet: FlashcardSet = {
      id: uuidv4(),
      name: setData.name || '',
      description: setData.description || '',
      tags: setData.tags || [],
      cards: setData.cards || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      totalCards: setData.cards?.length || 0,
      masteredCards: setData.masteredCards || 0,
      category: setData.category,
      difficulty: setData.difficulty
    };
    
    this.database.flashcardSets.push(newSet);
    
    return newSet;
  }
  
  public updateFlashcardSet(id: string, setData: Partial<FlashcardSet>): FlashcardSet | undefined {
    const setIndex = this.database.flashcardSets.findIndex(set => set.id === id);
    
    if (setIndex === -1) {
      return undefined;
    }
    
    const updatedSet = {
      ...this.database.flashcardSets[setIndex],
      ...setData,
      updatedAt: new Date()
    };
    
    this.database.flashcardSets[setIndex] = updatedSet;
    
    return updatedSet;
  }
  
  public deleteFlashcardSet(id: string): boolean {
    const setIndex = this.database.flashcardSets.findIndex(set => set.id === id);
    
    if (setIndex === -1) {
      return false;
    }
    
    // Remove the set from the database
    this.database.flashcardSets.splice(setIndex, 1);
    
    return true;
  }
  
  // Log methods
  public getLogs(): LogEntry[] {
    return this.database.logs;
  }
  
  public addLog(logData: Omit<LogEntry, 'id' | 'timestamp'>): LogEntry {
    const newLog: LogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      category: logData.category,
      action: logData.action,
      userId: logData.userId,
      details: logData.details,
      level: logData.level
    };
    
    this.database.logs.push(newLog);
    
    return newLog;
  }
  
  public clearLogs(): void {
    this.database.logs = [];
  }
}

export default DatabaseService;
