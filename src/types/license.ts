
export type LicenseType = 'university' | 'k12' | 'language-school' | 'corporate';
export type LicenseStatus = 'active' | 'expired' | 'pending' | 'canceled';
export type RenewalStatus = 'auto' | 'manual' | 'pending' | 'no-renewal';

export interface License {
  id: string;
  name: string;
  type: LicenseType;
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: LicenseStatus;
  contactName: string;
  contactEmail: string;
  customization: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    domainRestriction?: string[];
  };
  value: number; // monetary value
  renewalStatus: RenewalStatus;
}

export interface LicenseStats {
  total: number;
  active: number;
  expiringSoon: number;
  revenue: {
    monthly: number;
    yearly: number;
    lifetime: number;
  };
  utilizationRate: number; // percentage of seats being used
  mostPopularType: LicenseType;
  mostPopularPlan: string;
  renewalRate: number; // percentage
}

export interface LicenseUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  lastLogin?: Date;
  dateAdded: Date;
  status: 'active' | 'inactive' | 'pending';
}
