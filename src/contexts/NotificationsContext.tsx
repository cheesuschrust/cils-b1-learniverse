
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';

// Notification type definitions
export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'achievement';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: Date;
  priority: NotificationPriority;
  actionLabel?: string;
  actionUrl?: string;
  actionHandler?: () => void;
  expiresAt?: Date;
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  hasUnreadNotifications: boolean;
  unreadCount: number;
}

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
  const hasUnreadNotifications = notifications.some(n => !n.isRead);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
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
                timestamp: new Date(n.timestamp),
                expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
              }))
            );
          }
          
          // In a real app, also fetch from database
          // const { data, error } = await supabase
          //   .from('user_notifications')
          //   .select('*')
          //   .eq('user_id', user.id)
          //   .order('created_at', { ascending: false })
          //   .limit(maxNotifications);
          // 
          // if (error) throw error;
          // 
          // if (data) {
          //   // Transform database format to our notification format
          //   const dbNotifications: Notification[] = data.map(n => ({
          //     id: n.id,
          //     title: n.title,
          //     message: n.message,
          //     type: n.type as NotificationType,
          //     isRead: n.is_read,
          //     timestamp: new Date(n.created_at),
          //     priority: n.priority as NotificationPriority,
          //     actionLabel: n.action_label,
          //     actionUrl: n.action_url,
          //     expiresAt: n.expires_at ? new Date(n.expires_at) : undefined
          //   }));
          //   
          //   setNotifications(dbNotifications);
          // }
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
        prev.filter(n => !n.expiresAt || n.expiresAt > now)
      );
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Add a notification
  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      isRead: false,
      timestamp: new Date()
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
    
    // In a real app, also save to database
    // if (user) {
    //   supabase
    //     .from('user_notifications')
    //     .insert({
    //       user_id: user.id,
    //       title: notification.title,
    //       message: notification.message,
    //       type: notification.type,
    //       is_read: false,
    //       priority: notification.priority,
    //       action_label: notification.actionLabel,
    //       action_url: notification.actionUrl,
    //       expires_at: notification.expiresAt?.toISOString()
    //     })
    //     .then((result) => {
    //       if (result.error) {
    //         console.error('Error saving notification to database:', result.error);
    //       }
    //     });
    // }
  };
  
  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // In a real app, also remove from database
    // if (user) {
    //   supabase
    //     .from('user_notifications')
    //     .delete()
    //     .eq('id', id)
    //     .then((result) => {
    //       if (result.error) {
    //         console.error('Error deleting notification from database:', result.error);
    //       }
    //     });
    // }
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
    
    // In a real app, also update in database
    // if (user) {
    //   supabase
    //     .from('user_notifications')
    //     .update({ is_read: true })
    //     .eq('id', id)
    //     .then((result) => {
    //       if (result.error) {
    //         console.error('Error updating notification in database:', result.error);
    //       }
    //     });
    // }
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
    
    // In a real app, also update all in database
    // if (user) {
    //   supabase
    //     .from('user_notifications')
    //     .update({ is_read: true })
    //     .eq('user_id', user.id)
    //     .then((result) => {
    //       if (result.error) {
    //         console.error('Error updating all notifications in database:', result.error);
    //       }
    //     });
    // }
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    
    // In a real app, also clear from database
    // if (user) {
    //   supabase
    //     .from('user_notifications')
    //     .delete()
    //     .eq('user_id', user.id)
    //     .then((result) => {
    //       if (result.error) {
    //         console.error('Error clearing notifications from database:', result.error);
    //       }
    //     });
    // }
    
    // Clear from localStorage
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        hasUnreadNotifications,
        unreadCount
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
