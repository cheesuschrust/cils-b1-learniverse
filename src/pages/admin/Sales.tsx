
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { SalesConfiguration } from '@/contexts/shared-types';
import { API } from '@/services/api';
import { Plus, Trash2, Tag, CreditCard, Ticket, ShoppingCart, AlertCircle } from 'lucide-react';

const Sales = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [salesConfig, setSalesConfig] = useState<SalesConfiguration>({
    products: [
      {
        id: '1',
        name: 'Monthly Premium',
        description: 'Unlimited access to all lessons and exercises',
        price: 9.99,
        currency: 'USD',
        type: 'subscription',
        features: ['Unlimited lessons', 'No ads', 'Premium content'],
        active: true
      },
      {
        id: '2',
        name: 'Annual Premium',
        description: 'Unlimited access with 20% discount',
        price: 95.88,
        currency: 'USD',
        type: 'subscription',
        features: ['Everything in Monthly', 'Save 20%', 'Priority support'],
        active: true
      }
    ],
    discounts: [
      {
        id: '1',
        name: 'Summer Sale',
        code: 'SUMMER20',
        amount: 20,
        type: 'percentage',
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        active: true
      }
    ],
    paymentProviders: [
      {
        name: 'stripe',
        enabled: true,
        testMode: false
      },
      {
        name: 'paypal',
        enabled: true,
        testMode: false
      }
    ]
  });

  useEffect(() => {
    const fetchSalesSettings = async () => {
      setIsLoading(true);
      try {
        const response = await API.handleRequest<SalesConfiguration>('/admin/sales/settings', 'GET');
        setSalesConfig(response);
      } catch (error) {
        console.error('Error fetching sales settings:', error);
        toast({
          title: 'Failed to load sales settings',
          description: 'There was an error loading the sales configuration.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesSettings();
  }, [toast]);

  const addProduct = () => {
    const newId = String(Date.now());
    setSalesConfig(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: newId,
          name: 'New Product',
          description: 'Product description',
          price: 0,
          currency: 'USD',
          type: 'subscription',
          features: [],
          active: false
        }
      ]
    }));
  };

  const removeProduct = (id: string) => {
    setSalesConfig(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== id)
    }));
  };

  const handleProductChange = (id: string, field: string, value: any) => {
    setSalesConfig(prev => {
      const updatedProducts = prev.products.map(product => {
        if (product.id === id) {
          if (field === 'features') {
            return { ...product, features: value.split('\n').filter(Boolean) };
          }
          return { ...product, [field]: value };
        }
        return product;
      });
      
      return { ...prev, products: updatedProducts };
    });
  };

  const addDiscount = () => {
    const newId = String(Date.now());
    setSalesConfig(prev => ({
      ...prev,
      discounts: [
        ...prev.discounts,
        {
          id: newId,
          name: 'New Discount',
          code: 'CODE',
          amount: 10,
          type: 'percentage',
          validFrom: new Date().toISOString(),
          validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          active: false
        }
      ]
    }));
  };

  const removeDiscount = (id: string) => {
    setSalesConfig(prev => ({
      ...prev,
      discounts: prev.discounts.filter(discount => discount.id !== id)
    }));
  };

  const handleDiscountChange = (id: string, field: string, value: any) => {
    setSalesConfig(prev => {
      const updatedDiscounts = prev.discounts.map(discount => {
        if (discount.id === id) {
          return { ...discount, [field]: value };
        }
        return discount;
      });
      
      return { ...prev, discounts: updatedDiscounts };
    });
  };

  const handlePaymentProviderChange = (name: 'stripe' | 'paypal' | 'other', field: string, value: any) => {
    setSalesConfig(prev => {
      const updatedProviders = prev.paymentProviders.map(provider => {
        if (provider.name === name) {
          return { ...provider, [field]: value };
        }
        return provider;
      });
      
      return { ...prev, paymentProviders: updatedProviders };
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await API.handleRequest<SalesConfiguration>('/admin/sales/settings', 'PUT', salesConfig);
      toast({
        title: 'Sales settings saved',
        description: 'Your sales configuration has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving sales settings:', error);
      toast({
        title: 'Failed to save settings',
        description: 'There was an error updating the sales configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">E-Commerce Settings</h1>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-400">Payment Processing Integration</h3>
            <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
              Configure payment methods, products, and discounts. Ensure your payment provider accounts are set up correctly before enabling.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Discounts
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Methods
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Products & Subscriptions</CardTitle>
                <CardDescription>
                  Manage the products and subscription plans you offer
                </CardDescription>
              </div>
              <Button 
                onClick={addProduct} 
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              {salesConfig.products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No products configured. Click "Add Product" to create one.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {salesConfig.products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={product.active}
                            onCheckedChange={(checked) => handleProductChange(product.id, 'active', checked)}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${product.id}`}>Product Name</Label>
                          <Input 
                            id={`name-${product.id}`}
                            value={product.name}
                            onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`type-${product.id}`}>Product Type</Label>
                          <select
                            id={`type-${product.id}`}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={product.type}
                            onChange={(e) => handleProductChange(product.id, 'type', e.target.value)}
                          >
                            <option value="subscription">Subscription</option>
                            <option value="one-time">One-time Purchase</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`price-${product.id}`}>Price</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id={`price-${product.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={product.price}
                              onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value))}
                              className="flex-1"
                            />
                            <select
                              className="w-24 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              value={product.currency}
                              onChange={(e) => handleProductChange(product.id, 'currency', e.target.value)}
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="CAD">CAD</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`description-${product.id}`}>Description</Label>
                          <Textarea 
                            id={`description-${product.id}`}
                            value={product.description}
                            onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor={`features-${product.id}`}>Features (one per line)</Label>
                          <Textarea 
                            id={`features-${product.id}`}
                            value={product.features.join('\n')}
                            onChange={(e) => handleProductChange(product.id, 'features', e.target.value)}
                            rows={4}
                            placeholder="Enter one feature per line"
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

        <TabsContent value="discounts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Discount Codes</CardTitle>
                <CardDescription>
                  Create promotional codes and special offers
                </CardDescription>
              </div>
              <Button 
                onClick={addDiscount} 
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Discount
              </Button>
            </CardHeader>
            <CardContent>
              {salesConfig.discounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No discounts configured. Click "Add Discount" to create one.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {salesConfig.discounts.map((discount) => (
                    <div key={discount.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{discount.name}</h3>
                            <p className="text-sm font-mono bg-muted px-2 py-0.5 rounded inline-block">{discount.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={discount.active}
                            onCheckedChange={(checked) => handleDiscountChange(discount.id, 'active', checked)}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeDiscount(discount.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`discount-name-${discount.id}`}>Discount Name</Label>
                          <Input 
                            id={`discount-name-${discount.id}`}
                            value={discount.name}
                            onChange={(e) => handleDiscountChange(discount.id, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`discount-code-${discount.id}`}>Promo Code</Label>
                          <Input 
                            id={`discount-code-${discount.id}`}
                            value={discount.code}
                            onChange={(e) => handleDiscountChange(discount.id, 'code', e.target.value.toUpperCase())}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`discount-type-${discount.id}`}>Discount Type</Label>
                          <select
                            id={`discount-type-${discount.id}`}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={discount.type}
                            onChange={(e) => handleDiscountChange(discount.id, 'type', e.target.value)}
                          >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`discount-amount-${discount.id}`}>Amount</Label>
                          <div className="flex items-center">
                            <Input 
                              id={`discount-amount-${discount.id}`}
                              type="number"
                              min="0"
                              max={discount.type === 'percentage' ? 100 : undefined}
                              value={discount.amount}
                              onChange={(e) => handleDiscountChange(discount.id, 'amount', parseFloat(e.target.value))}
                            />
                            <span className="ml-2">{discount.type === 'percentage' ? '%' : '$'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`discount-start-${discount.id}`}>Valid From</Label>
                          <Input 
                            id={`discount-start-${discount.id}`}
                            type="date"
                            value={new Date(discount.validFrom).toISOString().split('T')[0]}
                            onChange={(e) => handleDiscountChange(discount.id, 'validFrom', new Date(e.target.value).toISOString())}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`discount-end-${discount.id}`}>Valid Until</Label>
                          <Input 
                            id={`discount-end-${discount.id}`}
                            type="date"
                            value={new Date(discount.validTo).toISOString().split('T')[0]}
                            onChange={(e) => handleDiscountChange(discount.id, 'validTo', new Date(e.target.value).toISOString())}
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

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment processor integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Credit card and direct bank processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={salesConfig.paymentProviders.find(p => p.name === 'stripe')?.enabled || false}
                      onCheckedChange={(checked) => handlePaymentProviderChange('stripe', 'enabled', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-public-key">Public Key</Label>
                    <Input 
                      id="stripe-public-key"
                      placeholder="pk_live_..."
                      disabled={!salesConfig.paymentProviders.find(p => p.name === 'stripe')?.enabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-key">Secret Key</Label>
                    <Input 
                      id="stripe-secret-key"
                      placeholder="sk_live_..."
                      type="password"
                      disabled={!salesConfig.paymentProviders.find(p => p.name === 'stripe')?.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="stripe-test-mode"
                      checked={salesConfig.paymentProviders.find(p => p.name === 'stripe')?.testMode || false}
                      onCheckedChange={(checked) => handlePaymentProviderChange('stripe', 'testMode', checked)}
                      disabled={!salesConfig.paymentProviders.find(p => p.name === 'stripe')?.enabled}
                    />
                    <Label htmlFor="stripe-test-mode">Test Mode</Label>
                    <p className="text-xs text-muted-foreground ml-2">
                      Use test credentials and don't process real payments
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">PayPal</h3>
                      <p className="text-sm text-muted-foreground">PayPal and credit card processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={salesConfig.paymentProviders.find(p => p.name === 'paypal')?.enabled || false}
                      onCheckedChange={(checked) => handlePaymentProviderChange('paypal', 'enabled', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">Client ID</Label>
                    <Input 
                      id="paypal-client-id"
                      placeholder="Client ID from PayPal Developer Dashboard"
                      disabled={!salesConfig.paymentProviders.find(p => p.name === 'paypal')?.enabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">Client Secret</Label>
                    <Input 
                      id="paypal-secret"
                      placeholder="Secret from PayPal Developer Dashboard"
                      type="password"
                      disabled={!salesConfig.paymentProviders.find(p => p.name === 'paypal')?.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paypal-test-mode"
                      checked={salesConfig.paymentProviders.find(p => p.name === 'paypal')?.testMode || false}
                      onCheckedChange={(checked) => handlePaymentProviderChange('paypal', 'testMode', checked)}
                      disabled={!salesConfig.paymentProviders.find(p => p.name === 'paypal')?.enabled}
                    />
                    <Label htmlFor="paypal-test-mode">Sandbox Mode</Label>
                    <p className="text-xs text-muted-foreground ml-2">
                      Use sandbox environment for testing
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Checkout Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure the checkout experience</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-success-url">Success URL</Label>
                    <Input 
                      id="checkout-success-url"
                      defaultValue="/checkout/success"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="checkout-cancel-url">Cancel URL</Label>
                    <Input 
                      id="checkout-cancel-url"
                      defaultValue="/checkout/cancel"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="checkout-currency">Default Currency</Label>
                    <select
                      id="checkout-currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="USD"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
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
          {isLoading ? 'Saving...' : 'Save Payment Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Sales;
