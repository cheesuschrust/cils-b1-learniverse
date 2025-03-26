
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationsContextType } from '@/types/interface-fixes';

// Define a basic notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'default' | 'info' | 'success' | 'warning' | 'error' | 'file-processing' | 'system' | 'achievement';
  read: boolean;
  timestamp: Date;
  priority?: 'low' | 'normal' | 'high';
  icon?: string;
  link?: string;
  expiresAt?: Date | string;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  addNotification: () => {},
  dismissNotification: () => {},
  markAsRead: () => {},
  dismissAllNotifications: () => {},
  unreadCount: 0,
  markAllAsRead: () => {},
  getFileProcessingNotifications: () => [],
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
          expiresAt: notification.expiresAt ? new Date(notification.expiresAt) : undefined,
        })));
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    }
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      read: false,
      timestamp: new Date(),
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // Dismiss a notification by ID
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Dismiss all notifications
  const dismissAllNotifications = () => {
    setNotifications([]);
  };

  // Get file processing notifications
  const getFileProcessingNotifications = () => {
    return notifications.filter(notification => notification.type === 'file-processing');
  };

  // Remove expired notifications
  useEffect(() => {
    const now = new Date();
    
    setNotifications(prev => 
      prev.filter(notification => {
        if (!notification.expiresAt) return true;
        
        const expiryDate = typeof notification.expiresAt === 'string' 
          ? new Date(notification.expiresAt) 
          : notification.expiresAt;
          
        return expiryDate > now;
      })
    );
    
    // Check for expired notifications every 60 seconds
    const interval = setInterval(() => {
      const now = new Date();
      
      setNotifications(prev => 
        prev.filter(notification => {
          if (!notification.expiresAt) return true;
          
          const expiryDate = typeof notification.expiresAt === 'string' 
            ? new Date(notification.expiresAt) 
            : notification.expiresAt;
            
          return expiryDate > now;
        })
      );
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        dismissNotification, 
        markAsRead,
        dismissAllNotifications,
        unreadCount,
        markAllAsRead,
        getFileProcessingNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
