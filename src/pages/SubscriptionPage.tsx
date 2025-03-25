
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { Calendar, CreditCard, GraduationCap, History, Receipt, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionInterval } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<SubscriptionInterval>('monthly');
  
  // Mock current subscription data (in a real app, this would come from the auth context or a dedicated subscription service)
  const subscription = user?.subscription === 'premium' ? {
    plan: 'premium',
    status: 'active',
    currentPeriod: {
      start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    },
    paymentMethod: 'credit_card',
    autoRenew: true,
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
  } : null;
  
  // Mock invoice data (in a real app, this would come from an API)
  const invoices = subscription ? [
    {
      id: 'inv-001',
      number: 'INV-001',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      amount: 9.99,
      status: 'paid',
    },
    {
      id: 'inv-002',
      number: 'INV-002',
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      amount: 9.99,
      status: 'paid',
    },
  ] : [];
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <Helmet>
        <title>Subscription Management | Italian Learning Platform</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      
      <Tabs defaultValue={subscription ? "manage" : "plans"} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl mx-auto mb-8">
          <TabsTrigger value="plans" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center" disabled={!subscription}>
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center" disabled={!subscription}>
            <Receipt className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Benefits
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans">
          <div className="max-w-6xl mx-auto">
            <SubscriptionPlans 
              selectedInterval={billingInterval}
              onIntervalChange={(interval) => setBillingInterval(interval as SubscriptionInterval)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          {subscription ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>Manage your subscription details and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Plan</h3>
                      <p className="font-medium capitalize flex items-center">
                        {subscription.plan === 'premium' && <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-2"></span>}
                        {subscription.plan} Plan
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                      <p className="font-medium capitalize">
                        {subscription.status}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Period</h3>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(subscription.currentPeriod.start, 'MMM d, yyyy')} - {format(subscription.currentPeriod.end, 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Auto-Renewal</h3>
                      <p className="font-medium">
                        {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Method</h3>
                      <p className="font-medium capitalize flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        {subscription.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Billing Date</h3>
                      <p className="font-medium">
                        {format(subscription.nextBillingDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t flex flex-col sm:flex-row gap-3 justify-end">
                    <Button variant="outline">Update Payment Method</Button>
                    {subscription.autoRenew ? (
                      <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                        Cancel Auto-Renewal
                      </Button>
                    ) : (
                      <Button variant="outline">
                        Enable Auto-Renewal
                      </Button>
                    )}
                    <Button variant="destructive">Cancel Subscription</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You don't currently have an active subscription.</p>
              <Button onClick={() => document.querySelector('button[value="plans"]')?.click()}>
                View Plans
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="billing">
          {subscription ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your past invoices and payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoices.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-muted-foreground text-sm">
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Invoice</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-right py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b hover:bg-muted/50 text-sm">
                              <td className="py-3 px-4">{format(invoice.date, 'MMM d, yyyy')}</td>
                              <td className="py-3 px-4">{invoice.number}</td>
                              <td className="py-3 px-4">${invoice.amount.toFixed(2)}</td>
                              <td className="py-3 px-4 capitalize">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {invoice.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="sm">Download</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No billing history available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You don't currently have any billing history.</p>
              <Button onClick={() => document.querySelector('button[value="plans"]')?.click()}>
                View Plans
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="benefits">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Premium Benefits</CardTitle>
                <CardDescription>Explore all the benefits of Premium membership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Unlimited Daily Questions
                    </h3>
                    <p className="text-muted-foreground">Premium members enjoy unlimited access to all question types every day, while free users are limited to one question per category.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                      Advanced Progress Tracking
                    </h3>
                    <p className="text-muted-foreground">Get detailed insights into your learning journey with advanced analytics, performance metrics, and personalized recommendations.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path>
                        <path d="M9 15l6-6"></path>
                        <path d="M15 15l-6-6"></path>
                      </svg>
                      Ad-Free Experience
                    </h3>
                    <p className="text-muted-foreground">Enjoy a completely ad-free learning experience throughout the entire platform, allowing you to focus entirely on your Italian language journey.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 13h5"></path>
                        <path d="M15 13h5"></path>
                        <path d="M4 19h5"></path>
                        <path d="M15 19h5"></path>
                        <path d="M9 13v6"></path>
                        <path d="M20 13v6"></path>
                        <path d="M12 10v9"></path>
                        <path d="M9 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"></path>
                      </svg>
                      Priority Support
                    </h3>
                    <p className="text-muted-foreground">Get faster responses from our support team and access to premium support channels for any questions or assistance you might need.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                      </svg>
                      Downloadable Content
                    </h3>
                    <p className="text-muted-foreground">Download lessons, flashcards, and audio files for offline learning, allowing you to continue your studies anywhere, anytime.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.5-5.5-1.5l-1-1"></path>
                      </svg>
                      Personalized Learning Path
                    </h3>
                    <p className="text-muted-foreground">Access to AI-powered learning recommendations that adapt to your strengths and weaknesses for a truly personalized learning experience.</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button onClick={() => document.querySelector('button[value="plans"]')?.click()}>
                    View Premium Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionPage;
