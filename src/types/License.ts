
export type LicenseType = 'university' | 'k12' | 'language-school' | 'corporate';
export type LicenseStatus = 'active' | 'expired' | 'trial' | 'suspended' | 'pending' | 'not-applicable' | 'not-started';
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
  | 'canceled'
  | 'not-renewing';

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

// Helper functions for license management
export function normalizeLicense(input: any): License {
  return {
    id: input.id || '',
    name: input.name || '',
    type: input.type || 'corporate',
    plan: input.plan || 'basic',
    seats: input.seats || 0,
    usedSeats: input.usedSeats || 0,
    startDate: input.startDate ? new Date(input.startDate) : new Date(),
    endDate: input.endDate ? new Date(input.endDate) : new Date(),
    status: input.status || 'pending',
    contactName: input.contactName || '',
    contactEmail: input.contactEmail || '',
    domain: input.domain || '',
    customization: {
      logo: input.customization?.logo || '',
      colors: {
        primary: input.customization?.colors?.primary || '#000000',
        secondary: input.customization?.colors?.secondary || '#ffffff'
      },
      domain: input.customization?.domain || input.domain || ''
    },
    value: input.value || 0,
    renewalStatus: input.renewalStatus || 'not-started',
    features: input.features || [],
    createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
    updatedAt: input.updatedAt ? new Date(input.updatedAt) : undefined
  };
}

export function convertToStringDates(license: License): any {
  return {
    ...license,
    startDate: license.startDate.toISOString(),
    endDate: license.endDate.toISOString(),
    createdAt: license.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: license.updatedAt?.toISOString()
  };
}
