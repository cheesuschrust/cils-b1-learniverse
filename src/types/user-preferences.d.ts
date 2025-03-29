
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
}

export interface ExtendedUserPreferences extends UserPreferences {
  voicePreferences?: {
    rate: number;
    pitch: number;
    voice: string;
  };
  studySchedule?: {
    daysPerWeek: number;
    minutesPerDay: number;
  };
}
