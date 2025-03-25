
// Type definitions for institutional licensing

export type LicenseType = "university" | "k12" | "language-school" | "corporate";
export type LicenseStatus = "active" | "pending" | "expired" | "cancelled";
export type RenewalStatus = "automatic" | "manual" | "pending" | "not-renewing";

export interface LicenseCustomization {
  brandingEnabled: boolean;
  customLogoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
  welcomeMessage?: string;
}

export interface License {
  id: string;
  name: string;
  type: LicenseType; // Restricted to specific types
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: LicenseStatus;
  contactName: string;
  contactEmail: string;
  customization: LicenseCustomization;
  value: number;
  renewalStatus: RenewalStatus;
}
