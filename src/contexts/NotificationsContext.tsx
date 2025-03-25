import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  createdAt: Date;
  duration?: number;
  read?: boolean;
}

export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  dismissAll: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const displayedNotifications = notifications.filter(notification => !notification.read);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>): string => {
    const id = uuid();
    const newNotification: Notification = {
      id,
      createdAt: new Date(),
      read: false,
      ...notification,
    };
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string): void => {
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
  }, []);

  const markAsRead = useCallback((id: string): void => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback((): void => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearAll = useCallback((): void => {
    setNotifications([]);
  }, []);
  
  const dismissAll = () => {
    setNotifications([]);
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  useEffect(() => {
    const autoDismiss = () => {
      setNotifications(prevNotifications => {
        return prevNotifications.filter(notification => {
          if (notification.duration) {
            const now = new Date().getTime();
            const created = notification.createdAt.getTime();
            return (now - created) < notification.duration;
          }
          return true;
        });
      });
    };

    const intervalId = setInterval(autoDismiss, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <NotificationsContext.Provider value={{
      notifications: displayedNotifications,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      dismissAll,
      unreadCount
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
