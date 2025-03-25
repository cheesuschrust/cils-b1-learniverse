
// Type definitions for advertisement management

export type AdNetwork = 'internal' | 'google' | 'facebook' | 'custom';
export type AdStatus = 'active' | 'paused' | 'draft' | 'archived';
export type AdFormat = 'banner' | 'native' | 'interstitial' | 'video' | 'popup';
export type AdPosition = 'top' | 'bottom' | 'inline' | 'sidebar' | 'modal';
export type AdSize = 'small' | 'medium' | 'large' | 'custom';

export interface AdPerformance {
  impressions: number;
  clicks: number;
  ctr: number;  // Click-through rate (%)
  revenue: number;
  cost?: number;
  roi?: number;  // Return on investment (%)
  conversions?: number; // Added for AdService compatibility
}

export interface Advertisement {
  id: string;
  name: string;
  description?: string;
  format: AdFormat;
  position: AdPosition;
  size: AdSize;
  content: {
    title?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    linkUrl: string;
  };
  targeting?: {
    userTypes?: string[];
    countries?: string[];
    languages?: string[];
    devices?: string[];
  };
  startDate: Date;
  endDate?: Date;
  status: AdStatus;
  network: AdNetwork;
  campaignId?: string;
  performance?: AdPerformance;
  createdAt: Date;
  updatedAt: Date;
  scheduling?: {
    dayOfWeek?: string[];
    timeOfDay?: string[];
    frequency?: string;
  }; // Added for AdService compatibility
}

export interface AdCampaign {
  id: string;
  name: string;
  description?: string;
  status: AdStatus;
  budget: {
    total: number;
    spent: number;
    daily?: number;
    currency?: string; // Added for AdService compatibility
  };
  startDate: Date;
  endDate?: Date;
  ads: string[];  // Ad IDs
  targeting?: {
    userTypes?: string[];
    countries?: string[];
    languages?: string[];
    devices?: string[];
  };
  performance?: AdPerformance;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdSettings {
  enableAds: boolean;
  defaultNetwork: AdNetwork;
  frequencyCap: number;
  showToPremiumUsers: boolean;
  refreshInterval?: number; // Make optional to match usage
  blockList: string[];
  networks?: string[]; // Added for AdService compatibility
}

// Ad service interface
export interface AdServiceInterface {
  getAds(): Advertisement[];
  getAd(id: string): Advertisement | null;
  getAdvertisement(id: string): Advertisement | null; 
  getAllAdvertisements(): Advertisement[];
  createAd(ad: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): Advertisement;
  updateAd(id: string, ad: Partial<Advertisement>): Advertisement | null;
  updateAdvertisement(id: string, ad: Partial<Advertisement>): Advertisement | null;
  deleteAd(id: string): boolean;
  deleteAdvertisement(id: string): boolean;
  
  getCampaigns(): AdCampaign[];
  getAllCampaigns(): AdCampaign[];
  getCampaign(id: string): AdCampaign | null;
  createCampaign(campaign: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): AdCampaign;
  updateCampaign(id: string, campaign: Partial<AdCampaign>): AdCampaign | null;
  deleteCampaign(id: string): boolean;
  
  getSettings(): AdSettings;
  getAdSettings(): AdSettings;
  updateSettings(settings: Partial<AdSettings>): AdSettings;
  updateAdSettings(settings: Partial<AdSettings>): AdSettings;
  
  trackImpression(adId: string): void;
  trackClick(adId: string): void;
  
  getAdFormats(): AdFormat[];
  getAdPositions(): AdPosition[];
  getAdSizes(): AdSize[];
  
  initializeSampleData(): void;
}
