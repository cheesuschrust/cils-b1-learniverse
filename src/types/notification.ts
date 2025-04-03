
export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
}

export type NotificationType = 
  | 'achievement' 
  | 'streak' 
  | 'reminder' 
  | 'milestone' 
  | 'system' 
  | 'file-processing'
  | 'feedback';

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
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}
