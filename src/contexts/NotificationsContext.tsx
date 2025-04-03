
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase-client';
import {
  Notification,
  NotificationType,
  ScheduledNotification,
  NotificationPriority,
  NotificationAction,
} from '@/types/notification';
import { v4 as uuidv4 } from 'uuid';

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => string;
  removeNotification: (id: string) => Promise<boolean>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  clearAll: () => Promise<boolean>;
  scheduleNotification: (notification: Omit<ScheduledNotification, 'id'>) => Promise<string>;
  cancelScheduledNotification: (id: string) => Promise<boolean>;
  scheduleReminder: (title: string, message: string, reminderDate: Date) => Promise<string>;
  cancelReminder: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch notifications on load and when user changes
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    // Set up real-time notifications
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = normalizeNotification(payload.new);
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show toast for new notification if priority is high
          if (newNotification.priority === 'high') {
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: getVariantFromType(newNotification.type),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Calculate unread count when notifications change
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fetch notifications from the database
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Get recent notifications (limit to 50)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Normalize and set notifications
      const normalized = data.map(normalizeNotification);
      setNotifications(normalized);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Helper to normalize notification from DB format
  const normalizeNotification = (dbNotification: any): Notification => {
    return {
      id: dbNotification.id,
      title: dbNotification.title,
      message: dbNotification.message,
      type: dbNotification.type as NotificationType,
      createdAt: new Date(dbNotification.created_at),
      read: dbNotification.read,
      actions: dbNotification.actions,
      expires: dbNotification.expires ? new Date(dbNotification.expires) : undefined,
      icon: dbNotification.icon,
      link: dbNotification.link,
      priority: dbNotification.priority as NotificationPriority,
      metadata: dbNotification.metadata,
    };
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): string => {
    const id = uuidv4();
    const now = new Date();

    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: now,
      read: false,
    };

    // Add locally first for immediate UI update
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Then persist to database if user is logged in
    if (user) {
      persistNotification(newNotification);
    }

    // Show toast for high priority notifications
    if (notification.priority === 'high') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: getVariantFromType(notification.type),
      });
    }

    return id;
  };

  // Save notification to database
  const persistNotification = async (notification: Notification): Promise<void> => {
    if (!user) return;

    try {
      await supabase.from('notifications').insert({
        id: notification.id,
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        created_at: notification.createdAt.toISOString(),
        read: notification.read,
        actions: notification.actions,
        expires: notification.expires?.toISOString(),
        icon: notification.icon,
        link: notification.link,
        priority: notification.priority,
        metadata: notification.metadata,
      });
    } catch (error) {
      console.error('Error persisting notification:', error);
    }
  };

  // Remove a notification
  const removeNotification = async (id: string): Promise<boolean> => {
    try {
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      // Update in database if user is logged in
      if (user) {
        await supabase.from('notifications').delete().eq('id', id);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing notification:', error);
      return false;
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string): Promise<boolean> => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      // Update in database if user is logged in
      if (user) {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);
      }
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<boolean> => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      // Update in database if user is logged in
      if (user) {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  // Clear all notifications
  const clearAll = async (): Promise<boolean> => {
    try {
      setNotifications([]);
      setUnreadCount(0);

      // Update in database if user is logged in
      if (user) {
        await supabase
          .from('notifications')
          .delete()
          .eq('user_id', user.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
  };

  // Schedule a notification for later
  const scheduleNotification = async (
    notification: Omit<ScheduledNotification, 'id'>
  ): Promise<string> => {
    if (!user) return '';

    try {
      const id = uuidv4();
      
      const { error } = await supabase.from('scheduled_notifications').insert({
        id,
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        scheduled_for: notification.scheduledFor.toISOString(),
        metadata: notification.metadata,
      });

      if (error) throw error;
      
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  };

  // Cancel a scheduled notification
  const cancelScheduledNotification = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error canceling scheduled notification:', error);
      return false;
    }
  };

  // Helper function to schedule a reminder
  const scheduleReminder = async (
    title: string,
    message: string,
    reminderDate: Date
  ): Promise<string> => {
    return scheduleNotification({
      title,
      message,
      type: 'reminder',
      scheduledFor: reminderDate,
      metadata: { type: 'reminder' },
    });
  };

  // Helper function to cancel a reminder
  const cancelReminder = async (id: string): Promise<void> => {
    await cancelScheduledNotification(id);
  };

  // Helper function to map notification type to toast variant
  const getVariantFromType = (type: NotificationType): "default" | "destructive" | undefined => {
    switch (type) {
      case 'achievement':
      case 'milestone':
        return 'default';
      case 'streak': 
        return type === 'streak' ? 'destructive' : 'default';
      default:
        return 'default';
    }
  };

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    scheduleNotification,
    cancelScheduledNotification,
    scheduleReminder,
    cancelReminder,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
