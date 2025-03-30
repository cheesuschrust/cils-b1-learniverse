
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, BookOpen, MessageSquare, BarChart3, ArrowUpRight,
  Sparkles, Settings, Database, FileText, Activity, Plus, Download
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | CILS B1 Learniverse</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your CILS B1 Learniverse platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">428</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Content Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,341</div>
              <p className="text-xs text-muted-foreground">+156 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                AI Interactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18,291</div>
              <p className="text-xs text-muted-foreground">+1,203 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Subscription Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">€2,845</div>
              <p className="text-xs text-muted-foreground">+€420 this month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="activities" className="w-full">
              <TabsList>
                <TabsTrigger value="activities">Recent Activities</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent System Activities</CardTitle>
                    <CardDescription>Latest actions across the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center py-4 px-6 border-b">
                          <div className="rounded-full bg-primary/10 p-2 mr-4">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {i === 1 && 'New user registered: Maria Rossi'}
                              {i === 2 && 'Content updated: CILS B1 Grammar Guide'}
                              {i === 3 && 'AI model settings updated by admin'}
                              {i === 4 && 'New support ticket: Issue with speaking exercise'}
                              {i === 5 && 'System update completed: v1.2.4'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {i === 1 && '2 minutes ago'}
                              {i === 2 && '45 minutes ago'}
                              {i === 3 && '1 hour ago'}
                              {i === 4 && '3 hours ago'}
                              {i === 5 && '5 hours ago'}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Analytics</CardTitle>
                    <CardDescription>User engagement and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Analytics charts would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button className="flex justify-between w-full">
                  <span className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                
                <Button className="flex justify-between w-full">
                  <span className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Configure AI
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                
                <Button className="flex justify-between w-full">
                  <span className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Content
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                
                <Button className="flex justify-between w-full">
                  <span className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>New Content</CardTitle>
                <CardDescription>Add learning materials to the platform</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button className="flex justify-between w-full">
                  <span className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Flashcards
                  </span>
                </Button>
                
                <Button className="flex justify-between w-full">
                  <span className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Quiz
                  </span>
                </Button>
                
                <Button className="flex justify-between w-full">
                  <span className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Listening Material
                  </span>
                </Button>
                
                <Button className="flex justify-between w-full" variant="outline">
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Export Reports
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
