
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationPreferences } from '@/types/notification';
import { v4 as uuidv4 } from 'uuid';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => string;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  addNotification: () => '',
  markAsRead: () => {},
  dismissNotification: () => {},
  dismissAll: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const processedNotifications = parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        setNotifications(processedNotifications);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ): string => {
    const id = uuidv4();
    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
    return id;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        dismissNotification,
        dismissAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
