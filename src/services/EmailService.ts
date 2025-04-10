
// Email provider types
export type EmailProvider = 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'gmail' | 'temporaryEmail';

// Config for email providers
export interface EmailProviderConfig {
  enableSsl?: boolean; // Make this optional to match the shared-types
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  domain?: string;
  accessKey?: string;
  secretKey?: string;
  region?: string;
}

// Template interface
export interface EmailTemplate {
  subject: string;
  body: string;
}

// Email settings interface
export interface EmailSettings {
  provider: EmailProvider;
  fromEmail: string;
  fromName: string;
  config: EmailProviderConfig;
  templates: {
    verification: EmailTemplate;
    passwordReset: EmailTemplate;
    welcome: EmailTemplate;
    newsletter: EmailTemplate;
    unsubscribe: EmailTemplate;
  };
  temporaryInboxDuration?: number;
}

// Mock email sending service functions
export const sendVerificationEmail = async (
  email: string, 
  name: string, 
  token: string,
  settings: EmailSettings
): Promise<boolean> => {
  console.log(`Sending verification email to ${email} with token ${token}`);
  return true;
};

export const sendPasswordResetEmail = async (
  email: string, 
  name: string, 
  token: string,
  settings: EmailSettings
): Promise<boolean> => {
  console.log(`Sending password reset email to ${email} with token ${token}`);
  return true;
};

export const sendWelcomeEmail = async (
  email: string, 
  name: string,
  settings: EmailSettings
): Promise<boolean> => {
  console.log(`Sending welcome email to ${email}`);
  return true;
};

export const sendNewsletterEmail = async (
  recipients: string[],
  subject: string,
  content: string,
  settings: EmailSettings
): Promise<boolean> => {
  console.log(`Sending newsletter "${subject}" to ${recipients.length} recipients`);
  return true;
};

export const sendUnsubscribeConfirmation = async (
  email: string,
  settings: EmailSettings
): Promise<boolean> => {
  console.log(`Sending unsubscribe confirmation to ${email}`);
  return true;
};
