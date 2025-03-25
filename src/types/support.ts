
export type SupportTicketStatus = 'open' | 'in-progress' | 'closed' | 'pending' | 'resolved';
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type SupportTicketCategory = 'technical' | 'billing' | 'feature-request' | 'content' | 'account' | 'other';

export interface SupportTicketMessage {
  id: string;
  content: string;
  timestamp: Date;
  authorId: string;
  authorName: string;
  authorType: 'user' | 'admin' | 'system';
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: SupportTicketCategory;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  caseNumber?: string;
  meta?: Record<string, any>;
  messages?: SupportTicketMessage[];
}

export interface SupportTicketProps {
  id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: SupportTicketCategory;
  userName: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  onReply: () => void;
  onClose: () => void;
  onReopen: () => void;
  messages?: SupportTicketMessage[];
}

export interface SupportTicketItemProps {
  ticket: SupportTicketProps;
  onRead: (id: string) => void;
  onReply: (id: string) => void;
  onClose: (id: string) => void;
  onReopen: (id: string) => void;
}

export interface SupportTicketMessageProps {
  id: string;
  content: string;
  timestamp: Date;
  authorName: string;
  authorType: 'user' | 'admin' | 'system';
  attachments?: string[];
}

export interface NotificationItemProps {
  notification: any;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}
