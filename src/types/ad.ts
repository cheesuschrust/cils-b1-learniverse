
export type AdNetwork = 'internal' | 'google' | 'facebook' | 'other';

export interface AdSettings {
  enabled: boolean;
  enableAds?: boolean; // For backward compatibility
  defaultNetwork: AdNetwork;
  frequencyCap: number;
  showToPremiumUsers: boolean;
  refreshInterval?: number;
  blockList: string[];
  placement?: string[]; // For compatibility
  frequency?: number;  // For compatibility
  userGroupTargeting?: string[]; // For compatibility
  networks?: string[]; // For compatibility with existing code
}

export interface AdUnit {
  id: string;
  name: string;
  type: 'banner' | 'interstitial' | 'native' | 'sidebar'; // Including 'sidebar' for compatibility
  network: AdNetwork;
  placement: string;
  active: boolean;
  impressions: number;
  clicks: number;
  revenue: number;
  lastUpdated: Date;
  content: string; // Required for compatibility
  targetUrl: string; // Required property based on error
  impression?: number; // For compatibility
  owner?: string;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  adFormat?: string;
  dimensions?: string;
  placements?: string[];
  targeting?: string[];
  price?: number;
  currency?: string;
  company?: string;
  status?: string;
}
