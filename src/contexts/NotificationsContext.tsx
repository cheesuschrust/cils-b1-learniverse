
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationType, NotificationsContextType } from '@/types/notification';
import { v4 as uuidv4 } from 'uuid';

// Create context
export const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismissNotification: () => {},
  clearNotifications: () => {},
  getFileProcessingNotifications: () => []
});

interface NotificationsProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ 
  children, 
  maxNotifications = 50 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // Load notifications from localStorage on mount
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert date strings back to Date objects
        const formattedNotifications = parsedNotifications.map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt),
          expiresAt: notification.expiresAt ? new Date(notification.expiresAt) : undefined
        }));
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save notifications to localStorage when they change
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      id: uuidv4(),
      createdAt: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => {
      const updatedNotifications = [newNotification, ...prev];
      // Limit the number of notifications
      return updatedNotifications.slice(0, maxNotifications);
    });
    
    // Auto-expire notifications if they have an expiresAt date
    if (newNotification.expiresAt) {
      const timeUntilExpiry = newNotification.expiresAt.getTime() - Date.now();
      if (timeUntilExpiry > 0) {
        setTimeout(() => {
          dismissNotification(newNotification.id);
        }, timeUntilExpiry);
      }
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const getFileProcessingNotifications = () => {
    return notifications.filter(notification => notification.type === 'file-processing');
  };
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearNotifications,
        getFileProcessingNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
