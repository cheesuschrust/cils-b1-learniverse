
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'review';

export interface NotificationAction {
  id: string;
  label: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date | string;
  timestamp?: Date | string;
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

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onAction?: (id: string, actionId: string) => void;
}
