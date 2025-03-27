
export type LicenseType = 'university' | 'k12' | 'language-school' | 'corporate';
export type LicenseStatus = 'active' | 'expired' | 'trial' | 'suspended' | 'pending';
export type RenewalStatus = 'auto-renewal' | 'pending-renewal' | 'cancelled' | 'not-applicable' | 'pending' | 'in-progress' | 'renewed' | 'expired' | 'not-started' | 'manual' | 'auto' | 'canceled';

export interface License {
  id: string;
  name: string;
  type: LicenseType;
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: LicenseStatus;
  contactName: string;
  contactEmail: string;
  customization: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
    domain: string;
  };
  domain?: string; // For backward compatibility
  value: number;
  renewalStatus: RenewalStatus;
}
