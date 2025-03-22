
/**
 * Email Service
 * 
 * Provides functionality for sending emails through various providers
 * and generating temporary email addresses for users.
 */

import { v4 as uuidv4 } from 'uuid';

export type EmailProvider = 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'gmail' | 'temporaryEmail';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailTemplates {
  verification: EmailTemplate;
  passwordReset: EmailTemplate;
  welcome: EmailTemplate;
}

export interface EmailProviderConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  region?: string;
  enableSsl?: boolean;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
}

export interface EmailSettings {
  provider: EmailProvider;
  fromEmail: string;
  fromName: string;
  config: EmailProviderConfig;
  templates: EmailTemplates;
  temporaryInboxDuration?: number; // In hours
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

// In-memory storage for simulating temporary email inboxes
interface TemporaryEmailMessage {
  id: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  receivedAt: Date;
}

interface TemporaryEmailInbox {
  address: string;
  userId: string;
  messages: TemporaryEmailMessage[];
  createdAt: Date;
  expiresAt: Date;
}

// Mock data store for temporary inboxes
const temporaryInboxes: Map<string, TemporaryEmailInbox> = new Map();

/**
 * Send an email using the configured provider
 */
export const sendEmail = async (
  data: EmailData, 
  settings: EmailSettings
): Promise<boolean> => {
  try {
    console.log('Sending email:', {
      to: data.to,
      subject: data.subject,
      provider: settings.provider
    });
    
    // Set sender information if not provided
    const emailData = {
      ...data,
      from: data.from || `${settings.fromName} <${settings.fromEmail}>`,
    };
    
    switch (settings.provider) {
      case 'temporaryEmail':
        return await sendViaTemporaryEmail(emailData);
      case 'smtp':
        return await sendViaSmtp(emailData, settings.config);
      case 'sendgrid':
        return await sendViaSendGrid(emailData, settings.config);
      case 'mailgun':
        return await sendViaMailgun(emailData, settings.config);
      case 'ses':
        return await sendViaSes(emailData, settings.config);
      case 'gmail':
        return await sendViaGmail(emailData, settings.config);
      default:
        throw new Error(`Unsupported email provider: ${settings.provider}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Generate a verification email
 */
export const sendVerificationEmail = async (
  toEmail: string,
  name: string,
  verificationToken: string,
  settings: EmailSettings
): Promise<boolean> => {
  try {
    const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;
    
    // Get the template
    const template = settings.templates.verification;
    
    // Replace placeholders
    const subject = template.subject.replace('{{name}}', name);
    const html = template.body
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{verificationLink\}\}/g, verificationUrl);
    
    // Send the email
    return await sendEmail(
      {
        to: toEmail,
        subject,
        html,
        text: stripHtmlTags(html),
      },
      settings
    );
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Generate a password reset email
 */
export const sendPasswordResetEmail = async (
  toEmail: string,
  name: string,
  resetToken: string,
  settings: EmailSettings
): Promise<boolean> => {
  try {
    const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    // Get the template
    const template = settings.templates.passwordReset;
    
    // Replace placeholders
    const subject = template.subject.replace('{{name}}', name);
    const html = template.body
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{resetLink\}\}/g, resetUrl);
    
    // Send the email
    return await sendEmail(
      {
        to: toEmail,
        subject,
        html,
        text: stripHtmlTags(html),
      },
      settings
    );
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

/**
 * Generate a welcome email
 */
export const sendWelcomeEmail = async (
  toEmail: string,
  name: string,
  settings: EmailSettings
): Promise<boolean> => {
  try {
    // Get the template
    const template = settings.templates.welcome;
    
    // Replace placeholders
    const subject = template.subject.replace('{{name}}', name);
    const html = template.body.replace(/\{\{name\}\}/g, name);
    
    // Send the email
    return await sendEmail(
      {
        to: toEmail,
        subject,
        html,
        text: stripHtmlTags(html),
      },
      settings
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

/**
 * Generate a temporary email address for a user
 */
export const generateTemporaryEmail = (userId: string, durationHours: number = 24): string => {
  // Generate a random username part
  const randomPart = Math.random().toString(36).substring(2, 8);
  const emailAddress = `temp-${randomPart}@cittadinanza-b2.com`;
  
  // Create an expiration date
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
  
  // Store the inbox
  temporaryInboxes.set(emailAddress, {
    address: emailAddress,
    userId,
    messages: [],
    createdAt: now,
    expiresAt,
  });
  
  return emailAddress;
};

/**
 * Get messages from a temporary email inbox
 */
export const getTemporaryEmailMessages = (emailAddress: string): TemporaryEmailMessage[] => {
  const inbox = temporaryInboxes.get(emailAddress);
  if (!inbox) {
    return [];
  }
  return [...inbox.messages];
};

/**
 * Check if a temporary email belongs to a user
 */
export const isTemporaryEmailOwner = (emailAddress: string, userId: string): boolean => {
  const inbox = temporaryInboxes.get(emailAddress);
  return !!inbox && inbox.userId === userId;
};

/**
 * Clean up expired temporary email inboxes
 */
export const cleanupExpiredInboxes = (): void => {
  const now = new Date();
  for (const [address, inbox] of temporaryInboxes.entries()) {
    if (inbox.expiresAt < now) {
      temporaryInboxes.delete(address);
    }
  }
};

// Set up a periodic cleanup
setInterval(cleanupExpiredInboxes, 60 * 60 * 1000); // Run once per hour

// Provider-specific implementations
const sendViaTemporaryEmail = async (data: EmailData): Promise<boolean> => {
  // This simulates delivery to a temporary inbox
  if (data.to.includes('@cittadinanza-b2.com')) {
    const inbox = temporaryInboxes.get(data.to);
    if (inbox) {
      inbox.messages.push({
        id: uuidv4(),
        from: data.from || '',
        subject: data.subject,
        html: data.html,
        text: data.text || stripHtmlTags(data.html),
        receivedAt: new Date(),
      });
      return true;
    }
  }
  
  // For non-temporary emails, we're simulating successful delivery
  console.log(`[Temporary Email] Would send to ${data.to}: ${data.subject}`);
  return true;
};

const sendViaSmtp = async (data: EmailData, config: EmailProviderConfig): Promise<boolean> => {
  // In a real implementation, this would use a library like nodemailer
  console.log(`[SMTP] Would send via ${config.host}:${config.port} to ${data.to}: ${data.subject}`);
  return true;
};

const sendViaSendGrid = async (data: EmailData, config: EmailProviderConfig): Promise<boolean> => {
  // In a real implementation, this would use the SendGrid API
  console.log(`[SendGrid] Would send to ${data.to}: ${data.subject}`);
  return true;
};

const sendViaMailgun = async (data: EmailData, config: EmailProviderConfig): Promise<boolean> => {
  // In a real implementation, this would use the Mailgun API
  console.log(`[Mailgun] Would send to ${data.to}: ${data.subject}`);
  return true;
};

const sendViaSes = async (data: EmailData, config: EmailProviderConfig): Promise<boolean> => {
  // In a real implementation, this would use the AWS SDK for SES
  console.log(`[SES] Would send to ${data.to}: ${data.subject}`);
  return true;
};

const sendViaGmail = async (data: EmailData, config: EmailProviderConfig): Promise<boolean> => {
  // In a real implementation, this would use the Gmail API
  console.log(`[Gmail] Would send to ${data.to}: ${data.subject}`);
  return true;
};

// Helper function to strip HTML tags for plain text email
const stripHtmlTags = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};
