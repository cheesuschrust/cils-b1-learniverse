
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Save, Trash2, Settings, DollarSign, BarChart2, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define types for ad networks and settings
export type AdNetwork = 'google' | 'facebook' | 'twitter' | 'amazon' | 'custom';

export interface AdSettings {
  enableAds: boolean;
  defaultNetwork: AdNetwork;
  frequencyCap: number;
  showToPremiumUsers: boolean;
  refreshInterval: number;
  blockList: string[];
}

// Sample ad campaign data
const sampleCampaigns = [
  {
    id: '1',
    name: 'Homepage Banner',
    network: 'google' as AdNetwork,
    placement: 'homepage-top',
    impressions: 12546,
    clicks: 342,
    ctr: 2.73,
    revenue: 198.45,
    status: 'active'
  },
  {
    id: '2',
    name: 'Lesson Sidebar',
    network: 'facebook' as AdNetwork,
    placement: 'lesson-sidebar',
    impressions: 8974,
    clicks: 156,
    ctr: 1.74,
    revenue: 87.23,
    status: 'active'
  },
  {
    id: '3',
    name: 'Practice End Screen',
    network: 'google' as AdNetwork,
    placement: 'practice-end',
    impressions: 4532,
    clicks: 97,
    ctr: 2.14,
    revenue: 54.76,
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Vocabulary List',
    network: 'amazon' as AdNetwork,
    placement: 'vocab-list',
    impressions: 3218,
    clicks: 86,
    ctr: 2.67,
    revenue: 43.92,
    status: 'active'
  }
];

// Sample ad performance data for chart
const performanceData = [
  {
    date: '2023-07-01',
    impressions: 3245,
    clicks: 87,
    revenue: 42.56
  },
  {
    date: '2023-07-02',
    impressions: 3102,
    clicks: 79,
    revenue: 38.21
  },
  {
    date: '2023-07-03',
    impressions: 3510,
    clicks: 95,
    revenue: 47.83
  },
  {
    date: '2023-07-04',
    impressions: 3680,
    clicks: 101,
    revenue: 52.14
  },
  {
    date: '2023-07-05',
    impressions: 3420,
    clicks: 92,
    revenue: 45.76
  },
  {
    date: '2023-07-06',
    impressions: 3590,
    clicks: 96,
    revenue: 49.32
  },
  {
    date: '2023-07-07',
    impressions: 3780,
    clicks: 104,
    revenue: 53.67
  }
];

const AdManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [adSettings, setAdSettings] = useState<AdSettings>({
    enableAds: true,
    defaultNetwork: 'google',
    frequencyCap: 3,
    showToPremiumUsers: false,
    refreshInterval: 60,
    blockList: ['adult', 'gambling', 'politics']
  });
  const [newBlockedCategory, setNewBlockedCategory] = useState('');
  const [campaigns, setCampaigns] = useState(sampleCampaigns);
  const { toast } = useToast();
  
  // Handle saving ad settings
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Ad settings have been successfully updated."
    });
  };
  
  // Handle adding a new blocked category
  const handleAddBlockedCategory = () => {
    if (!newBlockedCategory.trim()) return;
    
    if (!adSettings.blockList.includes(newBlockedCategory)) {
      setAdSettings({
        ...adSettings,
        blockList: [...adSettings.blockList, newBlockedCategory]
      });
      setNewBlockedCategory('');
    }
  };
  
  // Handle removing a blocked category
  const handleRemoveBlockedCategory = (category: string) => {
    setAdSettings({
      ...adSettings,
      blockList: adSettings.blockList.filter(c => c !== category)
    });
  };
  
  // Handle toggling campaign status
  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          status: campaign.status === 'active' ? 'inactive' : 'active'
        };
      }
      return campaign;
    }));
    
    toast({
      title: "Campaign Updated",
      description: "Campaign status has been toggled successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <DollarSign className="h-8 w-8 mr-2" />
          Ad Management
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="ad-toggle"
              checked={adSettings.enableAds}
              onCheckedChange={(checked) => setAdSettings({...adSettings, enableAds: checked})}
            />
            <Label htmlFor="ad-toggle" className="font-medium">
              {adSettings.enableAds ? "Ads Enabled" : "Ads Disabled"}
            </Label>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="campaigns">Ad Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Ad Campaigns</CardTitle>
              <CardDescription>
                Manage your ad campaigns across different networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell className="capitalize">{campaign.network}</TableCell>
                      <TableCell>{campaign.placement}</TableCell>
                      <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                      <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                      <TableCell>{campaign.ctr.toFixed(2)}%</TableCell>
                      <TableCell>${campaign.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === 'active' ? "default" : "outline"}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleCampaignStatus(campaign.id)}
                          >
                            {campaign.status === 'active' ? 'Pause' : 'Activate'}
                          </Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Campaign
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
                <CardDescription>
                  Overview of campaign performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Total Impressions</div>
                    <div className="text-2xl font-bold">
                      {campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Total Clicks</div>
                    <div className="text-2xl font-bold">
                      {campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Total Revenue</div>
                    <div className="text-2xl font-bold">
                      ${campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Average CTR</div>
                    <div className="text-2xl font-bold">
                      {(campaigns.reduce((sum, campaign) => sum + campaign.ctr, 0) / campaigns.length).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Ad Networks</CardTitle>
                <CardDescription>
                  Active advertising networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Google AdSense</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Connected: March 15, 2023
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        Publisher ID: pub-1234567890
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Facebook Audience Network</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Connected: May 2, 2023
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        App ID: 987654321098
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Amazon Associates</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Connected: June 12, 2023
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        Tracking ID: amzn-12345
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Add New Network</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect a new advertising network
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Connect Network
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Ad Performance</CardTitle>
                  <CardDescription>
                    Track revenue and engagement from your ads
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="week">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Last 24 Hours</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted">
                <div className="text-center">
                  <BarChart2 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">
                    Performance charts would display here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Network</CardTitle>
                <CardDescription>
                  Ad revenue distribution by network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Google AdSense</span>
                      <span className="text-sm font-medium">$245.67</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Facebook Audience Network</span>
                      <span className="text-sm font-medium">$87.23</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "23%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Amazon Associates</span>
                      <span className="text-sm font-medium">$43.92</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Placement Performance</CardTitle>
                <CardDescription>
                  Click-through rates by placement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Homepage Banner</span>
                      <span className="text-sm font-medium">2.73% CTR</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "54.6%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Lesson Sidebar</span>
                      <span className="text-sm font-medium">1.74% CTR</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "34.8%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Practice End Screen</span>
                      <span className="text-sm font-medium">2.14% CTR</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "42.8%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Vocabulary List</span>
                      <span className="text-sm font-medium">2.67% CTR</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "53.4%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Metrics</CardTitle>
              <CardDescription>
                Ad experience and interaction data from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Ad Viewability</div>
                  <div className="text-2xl font-bold">78.3%</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 2.4%</span> vs last month
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Engagement Rate</div>
                  <div className="text-2xl font-bold">3.21%</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 0.8%</span> vs last month
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Ad Block Rate</div>
                  <div className="text-2xl font-bold">22.7%</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="text-red-500">↑ 1.3%</span> vs last month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Ad Settings
              </CardTitle>
              <CardDescription>
                Configure how ads are displayed in your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-ads">Enable Ads</Label>
                        <p className="text-sm text-muted-foreground">
                          Display advertisements in the application
                        </p>
                      </div>
                      <Switch 
                        id="enable-ads"
                        checked={adSettings.enableAds}
                        onCheckedChange={(checked) => setAdSettings({...adSettings, enableAds: checked})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-network">Default Ad Network</Label>
                      <Select 
                        value={adSettings.defaultNetwork} 
                        onValueChange={(value: AdNetwork) => setAdSettings({...adSettings, defaultNetwork: value})}
                      >
                        <SelectTrigger id="default-network">
                          <SelectValue placeholder="Select ad network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google AdSense</SelectItem>
                          <SelectItem value="facebook">Facebook Audience Network</SelectItem>
                          <SelectItem value="twitter">Twitter Ads</SelectItem>
                          <SelectItem value="amazon">Amazon Associates</SelectItem>
                          <SelectItem value="custom">Custom Network</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Network used when no specific network is specified
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frequency-cap">Ad Frequency Cap</Label>
                      <Input 
                        id="frequency-cap" 
                        type="number" 
                        min={1} 
                        max={10}
                        value={adSettings.frequencyCap}
                        onChange={(e) => setAdSettings({...adSettings, frequencyCap: parseInt(e.target.value)})}
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum number of ads shown per page
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="premium-ads">Show Ads to Premium Users</Label>
                        <p className="text-sm text-muted-foreground">
                          Display ads to users with paid subscriptions
                        </p>
                      </div>
                      <Switch 
                        id="premium-ads"
                        checked={adSettings.showToPremiumUsers}
                        onCheckedChange={(checked) => setAdSettings({...adSettings, showToPremiumUsers: checked})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="refresh-interval">Ad Refresh Interval (seconds)</Label>
                      <Input 
                        id="refresh-interval" 
                        type="number" 
                        min={30} 
                        max={300}
                        value={adSettings.refreshInterval}
                        onChange={(e) => setAdSettings({...adSettings, refreshInterval: parseInt(e.target.value)})}
                      />
                      <p className="text-sm text-muted-foreground">
                        Time between ad refreshes in seconds
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Excluded Ad Categories</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {adSettings.blockList.map((category) => (
                          <Badge key={category} variant="outline" className="flex items-center gap-1">
                            {category}
                            <Button 
                              variant="ghost" 
                              className="h-4 w-4 p-0 ml-1" 
                              onClick={() => handleRemoveBlockedCategory(category)}
                            >
                              &times;
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter category to block" 
                          value={newBlockedCategory}
                          onChange={(e) => setNewBlockedCategory(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddBlockedCategory()}
                        />
                        <Button onClick={handleAddBlockedCategory}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Categories of ads that will not be shown
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Ad Placement Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Homepage Banner</Label>
                        <p className="text-sm text-muted-foreground">
                          Show banner ad on homepage
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Lesson Sidebar</Label>
                        <p className="text-sm text-muted-foreground">
                          Show sidebar ads during lessons
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Practice End Screen</Label>
                        <p className="text-sm text-muted-foreground">
                          Show ads after completing practice
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mobile Interstitial</Label>
                        <p className="text-sm text-muted-foreground">
                          Show full-screen ads on mobile devices
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monetization Strategy</CardTitle>
              <CardDescription>
                Optimize your ad revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Revenue Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 flex-shrink-0">
                        ✓
                      </div>
                      <span>Increase ad refresh rate for non-interactive pages to improve revenue.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 flex-shrink-0">
                        ✓
                      </div>
                      <span>Test larger ad formats on desktop devices for better visibility.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 flex-shrink-0">
                        ✓
                      </div>
                      <span>Consider native ad placements within content for higher engagement.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Premium Ad-Free Option</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Offer an ad-free experience as part of premium subscriptions to increase subscription conversion.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">A/B Testing</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Run A/B tests for different ad formats and placements to optimize revenue without affecting user experience.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdManager;
