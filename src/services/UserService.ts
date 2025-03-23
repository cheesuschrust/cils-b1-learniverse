
import { API } from "./api";
import { User, UserPreferences } from "@/contexts/shared-types";
import { VoicePreference } from "@/utils/textToSpeech";

export interface UserProfileResponse {
  user: User;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: "english" | "italian" | "both";
  preferences?: Partial<UserPreferences>;
  voicePreference?: VoicePreference;
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  category: string;
  metadata?: any;
}

export interface ActivityLogResponse {
  logs: ActivityLogItem[];
  total: number;
}

export class UserService {
  static async getUserProfile(userId: string): Promise<UserProfileResponse> {
    return API.handleRequest<UserProfileResponse>("/user/profile", "GET", { userId });
  }
  
  static async updateProfile(userId: string, userData: UpdateProfileData): Promise<UserProfileResponse> {
    console.log("Updating user profile with data:", userData);
    return API.handleRequest<UserProfileResponse>("/user/update", "PUT", { userId, userData });
  }
  
  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    return API.handleRequest<void>("/user/password", "PUT", { userId, currentPassword, newPassword });
  }
  
  static async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserProfileResponse> {
    return API.handleRequest<UserProfileResponse>("/user/preferences", "PUT", { userId, preferences });
  }
  
  static async updateVoicePreferences(userId: string, voicePreference: VoicePreference): Promise<UserProfileResponse> {
    return API.handleRequest<UserProfileResponse>("/user/voice-preferences", "PUT", { userId, voicePreference });
  }
  
  static async getActivityLog(userId: string, options: {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ActivityLogResponse> {
    return API.handleRequest<ActivityLogResponse>("/user/activity", "GET", { 
      userId,
      page: options.page || 1,
      limit: options.limit || 20,
      category: options.category,
      startDate: options.startDate,
      endDate: options.endDate
    });
  }
  
  static async getSystemSettings(): Promise<any> {
    return API.handleRequest<any>("/user/system-settings", "GET");
  }
  
  static async updateSystemSettings(settings: any): Promise<any> {
    return API.handleRequest<any>("/user/system-settings", "PUT", { settings });
  }
}
