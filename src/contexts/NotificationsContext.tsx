
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Notification, NotificationType } from '@/types/notification';

// Use 'export type' for isolatedModules
export type { Notification }; // Re-export for component imports

// Define the context interface
interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  dismissAll: () => void; // Alias for clearAll
  unreadCount: number;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void; // Alias for removeNotification
  dismissAllNotifications: () => void; // Alias for clearAll
  getFileProcessingNotifications: () => Notification[];
}

// Create the context with a default value
const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  addNotification: () => "",
  removeNotification: () => {},
  markAsRead: () => {},
  clearAll: () => {},
  dismissAll: () => {}, // Alias for clearAll
  unreadCount: 0,
  markAllAsRead: () => {},
  dismissNotification: () => {}, // Alias for removeNotification 
  dismissAllNotifications: () => {}, // Alias for clearAll
  getFileProcessingNotifications: () => [],
});

// Create a hook for easy context usage
export const useNotifications = () => useContext(NotificationsContext);

// Create the provider component
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  // Add a notification
  const addNotification = useCallback((notification: Notification) => {
    const id = notification.id || Math.random().toString(36).substring(2, 11);
    const newNotification = {
      ...notification,
      id,
      createdAt: notification.createdAt || new Date(),
      read: notification.read || false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    return id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  // Get file processing notifications
  const getFileProcessingNotifications = useCallback(() => {
    return notifications.filter((notification) => notification.type === 'file-processing');
  }, [notifications]);

  // Create the context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    dismissAll: clearAll, // Alias for clearAll
    unreadCount,
    markAllAsRead,
    dismissNotification: removeNotification, // Alias for removeNotification
    dismissAllNotifications: clearAll, // Alias for clearAll
    getFileProcessingNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
