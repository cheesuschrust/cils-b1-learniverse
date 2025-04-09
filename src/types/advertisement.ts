
export type AdPosition = 'top' | 'bottom' | 'sidebar' | 'inline';
export type AdSize = 'small' | 'medium' | 'large';
export type AdFormat = 'banner' | 'native' | 'video';
export type AdStatus = 'active' | 'paused' | 'draft' | 'archived';

export interface AdContent {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  buttonText?: string;
  linkUrl: string;
}

export interface Advertisement {
  id: string;
  name: string;
  campaignId: string;
  format: AdFormat;
  position: AdPosition;
  size: AdSize;
  content: AdContent;
  active: boolean;
}

export interface AdCampaign {
  id: string;
  name: string;
  description: string;
  status: AdStatus;
  startDate: Date;
  endDate: Date;
  budget: {
    total: number;
    spent: number;
    daily: number;
  };
  targeting: {
    userTypes: ('free' | 'premium')[];
    locations: string[];
    devices: ('desktop' | 'mobile' | 'tablet' | 'all')[];
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
}
