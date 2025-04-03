
export type NotificationType = 
  | 'achievement' 
  | 'streak' 
  | 'system' 
  | 'reminder'
  | 'milestone';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAt: Date;
  read: boolean;
  icon?: string;
  link?: string;
  expires?: Date;
  actions?: NotificationAction[];
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

export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  read?: boolean;
  fromDate?: Date;
  toDate?: Date;
}
