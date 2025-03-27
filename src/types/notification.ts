
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
  timestamp?: Date | string; // Added for compatibility
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
  removeNotification: (id: string) => void;
  dismissNotification: (id: string) => void; // Added
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;  // Added
  clearAll: () => void;
  dismissAll: () => void; // Alias for clearAll
  dismissAllNotifications: () => void; // Alias for clearAll
  getFileProcessingNotifications: () => Notification[]; // Added
}
