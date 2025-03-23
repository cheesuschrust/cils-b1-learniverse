
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
    console.log("Fetching user profile for:", userId);
    return API.handleRequest<UserProfileResponse>("/user/profile", "GET", { userId });
  }
  
  static async updateProfile(userId: string, userData: UpdateProfileData): Promise<UserProfileResponse> {
    console.log("Updating user profile with data:", userData);
    
    // Optimize update to prevent freezing by adding a small delay before resolving
    return new Promise(resolve => {
      setTimeout(() => {
        API.handleRequest<UserProfileResponse>("/user/update", "PUT", { userId, userData })
          .then(response => resolve(response))
          .catch(error => {
            console.error("Error updating profile:", error);
            throw error;
          });
      }, 100); // Small delay to prevent UI freezing
    });
  }
  
  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    console.log("Updating password for user:", userId);
    return API.handleRequest<void>("/user/password", "PUT", { userId, currentPassword, newPassword });
  }
  
  static async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserProfileResponse> {
    console.log("Updating user preferences:", preferences);
    return API.handleRequest<UserProfileResponse>("/user/preferences", "PUT", { userId, preferences });
  }
  
  static async updateVoicePreferences(userId: string, voicePreference: VoicePreference): Promise<UserProfileResponse> {
    console.log("Updating voice preferences:", voicePreference);
    
    // Optimize update to prevent freezing
    return new Promise(resolve => {
      setTimeout(() => {
        API.handleRequest<UserProfileResponse>("/user/voice-preferences", "PUT", { userId, voicePreference })
          .then(response => resolve(response))
          .catch(error => {
            console.error("Error updating voice preferences:", error);
            throw error;
          });
      }, 100);
    });
  }
  
  static async getActivityLog(userId: string, options: {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ActivityLogResponse> {
    console.log("Fetching activity log for user:", userId, "with options:", options);
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
    console.log("Fetching system settings");
    return API.handleRequest<any>("/user/system-settings", "GET");
  }
  
  static async updateSystemSettings(settings: any): Promise<any> {
    console.log("Updating system settings:", settings);
    return API.handleRequest<any>("/user/system-settings", "PUT", { settings });
  }
  
  static async setDefaultVoicePreferences(voicePreference: VoicePreference): Promise<any> {
    console.log("Setting default system voice preferences:", voicePreference);
    return API.handleRequest<any>("/admin/voice-preferences/default", "PUT", { voicePreference });
  }
}
