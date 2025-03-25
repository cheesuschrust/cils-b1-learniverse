
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingCart, Store, CreditCard, Package, RefreshCw, Check, X, Settings, Globe, BarChart } from 'lucide-react';

const integrationSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  apiSecret: z.string().min(1, "API Secret is required"),
  storeUrl: z.string().url("Must be a valid URL"),
  webhookUrl: z.string().optional(),
  enableInventorySync: z.boolean().default(true),
  enableOrderSync: z.boolean().default(true),
  enableProductSync: z.boolean().default(true),
  enableCustomerSync: z.boolean().default(false),
  syncInterval: z.number().min(5).max(1440).default(60),
});

type IntegrationType = 'shopify' | 'woocommerce' | 'magento' | 'bigcommerce' | 'square';

interface IntegrationConfig {
  type: IntegrationType;
  name: string;
  description: string;
  logo: string;
  isConnected: boolean;
  lastSync?: Date;
  status: 'active' | 'inactive' | 'error' | 'pending';
  config?: Record<string, any>;
}

const EcommerceIntegration: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('shopify');
  const [activeIntegration, setActiveIntegration] = useState<IntegrationType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      type: 'shopify',
      name: 'Shopify',
      description: 'Connect your Shopify store to manage products, orders, and customers.',
      logo: '/assets/logos/shopify.svg',
      isConnected: false,
      status: 'inactive',
    },
    {
      type: 'woocommerce',
      name: 'WooCommerce',
      description: 'Integrate with your WordPress WooCommerce store.',
      logo: '/assets/logos/woocommerce.svg',
      isConnected: false,
      status: 'inactive',
    },
    {
      type: 'magento',
      name: 'Magento',
      description: 'Connect with Magento 2 for enterprise e-commerce capabilities.',
      logo: '/assets/logos/magento.svg',
      isConnected: false,
      status: 'inactive',
    },
    {
      type: 'bigcommerce',
      name: 'BigCommerce',
      description: 'Integrate with BigCommerce for multi-channel selling.',
      logo: '/assets/logos/bigcommerce.svg',
      isConnected: false,
      status: 'inactive',
    },
    {
      type: 'square',
      name: 'Square',
      description: 'Connect Square for in-person and online payments.',
      logo: '/assets/logos/square.svg',
      isConnected: false,
      status: 'inactive',
    },
  ]);

  const form = useForm<z.infer<typeof integrationSchema>>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      apiKey: '',
      apiSecret: '',
      storeUrl: '',
      webhookUrl: '',
      enableInventorySync: true,
      enableOrderSync: true,
      enableProductSync: true,
      enableCustomerSync: false,
      syncInterval: 60,
    },
  });

  const handleConnect = (data: z.infer<typeof integrationSchema>) => {
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false);
      
      setIntegrations(prev => 
        prev.map(integration => 
          integration.type === activeTab 
            ? {
                ...integration,
                isConnected: true,
                status: 'active',
                lastSync: new Date(),
                config: data,
              }
            : integration
        )
      );
      
      toast({
        title: "Integration successful",
        description: `Your ${activeTab} store has been connected successfully.`,
      });
    }, 2000);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    
    // Simulate API test
    setTimeout(() => {
      setIsTesting(false);
      
      toast({
        title: "Connection test successful",
        description: "The connection to your store is working properly.",
      });
    }, 1500);
  };

  const handleSync = () => {
    setIsSyncing(true);
    
    // Simulate sync
    setTimeout(() => {
      setIsSyncing(false);
      
      setIntegrations(prev => 
        prev.map(integration => 
          integration.type === activeTab 
            ? {
                ...integration,
                lastSync: new Date(),
              }
            : integration
        )
      );
      
      toast({
        title: "Sync completed",
        description: `Successfully synchronized data with your ${activeTab} store.`,
      });
    }, 3000);
  };

  const handleDisconnect = () => {
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to disconnect your ${activeTab} integration? This will stop all syncing activities.`)) {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.type === activeTab 
            ? {
                ...integration,
                isConnected: false,
                status: 'inactive',
                lastSync: undefined,
                config: undefined,
              }
            : integration
        )
      );
      
      form.reset();
      
      toast({
        title: "Integration disconnected",
        description: `Your ${activeTab} store has been disconnected.`,
      });
    }
  };

  const getStatusBadge = (status: 'active' | 'inactive' | 'error' | 'pending') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'inactive':
        return <Badge variant="outline"><X className="w-3 h-3 mr-1" /> Inactive</Badge>;
      case 'error':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" /> Error</Badge>;
      case 'pending':
        return <Badge variant="secondary"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Pending</Badge>;
      default:
        return null;
    }
  };

  const currentIntegration = integrations.find(i => i.type === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">E-commerce Integrations</h2>
        <p className="text-muted-foreground mt-2">
          Connect your online store to seamlessly manage products, orders, and inventory.
        </p>
      </div>

      <Tabs 
        defaultValue="shopify" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-6">
          {integrations.map(integration => (
            <TabsTrigger 
              key={integration.type} 
              value={integration.type}
              className="relative"
            >
              {integration.name}
              {integration.isConnected && (
                <span className="absolute -top-1 -right-1">
                  <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    <Check className="h-3 w-3" />
                  </Badge>
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {integrations.map(integration => (
          <TabsContent key={integration.type} value={integration.type} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{integration.name} Integration</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(integration.status)}
                    {integration.lastSync && (
                      <span className="text-xs text-muted-foreground">
                        Last sync: {integration.lastSync.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!integration.isConnected ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleConnect)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key</FormLabel>
                              <FormControl>
                                <Input placeholder={`${integration.name} API Key`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="apiSecret"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Secret</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder={`${integration.name} API Secret`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="storeUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-store.example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              The URL of your {integration.name} store.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="enableProductSync"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel>Product Sync</FormLabel>
                                <FormDescription>
                                  Sync products and inventory
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="enableOrderSync"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel>Order Sync</FormLabel>
                                <FormDescription>
                                  Sync orders and fulfillment
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="enableInventorySync"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel>Inventory Sync</FormLabel>
                                <FormDescription>
                                  Keep inventory levels in sync
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="enableCustomerSync"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel>Customer Sync</FormLabel>
                                <FormDescription>
                                  Sync customer information
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="syncInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sync Interval (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              How often data should be synchronized
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="submit" disabled={isConnecting}>
                          {isConnecting ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Store className="mr-2 h-4 w-4" />
                              Connect to {integration.name}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Store Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Store URL:</dt>
                              <dd>{integration.config?.storeUrl}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Connection Status:</dt>
                              <dd>{getStatusBadge(integration.status)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Sync Interval:</dt>
                              <dd>Every {integration.config?.syncInterval} minutes</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Last Sync:</dt>
                              <dd>{integration.lastSync?.toLocaleString() || 'Never'}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Products:</dt>
                              <dd>{integration.config?.enableProductSync ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <Check className="w-3 h-3 mr-1" /> Enabled
                                </Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Orders:</dt>
                              <dd>{integration.config?.enableOrderSync ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <Check className="w-3 h-3 mr-1" /> Enabled
                                </Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Inventory:</dt>
                              <dd>{integration.config?.enableInventorySync ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <Check className="w-3 h-3 mr-1" /> Enabled
                                </Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Customers:</dt>
                              <dd>{integration.config?.enableCustomerSync ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <Check className="w-3 h-3 mr-1" /> Enabled
                                </Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleTestConnection}
                          disabled={isTesting}
                        >
                          {isTesting ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Test Connection
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSync}
                          disabled={isSyncing}
                        >
                          {isSyncing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync Now
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Open settings modal or tab
                            toast({
                              title: "Settings",
                              description: "Integration settings editor would open here.",
                            });
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDisconnect}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {integration.isConnected && (
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Products
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">128</div>
                    <p className="text-xs text-muted-foreground">
                      +12 from last sync
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">64</div>
                    <p className="text-xs text-muted-foreground">
                      +8 today
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenue
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +$2,345 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Customers
                    </CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">573</div>
                    <p className="text-xs text-muted-foreground">
                      +32 new this month
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-bold">Mobile App Integration</h3>
        
        <Card>
          <CardHeader>
            <CardTitle>App Store & Google Play Configuration</CardTitle>
            <CardDescription>
              Set up your app for submission to app stores with proper SEO and marketing materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input id="appName" placeholder="CILS B2 Cittadinanza" />
                <p className="text-xs text-muted-foreground mt-1">
                  This name will be displayed in app stores.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bundleId">Bundle ID / Package Name</Label>
                <Input id="bundleId" placeholder="com.example.cilsapp" />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier for your app (e.g., com.company.appname).
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="appDescription">App Description</Label>
                <textarea 
                  id="appDescription" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="A comprehensive learning app for Italian language..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This description will be shown in app stores (max 4000 characters).
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input id="keywords" placeholder="italian, learning, language, citizenship, cils, b2, app" />
                <p className="text-xs text-muted-foreground mt-1">
                  Keywords help users find your app (comma-separated).
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Privacy Policy URL</Label>
                <Input placeholder="https://example.com/privacy" />
              </div>
              
              <div className="space-y-2">
                <Label>Terms of Service URL</Label>
                <Input placeholder="https://example.com/terms" />
              </div>
              
              <div className="space-y-2">
                <Label>Support URL</Label>
                <Input placeholder="https://example.com/support" />
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h4 className="font-medium mb-2">App Store Screenshots</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload screenshots for various device sizes. Recommended sizes:
                iPhone: 1290x2796, iPad: 2048x2732, Android: 1440x3200
              </p>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                  <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">iPhone Screenshots</p>
                  <p className="text-xs text-muted-foreground">Drop files or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-2">Upload</Button>
                </div>
                
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                  <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">iPad Screenshots</p>
                  <p className="text-xs text-muted-foreground">Drop files or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-2">Upload</Button>
                </div>
                
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                  <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Android Phone</p>
                  <p className="text-xs text-muted-foreground">Drop files or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-2">Upload</Button>
                </div>
                
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                  <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Android Tablet</p>
                  <p className="text-xs text-muted-foreground">Drop files or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-2">Upload</Button>
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h4 className="font-medium mb-2">App Marketing Assets</h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>App Icon (1024x1024)</Label>
                  <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                    <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">PNG format, 1024x1024px</p>
                    <Button variant="outline" size="sm" className="mt-2">Upload Icon</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Feature Graphic (1024x500)</Label>
                  <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                    <BarChart className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">PNG format, 1024x500px</p>
                    <Button variant="outline" size="sm" className="mt-2">Upload Graphic</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Promotional Video</Label>
                  <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center">
                    <Video className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">
                      YouTube or direct video URL
                    </p>
                    <Input placeholder="https://youtube.com/watch?v=..." className="mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save as Draft</Button>
            <Button>Save Configuration</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EcommerceIntegration;
