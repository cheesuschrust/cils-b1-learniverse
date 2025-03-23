
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { AdConfiguration } from '@/contexts/shared-types';
import { API } from '@/services/api';
import { Plus, Trash2, LineChart, AlertCircle, DollarSign, LayoutGrid } from 'lucide-react';

// Type-safe setter for adConfig state
type AdConfigSetter = React.Dispatch<React.SetStateAction<AdConfiguration>>;

const Advertising = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adConfig, setAdConfig] = useState<AdConfiguration>({
    enabled: false,
    provider: 'google',
    adUnits: [
      {
        id: '1',
        name: 'Header Banner',
        type: 'banner',
        placement: 'header',
        active: true
      },
      {
        id: '2',
        name: 'Sidebar Ad',
        type: 'native',
        placement: 'sidebar',
        active: true
      }
    ],
    settings: {
      frequency: 3,
      showToFreeUsers: true,
      showToPremiumUsers: false
    }
  });

  useEffect(() => {
    const fetchAdSettings = async () => {
      setIsLoading(true);
      try {
        const response = await API.handleRequest<AdConfiguration>('/admin/advertising/settings', 'GET');
        setAdConfig(response);
      } catch (error) {
        console.error('Error fetching advertising settings:', error);
        toast({
          title: 'Failed to load advertising settings',
          description: 'There was an error loading the advertising configuration.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdSettings();
  }, [toast]);

  const handleInputChange = (field: string, value: any) => {
    setAdConfig(prev => {
      const newConfig = { ...prev };
      
      // Handle nested fields with dot notation
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'settings') {
          newConfig.settings = {
            ...newConfig.settings,
            [child]: value
          };
        }
      } else {
        // Type assertion to ensure TypeScript knows we're setting a valid field
        (newConfig as Record<string, unknown>)[field] = value;
      }
      
      return newConfig;
    });
  };

  const handleAdUnitChange = (id: string, field: string, value: any) => {
    setAdConfig(prev => {
      const updatedAdUnits = prev.adUnits.map(unit => {
        if (unit.id === id) {
          return { ...unit, [field]: value };
        }
        return unit;
      });
      
      return { ...prev, adUnits: updatedAdUnits };
    });
  };

  const addAdUnit = () => {
    const newId = String(Date.now());
    setAdConfig(prev => ({
      ...prev,
      adUnits: [
        ...prev.adUnits,
        {
          id: newId,
          name: 'New Ad Unit',
          type: 'banner',
          placement: 'content',
          active: false
        }
      ]
    }));
  };

  const removeAdUnit = (id: string) => {
    setAdConfig(prev => ({
      ...prev,
      adUnits: prev.adUnits.filter(unit => unit.id !== id)
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await API.handleRequest<AdConfiguration>('/admin/advertising/settings', 'PUT', adConfig);
      toast({
        title: 'Advertising settings saved',
        description: 'Your advertising configuration has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving advertising settings:', error);
      toast({
        title: 'Failed to save settings',
        description: 'There was an error updating the advertising configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Advertising Settings</h1>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Ad Revenue Integration</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
              Changes to ad settings may take up to 24 hours to fully propagate. Please ensure your ad units comply with your ad network's policies.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="units" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Ad Units
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Ad Settings</CardTitle>
              <CardDescription>
                Configure global settings for advertisements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Advertisements</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle all advertising on or off across the platform
                  </p>
                </div>
                <Switch 
                  checked={adConfig.enabled}
                  onCheckedChange={(checked) => handleInputChange('enabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adProvider">Ad Network Provider</Label>
                <select
                  id="adProvider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={adConfig.provider}
                  onChange={(e) => handleInputChange('provider', e.target.value)}
                  disabled={!adConfig.enabled}
                >
                  <option value="google">Google AdSense</option>
                  <option value="facebook">Facebook Audience Network</option>
                  <option value="custom">Custom Ad Network</option>
                </select>
                <p className="text-sm text-muted-foreground">
                  Select your primary ad monetization provider
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Ads to Free Users</Label>
                      <p className="text-sm text-muted-foreground">
                        Display advertisements to users on the free plan
                      </p>
                    </div>
                    <Switch 
                      checked={adConfig.settings.showToFreeUsers}
                      onCheckedChange={(checked) => handleInputChange('settings.showToFreeUsers', checked)}
                      disabled={!adConfig.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Ads to Premium Users</Label>
                      <p className="text-sm text-muted-foreground">
                        Display advertisements to users on paid plans
                      </p>
                    </div>
                    <Switch 
                      checked={adConfig.settings.showToPremiumUsers}
                      onCheckedChange={(checked) => handleInputChange('settings.showToPremiumUsers', checked)}
                      disabled={!adConfig.enabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adFrequency">Ad Frequency</Label>
                    <Input 
                      id="adFrequency"
                      type="number"
                      min="1"
                      max="10"
                      value={adConfig.settings.frequency}
                      onChange={(e) => handleInputChange('settings.frequency', parseInt(e.target.value))}
                      disabled={!adConfig.enabled}
                    />
                    <p className="text-sm text-muted-foreground">
                      How many lessons/pages between ads (1 = show ads on every page)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ad Units</CardTitle>
                <CardDescription>
                  Manage individual ad placements across the platform
                </CardDescription>
              </div>
              <Button 
                onClick={addAdUnit} 
                disabled={!adConfig.enabled}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Ad Unit
              </Button>
            </CardHeader>
            <CardContent>
              {adConfig.adUnits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No ad units configured. Click "Add Ad Unit" to create one.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {adConfig.adUnits.map((unit) => (
                    <div key={unit.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{unit.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {unit.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={unit.active}
                            onCheckedChange={(checked) => handleAdUnitChange(unit.id, 'active', checked)}
                            disabled={!adConfig.enabled}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeAdUnit(unit.id)}
                            disabled={!adConfig.enabled}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${unit.id}`}>Ad Name</Label>
                          <Input 
                            id={`name-${unit.id}`}
                            value={unit.name}
                            onChange={(e) => handleAdUnitChange(unit.id, 'name', e.target.value)}
                            disabled={!adConfig.enabled}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`type-${unit.id}`}>Ad Type</Label>
                          <select
                            id={`type-${unit.id}`}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={unit.type}
                            onChange={(e) => handleAdUnitChange(unit.id, 'type', e.target.value)}
                            disabled={!adConfig.enabled}
                          >
                            <option value="banner">Banner</option>
                            <option value="interstitial">Interstitial</option>
                            <option value="native">Native</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`placement-${unit.id}`}>Placement</Label>
                          <select
                            id={`placement-${unit.id}`}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={unit.placement}
                            onChange={(e) => handleAdUnitChange(unit.id, 'placement', e.target.value)}
                            disabled={!adConfig.enabled}
                          >
                            <option value="header">Header</option>
                            <option value="footer">Footer</option>
                            <option value="sidebar">Sidebar</option>
                            <option value="content">Within Content</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`adcode-${unit.id}`}>Ad Unit Code</Label>
                          <Input 
                            id={`adcode-${unit.id}`}
                            placeholder="e.g., ca-pub-1234567890"
                            disabled={!adConfig.enabled}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Performance</CardTitle>
              <CardDescription>
                Track your advertising revenue and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Revenue (30 days)</h3>
                  <p className="text-2xl font-bold">$126.47</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Impressions</h3>
                  <p className="text-2xl font-bold">25,831</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Average CTR</h3>
                  <p className="text-2xl font-bold">2.14%</p>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-3 border-b">
                  <h3 className="font-medium">Revenue History</h3>
                </div>
                <div className="p-6 h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Performance by Ad Unit</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 border-b">Ad Unit</th>
                        <th className="text-left p-3 border-b">Impressions</th>
                        <th className="text-left p-3 border-b">Clicks</th>
                        <th className="text-left p-3 border-b">CTR</th>
                        <th className="text-left p-3 border-b">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adConfig.adUnits.map((unit) => (
                        <tr key={unit.id}>
                          <td className="p-3 border-b">{unit.name}</td>
                          <td className="p-3 border-b">{Math.floor(Math.random() * 10000)}</td>
                          <td className="p-3 border-b">{Math.floor(Math.random() * 300)}</td>
                          <td className="p-3 border-b">{(Math.random() * 3).toFixed(2)}%</td>
                          <td className="p-3 border-b">${(Math.random() * 100).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" className="mr-2">
          Cancel
        </Button>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Ad Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Advertising;
