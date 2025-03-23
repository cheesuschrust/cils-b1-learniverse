
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

export class UserService {
  static async getUserProfile(userId: string): Promise<UserProfileResponse> {
    return API.handleRequest<UserProfileResponse>("/user/profile", "GET", { userId });
  }
  
  static async updateProfile(userId: string, userData: UpdateProfileData): Promise<UserProfileResponse> {
    return API.handleRequest<UserProfileResponse>("/user/update", "PUT", { userId, userData });
  }
  
  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    return API.handleRequest<void>("/user/password", "PUT", { userId, currentPassword, newPassword });
  }
  
  static async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserProfileResponse> {
    return API.handleRequest<UserProfileResponse>("/user/preferences", "PUT", { userId, preferences });
  }
  
  static async getActivityLog(userId: string): Promise<any> {
    return API.handleRequest<any>("/user/activity", "GET", { userId });
  }
}
