
export type AdNetwork = 'internal' | 'google' | 'facebook' | 'other';

export interface AdSettings {
  enableAds: boolean;
  defaultNetwork: AdNetwork;
  frequencyCap: number;
  showToPremiumUsers: boolean;
  refreshInterval?: number;
  blockList: string[];
}

export interface AdUnit {
  id: string;
  name: string;
  type: 'banner' | 'interstitial' | 'native';
  network: AdNetwork;
  placement: string;
  active: boolean;
  impressions: number;
  clicks: number;
  revenue: number;
  lastUpdated: Date;
}
