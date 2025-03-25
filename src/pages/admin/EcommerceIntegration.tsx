
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Banknote, 
  ShoppingBag, 
  Globe, 
  Check, 
  Store, 
  CreditCard, 
  Package, 
  TagIcon,
  DollarSign,
  ShieldCheck,
  ArrowUpDown,
  BookOpen,
  SquareTerminal
} from 'lucide-react';

/**
 * E-commerce Integration Component
 * 
 * Provides a comprehensive interface to manage e-commerce integrations,
 * product syncing, payment processing, and more.
 */
const EcommerceIntegration = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('shopify');
  const [saving, setSaving] = useState(false);
  
  // Shopify integration state
  const [shopifyIntegration, setShopifyIntegration] = useState({
    enabled: true,
    shopDomain: 'your-store.myshopify.com',
    apiKey: 'a1b2c3d4e5f6g7h8i9j0',
    apiSecret: '*************',
    accessToken: 'shpat_123abc456def789ghi',
    webhookUrl: 'https://example.com/api/shopify/webhook',
    syncProducts: true,
    syncCustomers: true,
    syncOrders: true,
    autoDeploy: false,
    lastSynced: '2023-12-12 14:30'
  });
  
  // WooCommerce integration state
  const [wooCommerceIntegration, setWooCommerceIntegration] = useState({
    enabled: false,
    siteUrl: 'https://yourstore.com',
    consumerKey: '',
    consumerSecret: '',
    webhookSecret: '',
    syncProducts: true,
    syncCustomers: true,
    syncOrders: true,
    autoSync: false,
    lastSynced: 'Never'
  });
  
  // Stripe integration state
  const [stripeIntegration, setStripeIntegration] = useState({
    enabled: true,
    publicKey: 'pk_test_123456789',
    secretKey: '************',
    webhookSecret: 'whsec_123456',
    paymentMethods: ['card', 'apple_pay', 'google_pay'],
    testMode: true,
    collectShippingAddress: true,
    autoConfirmPayments: true
  });
  
  // Product sync settings
  const [productSettings, setProductSettings] = useState({
    autoPublish: true,
    defaultStatus: 'draft',
    importImages: true,
    syncInventory: true,
    syncPricing: true,
    syncCategories: true,
    syncVariants: true,
    syncDescriptions: true,
    defaultTaxRate: 20,
    importReviews: false
  });
  
  // Handle saving Shopify integration
  const handleSaveShopify = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setShopifyIntegration({
        ...shopifyIntegration,
        lastSynced: new Date().toLocaleString()
      });
      
      toast({
        title: "Shopify integration updated",
        description: "Your Shopify store has been connected successfully.",
        variant: "success",
      });
    }, 1500);
  };
  
  // Handle saving WooCommerce integration
  const handleSaveWooCommerce = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setWooCommerceIntegration({
        ...wooCommerceIntegration,
        lastSynced: new Date().toLocaleString()
      });
      
      toast({
        title: "WooCommerce integration updated",
        description: "Your WooCommerce store has been connected successfully.",
        variant: "success",
      });
    }, 1500);
  };
  
  // Handle saving Stripe integration
  const handleSaveStripe = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      
      toast({
        title: "Stripe integration updated",
        description: "Your Stripe payment gateway has been configured successfully.",
        variant: "success",
      });
    }, 1500);
  };
  
  // Handle saving product settings
  const handleSaveProductSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      
      toast({
        title: "Product sync settings updated",
        description: "Your product synchronization settings have been saved.",
        variant: "success",
      });
    }, 1500);
  };
  
  // Handle syncing products
  const handleSyncProducts = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      
      if (activeTab === 'shopify') {
        setShopifyIntegration({
          ...shopifyIntegration,
          lastSynced: new Date().toLocaleString()
        });
      } else if (activeTab === 'woocommerce') {
        setWooCommerceIntegration({
          ...wooCommerceIntegration,
          lastSynced: new Date().toLocaleString()
        });
      }
      
      toast({
        title: "Products synchronized",
        description: "Your products have been synchronized successfully.",
        variant: "success",
      });
    }, 2000);
  };
  
  return (
    <>
      <Helmet>
        <title>E-commerce Integration - Admin</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">E-commerce Integration</h1>
            <p className="text-muted-foreground mt-1">
              Connect and manage your e-commerce platforms and payment processors
            </p>
          </div>
          <Badge className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Check className="h-4 w-4 mr-1" />
            System Ready
          </Badge>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="shopify" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Shopify
            </TabsTrigger>
            <TabsTrigger value="woocommerce" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              WooCommerce
            </TabsTrigger>
            <TabsTrigger value="stripe" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Stripe
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>
          
          {/* Shopify Integration Tab */}
          <TabsContent value="shopify" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Shopify Integration
                    </CardTitle>
                    <CardDescription>
                      Connect your Shopify store to sync products, orders, and customers
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Enable Integration</span>
                    <Switch 
                      checked={shopifyIntegration.enabled}
                      onCheckedChange={(checked) => setShopifyIntegration({...shopifyIntegration, enabled: checked})}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {shopifyIntegration.enabled ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="shopify-domain">Shop Domain</Label>
                        <Input 
                          id="shopify-domain" 
                          placeholder="your-store.myshopify.com" 
                          value={shopifyIntegration.shopDomain}
                          onChange={(e) => setShopifyIntegration({...shopifyIntegration, shopDomain: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="shopify-api-key">API Key</Label>
                        <Input 
                          id="shopify-api-key" 
                          placeholder="Enter API Key" 
                          value={shopifyIntegration.apiKey}
                          onChange={(e) => setShopifyIntegration({...shopifyIntegration, apiKey: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="shopify-api-secret">API Secret</Label>
                        <Input 
                          id="shopify-api-secret" 
                          type="password"
                          placeholder="Enter API Secret" 
                          value={shopifyIntegration.apiSecret}
                          onChange={(e) => setShopifyIntegration({...shopifyIntegration, apiSecret: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="shopify-access-token">Access Token</Label>
                        <Input 
                          id="shopify-access-token" 
                          type="password"
                          placeholder="Enter Access Token" 
                          value={shopifyIntegration.accessToken}
                          onChange={(e) => setShopifyIntegration({...shopifyIntegration, accessToken: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="shopify-webhook">Webhook URL</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="shopify-webhook" 
                            placeholder="Enter Webhook URL" 
                            value={shopifyIntegration.webhookUrl}
                            onChange={(e) => setShopifyIntegration({...shopifyIntegration, webhookUrl: e.target.value})}
                            className="flex-1"
                          />
                          <Button variant="outline">Copy</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Use this URL in your Shopify notification settings
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Synchronization Settings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="sync-products"
                            checked={shopifyIntegration.syncProducts}
                            onCheckedChange={(checked) => setShopifyIntegration({...shopifyIntegration, syncProducts: checked})}
                          />
                          <Label htmlFor="sync-products">Sync Products</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="sync-customers"
                            checked={shopifyIntegration.syncCustomers}
                            onCheckedChange={(checked) => setShopifyIntegration({...shopifyIntegration, syncCustomers: checked})}
                          />
                          <Label htmlFor="sync-customers">Sync Customers</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="sync-orders"
                            checked={shopifyIntegration.syncOrders}
                            onCheckedChange={(checked) => setShopifyIntegration({...shopifyIntegration, syncOrders: checked})}
                          />
                          <Label htmlFor="sync-orders">Sync Orders</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="auto-deploy"
                            checked={shopifyIntegration.autoDeploy}
                            onCheckedChange={(checked) => setShopifyIntegration({...shopifyIntegration, autoDeploy: checked})}
                          />
                          <Label htmlFor="auto-deploy">Auto Deploy</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Connection Status</h4>
                        <p className="text-sm text-muted-foreground">
                          {shopifyIntegration.enabled ? 'Connected' : 'Disconnected'} • Last synced: {shopifyIntegration.lastSynced}
                        </p>
                      </div>
                      <Button variant="secondary" onClick={handleSyncProducts} disabled={saving}>
                        Sync Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Shopify Integration Disabled</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Enable Shopify integration to connect your store and start syncing products, customers, and orders.
                    </p>
                    <Button onClick={() => setShopifyIntegration({...shopifyIntegration, enabled: true})}>
                      Enable Shopify Integration
                    </Button>
                  </div>
                )}
              </CardContent>
              {shopifyIntegration.enabled && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Test Connection</Button>
                  <Button onClick={handleSaveShopify} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connected Shopify Apps</CardTitle>
                <CardDescription>
                  Manage Shopify app integrations and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                        <Store className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sales Channel</h4>
                        <p className="text-sm text-muted-foreground">Publish products to your sales channel</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center text-green-600">
                        <TagIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Product Reviews</h4>
                        <p className="text-sm text-muted-foreground">Sync product reviews from Shopify</p>
                      </div>
                    </div>
                    <Switch checked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-600">
                        <ArrowUpDown className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Inventory Sync</h4>
                        <p className="text-sm text-muted-foreground">Real-time inventory synchronization</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* WooCommerce Integration Tab */}
          <TabsContent value="woocommerce" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      WooCommerce Integration
                    </CardTitle>
                    <CardDescription>
                      Connect your WooCommerce store to sync products, orders, and customers
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Enable Integration</span>
                    <Switch 
                      checked={wooCommerceIntegration.enabled}
                      onCheckedChange={(checked) => setWooCommerceIntegration({...wooCommerceIntegration, enabled: checked})}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {wooCommerceIntegration.enabled ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="woo-site-url">WordPress Site URL</Label>
                        <Input 
                          id="woo-site-url" 
                          placeholder="https://yourstore.com" 
                          value={wooCommerceIntegration.siteUrl}
                          onChange={(e) => setWooCommerceIntegration({...wooCommerceIntegration, siteUrl: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="woo-consumer-key">Consumer Key</Label>
                        <Input 
                          id="woo-consumer-key" 
                          placeholder="Enter Consumer Key" 
                          value={wooCommerceIntegration.consumerKey}
                          onChange={(e) => setWooCommerceIntegration({...wooCommerceIntegration, consumerKey: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="woo-consumer-secret">Consumer Secret</Label>
                        <Input 
                          id="woo-consumer-secret" 
                          type="password"
                          placeholder="Enter Consumer Secret" 
                          value={wooCommerceIntegration.consumerSecret}
                          onChange={(e) => setWooCommerceIntegration({...wooCommerceIntegration, consumerSecret: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="woo-webhook-secret">Webhook Secret</Label>
                        <Input 
                          id="woo-webhook-secret" 
                          type="password"
                          placeholder="Enter Webhook Secret" 
                          value={wooCommerceIntegration.webhookSecret}
                          onChange={(e) => setWooCommerceIntegration({...wooCommerceIntegration, webhookSecret: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Synchronization Settings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="woo-sync-products"
                            checked={wooCommerceIntegration.syncProducts}
                            onCheckedChange={(checked) => setWooCommerceIntegration({...wooCommerceIntegration, syncProducts: checked})}
                          />
                          <Label htmlFor="woo-sync-products">Sync Products</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="woo-sync-customers"
                            checked={wooCommerceIntegration.syncCustomers}
                            onCheckedChange={(checked) => setWooCommerceIntegration({...wooCommerceIntegration, syncCustomers: checked})}
                          />
                          <Label htmlFor="woo-sync-customers">Sync Customers</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="woo-sync-orders"
                            checked={wooCommerceIntegration.syncOrders}
                            onCheckedChange={(checked) => setWooCommerceIntegration({...wooCommerceIntegration, syncOrders: checked})}
                          />
                          <Label htmlFor="woo-sync-orders">Sync Orders</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="woo-auto-sync"
                            checked={wooCommerceIntegration.autoSync}
                            onCheckedChange={(checked) => setWooCommerceIntegration({...wooCommerceIntegration, autoSync: checked})}
                          />
                          <Label htmlFor="woo-auto-sync">Auto Sync</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Connection Status</h4>
                        <p className="text-sm text-muted-foreground">
                          {wooCommerceIntegration.enabled ? 'Connected' : 'Disconnected'} • Last synced: {wooCommerceIntegration.lastSynced}
                        </p>
                      </div>
                      <Button variant="secondary" onClick={handleSyncProducts} disabled={saving}>
                        Sync Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">WooCommerce Integration Disabled</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Enable WooCommerce integration to connect your WordPress store and start syncing products, customers, and orders.
                    </p>
                    <Button onClick={() => setWooCommerceIntegration({...wooCommerceIntegration, enabled: true})}>
                      Enable WooCommerce Integration
                    </Button>
                  </div>
                )}
              </CardContent>
              {wooCommerceIntegration.enabled && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Test Connection</Button>
                  <Button onClick={handleSaveWooCommerce} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {wooCommerceIntegration.enabled && (
              <Card>
                <CardHeader>
                  <CardTitle>API Authentication Guide</CardTitle>
                  <CardDescription>
                    Follow these steps to set up the WooCommerce REST API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">1. Enable the REST API</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Login to your WordPress admin panel and navigate to <strong>WooCommerce &gt; Settings &gt; Advanced &gt; REST API</strong>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click on "Add key" to create a new API key.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">2. Create API Credentials</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set Description to "CILS B2 Integration" and User to an admin account.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set Permissions to "Read/Write" for full access.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click "Generate API Key" to create the credentials.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">3. Copy API Credentials</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Copy the Consumer Key and Consumer Secret to the fields above.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Note: These credentials will only be shown once.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">4. Set Up Webhooks</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        In WooCommerce, go to <strong>Settings &gt; Advanced &gt; Webhooks</strong>.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Create webhooks for products, orders, and customers pointing to your webhook URL.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Set the secret key in each webhook and copy it to the Webhook Secret field above.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Detailed Documentation
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          {/* Stripe Integration Tab */}
          <TabsContent value="stripe" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Stripe Payment Integration
                    </CardTitle>
                    <CardDescription>
                      Connect Stripe to process payments and subscriptions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Enable Integration</span>
                    <Switch 
                      checked={stripeIntegration.enabled}
                      onCheckedChange={(checked) => setStripeIntegration({...stripeIntegration, enabled: checked})}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {stripeIntegration.enabled ? (
                  <>
                    <div className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200 p-4 rounded-md mb-4 flex items-start">
                      <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Test Mode Active</p>
                        <p className="text-xs mt-1">
                          You're using Stripe in test mode. No real payments will be processed. Use test cards for payment testing.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="stripe-public-key">Public Key</Label>
                        <Input 
                          id="stripe-public-key" 
                          placeholder="pk_test_..." 
                          value={stripeIntegration.publicKey}
                          onChange={(e) => setStripeIntegration({...stripeIntegration, publicKey: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="stripe-secret-key">Secret Key</Label>
                        <Input 
                          id="stripe-secret-key" 
                          type="password"
                          placeholder="sk_test_..." 
                          value={stripeIntegration.secretKey}
                          onChange={(e) => setStripeIntegration({...stripeIntegration, secretKey: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
                        <Input 
                          id="stripe-webhook-secret" 
                          type="password"
                          placeholder="whsec_..." 
                          value={stripeIntegration.webhookSecret}
                          onChange={(e) => setStripeIntegration({...stripeIntegration, webhookSecret: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">
                          The webhook secret verifies that events were sent by Stripe
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Payment Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="test-mode">Test Mode</Label>
                            <p className="text-sm text-muted-foreground">
                              Process test payments only
                            </p>
                          </div>
                          <Switch 
                            id="test-mode"
                            checked={stripeIntegration.testMode}
                            onCheckedChange={(checked) => setStripeIntegration({...stripeIntegration, testMode: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="collect-shipping">Collect Shipping Address</Label>
                            <p className="text-sm text-muted-foreground">
                              Prompt customers for shipping address
                            </p>
                          </div>
                          <Switch 
                            id="collect-shipping"
                            checked={stripeIntegration.collectShippingAddress}
                            onCheckedChange={(checked) => setStripeIntegration({...stripeIntegration, collectShippingAddress: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-confirm">Auto-confirm Payments</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically confirm payments without manual review
                            </p>
                          </div>
                          <Switch 
                            id="auto-confirm"
                            checked={stripeIntegration.autoConfirmPayments}
                            onCheckedChange={(checked) => setStripeIntegration({...stripeIntegration, autoConfirmPayments: checked})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label htmlFor="payment-methods">Payment Methods</Label>
                      <div className="flex flex-wrap gap-2">
                        {['card', 'apple_pay', 'google_pay', 'alipay', 'ideal', 'sepa_debit', 'bancontact', 'giropay', 'p24', 'eps', 'sofort', 'afterpay_clearpay'].map((method) => (
                          <Badge 
                            key={method}
                            variant={stripeIntegration.paymentMethods.includes(method) ? 'default' : 'outline'}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => {
                              if (stripeIntegration.paymentMethods.includes(method)) {
                                setStripeIntegration({
                                  ...stripeIntegration, 
                                  paymentMethods: stripeIntegration.paymentMethods.filter(m => m !== method)
                                });
                              } else {
                                setStripeIntegration({
                                  ...stripeIntegration, 
                                  paymentMethods: [...stripeIntegration.paymentMethods, method]
                                });
                              }
                            }}
                          >
                            {method.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select the payment methods you want to accept
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Stripe Integration Disabled</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Enable Stripe integration to accept payments, manage subscriptions, and process transactions securely.
                    </p>
                    <Button onClick={() => setStripeIntegration({...stripeIntegration, enabled: true})}>
                      Enable Stripe Integration
                    </Button>
                  </div>
                )}
              </CardContent>
              {stripeIntegration.enabled && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <SquareTerminal className="h-4 w-4 mr-2" />
                    Test Webhook
                  </Button>
                  <Button onClick={handleSaveStripe} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {stripeIntegration.enabled && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Configure available payment methods and options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Credit Cards</h4>
                        <Switch checked={true} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept Visa, Mastercard, Amex, and more
                      </p>
                      <div className="mt-3 flex space-x-1">
                        <Badge variant="secondary" className="text-xs">Visa</Badge>
                        <Badge variant="secondary" className="text-xs">Mastercard</Badge>
                        <Badge variant="secondary" className="text-xs">Amex</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Digital Wallets</h4>
                        <Switch checked={true} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept Apple Pay and Google Pay
                      </p>
                      <div className="mt-3 flex space-x-1">
                        <Badge variant="secondary" className="text-xs">Apple Pay</Badge>
                        <Badge variant="secondary" className="text-xs">Google Pay</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">European Payments</h4>
                        <Switch checked={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept SEPA, iDEAL, and more
                      </p>
                      <div className="mt-3 flex space-x-1">
                        <Badge variant="outline" className="text-xs">SEPA</Badge>
                        <Badge variant="outline" className="text-xs">iDEAL</Badge>
                        <Badge variant="outline" className="text-xs">Bancontact</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Buy Now, Pay Later</h4>
                        <Switch checked={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept Klarna, Afterpay, and more
                      </p>
                      <div className="mt-3 flex space-x-1">
                        <Badge variant="outline" className="text-xs">Klarna</Badge>
                        <Badge variant="outline" className="text-xs">Afterpay</Badge>
                        <Badge variant="outline" className="text-xs">Clearpay</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Bank Transfers</h4>
                        <Switch checked={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept ACH and wire transfers
                      </p>
                      <div className="mt-3 flex space-x-1">
                        <Badge variant="outline" className="text-xs">ACH</Badge>
                        <Badge variant="outline" className="text-xs">Wire</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">International</h4>
                        <Switch checked={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept Alipay, WeChat Pay, and more
                      </p>
                      <div className="mt-3 flex space-x-1">
                        <Badge variant="outline" className="text-xs">Alipay</Badge>
                        <Badge variant="outline" className="text-xs">WeChat</Badge>
                        <Badge variant="outline" className="text-xs">GrabPay</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Synchronization Settings</CardTitle>
                <CardDescription>
                  Configure how products are synchronized between systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-publish">Auto-publish Products</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically publish imported products
                        </p>
                      </div>
                      <Switch 
                        id="auto-publish"
                        checked={productSettings.autoPublish}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, autoPublish: checked})}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="default-status">Default Product Status</Label>
                      <Select 
                        value={productSettings.defaultStatus}
                        onValueChange={(value) => setProductSettings({...productSettings, defaultStatus: value})}
                      >
                        <SelectTrigger id="default-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="publish">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="import-images">Import Product Images</Label>
                        <p className="text-sm text-muted-foreground">
                          Import and store product images
                        </p>
                      </div>
                      <Switch 
                        id="import-images"
                        checked={productSettings.importImages}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, importImages: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sync-inventory">Sync Inventory</Label>
                        <p className="text-sm text-muted-foreground">
                          Keep stock levels synchronized
                        </p>
                      </div>
                      <Switch 
                        id="sync-inventory"
                        checked={productSettings.syncInventory}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, syncInventory: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sync-pricing">Sync Pricing</Label>
                        <p className="text-sm text-muted-foreground">
                          Keep product prices synchronized
                        </p>
                      </div>
                      <Switch 
                        id="sync-pricing"
                        checked={productSettings.syncPricing}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, syncPricing: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sync-categories">Sync Categories</Label>
                        <p className="text-sm text-muted-foreground">
                          Import and map product categories
                        </p>
                      </div>
                      <Switch 
                        id="sync-categories"
                        checked={productSettings.syncCategories}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, syncCategories: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sync-variants">Sync Product Variants</Label>
                        <p className="text-sm text-muted-foreground">
                          Import product variations and options
                        </p>
                      </div>
                      <Switch 
                        id="sync-variants"
                        checked={productSettings.syncVariants}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, syncVariants: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sync-descriptions">Sync Descriptions</Label>
                        <p className="text-sm text-muted-foreground">
                          Import full product descriptions
                        </p>
                      </div>
                      <Switch 
                        id="sync-descriptions"
                        checked={productSettings.syncDescriptions}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, syncDescriptions: checked})}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="default-tax">Default Tax Rate (%)</Label>
                      <Input 
                        id="default-tax" 
                        type="number"
                        min="0"
                        max="100"
                        placeholder="20" 
                        value={productSettings.defaultTaxRate}
                        onChange={(e) => setProductSettings({...productSettings, defaultTaxRate: Number(e.target.value)})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="import-reviews">Import Product Reviews</Label>
                        <p className="text-sm text-muted-foreground">
                          Import customer reviews for products
                        </p>
                      </div>
                      <Switch 
                        id="import-reviews"
                        checked={productSettings.importReviews}
                        onCheckedChange={(checked) => setProductSettings({...productSettings, importReviews: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label htmlFor="fields-to-sync">Fields to Synchronize</Label>
                  <Textarea 
                    id="fields-to-sync" 
                    placeholder="title, price, description, image, variants, sku, barcode, weight, dimensions"
                    defaultValue="title, price, description, image, variants, sku, barcode, weight, dimensions" 
                    className="min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter comma-separated list of product fields to sync
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveProductSettings} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Mapping</CardTitle>
                <CardDescription>
                  Configure how products are mapped between systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3">Category Mapping</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">E-commerce: Italian Books</p>
                        </div>
                        <div className="flex items-center px-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">App: Learning Resources</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">E-commerce: Audio Lessons</p>
                        </div>
                        <div className="flex items-center px-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">App: Listening Exercises</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">E-commerce: Flashcard Decks</p>
                        </div>
                        <div className="flex items-center px-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">App: Flashcards</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Edit Category Mapping
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3">Product Type Mapping</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">E-commerce: Digital Download</p>
                        </div>
                        <div className="flex items-center px-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">App: Digital Resource</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">E-commerce: Subscription</p>
                        </div>
                        <div className="flex items-center px-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">App: Premium Plan</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">E-commerce: Course</p>
                        </div>
                        <div className="flex items-center px-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">App: Lesson Package</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Edit Type Mapping
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default EcommerceIntegration;
