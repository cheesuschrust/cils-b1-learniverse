
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'educational' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing' | 'past_due' | 'unpaid';
export type SubscriptionInterval = 'monthly' | 'quarterly' | 'annual';
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'apple_pay' | 'google_pay';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  value: number | boolean | string;
}

export interface SubscriptionPlanDetails {
  id: string;
  name: string;
  description: string;
  type: SubscriptionPlan;
  prices: {
    interval: SubscriptionInterval;
    amount: number;
    currency: string;
    trialDays?: number;
    setupFee?: number;
  }[];
  features: SubscriptionFeature[];
  limitations: {
    questionsPerDay?: number;
    exercisesPerDay?: number;
    maxSavedItems?: number;
    downloadableContent: boolean;
    adsRemoved: boolean;
    prioritySupport: boolean;
    maxUsers?: number; // For educational/enterprise plans
  };
  recommended?: boolean;
  availableForPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriod: {
    start: Date;
    end: Date;
  };
  interval: SubscriptionInterval;
  price: {
    amount: number;
    currency: string;
  };
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    lastFour?: string;
    expiryDate?: string;
    cardType?: string;
    billingAddress?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      country: string;
      postalCode: string;
    };
  };
  autoRenew: boolean;
  startedAt: Date;
  canceledAt?: Date;
  trialEnd?: Date;
  nextBillingDate?: Date;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  description: string;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
  paidAt?: Date;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  billingDetails?: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      country: string;
      postalCode: string;
    };
    taxId?: string;
  };
  downloadUrl?: string;
}
