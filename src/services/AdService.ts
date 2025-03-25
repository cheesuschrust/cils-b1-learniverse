import { v4 as uuid } from 'uuid';

import { AdSettings, Advertisement, AdNetwork, AdStatus, AdPerformance, AdCampaign } from '@/types/advertisement';

interface UserInfo {
  userId?: string;
  preferences?: {
    interests?: string[];
    location?: string;
    age?: number;
  };
}

class AdService {
  private static instance: AdService;
  private settings: AdSettings = {
    enableAds: true,
    defaultNetwork: 'internal',
    frequencyCap: 5,
    showToPremiumUsers: false,
    refreshInterval: 60, // in seconds
    blockList: ['adult', 'gambling', 'politics'],
    networks: ['internal', 'google', 'facebook'] // Custom property for settings
  };
  private ads: Advertisement[] = [];
  private campaigns: AdCampaign[] = [];

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  public getSettings(): AdSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<AdSettings>): AdSettings {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  public getAdById(id: string): Advertisement | undefined {
    return this.ads.find(ad => ad.id === id);
  }

  public createAd(adData: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): Advertisement {
    const newAd: Advertisement = {
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      performance: { impressions: 0, clicks: 0, ctr: 0, revenue: 0 },
      ...adData
    };
    this.ads.push(newAd);
    return newAd;
  }

  public updateAd(id: string, adData: Partial<Advertisement>): Advertisement | undefined {
    const adIndex = this.ads.findIndex(ad => ad.id === id);
    if (adIndex === -1) {
      return undefined;
    }

    this.ads[adIndex] = { ...this.ads[adIndex], ...adData, updatedAt: new Date() };
    return this.ads[adIndex];
  }

  public deleteAd(id: string): boolean {
    const adIndex = this.ads.findIndex(ad => ad.id === id);
    if (adIndex === -1) {
      return false;
    }

    this.ads.splice(adIndex, 1);
    return true;
  }

  public getAds(options?: { limit?: number, offset?: number, status?: AdStatus }): Advertisement[] {
    let filteredAds = this.ads;

    if (options?.status) {
      filteredAds = filteredAds.filter(ad => ad.status === options.status);
    }

    if (options?.offset) {
      filteredAds = filteredAds.slice(options.offset);
    }

    if (options?.limit) {
      filteredAds = filteredAds.slice(0, options.limit);
    }

    return filteredAds;
  }

  public getAdsForUser(userInfo?: UserInfo): Advertisement[] {
    if (!this.settings.enableAds) {
      return [];
    }

    let relevantAds = this.getRelevantAds(userInfo);

    // Frequency capping - simplified version
    if (this.settings.frequencyCap > 0 && userInfo?.userId) {
      relevantAds = relevantAds.slice(0, this.settings.frequencyCap);
    }

    return relevantAds;
  }

  // Update ad targeting to match expected type format
  private getRelevantAds(userInfo?: { userId?: string, preferences?: any }): Advertisement[] {
    return this.ads.filter(ad => {
      // Basic filter - only active ads
      if (ad.status !== 'active') return false;
      
      // Date filter
      const now = new Date();
      if (now < ad.startDate) return false;
      if (ad.endDate && now > ad.endDate) return false;
      
      // Optional targeting filters
      if (userInfo && ad.targeting) {
        // Check user type targeting
        if (ad.targeting.userTypes && ad.targeting.userTypes.length > 0) {
          if (!userInfo.userId) return false;
          // In a real app, we would check the user type from user data
        }
      }
      
      return true;
    });
  }

  public recordImpression(adId: string): void {
    const ad = this.ads.find(ad => ad.id === adId);
    if (ad && ad.performance) {
      ad.performance.impressions = (ad.performance.impressions || 0) + 1;
    }
  }

  public recordClick(adId: string): void {
    const ad = this.ads.find(ad => ad.id === adId);
    if (ad && ad.performance) {
      ad.performance.clicks = (ad.performance.clicks || 0) + 1;
      ad.performance.ctr = (ad.performance.clicks || 0) / (ad.performance.impressions || 1) * 100;
    }
  }

  public getCampaignById(id: string): AdCampaign | undefined {
    return this.campaigns.find(campaign => campaign.id === id);
  }

  public createCampaign(campaignData: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): AdCampaign {
    const newCampaign: AdCampaign = {
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      performance: { impressions: 0, clicks: 0, ctr: 0, revenue: 0 },
      ads: [],
      ...campaignData
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  public updateCampaign(id: string, campaignData: Partial<AdCampaign>): AdCampaign | undefined {
    const campaignIndex = this.campaigns.findIndex(campaign => campaign.id === id);
    if (campaignIndex === -1) {
      return undefined;
    }

    this.campaigns[campaignIndex] = { ...this.campaigns[campaignIndex], ...campaignData, updatedAt: new Date() };
    return this.campaigns[campaignIndex];
  }

  public deleteCampaign(id: string): boolean {
    const campaignIndex = this.campaigns.findIndex(campaign => campaign.id === id);
    if (campaignIndex === -1) {
      return false;
    }

    this.campaigns.splice(campaignIndex, 1);
    return true;
  }

  public getCampaigns(options?: { limit?: number, offset?: number, status?: AdStatus }): AdCampaign[] {
    let filteredCampaigns = this.campaigns;

    if (options?.status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === options.status);
    }

    if (options?.offset) {
      filteredCampaigns = filteredCampaigns.slice(options.offset);
    }

    if (options?.limit) {
      filteredCampaigns = filteredCampaigns.slice(0, options.limit);
    }

    return filteredCampaigns;
  }
  
  // Initialize sample ads
  public initializeSampleData(): void {
    // Sample ad campaigns
    this.campaigns = Array(5).fill(null).map((_, i) => ({
      id: `campaign-${i + 1}`,
      name: `Campaign ${i + 1}`,
      description: `Description for campaign ${i + 1}`,
      status: ['active', 'active', 'paused', 'active', 'draft'][i] as AdStatus,
      budget: {
        total: 1000 * (i + 1),
        spent: 250 * i,
        daily: 100,
        currency: 'USD' // Custom property
      },
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
      endDate: i === 4 ? undefined : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * (i + 1)),
      ads: [],
      targeting: {
        userTypes: i % 2 === 0 ? ['premium', 'basic'] : undefined,
        countries: i % 3 === 0 ? ['US', 'UK', 'IT'] : undefined
      },
      performance: {
        impressions: 10000 * (i + 1),
        clicks: 500 * (i + 1),
        ctr: 5,
        revenue: 750 * (i + 1),
        cost: 500 * (i + 1),
        roi: 50,
        conversions: 50 * (i + 1) // Custom property
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    }));
    
    this.ads = Array(10).fill(null).map((_, i) => ({
      id: `ad-${i + 1}`,
      name: `Ad ${i + 1}`,
      description: `Description for ad ${i + 1}`,
      format: ['banner', 'native', 'video', 'popup', 'banner', 'native', 'video', 'popup', 'banner', 'native'][i % 10] as AdFormat,
      position: ['top', 'bottom', 'inline', 'sidebar', 'top', 'bottom', 'inline', 'sidebar', 'top', 'bottom'][i % 10] as AdPosition,
      size: ['small', 'medium', 'large', 'custom', 'small', 'medium', 'large', 'custom', 'small', 'medium'][i % 10] as AdSize,
      content: {
        title: `Learn Italian - Ad ${i + 1}`,
        description: 'Start speaking Italian today!',
        imageUrl: 'https://via.placeholder.com/300x250',
        buttonText: 'Learn More',
        linkUrl: 'https://www.example.com/italian'
      },
      targeting: {
        userTypes: i % 2 === 0 ? ['premium', 'basic'] : undefined,
        countries: i % 3 === 0 ? ['US', 'UK', 'IT'] : undefined,
        languages: i % 4 === 0 ? ['en', 'it'] : undefined
      },
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      endDate: i === 5 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : undefined,
      status: ['active', 'paused', 'draft', 'active', 'active', 'paused', 'draft', 'active', 'active', 'paused'][i % 10] as AdStatus,
      network: ['internal', 'google', 'facebook', 'custom', 'internal', 'google', 'facebook', 'custom', 'internal', 'google'][i % 10] as AdNetwork,
      campaignId: this.campaigns[i % this.campaigns.length].id,
      performance: {
        impressions: 5000 * (i + 1),
        clicks: 250 * (i + 1),
        ctr: 5,
        revenue: 375 * (i + 1),
        cost: 250 * (i + 1),
        roi: 50,
        conversions: 25 * (i + 1)
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      updatedAt: new Date(),
      scheduling: {
        dayOfWeek: ['Monday', 'Wednesday', 'Friday'],
        timeOfDay: ['9:00', '12:00', '15:00'],
        frequency: 'daily'
      }
    }));

    // Assign ads to campaigns
    this.campaigns.forEach(campaign => {
      campaign.ads = this.ads
        .filter(ad => ad.campaignId === campaign.id)
        .map(ad => ad.id);
    });
  }
}

export default AdService.getInstance();
