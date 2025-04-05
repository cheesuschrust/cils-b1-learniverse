
export type NotificationType = 
  'achievement' | 'streak' | 'milestone' | 'reminder' | 'system' |
  'info' | 'success' | 'warning' | 'error' | 'speaking' | 'listening';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent' | 'medium';

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
}

export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  dismissNotification: (id: string) => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
  getFileProcessingNotifications: () => Notification[];
  clearAllNotifications: () => void;
}

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onActionClick?: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export interface NotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface GlobalNotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
