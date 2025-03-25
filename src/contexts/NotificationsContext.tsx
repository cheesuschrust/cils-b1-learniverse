
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationsContextType, NotificationType } from '@/types/notification';
import { useToast } from '@/components/ui/use-toast';

// Create context with default empty values
const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismissNotification: () => {},
  clearNotifications: () => {},
  dismissAll: () => {},
  getFileProcessingNotifications: () => [],
});

export const useNotifications = () => useContext(NotificationsContext);

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Calculate unread count whenever notifications change
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const now = new Date();
    const newNotification: Notification = {
      id: uuidv4(),
      createdAt: now,
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notifications based on priority
    if (notification.priority === 'high') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default',
      });
    }
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };
  
  // Dismiss (remove) a notification
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // Dismiss all notifications
  const dismissAll = () => {
    setNotifications([]);
  };
  
  // Get file processing notifications
  const getFileProcessingNotifications = () => {
    return notifications.filter(n => n.type === 'file-processing');
  };
  
  // Load notifications from local storage on component mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        // Convert string dates back to Date objects
        const processedNotifications = parsedNotifications.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
        }));
        setNotifications(processedNotifications);
      } catch (error) {
        console.error('Failed to parse stored notifications:', error);
      }
    }
  }, []);
  
  // Save notifications to local storage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Clean up expired notifications
  useEffect(() => {
    const now = new Date();
    setNotifications(prev => 
      prev.filter(n => !n.expiresAt || new Date(n.expiresAt) > now)
    );
    
    // Set up interval to check for expired notifications
    const interval = setInterval(() => {
      const currentTime = new Date();
      setNotifications(prev => 
        prev.filter(n => !n.expiresAt || new Date(n.expiresAt) > currentTime)
      );
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
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
        dismissAll,
        getFileProcessingNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
