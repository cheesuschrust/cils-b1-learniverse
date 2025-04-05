
import { ReactNode } from 'react';

export type NotificationType = 
  | 'achievement' 
  | 'streak' 
  | 'flashcard' 
  | 'review' 
  | 'system' 
  | 'feature' 
  | 'promotion'
  | 'update'
  | 'reminder';

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  actions?: NotificationAction[];
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  hasUnread: boolean;
  unreadCount: number;
}

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export interface NotificationManagerProps {
  children: ReactNode;
  autoCloseTime?: number;
  maxToasts?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
