
// Type definitions for licensing and institutional access

export type LicenseType = 'university' | 'k12' | 'language-school' | 'corporate';
export type LicenseStatus = 'active' | 'expired' | 'trial' | 'pending' | 'suspended';
export type LicensePlan = 'basic' | 'standard' | 'premium' | 'enterprise' | 'custom';
export type RenewalStatus = 'auto' | 'manual' | 'pending' | 'no-renewal';

export interface License {
  id: string;
  name: string;
  type: LicenseType;
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  contactName: string;
  contactEmail: string;
  customization: {
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string;
    };
    domainRestriction?: string[];
    ssoEnabled?: boolean;
    customDomain?: string;
  };
  value: number;
  renewalStatus: string;
}

export interface LicenseFeature {
  id: string;
  name: string;
  description: string;
  includedInPlans: LicensePlan[];
  limitedInPlans?: {
    plan: LicensePlan;
    limit: number;
  }[];
}

export interface LicenseReport {
  licenseId: string;
  period: {
    start: Date;
    end: Date;
  };
  usageStats: {
    totalLogins: number;
    uniqueUsers: number;
    averageSessionDuration: number;
    contentAccessed: number;
    peakConcurrentUsers: number;
  };
  seatUtilization: {
    allocated: number;
    utilized: number;
    utilizationRate: number;
  };
  featureUsage: {
    featureId: string;
    featureName: string;
    usageCount: number;
    uniqueUsers: number;
  }[];
}

export interface LicenseInvitation {
  id: string;
  licenseId: string;
  email: string;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  role?: string;
}

export interface LicenseUser {
  id: string;
  licenseId: string;
  userId: string;
  assignedAt: Date;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  usage: {
    lastActive: Date;
    totalSessions: number;
    totalTimeSpent: number; // in minutes
  };
}
