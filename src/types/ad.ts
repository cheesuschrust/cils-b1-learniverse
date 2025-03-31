
export type AdNetwork = 'internal' | 'google' | 'facebook' | 'twitter' | 'amazon';

export interface AdUnit {
  id: string;
  name: string;
  type: 'banner' | 'sidebar' | 'interstitial' | 'native';
  content: string;
  targetUrl: string;
  impression?: number;
  clicks?: number;
  active: boolean;
  network?: AdNetwork;
  placement?: string;
  impressions?: number;
  revenue?: number;
  ctr?: number;
  lastUpdated?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  targetAudience?: string[];
  keywords?: string[];
  dimensions?: string;
  format?: string;
  status?: string;
}

export interface AdSettings {
  enabled: boolean;
  placement: string[];
  frequency: number;
  userGroupTargeting: string[];
  defaultNetwork?: AdNetwork;
  frequencyCap?: number;
  showToPremiumUsers?: boolean;
  blockList?: string[];
}

// Helper functions
export function normalizeAdUnit(input: any): AdUnit {
  return {
    id: input.id || '',
    name: input.name || '',
    type: input.type || 'banner',
    content: input.content || '',
    targetUrl: input.targetUrl || '#',
    impression: input.impression || 0,
    clicks: input.clicks || 0,
    active: input.active !== undefined ? input.active : true,
    network: input.network || 'internal',
    placement: input.placement || '',
    impressions: input.impressions || 0,
    revenue: input.revenue || 0,
    ctr: input.ctr || 0,
    lastUpdated: input.lastUpdated ? new Date(input.lastUpdated) : new Date(),
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
    createdAt: input.createdAt ? new Date(input.createdAt) : new Date(),
    updatedAt: input.updatedAt ? new Date(input.updatedAt) : new Date(),
    targetAudience: input.targetAudience || [],
    keywords: input.keywords || [],
    dimensions: input.dimensions || '',
    format: input.format || '',
    status: input.status || 'active'
  };
}

export function normalizeAdSettings(input: any): AdSettings {
  return {
    enabled: input.enabled !== undefined ? input.enabled : false,
    placement: input.placement || [],
    frequency: input.frequency || 5,
    userGroupTargeting: input.userGroupTargeting || [],
    defaultNetwork: input.defaultNetwork || 'internal',
    frequencyCap: input.frequencyCap || 10,
    showToPremiumUsers: input.showToPremiumUsers || false,
    blockList: input.blockList || []
  };
}
