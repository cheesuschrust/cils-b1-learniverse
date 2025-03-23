import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { 
  Settings, 
  Users, 
  BarChart, 
  Mail, 
  FileText, 
  Globe, 
  DollarSign,
  PlusCircle,
  Trash2,
  ExternalLink,
  MousePointerClick
} from 'lucide-react';
import { 
  AdConfiguration, 
  SEOConfiguration, 
  SalesConfiguration 
} from '@/contexts/shared-types';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  
  // Mock initial data for settings
  const [adConfig, setAdConfig] = useState<AdConfiguration>({
    enabled: true,
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
        type: 'banner',
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
  
  const [seoConfig, setSeoConfig] = useState<SEOConfiguration>({
    defaultTitle: 'CILS B2 Cittadinanza - Italian Language Learning',
    defaultDescription: 'Prepare for the CILS B2 Cittadinanza exam with our comprehensive learning tools',
    defaultKeywords: ['italian', 'language', 'citizenship', 'cils', 'b2', 'exam'],
    siteMap: {
      enabled: true,
      lastGenerated: new Date().toISOString()
    },
    robotsTxt: {
      enabled: true,
      content: 'User-agent: *\nAllow: /'
    },
    analytics: {
      provider: 'google',
      trackingId: 'UA-123456789-1',
      enabled: true
    }
  });
  
  const [salesConfig, setSalesConfig] = useState<SalesConfiguration>({
    products: [
      {
        id: '1',
        name: 'Basic Plan',
        description: 'Access to basic learning materials',
        price: 9.99,
        currency: 'USD',
        type: 'subscription',
        features: ['Grammar lessons', 'Vocabulary builder', 'Limited exercises'],
        active: true
      },
      {
        id: '2',
        name: 'Premium Plan',
        description: 'Full access to all features',
        price: 19.99,
        currency: 'USD',
        type: 'subscription',
        features: ['All basic features', 'Mock exams', 'AI feedback', 'Speaking practice'],
        active: true
      }
    ],
    discounts: [
      {
        id: '1',
        name: 'New User Discount',
        code: 'WELCOME20',
        amount: 20,
        type: 'percentage',
        validFrom: '2023-01-01T00:00:00Z',
        validTo: '2023-12-31T23:59:59Z',
        active: true
      }
    ],
    paymentProviders: [
      {
        name: 'stripe',
        enabled: true,
        testMode: true
      },
      {
        name: 'paypal',
        enabled: true,
        testMode: true
      }
    ]
  });

  // Handler for general settings save
  const handleGeneralSave = () => {
    toast({
      title: "Settings saved",
      description: "General settings have been updated successfully."
    });
  };
  
  // Handler for ad config save
  const handleAdConfigSave = () => {
    toast({
      title: "Ad settings saved",
      description: "Advertising configuration has been updated successfully."
    });
  };
  
  // Handler for SEO config save
  const handleSeoConfigSave = () => {
    toast({
      title: "SEO settings saved",
      description: "SEO configuration has been updated successfully."
    });
  };
  
  // Handler for sales config save
  const handleSalesConfigSave = () => {
    toast({
      title: "Sales settings saved",
      description: "Sales configuration has been updated successfully."
    });
  };
  
  // Add new ad unit
  const addAdUnit = () => {
    const newAdUnit = {
      id: Date.now().toString(),
      name: 'New Ad Unit',
      type: 'banner' as const,
      placement: 'content' as const,
      active: false
    };
    setAdConfig({
      ...adConfig,
      adUnits: [...adConfig.adUnits, newAdUnit]
    });
  };
  
  // Remove ad unit
  const removeAdUnit = (id: string) => {
    setAdConfig({
      ...adConfig,
      adUnits: adConfig.adUnits.filter(unit => unit.id !== id)
    });
  };
  
  // Add new product
  const addProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: 'New Product',
      description: 'Product description',
      price: 0,
      currency: 'USD',
      type: 'subscription' as const,
      features: ['Feature 1'],
      active: false
    };
    setSalesConfig({
      ...salesConfig,
      products: [...salesConfig.products, newProduct]
    });
  };
  
  // Remove product
  const removeProduct = (id: string) => {
    setSalesConfig({
      ...salesConfig,
      products: salesConfig.products.filter(product => product.id !== id)
    });
  };
  
  // Add new discount
  const addDiscount = () => {
    const newDiscount = {
      id: Date.now().toString(),
      name: 'New Discount',
      code: 'CODE' + Math.floor(Math.random() * 100),
      amount: 10,
      type: 'percentage' as const,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: false
    };
    setSalesConfig({
      ...salesConfig,
      discounts: [...salesConfig.discounts, newDiscount]
    });
  };
  
  // Remove discount
  const removeDiscount = (id: string) => {
    setSalesConfig({
      ...salesConfig,
      discounts: salesConfig.discounts.filter(discount => discount.id !== id)
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue="general" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="advertising" className="flex items-center">
            <MousePointerClick className="mr-2 h-4 w-4" />
            Advertising
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="terms" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Terms & Policies
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <FormLabel>Application Name</FormLabel>
                    <Input defaultValue="CILS B2 Cittadinanza" />
                    <FormDescription>
                      The name of your application as it appears to users
                    </FormDescription>
                  </div>
                  
                  <div className="grid gap-2">
                    <FormLabel>Site URL</FormLabel>
                    <Input defaultValue="https://cils-b2.example.com" />
                    <FormDescription>
                      Your application's public URL
                    </FormDescription>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Maintenance Mode</FormLabel>
                  <div className="flex items-center gap-2">
                    <Switch id="maintenance-mode" />
                    <FormLabel htmlFor="maintenance-mode">Enable maintenance mode</FormLabel>
                  </div>
                  <FormDescription>
                    When enabled, users will see a maintenance page
                  </FormDescription>
                </div>
                
                <Button type="button" onClick={handleGeneralSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Advertising Settings Tab */}
        <TabsContent value="advertising" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advertising Configuration</CardTitle>
              <CardDescription>
                Manage your application's advertising settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <FormLabel>Enable Advertisements</FormLabel>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="ads-enabled" 
                      checked={adConfig.enabled}
                      onCheckedChange={(checked) => setAdConfig({...adConfig, enabled: checked})}
                    />
                    <FormLabel htmlFor="ads-enabled">Show advertisements</FormLabel>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Ad Provider</FormLabel>
                  <select 
                    className="p-2 border rounded"
                    value={adConfig.provider}
                    onChange={(e) => setAdConfig({...adConfig, provider: e.target.value as any})}
                  >
                    <option value="google">Google AdSense</option>
                    <option value="facebook">Facebook Audience Network</option>
                    <option value="custom">Custom Ad Server</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Ad Units</FormLabel>
                    <Button variant="outline" size="sm" onClick={addAdUnit}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Ad Unit
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {adConfig.adUnits.map((unit) => (
                      <div key={unit.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">{unit.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeAdUnit(unit.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 grid-cols-2">
                          <div className="space-y-2">
                            <FormLabel>Name</FormLabel>
                            <Input 
                              value={unit.name} 
                              onChange={(e) => {
                                const newAdUnits = adConfig.adUnits.map(u => 
                                  u.id === unit.id ? {...u, name: e.target.value} : u
                                );
                                setAdConfig({...adConfig, adUnits: newAdUnits});
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Type</FormLabel>
                            <select 
                              className="w-full p-2 border rounded"
                              value={unit.type}
                              onChange={(e) => {
                                const newAdUnits = adConfig.adUnits.map(u => 
                                  u.id === unit.id ? {...u, type: e.target.value as any} : u
                                );
                                setAdConfig({...adConfig, adUnits: newAdUnits});
                              }}
                            >
                              <option value="banner">Banner</option>
                              <option value="interstitial">Interstitial</option>
                              <option value="native">Native</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Placement</FormLabel>
                            <select 
                              className="w-full p-2 border rounded"
                              value={unit.placement}
                              onChange={(e) => {
                                const newAdUnits = adConfig.adUnits.map(u => 
                                  u.id === unit.id ? {...u, placement: e.target.value as any} : u
                                );
                                setAdConfig({...adConfig, adUnits: newAdUnits});
                              }}
                            >
                              <option value="header">Header</option>
                              <option value="footer">Footer</option>
                              <option value="sidebar">Sidebar</option>
                              <option value="content">In-Content</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Status</FormLabel>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={unit.active}
                                onCheckedChange={(checked) => {
                                  const newAdUnits = adConfig.adUnits.map(u => 
                                    u.id === unit.id ? {...u, active: checked} : u
                                  );
                                  setAdConfig({...adConfig, adUnits: newAdUnits});
                                }}
                              />
                              <span>{unit.active ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Additional Settings</FormLabel>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <FormLabel>Show ads to free users</FormLabel>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={adConfig.settings.showToFreeUsers}
                          onCheckedChange={(checked) => {
                            setAdConfig({
                              ...adConfig, 
                              settings: {
                                ...adConfig.settings,
                                showToFreeUsers: checked
                              }
                            });
                          }}
                        />
                        <span>Show ads to free users</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Show ads to premium users</FormLabel>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={adConfig.settings.showToPremiumUsers}
                          onCheckedChange={(checked) => {
                            setAdConfig({
                              ...adConfig, 
                              settings: {
                                ...adConfig.settings,
                                showToPremiumUsers: checked
                              }
                            });
                          }}
                        />
                        <span>Show ads to premium users</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Ad frequency</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          min="1" 
                          value={adConfig.settings.frequency} 
                          onChange={(e) => {
                            setAdConfig({
                              ...adConfig, 
                              settings: {
                                ...adConfig.settings,
                                frequency: parseInt(e.target.value) || 1
                              }
                            });
                          }}
                        />
                        <span>pages</span>
                      </div>
                      <FormDescription>
                        Show ads every X pages or content items
                      </FormDescription>
                    </div>
                  </div>
                </div>
                
                <Button type="button" onClick={handleAdConfigSave}>Save Advertising Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SEO Settings Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
              <CardDescription>
                Manage search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <FormLabel>Default Meta Title</FormLabel>
                  <Input 
                    value={seoConfig.defaultTitle}
                    onChange={(e) => setSeoConfig({...seoConfig, defaultTitle: e.target.value})}
                  />
                  <FormDescription>
                    Default title tag for pages without a specific title
                  </FormDescription>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Default Meta Description</FormLabel>
                  <Textarea 
                    value={seoConfig.defaultDescription}
                    onChange={(e) => setSeoConfig({...seoConfig, defaultDescription: e.target.value})}
                  />
                  <FormDescription>
                    Default description for pages without a specific description
                  </FormDescription>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Default Keywords</FormLabel>
                  <Textarea 
                    value={seoConfig.defaultKeywords.join(', ')}
                    onChange={(e) => {
                      const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                      setSeoConfig({...seoConfig, defaultKeywords: keywords});
                    }}
                  />
                  <FormDescription>
                    Default keywords for SEO (comma separated)
                  </FormDescription>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Sitemap</FormLabel>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={seoConfig.siteMap.enabled}
                        onCheckedChange={(checked) => {
                          setSeoConfig({
                            ...seoConfig, 
                            siteMap: {
                              ...seoConfig.siteMap,
                              enabled: checked
                            }
                          });
                        }}
                      />
                      <span>Generate sitemap</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Sitemap
                    </Button>
                  </div>
                  <FormDescription>
                    Auto-generate and update sitemap.xml
                  </FormDescription>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Robots.txt</FormLabel>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={seoConfig.robotsTxt.enabled}
                      onCheckedChange={(checked) => {
                        setSeoConfig({
                          ...seoConfig, 
                          robotsTxt: {
                            ...seoConfig.robotsTxt,
                            enabled: checked
                          }
                        });
                      }}
                    />
                    <span>Use custom robots.txt</span>
                  </div>
                  <Textarea 
                    value={seoConfig.robotsTxt.content}
                    onChange={(e) => {
                      setSeoConfig({
                        ...seoConfig, 
                        robotsTxt: {
                          ...seoConfig.robotsTxt,
                          content: e.target.value
                        }
                      });
                    }}
                  />
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Analytics</FormLabel>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={seoConfig.analytics.enabled}
                      onCheckedChange={(checked) => {
                        setSeoConfig({
                          ...seoConfig, 
                          analytics: {
                            ...seoConfig.analytics,
                            enabled: checked
                          }
                        });
                      }}
                    />
                    <span>Enable analytics tracking</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormLabel>Provider</FormLabel>
                      <select 
                        className="w-full p-2 border rounded"
                        value={seoConfig.analytics.provider}
                        onChange={(e) => {
                          setSeoConfig({
                            ...seoConfig, 
                            analytics: {
                              ...seoConfig.analytics,
                              provider: e.target.value as any
                            }
                          });
                        }}
                      >
                        <option value="google">Google Analytics</option>
                        <option value="matomo">Matomo</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <FormLabel>Tracking ID</FormLabel>
                      <Input 
                        value={seoConfig.analytics.trackingId}
                        onChange={(e) => {
                          setSeoConfig({
                            ...seoConfig, 
                            analytics: {
                              ...seoConfig.analytics,
                              trackingId: e.target.value
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="button" onClick={handleSeoConfigSave}>Save SEO Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sales Settings Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Configuration</CardTitle>
              <CardDescription>
                Manage products, prices, and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Products</FormLabel>
                    <Button variant="outline" size="sm" onClick={addProduct}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {salesConfig.products.map((product) => (
                      <div key={product.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">{product.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <FormLabel>Name</FormLabel>
                            <Input 
                              value={product.name} 
                              onChange={(e) => {
                                const newProducts = salesConfig.products.map(p => 
                                  p.id === product.id ? {...p, name: e.target.value} : p
                                );
                                setSalesConfig({...salesConfig, products: newProducts});
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Type</FormLabel>
                            <select 
                              className="w-full p-2 border rounded"
                              value={product.type}
                              onChange={(e) => {
                                const newProducts = salesConfig.products.map(p => 
                                  p.id === product.id ? {...p, type: e.target.value as any} : p
                                );
                                setSalesConfig({...salesConfig, products: newProducts});
                              }}
                            >
                              <option value="subscription">Subscription</option>
                              <option value="one-time">One-time Purchase</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Price</FormLabel>
                            <div className="flex gap-2">
                              <Input 
                                type="number" 
                                step="0.01"
                                value={product.price} 
                                onChange={(e) => {
                                  const newProducts = salesConfig.products.map(p => 
                                    p.id === product.id ? {...p, price: parseFloat(e.target.value) || 0} : p
                                  );
                                  setSalesConfig({...salesConfig, products: newProducts});
                                }}
                              />
                              <select 
                                className="w-24 p-2 border rounded"
                                value={product.currency}
                                onChange={(e) => {
                                  const newProducts = salesConfig.products.map(p => 
                                    p.id === product.id ? {...p, currency: e.target.value} : p
                                  );
                                  setSalesConfig({...salesConfig, products: newProducts});
                                }}
                              >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Status</FormLabel>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={product.active}
                                onCheckedChange={(checked) => {
                                  const newProducts = salesConfig.products.map(p => 
                                    p.id === product.id ? {...p, active: checked} : p
                                  );
                                  setSalesConfig({...salesConfig, products: newProducts});
                                }}
                              />
                              <span>{product.active ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <FormLabel>Description</FormLabel>
                          <Textarea 
                            value={product.description} 
                            onChange={(e) => {
                              const newProducts = salesConfig.products.map(p => 
                                p.id === product.id ? {...p, description: e.target.value} : p
                              );
                              setSalesConfig({...salesConfig, products: newProducts});
                            }}
                          />
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <FormLabel>Features (one per line)</FormLabel>
                          <Textarea 
                            value={product.features.join('\n')} 
                            onChange={(e) => {
                              const features = e.target.value.split('\n').map(f => f.trim()).filter(f => f);
                              const newProducts = salesConfig.products.map(p => 
                                p.id === product.id ? {...p, features} : p
                              );
                              setSalesConfig({...salesConfig, products: newProducts});
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Discounts</FormLabel>
                    <Button variant="outline" size="sm" onClick={addDiscount}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Discount
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {salesConfig.discounts.map((discount) => (
                      <div key={discount.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">{discount.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeDiscount(discount.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <FormLabel>Name</FormLabel>
                            <Input 
                              value={discount.name} 
                              onChange={(e) => {
                                const newDiscounts = salesConfig.discounts.map(d => 
                                  d.id === discount.id ? {...d, name: e.target.value} : d
                                );
                                setSalesConfig({...salesConfig, discounts: newDiscounts});
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Code</FormLabel>
                            <Input 
                              value={discount.code} 
                              onChange={(e) => {
                                const newDiscounts = salesConfig.discounts.map(d => 
                                  d.id === discount.id ? {...d, code: e.target.value} : d
                                );
                                setSalesConfig({...salesConfig, discounts: newDiscounts});
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Amount</FormLabel>
                            <div className="flex gap-2">
                              <Input 
                                type="number" 
                                value={discount.amount} 
                                onChange={(e) => {
                                  const newDiscounts = salesConfig.discounts.map(d => 
                                    d.id === discount.id ? {...d, amount: parseFloat(e.target.value) || 0} : d
                                  );
                                  setSalesConfig({...salesConfig, discounts: newDiscounts});
                                }}
                              />
                              <select 
                                className="w-32 p-2 border rounded"
                                value={discount.type}
                                onChange={(e) => {
                                  const newDiscounts = salesConfig.discounts.map(d => 
                                    d.id === discount.id ? {...d, type: e.target.value as any} : d
                                  );
                                  setSalesConfig({...salesConfig, discounts: newDiscounts});
                                }}
                              >
                                <option value="percentage">%</option>
                                <option value="fixed">Fixed</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Status</FormLabel>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={discount.active}
                                onCheckedChange={(checked) => {
                                  const newDiscounts = salesConfig.discounts.map(d => 
                                    d.id === discount.id ? {...d, active: checked} : d
                                  );
                                  setSalesConfig({...salesConfig, discounts: newDiscounts});
                                }}
                              />
                              <span>{discount.active ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <FormLabel>Valid From</FormLabel>
                            <Input 
                              type="date" 
                              value={new Date(discount.validFrom).toISOString().split('T')[0]} 
                              onChange={(e) => {
                                const newDiscounts = salesConfig.discounts.map(d => 
                                  d.id === discount.id ? {...d, validFrom: new Date(e.target.value).toISOString()} : d
                                );
                                setSalesConfig({...salesConfig, discounts: newDiscounts});
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Valid To</FormLabel>
                            <Input 
                              type="date" 
                              value={new Date(discount.validTo).toISOString().split('T')[0]} 
                              onChange={(e) => {
                                const newDiscounts = salesConfig.discounts.map(d => 
                                  d.id === discount.id ? {...d, validTo: new Date(e.target.value).toISOString()} : d
                                );
                                setSalesConfig({...salesConfig, discounts: newDiscounts});
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <FormLabel>Payment Providers</FormLabel>
                  
                  <div className="space-y-4">
                    {salesConfig.paymentProviders.map((provider, index) => (
                      <div key={provider.name} className="p-4 border rounded-md">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <FormLabel>Provider</FormLabel>
                            <div className="font-medium capitalize">{provider.name}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Status</FormLabel>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={provider.enabled}
                                onCheckedChange={(checked) => {
                                  const newProviders = [...salesConfig.paymentProviders];
                                  newProviders[index] = { ...newProviders[index], enabled: checked };
                                  setSalesConfig({...salesConfig, paymentProviders: newProviders});
                                }}
                              />
                              <span>{provider.enabled ? 'Enabled' : 'Disabled'}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Mode</FormLabel>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={provider.testMode}
                                onCheckedChange={(checked) => {
                                  const newProviders = [...salesConfig.paymentProviders];
                                  newProviders[index] = { ...newProviders[index], testMode: checked };
                                  setSalesConfig({...salesConfig, paymentProviders: newProviders});
                                }}
                              />
                              <span>{provider.testMode ? 'Test Mode' : 'Live Mode'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button type="button" onClick={handleSalesConfigSave}>Save Sales Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other Tabs (can be implemented later) */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User management settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics configuration will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email configuration will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage your terms of service and privacy policies here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
