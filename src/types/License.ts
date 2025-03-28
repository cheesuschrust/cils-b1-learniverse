
export type LicenseType = 'university' | 'k12' | 'language-school' | 'corporate';
export type LicenseStatus = 'active' | 'expired' | 'trial' | 'suspended' | 'pending';
export type RenewalStatus = 
  | 'auto-renewal' 
  | 'pending-renewal' 
  | 'cancelled' 
  | 'not-applicable' 
  | 'pending' 
  | 'in-progress' 
  | 'renewed' 
  | 'expired' 
  | 'not-started' 
  | 'manual' 
  | 'auto' 
  | 'canceled';

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
  userId?: string;
  company?: string;
  createdAt?: Date;
  updatedAt?: Date;
  validity?: number;
  features?: string[];
}

export interface LicenseUserAssignment {
  licenseId: string;
  userId: string;
  assignedAt: Date;
  role: "student" | "teacher" | "admin";
  status: "active" | "suspended";
}

export interface LicenseFeature {
  id: string;
  name: string;
  included: boolean;
  limit?: number;
  used?: number;
}

export interface LicenseInvoice {
  id: string;
  licenseId: string;
  amount: number;
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled";
  date: Date;
  dueDate: Date;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}
