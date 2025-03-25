
export type AdFormat = 'banner' | 'interstitial' | 'native' | 'text';
export type AdPosition = 'top' | 'bottom' | 'inline' | 'sidebar';
export type AdSize = 'small' | 'medium' | 'large';
export type AdNetwork = 'internal' | 'google' | 'facebook' | 'custom';
export type AdStatus = 'active' | 'paused' | 'draft' | 'archived';

export interface Advertisement {
  id: string;
  name: string;
  description?: string;
  format: AdFormat;
  content: {
    title?: string;
    description?: string;
    imageUrl?: string;
    linkUrl: string;
    buttonText?: string;
  };
  position: AdPosition;
  size: AdSize;
  network: AdNetwork;
  status: AdStatus;
  targeting?: {
    userType?: ('free' | 'premium')[];
    minLevel?: number;
    maxLevel?: number;
    countries?: string[];
    languages?: string[];
    devices?: ('mobile' | 'tablet' | 'desktop')[];
  };
  scheduling: {
    startDate: Date;
    endDate?: Date;
    frequency?: number; // Max impressions per user per day
  };
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AdCampaign {
  id: string;
  name: string;
  description?: string;
  status: AdStatus;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  ads: Advertisement[];
  targeting?: {
    userType?: ('free' | 'premium')[];
    minLevel?: number;
    maxLevel?: number;
    countries?: string[];
    languages?: string[];
    devices?: ('mobile' | 'tablet' | 'desktop')[];
  };
  scheduling: {
    startDate: Date;
    endDate?: Date;
  };
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AdSettings {
  enableAds: boolean;
  defaultNetwork: AdNetwork;
  frequencyCap: number; // Max ads per session
  showToPremiumUsers: boolean;
  refreshInterval?: number; // In seconds, optional
  blockList?: string[]; // List of blocked advertisers or categories
  networks: {
    google?: {
      publisherId: string;
      slots: Record<string, string>;
    };
    facebook?: {
      placementId: string;
    };
    custom?: {
      apiUrl: string;
      apiKey?: string;
    };
  };
}
