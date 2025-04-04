
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/types/subscription';
import { Calendar, CreditCard, AlertTriangle, CheckCircle, RefreshCcw, DollarSign, ChevronRight } from 'lucide-react';

const SubscriptionManagementPage: React.FC = () => {
  const { subscription, cancelSubscription, updateSubscription, isLoading, error, hasPremiumAccess } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [autoRenew, setAutoRenew] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  
  useEffect(() => {
    if (subscription) {
      setAutoRenew(subscription.autoRenew);
    }
  }, [subscription]);
  
  const handleAutoRenewToggle = async () => {
    // In a real implementation, this would update the subscription auto-renewal setting
    setAutoRenew(!autoRenew);
    
    toast({
      title: !autoRenew ? "Auto-renewal enabled" : "Auto-renewal disabled",
      description: !autoRenew 
        ? "Your subscription will automatically renew at the end of your billing period."
        : "Your subscription will expire at the end of your current billing period."
    });
  };
  
  const handleCancelSubscription = async () => {
    const success = await cancelSubscription();
    if (success) {
      setConfirmCancel(false);
      navigate('/dashboard');
    }
  };
  
  const handleUpgrade = async (planType: SubscriptionPlan) => {
    await updateSubscription(planType);
  };
  
  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Subscription Management | CILS Italian Citizenship Prep</title>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-8">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Current Plan</span>
                <Badge variant={hasPremiumAccess() ? "default" : "outline"}>
                  {hasPremiumAccess() ? "Premium" : "Free"}
                </Badge>
              </CardTitle>
              <CardDescription>
                {hasPremiumAccess() 
                  ? "You have access to all premium features" 
                  : "Upgrade to access all premium features"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {subscription && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm font-medium">Current Period</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(subscription.currentPeriod.start).toLocaleDateString()} - {new Date(subscription.currentPeriod.end).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {subscription.nextBillingDate && (
                      <div className="flex items-center">
                        <RefreshCcw className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <p className="text-sm font-medium">Next Billing Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(subscription.nextBillingDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm font-medium">Billing Amount</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription.price.amount} {subscription.price.currency} / {subscription.interval}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm font-medium">Payment Method</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription.paymentMethod === 'credit_card' && subscription.paymentDetails?.lastFour
                            ? `•••• ${subscription.paymentDetails.lastFour}`
                            : subscription.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {hasPremiumAccess() && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-renew">Auto-renew subscription</Label>
                        <p className="text-sm text-muted-foreground">
                          {autoRenew
                            ? "Your subscription will automatically renew"
                            : "Your subscription will expire at the end of the current period"}
                        </p>
                      </div>
                      <Switch
                        id="auto-renew"
                        checked={autoRenew}
                        onCheckedChange={handleAutoRenewToggle}
                      />
                    </div>
                  )}
                </>
              )}
              
              {!subscription && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Badge variant="outline" className="mb-4">Free Plan</Badge>
                  <p className="text-center text-muted-foreground mb-6">
                    You're currently on the free plan with limited access to features.
                  </p>
                  <Button onClick={() => navigate('/pricing')}>View Premium Plans</Button>
                </div>
              )}
            </CardContent>
            
            {hasPremiumAccess() && !confirmCancel && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => setConfirmCancel(true)}
                >
                  Cancel Subscription
                </Button>
              </CardFooter>
            )}
            
            {confirmCancel && (
              <CardFooter className="flex-col space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Are you sure you want to cancel?</AlertTitle>
                  <AlertDescription>
                    You'll lose access to all premium features at the end of your current billing period.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-4 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setConfirmCancel(false)}
                  >
                    Keep Subscription
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={handleCancelSubscription}
                  >
                    Confirm Cancellation
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
          
          {/* Payment History */}
          {hasPremiumAccess() && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your past payments and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mock payment history - in a real implementation, this would fetch from the database */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Premium Subscription</p>
                      <p className="text-sm text-muted-foreground">May 15, 2023</p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4">€9.99</p>
                      <Badge variant="outline" className="mr-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Premium Subscription</p>
                      <p className="text-sm text-muted-foreground">April 15, 2023</p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4">€9.99</p>
                      <Badge variant="outline" className="mr-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Premium Subscription</p>
                      <p className="text-sm text-muted-foreground">March 15, 2023</p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4">€9.99</p>
                      <Badge variant="outline" className="mr-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Plan Options */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Options</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasPremiumAccess() ? (
                <div className="space-y-4">
                  <p>You're currently on the Premium plan. Would you like to make changes?</p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/pricing')}
                    >
                      View All Plans
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleUpgrade('educational')}
                    >
                      Upgrade to Educational
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Ready to unlock all premium features?</p>
                  <Button onClick={() => navigate('/pricing')}>
                    View Premium Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Help and Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Get support with your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you have any questions about your subscription, billing, or payments, our support team is here to help.</p>
              <Button variant="outline" onClick={() => navigate('/support-center')}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubscriptionManagementPage;
