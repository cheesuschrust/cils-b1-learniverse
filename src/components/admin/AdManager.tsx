
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  BarChart2, 
  Settings, 
  Image, 
  FileText, 
  Plus, 
  Save,
  Trash2, 
  Edit, 
  Eye, 
  DollarSign,
  ArrowDownUp,
  MousePointer,
  Activity,
  Search
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AdService from '@/services/AdService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdSettings, Advertisement, AdCampaign, AdFormat, AdPosition, AdSize, AdStatus } from '@/types/advertisement';
import EnhancedAdvertisement from '@/components/common/EnhancedAdvertisement';

// Initialize sample data
AdService.initializeSampleData();

const AdManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ads, setAds] = useState<Advertisement[]>(AdService.getAllAdvertisements());
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(AdService.getAllCampaigns());
  const [settings, setSettings] = useState<AdSettings>(AdService.getAdSettings());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<AdPosition>('inline');
  const [previewSize, setPreviewSize] = useState<AdSize>('medium');
  const { toast } = useToast();
  
  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === 'ads') {
      setAds(AdService.getAllAdvertisements());
    } else if (activeTab === 'campaigns') {
      setCampaigns(AdService.getAllCampaigns());
    }
  }, [activeTab]);
  
  // Handler for updating settings
  const handleSaveSettings = () => {
    const updatedSettings = AdService.updateAdSettings(settings);
    setSettings(updatedSettings);
    
    toast({
      title: "Settings Saved",
      description: "Ad settings have been updated successfully.",
    });
  };
  
  const handleSettingChange = (field: keyof AdSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Helper function to format large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: AdStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'archived':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  // Calculate total stats
  const totalStats = {
    impressions: ads.reduce((total, ad) => total + (ad.performance?.impressions || 0), 0),
    clicks: ads.reduce((total, ad) => total + (ad.performance?.clicks || 0), 0),
    revenue: ads.reduce((total, ad) => total + (ad.performance?.revenue || 0), 0),
    ctr: totalStats?.impressions > 0 
      ? (totalStats.clicks / totalStats.impressions) * 100 
      : 0
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ad Management</h1>
          <p className="text-muted-foreground">Create, manage, and analyze advertisements</p>
        </div>
        
        {activeTab === 'ads' && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Ad
          </Button>
        )}
        {activeTab === 'campaigns' && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        )}
        {activeTab === 'settings' && (
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            {isPreviewOpen ? 'Hide Preview' : 'Show Ad Preview'}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`col-span-1 lg:col-span-${isPreviewOpen ? 2 : 3}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="dashboard" className="flex items-center justify-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="ads" className="flex items-center justify-center">
                <Image className="h-4 w-4 mr-2" />
                Ads
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center justify-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                        <h3 className="text-2xl font-bold">{formatNumber(totalStats.impressions)}</h3>
                      </div>
                      <Activity className="h-8 w-8 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                        <h3 className="text-2xl font-bold">{formatNumber(totalStats.clicks)}</h3>
                      </div>
                      <MousePointer className="h-8 w-8 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average CTR</p>
                        <h3 className="text-2xl font-bold">{totalStats.ctr.toFixed(2)}%</h3>
                      </div>
                      <ArrowDownUp className="h-8 w-8 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <h3 className="text-2xl font-bold">{formatCurrency(totalStats.revenue)}</h3>
                      </div>
                      <DollarSign className="h-8 w-8 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Ads</CardTitle>
                    <CardDescription>Ads with the highest click-through rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {ads
                        .sort((a, b) => (b.performance?.ctr || 0) - (a.performance?.ctr || 0))
                        .slice(0, 5)
                        .map((ad) => (
                          <div key={ad.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div className="flex-1">
                              <div className="font-medium">{ad.name}</div>
                              <div className="text-sm text-muted-foreground truncate">
                                {ad.content.title || ad.description || 'No title'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{ad.performance?.ctr?.toFixed(2) || 0}%</div>
                              <div className="text-sm text-muted-foreground">
                                {formatNumber(ad.performance?.clicks || 0)} clicks
                              </div>
                            </div>
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Performance</CardTitle>
                    <CardDescription>Revenue by campaign</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {campaigns
                        .sort((a, b) => (b.performance?.revenue || 0) - (a.performance?.revenue || 0))
                        .map((campaign) => (
                          <div key={campaign.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div className="flex-1">
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-sm text-muted-foreground truncate">
                                {campaign.description || 'No description'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(campaign.performance?.revenue || 0)}</div>
                              <div className="text-sm text-muted-foreground">
                                {campaign.performance?.impressions 
                                  ? `${formatNumber(campaign.performance.impressions)} impressions` 
                                  : 'No impressions'}
                              </div>
                            </div>
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="ads">
              <Card>
                <CardHeader>
                  <CardTitle>All Advertisements</CardTitle>
                  <CardDescription>
                    Manage your ad content and view performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Search ads..." className="max-w-sm" />
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg">
                      <div className="grid grid-cols-12 bg-muted p-2 rounded-t-lg border-b">
                        <div className="col-span-3 font-medium">Name</div>
                        <div className="col-span-2 font-medium">Format</div>
                        <div className="col-span-1 font-medium">Status</div>
                        <div className="col-span-1 font-medium">Impressions</div>
                        <div className="col-span-1 font-medium">Clicks</div>
                        <div className="col-span-1 font-medium">CTR</div>
                        <div className="col-span-1 font-medium">Revenue</div>
                        <div className="col-span-2 font-medium">Actions</div>
                      </div>
                      
                      <ScrollArea className="h-[500px]">
                        {ads.map((ad) => (
                          <div key={ad.id} className="grid grid-cols-12 p-2 border-b last:border-0 hover:bg-muted/50">
                            <div className="col-span-3 truncate">
                              <div className="font-medium">{ad.name}</div>
                              <div className="text-xs text-muted-foreground">{ad.content.title || 'No title'}</div>
                            </div>
                            <div className="col-span-2">
                              <Badge variant="outline" className="capitalize">
                                {ad.format}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1 capitalize">{ad.position}, {ad.size}</div>
                            </div>
                            <div className="col-span-1">
                              <Badge variant={getStatusBadgeVariant(ad.status)} className="capitalize">
                                {ad.status}
                              </Badge>
                            </div>
                            <div className="col-span-1 text-sm">
                              {formatNumber(ad.performance?.impressions || 0)}
                            </div>
                            <div className="col-span-1 text-sm">
                              {formatNumber(ad.performance?.clicks || 0)}
                            </div>
                            <div className="col-span-1 text-sm">
                              {ad.performance?.ctr?.toFixed(2) || '0.00'}%
                            </div>
                            <div className="col-span-1 text-sm">
                              {formatCurrency(ad.performance?.revenue || 0)}
                            </div>
                            <div className="col-span-2 flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <Card>
                <CardHeader>
                  <CardTitle>Ad Campaigns</CardTitle>
                  <CardDescription>
                    Manage your campaign groups and budgets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Search campaigns..." className="max-w-sm" />
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg">
                      <div className="grid grid-cols-12 bg-muted p-2 rounded-t-lg border-b">
                        <div className="col-span-3 font-medium">Name</div>
                        <div className="col-span-1 font-medium">Status</div>
                        <div className="col-span-2 font-medium">Budget</div>
                        <div className="col-span-1 font-medium">Spent</div>
                        <div className="col-span-1 font-medium">Ads</div>
                        <div className="col-span-2 font-medium">Date Range</div>
                        <div className="col-span-2 font-medium">Actions</div>
                      </div>
                      
                      <ScrollArea className="h-[500px]">
                        {campaigns.map((campaign) => (
                          <div key={campaign.id} className="grid grid-cols-12 p-2 border-b last:border-0 hover:bg-muted/50">
                            <div className="col-span-3 truncate">
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-xs text-muted-foreground">{campaign.description || 'No description'}</div>
                            </div>
                            <div className="col-span-1">
                              <Badge variant={getStatusBadgeVariant(campaign.status)} className="capitalize">
                                {campaign.status}
                              </Badge>
                            </div>
                            <div className="col-span-2 text-sm">
                              {formatCurrency(campaign.budget.total)}
                              <div className="text-xs text-muted-foreground">{campaign.budget.currency}</div>
                            </div>
                            <div className="col-span-1 text-sm">
                              {formatCurrency(campaign.budget.spent)}
                              <div className="text-xs text-muted-foreground">
                                {Math.round((campaign.budget.spent / campaign.budget.total) * 100)}%
                              </div>
                            </div>
                            <div className="col-span-1 text-sm">
                              {campaign.ads.length}
                            </div>
                            <div className="col-span-2 text-sm">
                              {new Date(campaign.scheduling.startDate).toLocaleDateString()}
                              {campaign.scheduling.endDate && (
                                <> - {new Date(campaign.scheduling.endDate).toLocaleDateString()}</>
                              )}
                            </div>
                            <div className="col-span-2 flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Ad Settings</CardTitle>
                  <CardDescription>
                    Configure how ads are displayed throughout the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableAds" className="flex items-center">
                        Enable Advertisements
                        <Badge className="ml-2" variant={settings.enableAds ? 'default' : 'outline'}>
                          {settings.enableAds ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </Label>
                      <Switch 
                        id="enableAds" 
                        checked={settings.enableAds}
                        onCheckedChange={(checked) => handleSettingChange('enableAds', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showToPremiumUsers" className="flex items-center">
                        Show Ads to Premium Users
                      </Label>
                      <Switch 
                        id="showToPremiumUsers" 
                        checked={settings.showToPremiumUsers}
                        onCheckedChange={(checked) => handleSettingChange('showToPremiumUsers', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultNetwork">Default Ad Network</Label>
                      <Select
                        value={settings.defaultNetwork}
                        onValueChange={(value: AdNetwork) => handleSettingChange('defaultNetwork', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select default network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="google">Google AdSense</SelectItem>
                          <SelectItem value="facebook">Facebook Audience Network</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frequencyCap">Ad Frequency Cap</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="frequencyCap" 
                          type="number" 
                          min="1" 
                          max="100"
                          value={settings.frequencyCap}
                          onChange={(e) => handleSettingChange('frequencyCap', parseInt(e.target.value))}
                        />
                        <span className="text-muted-foreground">ads per session</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Maximum number of ads to show to a user in a single session
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="refreshInterval">Ad Refresh Interval</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="refreshInterval" 
                          type="number" 
                          min="0" 
                          max="3600"
                          value={settings.refreshInterval || 0}
                          onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                        />
                        <span className="text-muted-foreground">seconds (0 = no refresh)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        How often to refresh ads (set to 0 to disable automatic refresh)
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveSettings} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {isPreviewOpen && activeTab === 'settings' && (
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ad Preview</CardTitle>
                <CardDescription>
                  Preview how ads will appear to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="previewPosition">Position</Label>
                  <Select
                    value={previewPosition}
                    onValueChange={(value: AdPosition) => setPreviewPosition(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="previewSize">Size</Label>
                  <Select
                    value={previewSize}
                    onValueChange={(value: AdSize) => setPreviewSize(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-sm font-medium mb-2">Preview:</div>
                  <EnhancedAdvertisement 
                    position={previewPosition} 
                    size={previewSize}
                    showCloseButton={true}
                  />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Note: The preview shows a random ad from your active ads. 
                  If no ad appears, make sure you have active ads that match these criteria.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdManager;
