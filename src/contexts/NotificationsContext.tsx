
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/types/notification';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  unreadCount: number;
  markAllAsRead: () => void;
  getFileProcessingNotifications: () => Notification[];
}

// Mock initial notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New learning features available',
    message: 'Check out the new listening exercises in the app.',
    type: 'feature',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
    link: '/listening'
  },
  {
    id: '2',
    title: 'Your flashcards are ready for review',
    message: '5 flashcards are due for review today.',
    type: 'reminder',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    link: '/flashcards'
  },
  {
    id: '3',
    title: 'Practice streak achieved!',
    message: 'Congratulations! You have practiced for 7 days in a row.',
    type: 'achievement',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: false,
    icon: 'trophy'
  },
  {
    id: '4',
    title: 'Italian audio files processed',
    message: 'Your uploaded Italian pronunciation files have been analyzed.',
    type: 'file-processing',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: false,
    metadata: {
      fileType: 'audio',
      fileName: 'pronunciation-practice.mp3',
      processingResult: 'success'
    }
  }
];

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date(),
      read: false
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
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
  
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };
  
  const getFileProcessingNotifications = () => {
    return notifications.filter(notification => notification.type === 'file-processing');
  };
  
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        dismissNotification,
        unreadCount,
        markAllAsRead,
        getFileProcessingNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
