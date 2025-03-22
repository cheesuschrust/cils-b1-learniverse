
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemLog } from '@/hooks/use-system-log';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'file-processed' | 'system' | 'user' | 'content';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  userId: string;
  metadata?: {
    fileType?: string;
    contentType?: string;
    confidence?: number;
    processingTime?: number;
    detectedLanguage?: string;
    fileId?: string;
    [key: string]: any;
  };
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string, 
    message: string, 
    type: NotificationType, 
    metadata?: Notification['metadata']
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getFileProcessingNotifications: () => Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { logSystemAction } = useSystemLog();

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (storedNotifications) {
        try {
          const parsedNotifications = JSON.parse(storedNotifications);
          // Convert string dates back to Date objects
          const formattedNotifications = parsedNotifications.map((notification: any) => ({
            ...notification,
            timestamp: new Date(notification.timestamp)
          }));
          setNotifications(formattedNotifications);
        } catch (error) {
          console.error('Error parsing notifications from localStorage:', error);
        }
      }
    }
  }, [user]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (
    title: string, 
    message: string, 
    type: NotificationType, 
    metadata?: Notification['metadata']
  ) => {
    if (!user) return;
    
    const newNotification: Notification = {
      id: uuidv4(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      userId: user.id,
      metadata
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Log notification creation
    logSystemAction(
      'notification_created', 
      `New ${type} notification: ${title}`
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    logSystemAction('notifications_marked_read', `All notifications marked as read by user ${user?.id}`);
  };

  const clearNotifications = () => {
    setNotifications([]);
    
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
      logSystemAction('notifications_cleared', `All notifications cleared by user ${user.id}`);
    }
  };

  const getFileProcessingNotifications = () => {
    return notifications.filter(n => n.type === 'file-processed');
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        getFileProcessingNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  return context;
};
