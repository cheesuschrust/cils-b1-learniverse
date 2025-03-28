
// Notification types for the application

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
  | 'update';

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'link' | 'outline' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  read?: boolean;
  createdAt?: Date;
  actions?: NotificationAction[];
  link?: string;
  autoClose?: boolean | number;
  icon?: React.ReactNode;
  priority?: 'low' | 'normal' | 'high';
  data?: Record<string, any>;
}

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  className?: string;
}
