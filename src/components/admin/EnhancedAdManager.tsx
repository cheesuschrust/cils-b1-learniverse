
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
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdCampaignManager from './AdCampaignManager';
import AdService from '@/services/AdService';

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
        <Badge variant={adSettings.enableAds ? "default" : "outline"} className="ml-auto">
          {adSettings.enableAds ? 'Ads Enabled' : 'Ads Disabled'}
        </Badge>
      </div>
      
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-5">
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
          <Card>
            <CardHeader>
              <CardTitle>Ad Placements</CardTitle>
              <CardDescription>
                Configure where advertisements appear throughout the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MonitorSmartphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Ad placement configuration would be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
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
              <div className="text-center py-8">
                <BarChart4 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Performance metrics and charts would be displayed here
                </p>
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
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Revenue tracking and management would be displayed here
                </p>
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
              <div className="text-center py-8">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Global advertisement settings would be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdManager;
