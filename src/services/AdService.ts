
import { v4 as uuidv4 } from 'uuid';
import { 
  Advertisement, 
  AdCampaign, 
  AdSettings, 
  AdNetwork, 
  AdStatus, 
  AdFormat,
  AdPosition,
  AdSize,
  AdServiceInterface
} from '@/types/advertisement';

class AdService implements AdServiceInterface {
  private static instance: AdService;
  private ads: Advertisement[] = [];
  private campaigns: AdCampaign[] = [];
  private settings: AdSettings = {
    enableAds: true,
    defaultNetwork: 'internal',
    frequencyCap: 5,
    showToPremiumUsers: false,
    refreshInterval: 60,
    blockList: []
  };
  
  private constructor() {
    // Private constructor for singleton pattern
    this.loadFromStorage();
  }
  
  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }
  
  private loadFromStorage(): void {
    try {
      const storedAds = localStorage.getItem('ads');
      const storedCampaigns = localStorage.getItem('adCampaigns');
      const storedSettings = localStorage.getItem('adSettings');
      
      if (storedAds) {
        this.ads = JSON.parse(storedAds);
      }
      
      if (storedCampaigns) {
        this.campaigns = JSON.parse(storedCampaigns);
      }
      
      if (storedSettings) {
        this.settings = JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error('Error loading ad data from storage:', error);
    }
  }
  
  private saveToStorage(): void {
    try {
      localStorage.setItem('ads', JSON.stringify(this.ads));
      localStorage.setItem('adCampaigns', JSON.stringify(this.campaigns));
      localStorage.setItem('adSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving ad data to storage:', error);
    }
  }
  
  // Ad Methods
  public getAds(): Advertisement[] {
    return this.ads;
  }
  
  public getAllAdvertisements(): Advertisement[] {
    return this.ads;
  }
  
  public getAd(id: string): Advertisement | null {
    return this.ads.find(ad => ad.id === id) || null;
  }
  
  public getAdvertisement(id: string): Advertisement | null {
    return this.getAd(id);
  }
  
  public createAd(ad: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): Advertisement {
    const now = new Date();
    const newAd: Advertisement = {
      ...ad,
      id: uuidv4(),
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        revenue: 0
      },
      createdAt: now,
      updatedAt: now
    };
    
    this.ads.push(newAd);
    this.saveToStorage();
    return newAd;
  }
  
  public updateAd(id: string, ad: Partial<Advertisement>): Advertisement | null {
    const index = this.ads.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.ads[index] = {
      ...this.ads[index],
      ...ad,
      updatedAt: new Date()
    };
    
    this.saveToStorage();
    return this.ads[index];
  }
  
  public updateAdvertisement(id: string, ad: Partial<Advertisement>): Advertisement | null {
    return this.updateAd(id, ad);
  }
  
  public deleteAd(id: string): boolean {
    const initialLength = this.ads.length;
    this.ads = this.ads.filter(a => a.id !== id);
    const success = this.ads.length < initialLength;
    
    if (success) {
      this.saveToStorage();
    }
    
    return success;
  }
  
  public deleteAdvertisement(id: string): boolean {
    return this.deleteAd(id);
  }
  
  // Campaign Methods
  public getCampaigns(): AdCampaign[] {
    return this.campaigns;
  }
  
  public getAllCampaigns(): AdCampaign[] {
    return this.campaigns;
  }
  
  public getCampaign(id: string): AdCampaign | null {
    return this.campaigns.find(c => c.id === id) || null;
  }
  
  public createCampaign(campaign: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): AdCampaign {
    const now = new Date();
    const newCampaign: AdCampaign = {
      ...campaign,
      id: uuidv4(),
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        revenue: 0
      },
      createdAt: now,
      updatedAt: now
    };
    
    this.campaigns.push(newCampaign);
    this.saveToStorage();
    return newCampaign;
  }
  
  public updateCampaign(id: string, campaign: Partial<AdCampaign>): AdCampaign | null {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.campaigns[index] = {
      ...this.campaigns[index],
      ...campaign,
      updatedAt: new Date()
    };
    
    this.saveToStorage();
    return this.campaigns[index];
  }
  
  public deleteCampaign(id: string): boolean {
    const initialLength = this.campaigns.length;
    this.campaigns = this.campaigns.filter(c => c.id !== id);
    const success = this.campaigns.length < initialLength;
    
    if (success) {
      this.saveToStorage();
    }
    
    return success;
  }
  
  // Settings Methods
  public getSettings(): AdSettings {
    return this.settings;
  }
  
  public getAdSettings(): AdSettings {
    return this.settings;
  }
  
  public updateSettings(settings: Partial<AdSettings>): AdSettings {
    this.settings = {
      ...this.settings,
      ...settings
    };
    
    this.saveToStorage();
    return this.settings;
  }
  
  public updateAdSettings(settings: Partial<AdSettings>): AdSettings {
    return this.updateSettings(settings);
  }
  
  // Analytics Methods
  public trackImpression(adId: string): void {
    const ad = this.getAd(adId);
    if (!ad) return;
    
    const updatedPerformance = {
      ...ad.performance,
      impressions: (ad.performance?.impressions || 0) + 1
    };
    
    // Calculate CTR
    if (updatedPerformance.clicks > 0) {
      updatedPerformance.ctr = (updatedPerformance.clicks / updatedPerformance.impressions) * 100;
    }
    
    this.updateAd(adId, { performance: updatedPerformance });
  }
  
  public trackClick(adId: string): void {
    const ad = this.getAd(adId);
    if (!ad) return;
    
    const updatedPerformance = {
      ...ad.performance,
      clicks: (ad.performance?.clicks || 0) + 1
    };
    
    // Calculate CTR
    updatedPerformance.ctr = (updatedPerformance.clicks / updatedPerformance.impressions) * 100;
    
    this.updateAd(adId, { performance: updatedPerformance });
  }
  
  // Utility Methods
  public getAdFormats(): AdFormat[] {
    return ['banner', 'native', 'interstitial', 'video', 'popup'];
  }
  
  public getAdPositions(): AdPosition[] {
    return ['top', 'bottom', 'inline', 'sidebar', 'modal'];
  }
  
  public getAdSizes(): AdSize[] {
    return ['small', 'medium', 'large', 'custom'];
  }
  
  // Sample Data
  public initializeSampleData(): void {
    // Only initialize if no ads exist
    if (this.ads.length === 0) {
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      
      // Create a sample campaign
      const sampleCampaign: AdCampaign = {
        id: uuidv4(),
        name: 'Sample Language Learning Campaign',
        description: 'Campaign targeting language learners',
        status: 'active',
        budget: {
          total: 5000,
          spent: 750,
          daily: 50
        },
        startDate: now,
        endDate: endDate,
        ads: [],
        targeting: {
          userTypes: ['free', 'basic'],
          languages: ['english', 'italian']
        },
        performance: {
          impressions: 10000,
          clicks: 250,
          ctr: 2.5,
          revenue: 500
        },
        createdAt: now,
        updatedAt: now
      };
      
      this.campaigns.push(sampleCampaign);
      
      // Create sample ads
      const sampleAds: Advertisement[] = [
        {
          id: uuidv4(),
          name: 'Premium Subscription Promo',
          description: 'Banner ad promoting premium subscription',
          format: 'banner',
          position: 'top',
          size: 'medium',
          content: {
            title: 'Upgrade to Premium',
            description: 'Get unlimited access to all language learning content',
            imageUrl: '/images/premium-banner.jpg',
            buttonText: 'Upgrade Now',
            linkUrl: '/subscription'
          },
          startDate: now,
          endDate: endDate,
          status: 'active',
          network: 'internal',
          campaignId: sampleCampaign.id,
          performance: {
            impressions: 5000,
            clicks: 120,
            ctr: 2.4,
            revenue: 240
          },
          createdAt: now,
          updatedAt: now
        },
        {
          id: uuidv4(),
          name: 'New Italian Course',
          description: 'Sidebar ad for new Italian course',
          format: 'native',
          position: 'sidebar',
          size: 'small',
          content: {
            title: 'Learn Italian in 30 Days',
            description: 'Our new accelerated Italian course for beginners',
            imageUrl: '/images/italian-course.jpg',
            buttonText: 'Start Learning',
            linkUrl: '/courses/italian-beginner'
          },
          startDate: now,
          endDate: endDate,
          status: 'active',
          network: 'internal',
          campaignId: sampleCampaign.id,
          performance: {
            impressions: 3000,
            clicks: 90,
            ctr: 3.0,
            revenue: 180
          },
          createdAt: now,
          updatedAt: now
        },
        {
          id: uuidv4(),
          name: 'Premium Plan Comparison',
          description: 'Comparing different premium plans',
          format: 'interstitial',
          position: 'modal',
          size: 'large',
          content: {
            title: 'Choose the Right Plan',
            description: 'Compare our premium plans and choose what works for you',
            imageUrl: '/images/plans-comparison.jpg',
            buttonText: 'View Plans',
            linkUrl: '/plans'
          },
          startDate: now,
          endDate: endDate,
          status: 'paused',
          network: 'internal',
          campaignId: sampleCampaign.id,
          performance: {
            impressions: 2000,
            clicks: 40,
            ctr: 2.0,
            revenue: 80
          },
          createdAt: now,
          updatedAt: now
        }
      ];
      
      this.ads = sampleAds;
      
      // Update campaign with ad IDs
      sampleCampaign.ads = sampleAds.map(ad => ad.id);
      
      this.saveToStorage();
    }
  }
}

// Create and export the singleton instance
const adServiceInstance = AdService.getInstance();
export default adServiceInstance;
