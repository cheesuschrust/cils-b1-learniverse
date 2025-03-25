
// Type definitions for notification system

export type NotificationType = 
  | 'success' 
  | 'info' 
  | 'warning' 
  | 'error' 
  | 'system' 
  | 'file-processing'
  | 'achievement'
  | 'reminder'
  | 'feature'
  | 'update'
  | 'lesson'
  | 'support';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  actions?: {
    label: string;
    action: () => void;
  }[];
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
  icon?: string;
  link?: string; // Added link property to support notification linking
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  dismissAll: () => void; // Method to dismiss all notifications
  getFileProcessingNotifications: () => Notification[];
}

export interface NotificationSettings {
  showNotifications: boolean;
  playSound: boolean;
  emailNotifications: boolean;
  emailDigestFrequency: 'daily' | 'weekly' | 'never';
  desktopNotifications: boolean;
  notificationTypes: {
    [key in NotificationType]: boolean;
  };
}
