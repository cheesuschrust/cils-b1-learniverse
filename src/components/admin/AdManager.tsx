
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, LineChart } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AdService from '@/services/AdService';
import { Advertisement, AdCampaign, AdFormat, AdPosition, AdSize, AdNetwork, AdStatus } from '@/types/advertisement';
import { BarChart3, CalendarIcon, CheckCircle, ChevronDown, ChevronRight, CreditCard, ExternalLink, Eye, EyeOff, Filter, Image, Layers, LayoutGrid, ListFilter, MoreHorizontal, Pencil, PieChart, Plus, Search, Trash2, TrendingUp } from 'lucide-react';

const AdManager: React.FC = () => {
  const { toast } = useToast();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [isAdFormOpen, setIsAdFormOpen] = useState(false);
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [adSettings, setAdSettings] = useState({
    enableAds: true,
    defaultNetwork: 'internal' as AdNetwork,
    frequencyCap: 10,
    showToPremiumUsers: false,
    refreshInterval: 60,
    blockList: [] as string[],
  });
  
  // Set up mock data on first render
  useEffect(() => {
    AdService.initializeSampleData();
    loadAdsAndCampaigns();
  }, []);
  
  // Load ads and campaigns from the service
  const loadAdsAndCampaigns = () => {
    const allAds = AdService.getAllAdvertisements();
    const allCampaigns = AdService.getAllCampaigns();
    setAdvertisements(allAds);
    setCampaigns(allCampaigns);
    setAdSettings(AdService.getAdSettings());
  };
  
  // Handle status change for an advertisement
  const handleAdStatusChange = (adId: string, status: AdStatus) => {
    const updatedAd = AdService.updateAdvertisement(adId, { status });
    if (updatedAd) {
      setAdvertisements(AdService.getAllAdvertisements());
      toast({
        title: "Ad Status Updated",
        description: `Ad status changed to ${status}.`,
      });
    }
  };
  
  // Handle status change for a campaign
  const handleCampaignStatusChange = (campaignId: string, status: AdStatus) => {
    const updatedCampaign = AdService.updateCampaign(campaignId, { status });
    if (updatedCampaign) {
      setCampaigns(AdService.getAllCampaigns());
      toast({
        title: "Campaign Status Updated",
        description: `Campaign status changed to ${status}.`,
      });
    }
  };
  
  // Edit an advertisement
  const handleEditAd = (ad: Advertisement) => {
    setSelectedAd(ad);
    setIsAdFormOpen(true);
  };
  
  // Edit a campaign
  const handleEditCampaign = (campaign: AdCampaign) => {
    setSelectedCampaign(campaign);
    setIsCampaignFormOpen(true);
  };
  
  // Delete an advertisement
  const handleDeleteAd = (adId: string) => {
    const success = AdService.deleteAdvertisement(adId);
    if (success) {
      setAdvertisements(AdService.getAllAdvertisements());
      toast({
        title: "Advertisement Deleted",
        description: "The advertisement has been permanently removed.",
      });
    }
  };
  
  // Delete a campaign
  const handleDeleteCampaign = (campaignId: string) => {
    const success = AdService.deleteCampaign(campaignId);
    if (success) {
      setCampaigns(AdService.getAllCampaigns());
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been permanently removed.",
      });
    }
  };
  
  // Update ad settings
  const handleUpdateSettings = () => {
    AdService.updateAdSettings(adSettings);
    toast({
      title: "Settings Updated",
      description: "Ad settings have been successfully updated.",
    });
  };
  
  // Calculate total stats across all ads
  const getTotalStats = () => {
    const totalStats = {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
    };
    
    advertisements.forEach(ad => {
      if (ad.performance) {
        totalStats.impressions += ad.performance.impressions;
        totalStats.clicks += ad.performance.clicks;
        totalStats.revenue += ad.performance.revenue;
      }
    });
    
    if (totalStats.impressions > 0) {
      totalStats.ctr = (totalStats.clicks / totalStats.impressions) * 100;
    }
    
    return totalStats;
  };
  
  const totalStats = getTotalStats();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ad Management</h1>
          <p className="text-muted-foreground">Create, manage, and track advertisements</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => {
            setSelectedAd(null);
            setIsAdFormOpen(true);
          }} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Ad
          </Button>
          
          <Button onClick={() => {
            setSelectedCampaign(null);
            setIsCampaignFormOpen(true);
          }} variant="outline" className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.impressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime ad views</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.clicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              CTR: {totalStats.ctr.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {advertisements.length > 0 && totalStats.impressions > 0 && 
                `RPM: $${((totalStats.revenue / totalStats.impressions) * 1000).toFixed(2)}`
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {advertisements.filter(ad => ad.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {advertisements.length > 0 && 
                `${Math.round((advertisements.filter(ad => ad.status === 'active').length / advertisements.length) * 100)}% of total ads`
              }
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="advertisements" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-8">
          <TabsTrigger value="advertisements" className="flex items-center justify-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Advertisements
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center justify-center gap-2">
            <Layers className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center justify-center gap-2">
            <Filter className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="advertisements">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Manage Advertisements</CardTitle>
                  <CardDescription>Create and manage individual ad units</CardDescription>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search ads..."
                      className="pl-8 w-full md:w-[200px]"
                    />
                  </div>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {advertisements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Advertisements Yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                    Create your first advertisement to start monetizing your platform.
                  </p>
                  <Button onClick={() => {
                    setSelectedAd(null);
                    setIsAdFormOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Advertisement
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Impressions</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {advertisements.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell className="font-medium">{ad.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {ad.format}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {ad.position}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={ad.status} 
                              onValueChange={(value: AdStatus) => handleAdStatusChange(ad.id, value)}
                            >
                              <SelectTrigger className="h-7 w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            {ad.performance?.impressions?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {ad.performance?.clicks?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {ad.performance?.ctr?.toFixed(2) || 0}%
                          </TableCell>
                          <TableCell className="text-right">
                            ${ad.performance?.revenue?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditAd(ad)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteAd(ad.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your ads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart 
                    data={advertisements.slice(0, 5).map(ad => ({
                      name: ad.name,
                      impressions: ad.performance?.impressions || 0,
                      clicks: ad.performance?.clicks || 0,
                    }))}
                    index="name"
                    categories={["impressions", "clicks"]}
                    colors={["blue", "orange"]}
                    valueFormatter={(value) => `${value.toLocaleString()}`}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart 
                    data={[
                      { date: "Jan", revenue: 580 },
                      { date: "Feb", revenue: 620 },
                      { date: "Mar", revenue: 750 },
                      { date: "Apr", revenue: 820 },
                      { date: "May", revenue: 950 },
                      { date: "Jun", revenue: 1050 },
                      { date: "Jul", revenue: 1250 },
                    ]}
                    index="date"
                    categories={["revenue"]}
                    colors={["green"]}
                    valueFormatter={(value) => `$${value}`}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Manage Campaigns</CardTitle>
                  <CardDescription>Group ads into campaigns for better organization</CardDescription>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search campaigns..."
                      className="pl-8 w-full md:w-[200px]"
                    />
                  </div>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Campaigns Yet</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                    Create your first campaign to organize your advertisements.
                  </p>
                  <Button onClick={() => {
                    setSelectedCampaign(null);
                    setIsCampaignFormOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Spend</TableHead>
                        <TableHead className="text-right">Remaining</TableHead>
                        <TableHead className="text-center">Ads</TableHead>
                        <TableHead className="text-right">Impressions</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <Select 
                              value={campaign.status} 
                              onValueChange={(value: AdStatus) => handleCampaignStatusChange(campaign.id, value)}
                            >
                              <SelectTrigger className="h-7 w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            ${campaign.budget.total.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ${campaign.budget.spent.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ${(campaign.budget.total - campaign.budget.spent).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge>
                              {campaign.ads.length}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {campaign.performance?.impressions?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {campaign.performance?.clicks?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditCampaign(campaign)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteCampaign(campaign.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Budget utilization and results by campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart 
                    data={campaigns.map(campaign => ({
                      name: campaign.name,
                      budget: campaign.budget.total,
                      spent: campaign.budget.spent,
                    }))}
                    index="name"
                    categories={["budget", "spent"]}
                    colors={["blue", "green"]}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Engagement</CardTitle>
                <CardDescription>Click-through rates and conversion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart 
                    data={campaigns.map(campaign => ({
                      name: campaign.name,
                      ctr: campaign.performance?.ctr || 0,
                      revenue: campaign.performance?.revenue || 0,
                    }))}
                    index="name"
                    categories={["ctr", "revenue"]}
                    colors={["orange", "green"]}
                    valueFormatter={(value, category) => 
                      category === "ctr" ? `${value.toFixed(2)}%` : `$${value.toLocaleString()}`
                    }
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Ad System Settings</CardTitle>
              <CardDescription>Configure global settings for your ad system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableAds">Enable Advertisements</Label>
                      <Switch 
                        id="enableAds" 
                        checked={adSettings.enableAds}
                        onCheckedChange={(checked) => setAdSettings({...adSettings, enableAds: checked})}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Toggle to enable or disable all advertisements platform-wide
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showToPremiumUsers">Show Ads to Premium Users</Label>
                      <Switch 
                        id="showToPremiumUsers" 
                        checked={adSettings.showToPremiumUsers}
                        onCheckedChange={(checked) => setAdSettings({...adSettings, showToPremiumUsers: checked})}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If enabled, premium users will also see advertisements
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultNetwork">Default Ad Network</Label>
                    <Select 
                      value={adSettings.defaultNetwork} 
                      onValueChange={(value: AdNetwork) => setAdSettings({...adSettings, defaultNetwork: value})}
                    >
                      <SelectTrigger id="defaultNetwork">
                        <SelectValue placeholder="Select default network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      The default network to use when no specific network is specified
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequencyCap">Ad Frequency Cap</Label>
                    <Input 
                      id="frequencyCap" 
                      type="number" 
                      min="1" 
                      max="100"
                      value={adSettings.frequencyCap}
                      onChange={(e) => setAdSettings({...adSettings, frequencyCap: parseInt(e.target.value)})}
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum number of ads to show per session (1-100)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="refreshInterval">Ad Refresh Interval (seconds)</Label>
                    <Input 
                      id="refreshInterval" 
                      type="number" 
                      min="0" 
                      max="3600"
                      value={adSettings.refreshInterval}
                      onChange={(e) => setAdSettings({...adSettings, refreshInterval: parseInt(e.target.value)})}
                    />
                    <p className="text-sm text-muted-foreground">
                      Time in seconds before refreshing ads (0 to disable auto-refresh)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blockList">Advertiser Block List</Label>
                  <Textarea 
                    id="blockList" 
                    placeholder="Enter blocked advertisers or categories, one per line"
                    value={adSettings.blockList.join('\n')}
                    onChange={(e) => setAdSettings({...adSettings, blockList: e.target.value.split('\n').filter(item => item.trim() !== '')})}
                  />
                  <p className="text-sm text-muted-foreground">
                    List of advertisers or categories that should be blocked from appearing
                  </p>
                </div>
                
                <h3 className="text-lg font-medium mt-8 mb-4">Ad Network Configuration</h3>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Google AdSense</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="googlePublisherId">Publisher ID</Label>
                          <Input id="googlePublisherId" placeholder="e.g., pub-1234567890123456" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="googleSlotId">Ad Slot ID</Label>
                          <Input id="googleSlotId" placeholder="e.g., 1234567890" />
                        </div>
                      </div>
                      <Alert>
                        <AlertTitle>Integration Required</AlertTitle>
                        <AlertDescription>
                          To use Google AdSense, you need to complete the verification process on their platform and add the necessary code to your site. For detailed instructions, refer to the <a href="#" className="underline">integration guide</a>.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Facebook Audience Network</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebookPlacementId">Placement ID</Label>
                        <Input id="facebookPlacementId" placeholder="e.g., 123456789_987654321" />
                      </div>
                      <Alert>
                        <AlertTitle>Integration Required</AlertTitle>
                        <AlertDescription>
                          To use Facebook Audience Network, you need to set up your app in the Facebook for Developers portal. For detailed instructions, refer to the <a href="#" className="underline">integration guide</a>.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Custom Ad Server</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customApiUrl">API URL</Label>
                          <Input id="customApiUrl" placeholder="e.g., https://ads.example.com/api" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customApiKey">API Key</Label>
                          <Input id="customApiKey" type="password" placeholder="Your API key" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleUpdateSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Ad Form Dialog */}
      <Dialog open={isAdFormOpen} onOpenChange={setIsAdFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedAd ? 'Edit Advertisement' : 'Create New Advertisement'}</DialogTitle>
            <DialogDescription>
              {selectedAd 
                ? 'Update the details of your existing advertisement'
                : 'Fill in the details to create a new advertisement'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adName">Advertisement Name</Label>
                <Input id="adName" placeholder="e.g., Premium Promotion Banner" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adDescription">Description</Label>
                <Textarea id="adDescription" placeholder="Brief description of this advertisement" />
              </div>
              
              <div className="space-y-2">
                <Label>Ad Format</Label>
                <ToggleGroup type="single" className="justify-start">
                  <ToggleGroupItem value="banner" aria-label="Banner">
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Banner
                  </ToggleGroupItem>
                  <ToggleGroupItem value="native" aria-label="Native">
                    <ListFilter className="h-4 w-4 mr-2" />
                    Native
                  </ToggleGroupItem>
                  <ToggleGroupItem value="interstitial" aria-label="Interstitial">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Interstitial
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adPosition">Position</Label>
                  <Select defaultValue="inline">
                    <SelectTrigger id="adPosition">
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
                  <Label htmlFor="adSize">Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="adSize">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adStatus">Status</Label>
                <Select defaultValue="draft">
                  <SelectTrigger id="adStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adTitle">Ad Title</Label>
                <Input id="adTitle" placeholder="e.g., Upgrade to Premium Today!" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adContent">Ad Description</Label>
                <Textarea id="adContent" placeholder="Brief compelling message for your advertisement" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adLink">Destination URL</Label>
                <Input id="adLink" placeholder="e.g., https://example.com/premium" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adButtonText">Button Text</Label>
                <Input id="adButtonText" placeholder="e.g., Learn More" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adImageUrl">Image URL</Label>
                <Input id="adImageUrl" placeholder="e.g., https://example.com/images/ad.jpg" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Pick a date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdFormOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: selectedAd ? "Advertisement Updated" : "Advertisement Created",
                description: selectedAd 
                  ? "Your advertisement has been successfully updated." 
                  : "Your new advertisement has been created.",
              });
              setIsAdFormOpen(false);
            }}>
              {selectedAd ? 'Update Advertisement' : 'Create Advertisement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Campaign Form Dialog */}
      <Dialog open={isCampaignFormOpen} onOpenChange={setIsCampaignFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
            <DialogDescription>
              {selectedCampaign 
                ? 'Update the details of your existing campaign'
                : 'Fill in the details to create a new ad campaign'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input id="campaignName" placeholder="e.g., Q4 Subscription Drive" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaignDescription">Description</Label>
                  <Textarea id="campaignDescription" placeholder="Brief description of this campaign's goals" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaignStatus">Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="campaignStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignBudget">Total Budget</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <Input id="campaignBudget" className="pl-7" placeholder="e.g., 5000" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(new Date(), "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>Pick a date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaignCurrency">Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="campaignCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Campaign Advertisements</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Advertisement
                </Button>
              </div>
              
              {/* List of ads in campaign */}
              <div className="border rounded-lg">
                {advertisements.length > 0 ? (
                  <div className="divide-y">
                    {advertisements.slice(0, 3).map((ad) => (
                      <div key={ad.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <Switch id={`ad-${ad.id}`} />
                          <div>
                            <p className="font-medium">{ad.name}</p>
                            <p className="text-sm text-muted-foreground">{ad.format} · {ad.position}</p>
                          </div>
                        </div>
                        <Badge variant={ad.status === 'active' ? 'default' : 'outline'} className="capitalize">
                          {ad.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No advertisements available.</p>
                    <p className="text-sm">Create advertisements first, then add them to this campaign.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Targeting Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>User Type</Label>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="targetFree" />
                      <Label htmlFor="targetFree">Free Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="targetPremium" />
                      <Label htmlFor="targetPremium">Premium Users</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>User Level</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minLevel">Minimum Level</Label>
                      <Input id="minLevel" type="number" placeholder="e.g., 1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLevel">Maximum Level</Label>
                      <Input id="maxLevel" type="number" placeholder="e.g., 100" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="countries">Countries</Label>
                  <Input id="countries" placeholder="e.g., US, CA, UK (comma separated)" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages</Label>
                  <Input id="languages" placeholder="e.g., en, fr, es (comma separated)" />
                </div>
                
                <div className="space-y-2">
                  <Label>Devices</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="targetMobile" />
                      <Label htmlFor="targetMobile">Mobile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="targetTablet" />
                      <Label htmlFor="targetTablet">Tablet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="targetDesktop" />
                      <Label htmlFor="targetDesktop">Desktop</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCampaignFormOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: selectedCampaign ? "Campaign Updated" : "Campaign Created",
                description: selectedCampaign 
                  ? "Your campaign has been successfully updated." 
                  : "Your new campaign has been created.",
              });
              setIsCampaignFormOpen(false);
            }}>
              {selectedCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdManager;
