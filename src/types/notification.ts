
export interface NotificationAction {
  id: string;
  label: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: 'default' | 'info' | 'success' | 'warning' | 'error';
  createdAt: Date | string;
  read: boolean;
  actions?: NotificationAction[];
  url?: string;
  metadata?: Record<string, any>;
  userId?: string;
}

export interface NotificationsState {
  notifications: Notification[];
}

export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => string;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissAllNotifications: () => void;
  getUnreadCount: () => number;
}
