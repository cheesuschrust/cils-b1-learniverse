
import { API } from './api';
import { EmailSettings } from '@/contexts/shared-types';

export type EmailProvider = 'smtp' | 'sendgrid' | 'mailgun';

export interface EmailProviderConfig {
  enableSsl: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
  cc?: string | string[];
  bcc?: string | string[];
}

export class EmailService {
  static async getEmailSettings(): Promise<EmailSettings> {
    return API.handleRequest<EmailSettings>('/admin/email/settings', 'GET');
  }
  
  static async updateEmailSettings(settings: EmailSettings): Promise<EmailSettings> {
    return API.handleRequest<EmailSettings>('/admin/email/settings', 'PUT', settings);
  }
  
  static async sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string }> {
    return API.handleRequest<{ success: boolean; messageId?: string }>('/admin/email/send', 'POST', params);
  }
  
  static async sendTestEmail(email: string): Promise<{ success: boolean }> {
    return API.handleRequest<{ success: boolean }>('/admin/email/test', 'POST', { email });
  }
  
  static async getTemplates(): Promise<Record<string, EmailTemplate>> {
    return API.handleRequest<Record<string, EmailTemplate>>('/admin/email/templates', 'GET');
  }
  
  static async updateTemplate(name: string, template: EmailTemplate): Promise<{ success: boolean }> {
    return API.handleRequest<{ success: boolean }>(`/admin/email/templates/${name}`, 'PUT', template);
  }
  
  static async getEmailStats(): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    period: string;
  }> {
    return API.handleRequest<{
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
      period: string;
    }>('/admin/email/stats', 'GET');
  }
}

export default EmailService;
