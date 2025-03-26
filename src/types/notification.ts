
export type NotificationType = 'default' | 'info' | 'success' | 'warning' | 'error' | 'file-processing' | 'system' | 'achievement';

export interface NotificationAction {
  id: string;
  label: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: NotificationType;
  createdAt: Date | string;
  read: boolean;
  actions?: NotificationAction[];
  url?: string;
  metadata?: Record<string, any>;
  userId?: string;
  priority?: 'low' | 'normal' | 'high';
  icon?: string;
  link?: string;
  expiresAt?: Date | string;
}

export interface NotificationsState {
  notifications: Notification[];
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => string;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissAll: () => void;
  clearNotifications: () => void;
  getFileProcessingNotifications: () => Notification[];
}
