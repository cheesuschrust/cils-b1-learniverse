
export type NotificationType = 
  | 'achievement' 
  | 'streak' 
  | 'reminder' 
  | 'milestone' 
  | 'system' 
  | 'progress';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  variant?: 'default' | 'outline' | 'destructive';
  icon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
  actions?: NotificationAction[];
  expires?: Date;
  icon?: string;
  link?: string;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  scheduledFor: Date;
  metadata?: Record<string, any>;
}
