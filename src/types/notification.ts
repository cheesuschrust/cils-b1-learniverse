
// Notification types for the application
import React from 'react';

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'error' 
  | 'warning'
  | 'system'
  | 'user'
  | 'file-processing'
  | 'achievement'
  | 'progress'
  | 'reminder'
  | 'update'
  | 'default';

// Map from notification type to button variant
export type NotificationVariantMapping = {
  [key in NotificationType]?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
};

export const notificationToVariantMap: NotificationVariantMapping = {
  success: 'default',
  error: 'destructive',
  warning: 'secondary',
  info: 'outline',
  system: 'secondary',
  achievement: 'default',
  default: 'secondary'
};

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'link' | 'outline' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  id?: string;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  read?: boolean;
  createdAt?: Date;
  timestamp?: Date;
  actions?: NotificationAction[];
  link?: string;
  autoClose?: boolean | number;
  icon?: React.ReactNode;
  priority?: 'low' | 'normal' | 'high';
  data?: Record<string, any>;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  url?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  className?: string;
  showControls?: boolean;
}
