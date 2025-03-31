
// Common license interfaces to fix case sensitivity issues

export type LicenseType = 'basic' | 'pro' | 'enterprise' | 'educational' | 'trial';
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'pending';
export type RenewalStatus = 'auto' | 'manual' | 'none';

export interface License {
  id: string;
  name: string;
  type: LicenseType;
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: Date;
  endDate: Date;
  status: LicenseStatus;
  renewal: RenewalStatus;
  billingPeriod: 'monthly' | 'annual';
  price: number;
  discount: number;
  domain: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  features?: string[];
}
