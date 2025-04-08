
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid';
export type SubscriptionPlan = 'free' | 'premium' | 'enterprise';

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriod: {
    start: Date;
    end: Date;
  };
  interval: 'month' | 'year' | null;
  price: {
    amount: number;
    currency: string;
  };
  paymentMethod?: string;
  autoRenew: boolean;
  startedAt: Date;
  canceledAt?: Date;
  trialEnd?: Date;
  nextBillingDate?: Date;
  metadata?: Record<string, any>;
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export interface SubscriptionPlanDetails {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: SubscriptionFeature[];
  isPopular?: boolean;
  isEnterprise?: boolean;
}
