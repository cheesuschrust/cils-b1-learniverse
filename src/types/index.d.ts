
// Define global types here

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    [key: string]: any;
  };
  preferredLanguage: 'english' | 'italian' | 'both';
  progress: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: Date;
}

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  isAdmin: boolean;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

interface PrivacySettings {
  allowDataCollection: boolean;
  allowCookies: boolean;
  allowThirdPartySharing: boolean;
  marketingEmails: boolean;
}

interface EmailConfig {
  service: 'smtp' | 'sendgrid' | 'mailchimp' | 'ses';
  apiKey?: string;
  fromEmail: string;
  replyToEmail: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  templates: {
    welcome: string;
    passwordReset: string;
    notification: string;
  };
}

interface ShopifyIntegration {
  apiKey: string;
  apiSecret: string;
  storeDomain: string;
  accessToken: string;
  webhookUrl: string;
  isActive: boolean;
}

interface SEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  siteUrl: string;
  openGraph: {
    title: string;
    description: string;
    imageUrl: string;
  };
  twitter: {
    cardType: 'summary' | 'summary_large_image';
    handle: string;
  };
  structuredData: {
    type: string;
    name: string;
    description: string;
  };
}
