
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MonitorSmartphone, 
  BarChart4, 
  Settings, 
  Megaphone, 
  Target, 
  PackageCheck,
  CreditCard,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AdCampaignManager from './AdCampaignManager';
import AdPlacementManager from './AdPlacementManager';
import AdService from '@/services/AdService';
import AdPerformanceChart from './charts/AdPerformanceChart';

const EnhancedAdManager: React.FC = () => {
  const [adSettings, setAdSettings] = useState(AdService.getAdSettings());
  const { toast } = useToast();
  
  // Initialize sample data to ensure there's content to display
  React.useEffect(() => {
    AdService.initializeSampleData();
  }, []);
  
  const handleToggleAds = () => {
    const updatedSettings = AdService.updateAdSettings({
      enableAds: !adSettings.enableAds
    });
    
    setAdSettings(updatedSettings);
    toast({
      title: updatedSettings.enableAds ? 'Ads Enabled' : 'Ads Disabled',
      description: updatedSettings.enableAds 
        ? 'Advertisements are now enabled on the platform.' 
        : 'Advertisements have been disabled.',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Advertisement Management</h2>
          <p className="text-muted-foreground">
            Configure and manage advertisements, campaigns, and revenue
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{adSettings.enableAds ? 'Ads Enabled' : 'Ads Disabled'}</span>
          <Switch 
            checked={adSettings.enableAds} 
            onCheckedChange={handleToggleAds} 
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Out of 6 total campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month's Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,521</div>
            <p className="text-xs text-green-600">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-green-600">+0.6% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="campaigns" className="flex items-center">
            <Megaphone className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="placements" className="flex items-center">
            <MonitorSmartphone className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Placements</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <BarChart4 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns">
          <AdCampaignManager />
        </TabsContent>
        
        <TabsContent value="placements">
          <AdPlacementManager />
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                View detailed analytics for your advertisement campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AdPerformanceChart />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <p className="text-xs text-green-600">+8.2% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">215</div>
                    <p className="text-xs text-green-600">+5.1% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Engagement Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42s</div>
                    <p className="text-xs text-green-600">+10.5% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Management</CardTitle>
              <CardDescription>
                Track and manage advertisement revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,456.78</div>
                    <p className="text-xs text-green-600">+12.5% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average CPM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$4.28</div>
                    <p className="text-xs text-muted-foreground">Per 1,000 impressions</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Estimated Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$3,150.00</div>
                    <p className="text-xs text-green-600">Based on current traffic</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Detailed revenue reports and payment management would be displayed here
                </p>
                <Button variant="outline" className="mt-4">Generate Revenue Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Settings</CardTitle>
              <CardDescription>
                Configure global advertisement settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Show Ads to Free Users</h3>
                      <p className="text-sm text-muted-foreground">Display advertisements to users on the free tier</p>
                    </div>
                    <Switch checked={adSettings.showAdsToFreeTier} />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Show Ads to Premium Users</h3>
                      <p className="text-sm text-muted-foreground">Display advertisements to premium subscribers</p>
                    </div>
                    <Switch checked={adSettings.showAdsToPremiumTier} />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Allow Third-party Ads</h3>
                      <p className="text-sm text-muted-foreground">Allow external advertisement networks</p>
                    </div>
                    <Switch checked={adSettings.allowThirdPartyAds} />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Allow Remarketing</h3>
                      <p className="text-sm text-muted-foreground">Enable remarketing and tracking cookies</p>
                    </div>
                    <Switch checked={adSettings.allowRemarketing} />
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="py-3 bg-muted/50">
                    <CardTitle className="text-sm font-medium">Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      These settings control advanced behavior of the advertisement system.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Maximum Ads per Page</label>
                          <input 
                            type="number" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            value={adSettings.adsPerPage} 
                            min={0}
                            max={10}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Minimum Time Between Ads (seconds)</label>
                          <input 
                            type="number" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            value={adSettings.minimumTimeBetweenAds} 
                            min={0}
                          />
                        </div>
                      </div>
                      
                      <Button variant="default">
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdManager;
