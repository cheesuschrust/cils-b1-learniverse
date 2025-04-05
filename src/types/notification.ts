
export type NotificationType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'achievement' 
  | 'reminder' 
  | 'system' 
  | 'update' 
  | 'streak' 
  | 'challenge' 
  | 'lesson' 
  | 'speaking' 
  | 'listening' 
  | 'citizenship';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationAction {
  id: string;
  label: string;
  action: string | (() => void);
  url?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
  priority?: NotificationPriority;
  actions?: NotificationAction[];
  icon?: string;
  image?: string;
  expires?: Date;
  userId?: string;
  category?: string;
  dismissible?: boolean;
  persistent?: boolean;
  data?: Record<string, any>;
}

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: () => void;
  onRead: () => void;
  onRemove?: () => void;
  onClick?: () => void;
  expanded?: boolean;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onDismissAll: () => void;
  onRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
