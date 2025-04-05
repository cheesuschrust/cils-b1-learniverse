// Type definitions for advertisement management  

export type AdNetwork = 'internal' | 'google' | 'facebook' | 'custom';  
export type AdStatus = 'active' | 'paused' | 'draft' | 'archived';  
export type AdFormat = 'banner' | 'native' | 'interstitial' | 'video' | 'popup';  
export type AdPosition = 'top' | 'bottom' | 'inline' | 'sidebar' | 'modal';  
export type AdSize = 'small' | 'medium' | 'large' | 'custom';  

export interface AdPerformance {  
  impressions: number;  
  clicks: number;  
  ctr: number; // Click-through rate (%)  
  revenue: number;  
  cost?: number;  
  roi?: number; // Return on investment (%)  
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
  }; // Optional ad scheduling data  
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
    currency?: string; // Currency to match international usage  
  };  
  startDate: Date;  
  endDate?: Date;  
  ads: string[]; // IDs of ads in this campaign  
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
  frequencyCap: number; // Maximum number of ads to be shown in a time period  
  showToPremiumUsers: boolean; // Indicator if ads should be shown to premium users  
  refreshInterval?: number; // Optional refresh rate for ads  
  blockList: string[]; // List of blocked ad sources  
  networks?: string[]; // Additional networks for flexibility  
}  

// Ad service interface  
export interface AdServiceInterface {  
  getAds(): Advertisement[]; // Retrieve active advertisements  
  getAd(id: string): Advertisement | null; // Get specific advertisement by ID  
  getAdvertisement(id: string): Advertisement | null; // Alias for getting ad by ID  
  getAllAdvertisements(): Advertisement[]; // Get all advertisements  
  createAd(ad: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): Advertisement; // Create new ad  
  updateAd(id: string, ad: Partial<Advertisement>): Advertisement | null; // Update existing ad  
  updateAdvertisement(id: string, ad: Partial<Advertisement>): Advertisement | null; // Alias for updating ad  
  deleteAd(id: string): boolean; // Delete ad by ID  
  deleteAdvertisement(id: string): boolean; // Alias for deleting ad  

  getCampaigns(): AdCampaign[]; // Get all ad campaigns  
  getAllCampaigns(): AdCampaign[]; // Alias for getting all campaigns  
  getCampaign(id: string): AdCampaign | null; // Get campaign by ID  
  createCampaign(campaign: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): AdCampaign; // Create campaign  
  updateCampaign(id: string, campaign: Partial<AdCampaign>): AdCampaign | null; // Update existing campaign  
  deleteCampaign(id: string): boolean; // Delete campaign by ID  
  
  getSettings(): AdSettings; // Get current ad settings  
  getAdSettings(): AdSettings; // Alias for getting ad settings  
  updateSettings(settings: Partial<AdSettings>): AdSettings; // Update ad settings  
  updateAdSettings(settings: Partial<AdSettings>): AdSettings; // Alias for updating ad settings  
  
  trackImpression(adId: string): void; // Track ad impression  
  trackClick(adId: string): void; // Track ad click  
  
  getAdFormats(): AdFormat[]; // Retrieve available ad formats  
  getAdPositions(): AdPosition[]; // Retrieve available ad positions  
  getAdSizes(): AdSize[]; // Retrieve available ad sizes  
  
  initializeSampleData(): void; // Method for initializing sample ad data  
}  
