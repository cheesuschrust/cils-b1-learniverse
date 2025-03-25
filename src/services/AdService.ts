
import { v4 as uuidv4 } from 'uuid';
import { Advertisement, AdCampaign, AdSettings, AdStatus, AdNetwork } from '@/types/advertisement';
import { User } from '@/contexts/shared-types';

// In-memory storage for advertisements and campaigns
let advertisements: Advertisement[] = [];
let campaigns: AdCampaign[] = [];

// Default ad settings
const defaultSettings: AdSettings = {
  enableAds: true,
  defaultNetwork: 'internal',
  frequencyCap: 10,
  showToPremiumUsers: false,
  networks: {}
};

let adSettings: AdSettings = { ...defaultSettings };

// Get an advertisement based on position, user, and other parameters
export const getAdvertisement = (
  position: Advertisement['position'],
  size: Advertisement['size'],
  user?: User
): Advertisement | null => {
  // If ads are disabled or user is premium and we don't show ads to premium users
  if (!adSettings.enableAds || (user?.subscription === 'premium' && !adSettings.showToPremiumUsers)) {
    return null;
  }
  
  // Get all active ads matching the position and size
  const eligibleAds = advertisements.filter(ad => {
    // Check ad status
    if (ad.status !== 'active') return false;
    
    // Check position and size
    if (ad.position !== position || ad.size !== size) return false;
    
    // Check scheduling
    const now = new Date();
    if (now < ad.scheduling.startDate || (ad.scheduling.endDate && now > ad.scheduling.endDate)) {
      return false;
    }
    
    // Check targeting (if exists)
    if (ad.targeting && user) {
      // Check user type
      if (ad.targeting.userType && 
          !ad.targeting.userType.includes(user.subscription === 'premium' ? 'premium' : 'free')) {
        return false;
      }
    }
    
    return true;
  });
  
  if (eligibleAds.length === 0) {
    return null;
  }
  
  // Select a random ad from eligible ads
  const selectedAd = eligibleAds[Math.floor(Math.random() * eligibleAds.length)];
  
  // Track impression (in a real implementation, this would be more sophisticated)
  trackImpression(selectedAd.id);
  
  return selectedAd;
};

// Track ad impression
export const trackImpression = (adId: string): void => {
  const ad = advertisements.find(a => a.id === adId);
  if (!ad) return;
  
  // Initialize performance metrics if not present
  if (!ad.performance) {
    ad.performance = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0
    };
  }
  
  // Update impression count
  ad.performance.impressions += 1;
  
  // Update CTR
  if (ad.performance.impressions > 0) {
    ad.performance.ctr = (ad.performance.clicks / ad.performance.impressions) * 100;
  }
  
  // Update campaign metrics if the ad belongs to a campaign
  updateCampaignMetrics();
};

// Track ad click
export const trackClick = (adId: string): void => {
  const ad = advertisements.find(a => a.id === adId);
  if (!ad) return;
  
  // Initialize performance metrics if not present
  if (!ad.performance) {
    ad.performance = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0
    };
  }
  
  // Update click count
  ad.performance.clicks += 1;
  
  // Update CTR
  if (ad.performance.impressions > 0) {
    ad.performance.ctr = (ad.performance.clicks / ad.performance.impressions) * 100;
  }
  
  // Estimate revenue (in a real implementation, this would be based on actual ad network data)
  ad.performance.revenue += 0.05; // Assume $0.05 per click
  
  // Update campaign metrics if the ad belongs to a campaign
  updateCampaignMetrics();
};

// Track ad conversion
export const trackConversion = (adId: string, value?: number): void => {
  const ad = advertisements.find(a => a.id === adId);
  if (!ad) return;
  
  // Initialize performance metrics if not present
  if (!ad.performance) {
    ad.performance = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0
    };
  }
  
  // Update conversion count
  ad.performance.conversions += 1;
  
  // Add conversion value to revenue
  if (value) {
    ad.performance.revenue += value;
  }
  
  // Update campaign metrics if the ad belongs to a campaign
  updateCampaignMetrics();
};

// Update campaign metrics based on ad performance
const updateCampaignMetrics = (): void => {
  // Reset all campaign metrics
  campaigns.forEach(campaign => {
    campaign.performance = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0
    };
  });
  
  // Calculate metrics based on ads in each campaign
  advertisements.forEach(ad => {
    const campaign = campaigns.find(c => c.ads.some(a => a.id === ad.id));
    if (!campaign || !ad.performance) return;
    
    campaign.performance!.impressions += ad.performance.impressions;
    campaign.performance!.clicks += ad.performance.clicks;
    campaign.performance!.conversions += ad.performance.conversions;
    campaign.performance!.revenue += ad.performance.revenue;
    
    // Update campaign CTR
    if (campaign.performance!.impressions > 0) {
      campaign.performance!.ctr = (campaign.performance!.clicks / campaign.performance!.impressions) * 100;
    }
    
    // Update campaign budget spent
    campaign.budget.spent = campaign.performance!.revenue;
  });
};

// Create a new advertisement
export const createAdvertisement = (adData: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>): Advertisement => {
  const newAd: Advertisement = {
    ...adData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  advertisements.push(newAd);
  return newAd;
};

// Update an existing advertisement
export const updateAdvertisement = (id: string, adData: Partial<Advertisement>): Advertisement | null => {
  const index = advertisements.findIndex(ad => ad.id === id);
  if (index === -1) return null;
  
  advertisements[index] = {
    ...advertisements[index],
    ...adData,
    updatedAt: new Date()
  };
  
  return advertisements[index];
};

// Delete an advertisement
export const deleteAdvertisement = (id: string): boolean => {
  const initialLength = advertisements.length;
  advertisements = advertisements.filter(ad => ad.id !== id);
  return advertisements.length < initialLength;
};

// Get all advertisements
export const getAllAdvertisements = (): Advertisement[] => {
  return advertisements;
};

// Get advertisement by ID
export const getAdvertisementById = (id: string): Advertisement | null => {
  return advertisements.find(ad => ad.id === id) || null;
};

// Create a new campaign
export const createCampaign = (campaignData: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt'>): AdCampaign => {
  const newCampaign: AdCampaign = {
    ...campaignData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  campaigns.push(newCampaign);
  return newCampaign;
};

// Update an existing campaign
export const updateCampaign = (id: string, campaignData: Partial<AdCampaign>): AdCampaign | null => {
  const index = campaigns.findIndex(campaign => campaign.id === id);
  if (index === -1) return null;
  
  campaigns[index] = {
    ...campaigns[index],
    ...campaignData,
    updatedAt: new Date()
  };
  
  return campaigns[index];
};

// Delete a campaign
export const deleteCampaign = (id: string): boolean => {
  const initialLength = campaigns.length;
  campaigns = campaigns.filter(campaign => campaign.id !== id);
  return campaigns.length < initialLength;
};

// Get all campaigns
export const getAllCampaigns = (): AdCampaign[] => {
  return campaigns;
};

// Get campaign by ID
export const getCampaignById = (id: string): AdCampaign | null => {
  return campaigns.find(campaign => campaign.id === id) || null;
};

// Add an advertisement to a campaign
export const addAdvertisementToCampaign = (campaignId: string, adId: string): boolean => {
  const campaign = campaigns.find(c => c.id === campaignId);
  const ad = advertisements.find(a => a.id === adId);
  
  if (!campaign || !ad) return false;
  
  // Check if ad is already in the campaign
  if (campaign.ads.some(a => a.id === adId)) return true;
  
  campaign.ads.push(ad);
  return true;
};

// Remove an advertisement from a campaign
export const removeAdvertisementFromCampaign = (campaignId: string, adId: string): boolean => {
  const campaign = campaigns.find(c => c.id === campaignId);
  if (!campaign) return false;
  
  const initialLength = campaign.ads.length;
  campaign.ads = campaign.ads.filter(ad => ad.id !== adId);
  
  return campaign.ads.length < initialLength;
};

// Update ad settings
export const updateAdSettings = (newSettings: Partial<AdSettings>): AdSettings => {
  adSettings = { ...adSettings, ...newSettings };
  return adSettings;
};

// Get current ad settings
export const getAdSettings = (): AdSettings => adSettings;

// Initialize with some sample data
export const initializeSampleData = (): void => {
  // Create some sample advertisements
  const sampleAds: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Premium Subscription Promotion',
      description: 'Banner ad promoting premium subscription benefits',
      format: 'banner',
      content: {
        title: 'Upgrade to Premium',
        description: 'Get unlimited questions and remove ads',
        imageUrl: '/assets/premium-promo.jpg',
        linkUrl: '/pricing',
        buttonText: 'Learn More'
      },
      position: 'top',
      size: 'medium',
      network: 'internal',
      status: 'active',
      scheduling: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
      }
    },
    {
      name: 'Italian Culture Course',
      description: 'Native ad promoting Italian culture course',
      format: 'native',
      content: {
        title: 'Discover Italian Culture',
        description: 'Learn about Italian history, food, and traditions',
        imageUrl: '/assets/italy-culture.jpg',
        linkUrl: '/courses/italian-culture',
        buttonText: 'Explore Now'
      },
      position: 'inline',
      size: 'large',
      network: 'internal',
      status: 'active',
      targeting: {
        userType: ['free'],
        minLevel: 2
      },
      scheduling: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 15)),
      }
    },
    {
      name: 'Mobile App Download',
      description: 'Banner promoting our mobile app',
      format: 'banner',
      content: {
        title: 'Learn Italian on the go',
        description: 'Download our mobile app for iOS and Android',
        imageUrl: '/assets/mobile-app.jpg',
        linkUrl: '/download-app',
        buttonText: 'Download'
      },
      position: 'bottom',
      size: 'small',
      network: 'internal',
      status: 'active',
      scheduling: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 45)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 45)),
      }
    }
  ];
  
  // Create the sample advertisements
  sampleAds.forEach(ad => createAdvertisement(ad));
  
  // Create a sample campaign
  const sampleCampaign: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Q4 Subscription Drive',
    description: 'Campaign to increase premium subscriptions in Q4',
    status: 'active',
    budget: {
      total: 5000,
      spent: 0,
      currency: 'USD'
    },
    ads: [],
    scheduling: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 15)),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    }
  };
  
  // Create the sample campaign
  const campaign = createCampaign(sampleCampaign);
  
  // Add all ads to the campaign
  advertisements.forEach(ad => {
    addAdvertisementToCampaign(campaign.id, ad.id);
  });
};

// Export these methods as the AdService
export default {
  getAdvertisement,
  trackImpression,
  trackClick,
  trackConversion,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  addAdvertisementToCampaign,
  removeAdvertisementFromCampaign,
  updateAdSettings,
  getAdSettings,
  initializeSampleData
};
