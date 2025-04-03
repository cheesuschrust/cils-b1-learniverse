
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Notification, NotificationType } from '@/types/notification';

// Context interface
interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  dismissNotification: (id: string) => void;
  dismissAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  hasUnreadOfType: (type: NotificationType) => boolean;
  scheduleReminder: (title: string, message: string, scheduledFor: Date) => Promise<string>;
  cancelReminder: (id: string) => Promise<void>;
}

// Create the context with a default value
const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => '',
  removeNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
  dismissNotification: () => {},
  dismissAllNotifications: () => {},
  getNotificationsByType: () => [],
  hasUnreadOfType: () => false,
  scheduleReminder: async () => '',
  cancelReminder: async () => {},
});

// Create a hook for easy context usage
export const useNotifications = () => useContext(NotificationsContext);

// Create the provider component
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  // Fetch notifications from database on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  // Fetch notifications from database
  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedNotifications = data.map(item => ({
        ...item,
        createdAt: new Date(item.created_at),
        expires: item.expires ? new Date(item.expires) : undefined,
      })) as Notification[];
      
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Add a notification
  const addNotification = useCallback(async (notification: Notification) => {
    if (!user?.id) return '';
    
    const id = notification.id || crypto.randomUUID();
    const newNotification = {
      ...notification,
      id,
      user_id: user.id,
      created_at: new Date().toISOString(),
      read: false,
    };

    try {
      const { error } = await supabase
        .from('notifications')
        .insert([newNotification]);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => [
        {
          ...notification,
          id,
          createdAt: new Date(),
          read: false,
        },
        ...prev
      ]);
      
      return id;
    } catch (error) {
      console.error('Error adding notification:', error);
      return '';
    }
  }, [user?.id]);

  // Remove a notification
  const removeNotification = useCallback(async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  }, [user?.id]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user?.id]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id || notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.id, notifications]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!user?.id || notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, [user?.id, notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter(notification => notification.type === type);
    },
    [notifications]
  );

  // Check if there are unread notifications of a specific type
  const hasUnreadOfType = useCallback(
    (type: NotificationType) => {
      return notifications.some(notification => notification.type === type && !notification.read);
    },
    [notifications]
  );

  // Schedule a reminder notification
  const scheduleReminder = useCallback(async (title: string, message: string, scheduledFor: Date): Promise<string> => {
    if (!user?.id) return '';
    
    const id = crypto.randomUUID();
    
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert([{
          id,
          user_id: user.id,
          title,
          message,
          scheduled_for: scheduledFor.toISOString(),
          type: 'reminder',
          created_at: new Date().toISOString(),
        }]);
      
      if (error) throw error;
      
      return id;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      return '';
    }
  }, [user?.id]);

  // Cancel a scheduled reminder
  const cancelReminder = useCallback(async (id: string): Promise<void> => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error canceling reminder:', error);
    }
  }, [user?.id]);

  // Aliases for semantic clarity
  const dismissNotification = removeNotification;
  const dismissAllNotifications = clearAll;

  // Create the context value
  const value = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    dismissNotification,
    dismissAllNotifications,
    getNotificationsByType,
    hasUnreadOfType,
    scheduleReminder,
    cancelReminder,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
