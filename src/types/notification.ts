
export interface NotificationAction {
  id: string;
  label: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actions?: NotificationAction[];
}

export interface NotificationPreference {
  type: string;
  enabled: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: NotificationPreference[];
}
