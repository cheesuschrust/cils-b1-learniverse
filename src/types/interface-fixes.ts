
import { ReactNode } from 'react';
import { Notification } from '@/contexts/NotificationsContext';

// Progress component props
export interface ProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  value: number;
  max?: number;
  indicator?: string;
}

// Alert component props
export interface AlertProps {
  variant?: "default" | "destructive" | "outline" | "warning" | "success" | "info";
}

// Notifications context type
export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  dismissAllNotifications: () => void;
  unreadCount: number;
  markAllAsRead: () => void;
  getFileProcessingNotifications: () => Notification[];
}
