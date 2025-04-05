import { ReactNode } from 'react';  

// Notification Types  
export type NotificationType =   
  | 'achievement'  
  | 'streak'  
  | 'milestone'  
  | 'reminder'  
  | 'system'  
  | 'info'  
  | 'success'  
  | 'warning'  
  | 'error'  
  | 'speaking'  
  | 'listening';  

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';  

// Action interface for a notification  
export interface NotificationAction {  
  id: string;  
  label: string;  
  action: () => void; // Function to be called when action is triggered  
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'link' | 'success' | 'warning';  
}  

// Main notification interface  
export interface Notification {  
  id: string; // Unique identifier  
  title: string; // Notification title  
  message: string; // Notification message content  
  type: NotificationType; // Type of notification  
  priority: NotificationPriority; // Priority level  
  createdAt: Date; // Date the notification was created  
  read: boolean; // Indicates if the notification has been read  
  link?: string; // Optional link associated with the notification  
  actionLabel?: string; // Optional action label for visibility  
  actionHandler?: () => void; // Optional action handler function  
  expires?: Date; // Optional expiration date for the notification  
  metadata?: Record<string, any>; // Optional additional metadata  
  actions?: NotificationAction[]; // Optional list of actions for the notification  
  icon?: ReactNode; // Optional icon for the notification  
}  

// Context type for managing notifications globally  
export interface NotificationsContextType {  
  notifications: Notification[]; // List of notifications  
  unreadCount: number; // Count of unread notifications  
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void; // Function to add a new notification  
  markAsRead: (id: string) => void; // Function to mark a notification as read  
  markAllAsRead: () => void; // Function to mark all notifications as read  
  clearAll: () => void; // Function to clear all notifications  
  dismissNotification: (id: string) => void; // Function to dismiss a specific notification  
  removeNotification: (id: string) => void; // Function to remove a notification  
  getFileProcessingNotifications: () => Notification[]; // Function to get specific notifications  
  scheduleReminder?: (reminder: Omit<Notification, 'id' | 'createdAt' | 'read' | 'type'>, date: Date) => string; // Optional for scheduling a reminder  
  cancelReminder?: (id: string) => void; // Optional for canceling a reminder  
}  

// Props interface for rendering a notification item  
export interface NotificationItemProps {  
  notification: Notification; // The notification to display  
  onDismiss?: (id: string) => void; // Callback for dismiss action  
  onRead?: (id: string) => void; // Callback for marking as read  
  onAction?: (actionId: string, notificationId: string) => void; // Callback for notification action  
  onRemove?: (id: string) => void; // Callback for removing notification  
  showControls?: boolean; // Determines if controls are shown  
  onClick?: () => void; // Callback for when the notification is clicked  
  expanded?: boolean; // Indicates if the notification is in expanded state  
}  

// Props interface for the notification center  
export interface NotificationCenterProps {  
  initialTab?: string; // Optional initial tab to show  
  className?: string; // Optional class for styling  
}  

// Props interface for global notification center component  
export interface GlobalNotificationCenterProps {  
  open: boolean; // Indicates if the notification center is open  
  onOpenChange: (open: boolean) => void; // Callback for handling open state change  
}  

// Props interface for the notification bell component  
export interface NotificationBellProps {  
  onClick?: () => void; // Callback for when the bell is clicked  
}  
