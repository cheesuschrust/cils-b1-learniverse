
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash, 
  MoreHorizontal,
  Users,
  CreditCard,
  Calendar,
  DollarSign,
  PiggyBank
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SubscriptionManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: '1',
      name: 'Free',
      price_monthly: 0,
      price_yearly: 0,
      is_active: true,
      users_count: 1842,
      features: {
        flashcards: true,
        quizzes: true,
        reading: true,
        writing: 'limited',
        speaking: 'limited',
        ai_feedback: false
      }
    },
    {
      id: '2',
      name: 'Premium',
      price_monthly: 9.99,
      price_yearly: 99.99,
      is_active: true,
      users_count: 653,
      features: {
        flashcards: true,
        quizzes: true,
        reading: true,
        writing: true,
        speaking: true,
        ai_feedback: true
      }
    },
    {
      id: '3',
      name: 'Instructor',
      price_monthly: 19.99,
      price_yearly: 199.99,
      is_active: true,
      users_count: 214,
      features: {
        flashcards: true,
        quizzes: true,
        reading: true,
        writing: true,
        speaking: true,
        ai_feedback: true,
        student_management: true,
        reporting: true
      }
    }
  ]);
  
  const [revenueMetrics, setRevenueMetrics] = useState({
    monthly_recurring_revenue: 12546.52,
    annual_recurring_revenue: 150558.24,
    average_revenue_per_user: 14.55,
    lifetime_value: 87.30
  });

  useEffect(() => {
    // In a real app, would fetch subscription plans from the database
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>Subscription Management - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage subscription plans and monitor revenue
            </p>
          </div>
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Plan
          </Button>
        </div>
        
        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Monthly Recurring Revenue
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueMetrics.monthly_recurring_revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Annual Recurring Revenue
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueMetrics.annual_recurring_revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12.8% from last year
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Average Revenue Per User
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueMetrics.average_revenue_per_user.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Customer Lifetime Value
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueMetrics.lifetime_value.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +3.5% from last quarter
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>
              Manage available subscription plans and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Monthly Price</TableHead>
                  <TableHead>Annual Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading subscription plans...
                    </TableCell>
                  </TableRow>
                ) : subscriptionPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>
                      {plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      {plan.price_yearly === 0 ? 'Free' : `$${plan.price_yearly.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.is_active ? 'default' : 'outline'}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        {plan.users_count.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {plan.name !== 'Free' && (
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Features Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Features Matrix</CardTitle>
            <CardDescription>
              Compare features across subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    {subscriptionPlans.map(plan => (
                      <TableHead key={plan.id}>{plan.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Flashcards</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.flashcards === true ? '✓' : 
                          plan.features.flashcards === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Quizzes</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.quizzes === true ? '✓' : 
                          plan.features.quizzes === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reading Exercises</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.reading === true ? '✓' : 
                          plan.features.reading === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Writing Exercises</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.writing === true ? '✓' : 
                          plan.features.writing === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Speaking Exercises</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.speaking === true ? '✓' : 
                          plan.features.speaking === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI Feedback</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.ai_feedback === true ? '✓' : 
                          plan.features.ai_feedback === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Student Management</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.student_management === true ? '✓' : 
                          plan.features.student_management === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reporting & Analytics</TableCell>
                    {subscriptionPlans.map(plan => (
                      <TableCell key={plan.id}>
                        {plan.features.reporting === true ? '✓' : 
                          plan.features.reporting === 'limited' ? 'Limited' : '✕'}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default SubscriptionManager;
