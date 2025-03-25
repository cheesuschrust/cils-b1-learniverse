
export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'achievement'
  | 'reminder'
  | 'feature'
  | 'update'
  | 'lesson'
  | 'support'
  | 'file-processing'
  | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
  userId?: string;
  icon?: string;
  link?: string;
  actions?: {
    label: string;
    action: string;
  }[];
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
}
