
import { Advertisement, AdCampaign, AdPosition, AdSize } from '@/types/advertisement';

/**
 * Service for handling advertisements in the application
 */
class AdService {
  private static instance: AdService;
  private campaigns: AdCampaign[] = [];
  private advertisements: Advertisement[] = [];
  private settings = {
    enableAds: true,
    showAdsToFreeTier: true,
    showAdsToPremiumTier: false,
    adsPerPage: 2,
    allowThirdPartyAds: true,
    allowRemarketing: true,
    minimumTimeBetweenAds: 30, // seconds
  };
  
  private constructor() {
    // Private constructor to enforce singleton
  }
  
  /**
   * Get the singleton instance of the AdService
   */
  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }
  
  /**
   * Initialize the service with sample data for demonstration purposes
   */
  public initializeSampleData(): void {
    if (this.campaigns.length > 0) {
      return; // Already initialized
    }
    
    // Sample campaigns
    this.campaigns = [
      {
        id: 'campaign-001',
        name: 'Premium Subscription Promotion',
        description: 'Promote premium subscription benefits to free users',
        status: 'active',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        budget: {
          total: 5000,
          spent: 2130,
          daily: 50
        },
        targeting: {
          userTypes: ['free'],
          locations: ['all'],
          devices: ['all']
        },
        performance: {
          impressions: 15420,
          clicks: 842,
          conversions: 124,
          ctr: 5.46
        }
      },
      {
        id: 'campaign-002',
        name: 'Italian Culture Webinar',
        description: 'Promote upcoming webinar on Italian culture',
        status: 'active',
        startDate: new Date('2023-03-15'),
        endDate: new Date('2023-06-15'),
        budget: {
          total: 2500,
          spent: 1250,
          daily: 30
        },
        targeting: {
          userTypes: ['free', 'premium'],
          locations: ['us', 'uk', 'ca'],
          devices: ['desktop', 'mobile']
        },
        performance: {
          impressions: 8750,
          clicks: 385,
          conversions: 62,
          ctr: 4.4
        }
      },
      {
        id: 'campaign-003',
        name: 'Italian Resource Books',
        description: 'Promote Italian learning books and resources',
        status: 'paused',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-08-31'),
        budget: {
          total: 3500,
          spent: 1850,
          daily: 25
        },
        targeting: {
          userTypes: ['free', 'premium'],
          locations: ['all'],
          devices: ['all']
        },
        performance: {
          impressions: 12840,
          clicks: 572,
          conversions: 87,
          ctr: 4.45
        }
      },
      {
        id: 'campaign-004',
        name: 'Italian Language Partners',
        description: 'Connect with native Italian speakers for practice',
        status: 'draft',
        startDate: new Date('2023-07-01'),
        endDate: new Date('2023-12-31'),
        budget: {
          total: 4000,
          spent: 0,
          daily: 35
        },
        targeting: {
          userTypes: ['free', 'premium'],
          locations: ['us', 'uk', 'ca', 'au'],
          devices: ['all']
        },
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0
        }
      }
    ];
    
    // Sample advertisements
    this.advertisements = [
      {
        id: 'ad-001',
        name: 'Premium Subscription Banner',
        campaignId: 'campaign-001',
        format: 'banner',
        position: 'inline',
        size: 'medium',
        content: {
          title: 'Unlock Full Access to CILS Italian',
          description: 'Get unlimited lessons, personal feedback, and certification preparation',
          imageUrl: '/images/premium-promo.jpg',
          buttonText: 'Try Premium',
          linkUrl: '/pricing'
        },
        active: true
      },
      {
        id: 'ad-002',
        name: 'Premium Subscription Side Banner',
        campaignId: 'campaign-001',
        format: 'banner',
        position: 'sidebar',
        size: 'small',
        content: {
          title: 'Ready for CILS Certification?',
          description: 'Our premium plan includes mock exams and expert feedback',
          imageUrl: '/images/certification.jpg',
          buttonText: 'Upgrade Now',
          linkUrl: '/pricing'
        },
        active: true
      },
      {
        id: 'ad-003',
        name: 'Italian Culture Webinar Native Ad',
        campaignId: 'campaign-002',
        format: 'native',
        position: 'inline',
        size: 'medium',
        content: {
          title: 'Join Our Italian Culture Webinar',
          description: 'Live session with Italian experts - June 12th, 7PM EST',
          imageUrl: '/images/webinar-italian.jpg',
          buttonText: 'Register Free',
          linkUrl: '/events/webinar-culture'
        },
        active: true
      },
      {
        id: 'ad-004',
        name: 'Italian Books Promotion',
        campaignId: 'campaign-003',
        format: 'banner',
        position: 'bottom',
        size: 'large',
        content: {
          title: 'Essential Books for Italian Learners',
          description: 'Curated collection of the best books for CILS preparation',
          imageUrl: '/images/italian-books.jpg',
          buttonText: 'Browse Collection',
          linkUrl: '/resources/books'
        },
        active: false
      }
    ];
  }
  
  /**
   * Get a suitable advertisement for the given position and size
   */
  public getAdvertisement(
    position: AdPosition, 
    size: AdSize, 
    user?: { id?: string; email?: string; isPremium?: boolean }
  ): Advertisement | null {
    // Initialize sample data if not already initialized
    this.initializeSampleData();
    
    // Check if ads are enabled globally
    if (!this.settings.enableAds) {
      return null;
    }
    
    // Don't show ads to premium users if that setting is disabled
    if (user?.isPremium && !this.settings.showAdsToPremiumTier) {
      return null;
    }
    
    // Filter ads by position, size, and active status
    const eligibleAds = this.advertisements.filter(ad => 
      ad.position === position && 
      ad.size === size && 
      ad.active
    );
    
    if (eligibleAds.length === 0) {
      return null;
    }
    
    // For now, just return a random ad from the eligible ones
    // In a real system, this would use targeting rules, user preferences, etc.
    const randomIndex = Math.floor(Math.random() * eligibleAds.length);
    return eligibleAds[randomIndex];
  }
  
  /**
   * Track an ad click (in a real system, this would send analytics data)
   */
  public trackClick(adId: string): void {
    console.log(`Ad clicked: ${adId}`);
    // In a real system, this would:
    // 1. Log the click to an analytics system
    // 2. Increment the click count in the database
    // 3. Track conversion if applicable
  }
  
  /**
   * Track an ad impression (in a real system, this would send analytics data)
   */
  public trackImpression(adId: string): void {
    console.log(`Ad impression: ${adId}`);
    // In a real system, this would:
    // 1. Log the impression to an analytics system
    // 2. Increment the impression count in the database
  }
  
  /**
   * Get all campaigns
   */
  public getAllCampaigns(): AdCampaign[] {
    // Initialize sample data if not already initialized
    this.initializeSampleData();
    return [...this.campaigns];
  }
  
  /**
   * Delete a campaign by ID
   */
  public deleteCampaign(id: string): boolean {
    const initialLength = this.campaigns.length;
    this.campaigns = this.campaigns.filter(campaign => campaign.id !== id);
    
    // Also delete associated ads
    this.advertisements = this.advertisements.filter(ad => ad.campaignId !== id);
    
    return this.campaigns.length < initialLength;
  }
  
  /**
   * Update ad settings
   */
  public updateAdSettings(newSettings: Partial<typeof this.settings>) {
    this.settings = {
      ...this.settings,
      ...newSettings
    };
    return this.settings;
  }
  
  /**
   * Get current ad settings
   */
  public getAdSettings() {
    return { ...this.settings };
  }
}

// Export singleton instance
export default AdService.getInstance();
