
import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from '@/components/ui/tabs';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, Clock, Edit, FileText, Mail, Send, Users, 
  ListChecks, Book, BarChart, Settings, Upload 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock newsletter templates
const newsletterTemplates = [
  {
    id: 1,
    name: 'Italian Citizenship Guide',
    subject: 'Your Guide to Italian Citizenship: Steps, Requirements & Tips',
    thumbnail: '/images/newsletter-template-1.jpg',
    category: 'citizenship',
    lastModified: '2025-03-12'
  },
  {
    id: 2,
    name: 'Weekly Italian Tips',
    subject: 'This Week\'s Italian Learning Tips & Practice Exercises',
    thumbnail: '/images/newsletter-template-2.jpg',
    category: 'language',
    lastModified: '2025-04-01'
  },
  {
    id: 3,
    name: 'Italian Test Preparation',
    subject: 'CILS B1 Exam Preparation: Practice Questions & Study Plan',
    thumbnail: '/images/newsletter-template-3.jpg',
    category: 'exam',
    lastModified: '2025-03-28'
  },
  {
    id: 4,
    name: 'Italian Culture Deep Dive',
    subject: 'Explore Italian Culture: Regions, Traditions & History',
    thumbnail: '/images/newsletter-template-4.jpg', 
    category: 'culture',
    lastModified: '2025-02-15'
  }
];

// Mock subscriber segments
const subscriberSegments = [
  { id: 1, name: 'All Subscribers', count: 4582 },
  { id: 2, name: 'Active Users', count: 3241 },
  { id: 3, name: 'B1 Test Takers', count: 1876 },
  { id: 4, name: 'Citizenship Applicants', count: 2134 },
  { id: 5, name: 'Italian Beginners', count: 1453 },
  { id: 6, name: 'Italian Intermediate', count: 1287 },
  { id: 7, name: 'Italian Advanced', count: 842 },
  { id: 8, name: 'New Subscribers (30 days)', count: 387 }
];

// Mock scheduled campaigns
const scheduledCampaigns = [
  { 
    id: 1, 
    name: 'Weekly Learning Tips', 
    segment: 'All Subscribers', 
    scheduledFor: '2025-04-15T09:00:00', 
    status: 'scheduled'
  },
  { 
    id: 2, 
    name: 'CILS Exam Preparation Guide', 
    segment: 'B1 Test Takers', 
    scheduledFor: '2025-04-18T14:30:00', 
    status: 'scheduled'
  },
  { 
    id: 3, 
    name: 'Citizenship Documentation Checklist', 
    segment: 'Citizenship Applicants', 
    scheduledFor: '2025-04-22T10:00:00', 
    status: 'draft'
  }
];

// Mock past campaigns
const pastCampaigns = [
  { 
    id: 101, 
    name: 'March Italian Grammar Tips', 
    segment: 'All Subscribers', 
    sentOn: '2025-03-15T09:00:00', 
    openRate: 48.3,
    clickRate: 12.7
  },
  { 
    id: 102, 
    name: 'Italian Citizenship Pathway Guide', 
    segment: 'Citizenship Applicants', 
    sentOn: '2025-03-22T10:15:00', 
    openRate: 62.5,
    clickRate: 24.8
  },
  { 
    id: 103, 
    name: 'CILS Practice Test Invitation', 
    segment: 'B1 Test Takers', 
    sentOn: '2025-03-28T15:30:00', 
    openRate: 71.2,
    clickRate: 38.9
  },
  { 
    id: 104, 
    name: 'Italian Study Resources Round-up', 
    segment: 'Active Users', 
    sentOn: '2025-04-05T08:45:00', 
    openRate: 52.6,
    clickRate: 17.3
  }
];

// Mock content for autoblog
const autoblogContent = [
  {
    id: 1,
    title: 'Complete Guide to Italian Dual Citizenship',
    category: 'Citizenship',
    status: 'published',
    publishDate: '2025-04-08T10:30:00',
    readTime: 8,
    newsletter: true
  },
  {
    id: 2,
    title: 'Top 50 Italian Phrases for Daily Conversation',
    category: 'Language',
    status: 'published',
    publishDate: '2025-04-05T14:15:00',
    readTime: 5,
    newsletter: true
  },
  {
    id: 3,
    title: 'How to Navigate the Italian Bureaucracy System',
    category: 'Citizenship',
    status: 'draft',
    publishDate: null,
    readTime: 10,
    newsletter: false
  },
  {
    id: 4,
    title: 'CILS B1 Exam: Comprehensive Study Guide',
    category: 'Exam Prep',
    status: 'scheduled',
    publishDate: '2025-04-12T09:00:00',
    readTime: 12,
    newsletter: true
  },
  {
    id: 5,
    title: 'Italian Regions: A Cultural Overview',
    category: 'Culture',
    status: 'published',
    publishDate: '2025-04-02T11:45:00',
    readTime: 7,
    newsletter: true
  }
];

const NewsletterManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState('');

  const handleCreateCampaign = () => {
    toast({
      title: "Campaign created",
      description: "Your newsletter campaign has been created and saved as a draft."
    });
  };

  const handleScheduleCampaign = () => {
    toast({
      title: "Campaign scheduled",
      description: "Your newsletter campaign has been scheduled for delivery."
    });
  };

  const handleSendTestEmail = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to your admin address."
    });
  };

  const handleAutoblogSave = () => {
    toast({
      title: "Autoblog settings saved",
      description: "Your autoblog and newsletter settings have been updated."
    });
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="Newsletter & Autoblog Management"
        description="Create, schedule, and manage newsletters and autoblog content for Italian citizenship preparation."
        keywords="newsletter, email marketing, autoblog, content management, Italian citizenship"
      />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Newsletter & Autoblog</h1>
            <p className="text-muted-foreground mt-1">
              Manage newsletter campaigns and automated content delivery
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleSendTestEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Send Test
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="autoblog">Autoblog</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Dashboard tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{subscriberSegments[0].count}</div>
                  <p className="text-sm text-muted-foreground">
                    +124 new subscribers this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-2" />
                    Open Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">58.4%</div>
                  <p className="text-sm text-muted-foreground">
                    +5.2% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    Next Campaign
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">Weekly Learning Tips</div>
                  <p className="text-sm text-muted-foreground">
                    Scheduled for Apr 15, 2025
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Performance of your latest newsletter campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {pastCampaigns.slice(0, 3).map(campaign => (
                      <li key={campaign.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Sent to: {campaign.segment} • {new Date(campaign.sentOn).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{campaign.openRate}%</p>
                            <p className="text-sm text-muted-foreground">open rate</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0" onClick={() => setActiveTab('campaigns')}>
                    View all campaigns
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Autoblog Activity</CardTitle>
                  <CardDescription>Latest published content from your autoblog</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {autoblogContent.filter(content => content.status === 'published').slice(0, 3).map(content => (
                      <li key={content.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Category: {content.category} • {new Date(content.publishDate!).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${content.newsletter ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                              {content.newsletter ? 'Newsletter' : 'Blog Only'}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0" onClick={() => setActiveTab('autoblog')}>
                    Manage autoblog content
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common newsletter and autoblog tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => setActiveTab('campaigns')}>
                    <Send className="h-6 w-6" />
                    <span>Create Campaign</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => setActiveTab('autoblog')}>
                    <FileText className="h-6 w-6" />
                    <span>New Autoblog Post</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => setActiveTab('subscribers')}>
                    <Upload className="h-6 w-6" />
                    <span>Import Subscribers</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => setActiveTab('settings')}>
                    <Settings className="h-6 w-6" />
                    <span>Email Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Campaigns tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Campaign</CardTitle>
                <CardDescription>Design a new newsletter to send to your subscribers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="e.g., April Italian Citizenship Tips" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="campaign-subject">Email Subject Line</Label>
                    <Input id="campaign-subject" placeholder="e.g., Your Monthly Guide to Italian Citizenship" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select Template</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {newsletterTemplates.map(template => (
                        <div 
                          key={template.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'hover:border-gray-400'}`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                            {/* Placeholder for template thumbnail */}
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                          <p className="font-medium text-sm truncate">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="segment-select">Recipient Segment</Label>
                    <Select onValueChange={setSelectedSegment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subscriber segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {subscriberSegments.map(segment => (
                          <SelectItem key={segment.id} value={segment.id.toString()}>
                            {segment.name} ({segment.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="campaign-content">Email Content</Label>
                    <Textarea id="campaign-content" rows={6} placeholder="Write your newsletter content here or use the template editor..." />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSendTestEmail}>Send Test</Button>
                  <Button variant="outline" onClick={handleCreateCampaign}>Save Draft</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleScheduleCampaign}>Schedule</Button>
                  <Button>Send Now</Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Campaigns</CardTitle>
                  <CardDescription>Upcoming newsletter campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledCampaigns.length > 0 ? (
                    <ul className="space-y-4">
                      {scheduledCampaigns.map(campaign => (
                        <li key={campaign.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{campaign.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Segment: {campaign.segment} • {new Date(campaign.scheduledFor).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${campaign.status === 'scheduled' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                                {campaign.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                              </span>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">No scheduled campaigns</h3>
                      <p className="text-muted-foreground">
                        Create a new campaign and schedule it for future delivery
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Past Campaigns</CardTitle>
                  <CardDescription>Performance metrics for previous campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  {pastCampaigns.length > 0 ? (
                    <ul className="space-y-4">
                      {pastCampaigns.map(campaign => (
                        <li key={campaign.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{campaign.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Sent: {new Date(campaign.sentOn).toLocaleDateString()} • To: {campaign.segment}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <span className="text-xs">Open: {campaign.openRate}%</span>
                                <span className="text-xs">Click: {campaign.clickRate}%</span>
                              </div>
                              <Button variant="link" size="sm" className="h-6 px-0">
                                View Report
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">No past campaigns</h3>
                      <p className="text-muted-foreground">
                        Send your first campaign to see performance metrics
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Subscribers tab */}
          <TabsContent value="subscribers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    Total Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{subscriberSegments[0].count}</div>
                  <p className="text-sm text-muted-foreground">
                    Across all segments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 text-primary mr-2" />
                    Growth Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">+8.4%</div>
                  <p className="text-sm text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-2" />
                    Average Open Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">58.4%</div>
                  <p className="text-sm text-muted-foreground">
                    Last 5 campaigns
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Segments</CardTitle>
                <CardDescription>Manage your subscriber lists and segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Segment Name</th>
                        <th className="text-left py-3 px-4 font-medium">Subscribers</th>
                        <th className="text-left py-3 px-4 font-medium">Open Rate</th>
                        <th className="text-left py-3 px-4 font-medium">Click Rate</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriberSegments.map((segment, index) => (
                        <tr key={segment.id} className="border-b">
                          <td className="py-3 px-4">{segment.name}</td>
                          <td className="py-3 px-4">{segment.count.toLocaleString()}</td>
                          <td className="py-3 px-4">{(55 + index * 2).toFixed(1)}%</td>
                          <td className="py-3 px-4">{(12 + index * 1.5).toFixed(1)}%</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">View</Button>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Import Subscribers</Button>
                <Button>Create Segment</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Forms</CardTitle>
                <CardDescription>Website forms for newsletter subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Embedded Form</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add this form to your website to collect subscribers.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md text-xs font-mono mb-4 overflow-x-auto">
                      &lt;form action="https://api.cilsprep.com/subscribe" method="post"&gt;<br />
                      &nbsp;&nbsp;&lt;input type="email" name="email" placeholder="Your email" /&gt;<br />
                      &nbsp;&nbsp;&lt;input type="hidden" name="source" value="website" /&gt;<br />
                      &nbsp;&nbsp;&lt;button type="submit"&gt;Subscribe&lt;/button&gt;<br />
                      &lt;/form&gt;
                    </div>
                    <Button variant="outline" size="sm">Copy Code</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Popup Form</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add a popup subscription form to your website.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md text-xs font-mono mb-4 overflow-x-auto">
                      &lt;script src="https://api.cilsprep.com/subscribe-popup.js"<br />
                      &nbsp;&nbsp;data-delay="5000"<br />
                      &nbsp;&nbsp;data-title="Get Italian Citizenship Tips"<br />
                      &nbsp;&nbsp;data-source="popup"&gt;<br />
                      &lt;/script&gt;
                    </div>
                    <Button variant="outline" size="sm">Copy Code</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Autoblog tab */}
          <TabsContent value="autoblog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Autoblog Configuration</CardTitle>
                <CardDescription>Set up your automated blog and newsletter content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Content Creation</Label>
                      <p className="text-sm text-muted-foreground">
                        Generate blog posts from curated Italian citizenship and language content
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send to Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically include new blog posts in your newsletter
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Social Media Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically share new posts on connected social media accounts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Publishing Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select publishing frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Content Categories</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="category-citizenship" className="rounded" defaultChecked />
                        <label htmlFor="category-citizenship">Italian Citizenship</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="category-language" className="rounded" defaultChecked />
                        <label htmlFor="category-language">Language Learning</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="category-culture" className="rounded" defaultChecked />
                        <label htmlFor="category-culture">Italian Culture</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="category-exam" className="rounded" defaultChecked />
                        <label htmlFor="category-exam">CILS Exam Preparation</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="category-legal" className="rounded" defaultChecked />
                        <label htmlFor="category-legal">Legal Updates</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="category-tips" className="rounded" defaultChecked />
                        <label htmlFor="category-tips">Study Tips & Tricks</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Content Sources</Label>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Italian Government Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Official updates from Italian government sources
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Language Learning Resources</p>
                          <p className="text-sm text-muted-foreground">
                            Curated Italian language learning content
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Citizenship News</p>
                          <p className="text-sm text-muted-foreground">
                            News and updates about Italian citizenship process
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Student Success Stories</p>
                          <p className="text-sm text-muted-foreground">
                            Stories from successful CILS exam takers
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>AI Content Enhancement</Label>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Language Optimization</p>
                          <p className="text-sm text-muted-foreground">
                            Improve readability and clarity using AI
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SEO Enhancement</p>
                          <p className="text-sm text-muted-foreground">
                            Optimize content for search engines
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Content Personalization</p>
                          <p className="text-sm text-muted-foreground">
                            Tailor content based on subscriber interests
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAutoblogSave}>Save Configuration</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Scheduled and published autoblog content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Title</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Newsletter</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {autoblogContent.map(content => (
                        <tr key={content.id} className="border-b">
                          <td className="py-3 px-4">{content.title}</td>
                          <td className="py-3 px-4">{content.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              content.status === 'published' ? 'bg-green-100 text-green-700' :
                              content.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {content.publishDate ? new Date(content.publishDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {content.newsletter ? (
                              <span className="text-green-600">Yes</span>
                            ) : (
                              <span className="text-gray-500">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Create Content</Button>
                <Button variant="outline">View Calendar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Settings tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure your newsletter email settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-name">From Name</Label>
                      <Input id="from-name" defaultValue="CILS Italian Citizenship Prep" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input id="from-email" defaultValue="newsletter@cilsprep.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reply-to">Reply-To Email</Label>
                      <Input id="reply-to" defaultValue="support@cilsprep.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-provider">Email Provider</Label>
                      <Select defaultValue="sendgrid">
                        <SelectTrigger id="email-provider">
                          <SelectValue placeholder="Select email provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailchimp">Mailchimp</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email Authentication</Label>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SPF Record</p>
                          <p className="text-sm text-muted-foreground">
                            Sender Policy Framework verification
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Verified</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">DKIM</p>
                          <p className="text-sm text-muted-foreground">
                            DomainKeys Identified Mail
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Verified</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">DMARC</p>
                          <p className="text-sm text-muted-foreground">
                            Domain-based Message Authentication
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Verified</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Compliance</Label>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Include Unsubscribe Link</p>
                          <p className="text-sm text-muted-foreground">
                            Required by anti-spam regulations
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Physical Address</p>
                          <p className="text-sm text-muted-foreground">
                            Include business address in footer
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">GDPR Compliance</p>
                          <p className="text-sm text-muted-foreground">
                            Enhanced EU privacy controls
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Preferences</CardTitle>
                <CardDescription>Default settings for newsletter campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-template">Default Template</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="default-template">
                        <SelectValue placeholder="Select default template" />
                      </SelectTrigger>
                      <SelectContent>
                        {newsletterTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="send-time">Preferred Send Time</Label>
                    <Select defaultValue="morning">
                      <SelectTrigger id="send-time">
                        <SelectValue placeholder="Select send time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8-10 AM)</SelectItem>
                        <SelectItem value="midday">Midday (11 AM-1 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2-5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6-8 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Sending Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="day-of-week">Day of Week</Label>
                    <Select defaultValue="tuesday">
                      <SelectTrigger id="day-of-week">
                        <SelectValue placeholder="Select day of week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Content Preferences</Label>
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Include Social Links</p>
                        <p className="text-sm text-muted-foreground">
                          Add social media links to the footer
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Personalize Greetings</p>
                        <p className="text-sm text-muted-foreground">
                          Address subscribers by their name
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Include Latest Blog Posts</p>
                        <p className="text-sm text-muted-foreground">
                          Add recent blog posts to newsletters
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Track Link Clicks</p>
                        <p className="text-sm text-muted-foreground">
                          Monitor which links subscribers click
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default NewsletterManagement;
