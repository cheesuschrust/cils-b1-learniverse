
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface Flashcard {
  id: string;
  front: string; 
  back: string;
  italian?: string;
  english?: string;
  level: number;
  difficulty: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  set_id?: string;
  tags?: string[];
  nextReview?: Date;
  last_reviewed?: Date;
  mastered?: boolean;
  progress?: any;
  isDue?: boolean;
}

export interface User extends SupabaseUser {
  isPremiumUser?: boolean;
  isPremium?: boolean;
}

export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
  accuracy: number;
  speed: number;
  consistency: number;
  retention: number;
  overall: number;
}

export interface ReviewSchedule {
  interval?: number;
  dueDate?: Date;
  difficulty?: number;
  overdue: number;
  dueToday: number;
  upcoming: number;
  dueThisWeek: number;
  dueNextWeek: number;
  totalDue: number;
  nextWeekCount: number;
  dueByDate: Record<string, number>;
}
