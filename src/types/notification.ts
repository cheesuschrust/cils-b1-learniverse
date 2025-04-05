
import { ReactNode } from 'react';

// Notification Types
export type NotificationType = 
  'achievement' | 'streak' | 'milestone' | 'reminder' | 'system' |
  'info' | 'success' | 'warning' | 'error' | 'speaking' | 'listening';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'link' | 'success' | 'warning';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAt: Date;
  read: boolean;
  link?: string;
  actionLabel?: string;
  actionHandler?: () => void;
  expires?: Date;
  metadata?: Record<string, any>;
  actions?: NotificationAction[];
  icon?: ReactNode;
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  dismissNotification: (id: string) => void;
  removeNotification: (id: string) => void;
  getFileProcessingNotifications: () => Notification[];
  scheduleReminder?: (reminder: Omit<Notification, 'id' | 'createdAt' | 'read' | 'type'>, date: Date) => string;
  cancelReminder?: (id: string) => void;
}

export interface NotificationItemProps {
  notification: Notification;
  onDismiss?: (id: string) => void;
  onRead?: (id: string) => void;
  onAction?: (actionId: string, notificationId: string) => void;
  onRemove?: (id: string) => void;
  showControls?: boolean;
  onClick?: () => void;
  expanded?: boolean;
}

export interface NotificationCenterProps {
  initialTab?: string;
  className?: string;
}

export interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface NotificationBellProps {
  onClick?: () => void;
}
