
export type LicenseType = 'university' | 'k12' | 'language-school' | 'corporate';

export interface License {
  id: string;
  name: string;
  type: LicenseType;
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: string;
  contactName: string;
  contactEmail: string;
  customization: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    domain?: string;
  };
  value: number;
  renewalStatus: string;
}
