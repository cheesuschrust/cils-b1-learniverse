
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart as BarChartIcon,
  Users,
  ShoppingCart,
  Package,
  ArrowUpRight,
  MoreHorizontal,
  Download,
  RefreshCw,
  Calendar,
  Settings,
  Globe,
  Book,
  HelpCircle,
  MessageSquare,
  Upload,
  ServerIcon,
  Clock,
  CheckCircle,
  HardDrive,
  Link,
  FileText,
} from 'lucide-react';
import { Icons } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Import our custom components
import EnhancedAnalyticsDashboard from '@/components/admin/EnhancedAnalyticsDashboard';
import EcommerceIntegration from '@/components/admin/EcommerceIntegration';
import SEOManager from '@/components/admin/SEOManager';

type AdminTabType = 'overview' | 'analytics' | 'ecommerce' | 'seo' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefreshData = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated with the latest information.",
      });
    }, 2000);
  };

  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Your dashboard data export has started. You'll be notified when it's ready.",
    });
    
    // Simulate export completion
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Your data has been exported successfully. Check your downloads folder.",
      });
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CILS B2 Cittadinanza</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your application, users, and content.
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportData}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportData}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportData}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AdminTabType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,853</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                  <div className="mt-3">
                    <Progress value={78} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Monthly Target: 2,500</div>
                      <div>78%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Subscriptions
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,239</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                  <div className="mt-3">
                    <Progress value={62} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Monthly Target: 2,000</div>
                      <div>62%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lesson Completions
                  </CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18,396</div>
                  <p className="text-xs text-muted-foreground">
                    +22% from last month
                  </p>
                  <div className="mt-3">
                    <Progress value={91} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Monthly Target: 15,000</div>
                      <div>91%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Support Tickets
                  </CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">27</div>
                  <p className="text-xs text-muted-foreground">
                    -12% from last month
                  </p>
                  <div className="mt-3">
                    <Progress value={42} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <div>Open: 12 / Resolved: 15</div>
                      <div>42%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>
                    Daily active users and app usage metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <BarChartIcon className="h-16 w-16 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest system events and user activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-muted-foreground">
                            Maria Rossi (maria@example.com)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-orange-500/10 p-2">
                          <ShoppingCart className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">New subscription purchased</p>
                          <p className="text-xs text-muted-foreground">
                            Premium Plan - Annual ($99.99)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(Date.now() - 1000 * 60 * 30), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-green-500/10 p-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Content update completed</p>
                          <p className="text-xs text-muted-foreground">
                            25 new flashcards added to "B2 Grammar"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(Date.now() - 1000 * 60 * 60), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-500/10 p-2">
                          <Upload className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">System update deployed</p>
                          <p className="text-xs text-muted-foreground">
                            Version 2.4.5 with bug fixes and performance improvements
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(Date.now() - 1000 * 60 * 120), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-red-500/10 p-2">
                          <HelpCircle className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Support ticket opened</p>
                          <p className="text-xs text-muted-foreground">
                            "Issue with audio playback on speaking exercises"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(Date.now() - 1000 * 60 * 240), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current system metrics and health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ServerIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">API Server</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Operational</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Database</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Operational</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">CDN</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Operational</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Chatbot</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Degraded</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Content API</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Operational</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-xs text-muted-foreground">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-xs text-muted-foreground">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Storage</span>
                        <span className="text-xs text-muted-foreground">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Overview</CardTitle>
                  <CardDescription>
                    Content distribution and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Lessons</span>
                        <Badge>124</Badge>
                      </div>
                      <Progress value={62} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <div>Published: 124</div>
                        <div>Drafts: 18</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Flashcards</span>
                        <Badge>2,456</Badge>
                      </div>
                      <Progress value={82} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <div>Active: 2,456</div>
                        <div>Archived: 342</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Multiple Choice</span>
                        <Badge>892</Badge>
                      </div>
                      <Progress value={45} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <div>Published: 892</div>
                        <div>Drafts: 56</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Speaking Exercises</span>
                        <Badge>238</Badge>
                      </div>
                      <Progress value={32} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <div>Published: 238</div>
                        <div>Drafts: 24</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Listening Exercises</span>
                        <Badge>176</Badge>
                      </div>
                      <Progress value={28} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <div>Published: 176</div>
                        <div>Drafts: 12</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>
                    Scheduled tasks and reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-500/10 p-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Weekly Content Review</p>
                          <p className="text-xs text-muted-foreground">
                            Review and approve new content submissions
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Tomorrow</Badge>
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">High Priority</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-purple-500/10 p-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Database Backup</p>
                          <p className="text-xs text-muted-foreground">
                            Scheduled automatic backup of all database content
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Today</Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Automated</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-green-500/10 p-2">
                          <Upload className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">App Store Update</p>
                          <p className="text-xs text-muted-foreground">
                            Submit new app version to App Store and Play Store
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">2 days</Badge>
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">High Priority</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-orange-500/10 p-2">
                          <MessageSquare className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Support Team Meeting</p>
                          <p className="text-xs text-muted-foreground">
                            Weekly discussion of support ticket metrics and issues
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">3 days</Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Medium Priority</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-red-500/10 p-2">
                          <BarChartIcon className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Monthly Analytics Review</p>
                          <p className="text-xs text-muted-foreground">
                            Analysis of user engagement and conversion metrics
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">5 days</Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Medium Priority</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Analytics</CardTitle>
                <CardDescription>
                  In-depth analytics and data visualization for your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedAnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ecommerce">
            <EcommerceIntegration />
          </TabsContent>
          
          <TabsContent value="seo">
            <SEOManager />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure core application settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20 text-muted-foreground space-y-4">
                  <Settings className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <div>
                    <h3 className="text-lg font-medium">Settings Panel</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure application settings, permissions, and system preferences here.
                    </p>
                  </div>
                  <Button className="mt-4">
                    Open Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;
