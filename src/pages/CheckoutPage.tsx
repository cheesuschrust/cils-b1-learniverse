
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Check, 
  ShieldCheck, 
  LockKeyhole, 
  ArrowLeft 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [plan, setPlan] = useState('premium-monthly');
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. Redirecting to dashboard...",
        variant: "default",
      });
      
      // Redirect after successful payment
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to format credit card input
  const formatCreditCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Calculate prices based on plan selection
  const getPriceDetails = () => {
    switch (plan) {
      case 'premium-monthly':
        return { name: 'Premium Monthly', price: 9.99, total: 9.99 };
      case 'premium-yearly':
        return { name: 'Premium Yearly', price: 99.99, total: 99.99 };
      case 'pro-monthly':
        return { name: 'Professional Monthly', price: 19.99, total: 19.99 };
      case 'pro-yearly':
        return { name: 'Professional Yearly', price: 199.99, total: 199.99 };
      default:
        return { name: 'Premium Monthly', price: 9.99, total: 9.99 };
    }
  };
  
  const priceDetails = getPriceDetails();

  return (
    <>
      <Helmet>
        <title>Checkout | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Complete your subscription purchase for the CILS B1 Italian citizenship test preparation." />
      </Helmet>

      <div className="container mx-auto max-w-7xl py-12 px-4">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>
                  Complete your purchase to get full access to our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Plan Selection */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Select Your Plan</h3>
                      <RadioGroup 
                        value={plan} 
                        onValueChange={setPlan} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem 
                            value="premium-monthly" 
                            id="premium-monthly" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="premium-monthly" 
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="text-center">
                              <div className="font-semibold">Premium Monthly</div>
                              <div className="text-sm text-muted-foreground">$9.99/month</div>
                            </div>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem 
                            value="premium-yearly" 
                            id="premium-yearly" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="premium-yearly" 
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="text-center">
                              <div className="font-semibold">Premium Yearly</div>
                              <div className="text-sm text-muted-foreground">$99.99/year (Save 16%)</div>
                            </div>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem 
                            value="pro-monthly" 
                            id="pro-monthly" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="pro-monthly" 
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="text-center">
                              <div className="font-semibold">Professional Monthly</div>
                              <div className="text-sm text-muted-foreground">$19.99/month</div>
                            </div>
                          </Label>
                        </div>
                        
                        <div>
                          <RadioGroupItem 
                            value="pro-yearly" 
                            id="pro-yearly" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="pro-yearly" 
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="text-center">
                              <div className="font-semibold">Professional Yearly</div>
                              <div className="text-sm text-muted-foreground">$199.99/year (Save 16%)</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={setPaymentMethod}
                        className="mb-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Credit or Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal">PayPal</Label>
                        </div>
                      </RadioGroup>
                      
                      {paymentMethod === 'credit-card' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input 
                              id="cardName" 
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input 
                              id="cardNumber" 
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={(e) => {
                                const formatted = formatCreditCardNumber(e.target.value);
                                setFormData({ ...formData, cardNumber: formatted });
                              }}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryMonth">Expiry Month</Label>
                              <Select 
                                value={formData.expiryMonth} 
                                onValueChange={(value) => setFormData({ ...formData, expiryMonth: value })}
                              >
                                <SelectTrigger id="expiryMonth">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => {
                                    const month = (i + 1).toString().padStart(2, '0');
                                    return (
                                      <SelectItem key={month} value={month}>
                                        {month}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expiryYear">Expiry Year</Label>
                              <Select 
                                value={formData.expiryYear} 
                                onValueChange={(value) => setFormData({ ...formData, expiryYear: value })}
                              >
                                <SelectTrigger id="expiryYear">
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 10 }, (_, i) => {
                                    const year = (new Date().getFullYear() + i).toString();
                                    return (
                                      <SelectItem key={year} value={year}>
                                        {year}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input 
                                id="cvv" 
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">{priceDetails.name}</span>
                    <span>${priceDetails.price.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${priceDetails.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Complete Payment"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                    <LockKeyhole className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">14-day money-back guarantee</span>
                        <p className="text-sm text-muted-foreground">Not happy with our service? Get a full refund within 14 days.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Cancel anytime</span>
                        <p className="text-sm text-muted-foreground">No long-term contracts, cancel your subscription whenever you want.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
