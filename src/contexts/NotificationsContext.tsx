
import React, { createContext, useContext, useState } from 'react';
import { Notification, NotificationsContextType } from '@/types/notification';

// Initial state
const initialState: { notifications: Notification[] } = {
  notifications: []
};

// Create the context
const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => '',
  removeNotification: () => {},
  dismissNotification: () => {}, // Added
  markAsRead: () => {},
  markAllAsRead: () => {}, // Added
  clearAll: () => {},
  dismissAll: () => {}, // Alias for clearAll
  dismissAllNotifications: () => {}, // Alias for clearAll
  getFileProcessingNotifications: () => [] // Added
});

// Provider component
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Calculate unread count
  const unreadCount = state.notifications.filter(n => !n.read).length;

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const id = `notification-${Date.now()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      timestamp: new Date(), // For compatibility
      read: false
    };

    setState(prevState => ({
      ...prevState,
      notifications: [newNotification, ...prevState.notifications]
    }));

    return id;
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setState(prevState => ({
      ...prevState,
      notifications: prevState.notifications.filter(n => n.id !== id)
    }));
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setState(prevState => ({
      ...prevState,
      notifications: prevState.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setState(prevState => ({
      ...prevState,
      notifications: prevState.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  // Clear all notifications
  const clearAll = () => {
    setState(prevState => ({
      ...prevState,
      notifications: []
    }));
  };

  // Get file processing notifications
  const getFileProcessingNotifications = () => {
    return state.notifications.filter(n => n.type === 'file-processing');
  };

  // Aliases for consistency
  const dismissNotification = removeNotification;
  const dismissAll = clearAll;
  const dismissAllNotifications = clearAll;

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        removeNotification,
        dismissNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        dismissAll,
        dismissAllNotifications,
        unreadCount,
        getFileProcessingNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook for accessing notifications context
export const useNotifications = () => useContext(NotificationsContext);

export default NotificationsContext;
