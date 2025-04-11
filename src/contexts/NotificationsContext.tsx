
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase-client';
import { Notification, NotificationType, NotificationPriority, NotificationsContextType } from '@/types/notification';

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ 
  children, 
  maxNotifications = 50 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  // Calculate if there are unread notifications and count them
  const hasUnreadNotifications = notifications.some(n => !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Load notifications from localStorage on initial load
  useEffect(() => {
    if (user) {
      const loadNotifications = async () => {
        try {
          // In a production app, fetch from database
          // For now, we'll use localStorage as a fallback
          const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
          if (savedNotifications) {
            // Parse the saved notifications and convert string timestamps back to Date objects
            const parsedNotifications: Notification[] = JSON.parse(savedNotifications);
            setNotifications(
              parsedNotifications.map(n => ({
                ...n,
                createdAt: new Date(n.createdAt),
                expires: n.expires ? new Date(n.expires) : undefined
              }))
            );
          }
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      };
      
      loadNotifications();
    }
  }, [user, maxNotifications]);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);
  
  // Clean up expired notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setNotifications(prev => 
        prev.filter(n => !n.expires || n.expires > now)
      );
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Add a notification
  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      read: false,
      createdAt: new Date()
    };
    
    setNotifications(prev => {
      // Add to the beginning of the array
      const updated = [newNotification, ...prev];
      
      // If we have more than maxNotifications, remove the oldest ones
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications);
      }
      
      return updated;
    });
  };
  
  // Remove a notification
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // In a real app, also remove from database
    if (user) {
      // Database removal logic would go here
    }
  };
  
  // Remove a notification (alias for dismissNotification for compatibility)
  const removeNotification = (id: string) => {
    dismissNotification(id);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    
    // In a real app, also clear from database
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    
    // In a real app, also update in database
    if (user) {
      // Database update logic would go here
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    
    // In a real app, also update all in database
    if (user) {
      // Database update logic would go here
    }
  };
  
  // Clear all notifications (alias for compatibility)
  const clearAll = () => {
    clearAllNotifications();
  };
  
  // Get notifications related to file processing
  const getFileProcessingNotifications = () => {
    return notifications.filter(n => 
      n.metadata?.type === 'file-processing' || 
      n.type === 'system' && n.message.toLowerCase().includes('file')
    );
  };

  // Schedule a reminder
  const scheduleReminder = (date: Date, notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const id = uuidv4();
    
    const timeoutMs = date.getTime() - new Date().getTime();
    if (timeoutMs <= 0) {
      // If the date is in the past, add notification immediately
      addNotification(notification);
      return id;
    }
    
    // Schedule the notification
    setTimeout(() => {
      addNotification(notification);
    }, timeoutMs);
    
    return id;
  };
  
  // Cancel a scheduled reminder (not fully implemented without a proper reminder system)
  const cancelReminder = (id: string) => {
    // This would cancel a scheduled reminder in a real implementation
    console.log(`Reminder ${id} would be cancelled if this was fully implemented`);
  };
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        dismissNotification,
        removeNotification,
        unreadCount,
        getFileProcessingNotifications,
        clearAllNotifications,
        scheduleReminder,
        cancelReminder
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
