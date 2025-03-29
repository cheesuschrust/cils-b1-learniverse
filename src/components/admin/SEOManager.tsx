import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Check, Globe, Search, Share2, BarChart2, TrendingUp, FileText, RefreshCw, ArrowUpRight, Tag, Edit, Trash } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ExtendedAlertVariant } from '@/types/variant-fixes';

/**
 * SEO Manager Component
 * 
 * Provides comprehensive SEO management capabilities for site administrators.
 * Features include metadata management, sitemap configuration, analytics integration,
 * and performance monitoring.
 */
const SEOManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('metadata');
  const [saving, setSaving] = useState(false);
  
  // SEO metadata state
  const [metadata, setMetadata] = useState({
    title: 'Italian Language Learning Platform | CILS B2 Cittadinanza',
    description: 'Master Italian language with our comprehensive learning platform. Prepare for CILS B2 Cittadinanza exams with interactive lessons, practice tests, and AI-powered assistance.',
    keywords: 'Italian language learning, CILS B2, Italian citizenship, language exams, Italian practice',
    ogTitle: 'Learn Italian Online | CILS B2 Preparation',
    ogDescription: 'The most effective way to learn Italian and prepare for your citizenship exam.',
    ogImage: '/assets/og-image.jpg',
    twitterTitle: 'Italian Language Learning Platform',
    twitterDescription: 'Master Italian with our interactive platform designed for CILS B2 preparation.',
    twitterImage: '/assets/twitter-card.jpg',
    canonicalUrl: 'https://example.com',
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/',
    structuredData: '{\n  "@context": "https://schema.org",\n  "@type": "EducationalOrganization",\n  "name": "CILS B2 Cittadinanza",\n  "description": "Italian language learning platform"\n}'
  });
  
  // Sitemap settings
  const [sitemapSettings, setSitemapSettings] = useState({
    autoGenerate: true,
    includeImages: true,
    changeFrequency: 'weekly',
    priority: 0.7,
    lastGenerated: '2023-12-15',
    excludedPaths: '/admin/*, /api/*, /internal/*'
  });
  
  // Analytics connections
  const [analyticsConnections, setAnalyticsConnections] = useState({
    googleAnalytics: true,
    gaTrackingId: 'UA-123456789-1',
    googleSearchConsole: true,
    gscVerification: 'abc123def456',
    bingWebmaster: false,
    bingVerification: '',
    facebookPixel: true,
    fbPixelId: '987654321',
    customHeadScripts: '<!-- Custom tracking code here -->'
  });
  
  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    enableLazyLoading: true,
    minifyAssets: true,
    useWebP: true,
    preloadCriticalAssets: true,
    deferNonCriticalJS: true,
    useCDN: true,
    cdnUrl: 'https://cdn.example.com'
  });
  
  // Pages requiring SEO attention
  const [seoIssues, setSeoIssues] = useState([
    { id: 1, page: '/lessons', issue: 'Missing meta description', severity: 'high' },
    { id: 2, page: '/speaking', issue: 'Title too long (78 characters)', severity: 'medium' },
    { id: 3, page: '/writing', issue: 'Low word count (250 words)', severity: 'medium' },
    { id: 4, page: '/flashcards', issue: 'Missing alt text on 3 images', severity: 'high' },
    { id: 5, page: '/progress', issue: 'Duplicate H1 tags', severity: 'high' }
  ]);
  
  // Handle saving metadata
  const handleSaveMetadata = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "SEO settings saved",
        description: "Your metadata changes have been applied successfully.",
        variant: "success" as any,
      });
    }, 1000);
  };
  
  // Handle saving sitemap settings
  const handleSaveSitemap = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSitemapSettings({
        ...sitemapSettings,
        lastGenerated: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Sitemap updated",
        description: "Your sitemap has been regenerated and submitted to search engines.",
        variant: "success",
      });
    }, 1500);
  };
  
  // Handle saving analytics connections
  const handleSaveAnalytics = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Analytics connections updated",
        description: "Your tracking codes have been updated successfully.",
        variant: "success",
      });
    }, 1000);
  };
  
  // Handle saving performance settings
  const handleSavePerformance = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Performance settings saved",
        description: "Your performance optimizations have been applied.",
        variant: "success",
      });
    }, 1200);
  };
  
  // Generate sitemap
  const handleGenerateSitemap = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSitemapSettings({
        ...sitemapSettings,
        lastGenerated: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Sitemap generated",
        description: "New sitemap has been created and deployed to the server.",
        variant: "success",
      });
    }, 2000);
  };
  
  // Fix SEO issue
  const handleFixIssue = (id: number) => {
    // Filter out the fixed issue
    setSeoIssues(seoIssues.filter(issue => issue.id !== id));
    
    toast({
      title: "Issue fixed",
      description: "The SEO issue has been resolved successfully.",
      variant: "success",
    });
  };
  
  // Get status variant - fix the type by using the ExtendedAlertVariant
  const getStatusVariant = (status: string): ExtendedAlertVariant => {
    switch (status) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'secondary';
    }
  };
  
  return (
    <>
      <Helmet>
        <title>SEO Management - Admin</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">SEO Management</h1>
            <p className="text-muted-foreground mt-1">
              Configure and optimize your site's search engine visibility
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="px-3 py-1">
              <Globe className="h-4 w-4 mr-1" />
              Last Crawled: 2 days ago
            </Badge>
            <Button variant="outline" className="flex gap-2">
              <Search className="h-4 w-4" />
              Test Search Preview
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4 w-full">
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Page Metadata</CardTitle>
                <CardDescription>
                  Configure the metadata that search engines and social media platforms use to display your site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="meta-title">Page Title</Label>
                    <Input 
                      id="meta-title" 
                      placeholder="Enter page title" 
                      value={metadata.title}
                      onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      {metadata.title.length}/60 characters (Recommended: 50-60)
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea 
                      id="meta-description" 
                      placeholder="Enter meta description" 
                      value={metadata.description}
                      onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                      className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {metadata.description.length}/160 characters (Recommended: 140-160)
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="meta-keywords">Meta Keywords</Label>
                  <Textarea 
                    id="meta-keywords" 
                    placeholder="Enter keywords separated by commas" 
                    value={metadata.keywords}
                    onChange={(e) => setMetadata({...metadata, keywords: e.target.value})}
                    className="min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium mb-3">Open Graph Tags</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="og-title">OG Title</Label>
                    <Input 
                      id="og-title" 
                      placeholder="Enter Open Graph title" 
                      value={metadata.ogTitle}
                      onChange={(e) => setMetadata({...metadata, ogTitle: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="og-description">OG Description</Label>
                    <Textarea 
                      id="og-description" 
                      placeholder="Enter Open Graph description" 
                      value={metadata.ogDescription}
                      onChange={(e) => setMetadata({...metadata, ogDescription: e.target.value})}
                      className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="og-image">OG Image</Label>
                  <Input 
                    id="og-image" 
                    placeholder="Enter Open Graph image URL" 
                    value={metadata.ogImage}
                    onChange={(e) => setMetadata({...metadata, ogImage: e.target.value})}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium mb-3">Twitter Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="twitter-title">Twitter Title</Label>
                    <Input 
                      id="twitter-title" 
                      placeholder="Enter Twitter title" 
                      value={metadata.twitterTitle}
                      onChange={(e) => setMetadata({...metadata, twitterTitle: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="twitter-description">Twitter Description</Label>
                    <Textarea 
                      id="twitter-description" 
                      placeholder="Enter Twitter description" 
                      value={metadata.twitterDescription}
                      onChange={(e) => setMetadata({...metadata, twitterDescription: e.target.value})}
                      className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="twitter-image">Twitter Image</Label>
                  <Input 
                    id="twitter-image" 
                    placeholder="Enter Twitter image URL" 
                    value={metadata.twitterImage}
                    onChange={(e) => setMetadata({...metadata, twitterImage: e.target.value})}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium mb-3">Additional Settings</h3>
                <div className="space-y-3">
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <Input 
                    id="canonical-url" 
                    placeholder="Enter canonical URL" 
                    value={metadata.canonicalUrl}
                    onChange={(e) => setMetadata({...metadata, canonicalUrl: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="robots-txt">robots.txt Content</Label>
                  <Textarea 
                    id="robots-txt" 
                    placeholder="Enter robots.txt content" 
                    value={metadata.robotsTxt}
                    onChange={(e) => setMetadata({...metadata, robotsTxt: e.target.value})}
                    className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="structured-data">Structured Data (JSON-LD)</Label>
                  <Textarea 
                    id="structured-data" 
                    placeholder="Enter JSON-LD structured data" 
                    value={metadata.structuredData}
                    onChange={(e) => setMetadata({...metadata, structuredData: e.target.value})}
                    className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button onClick={handleSaveMetadata} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Metadata'
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          {/* Sitemap Tab */}
          <TabsContent value="sitemap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Configuration</CardTitle>
                <CardDescription>
                  Manage your sitemap.xml generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Sitemap Status</h3>
                    <p className="text-sm text-muted-foreground">
                      Last generated: {sitemapSettings.lastGenerated}
                    </p>
                  </div>
                  <Button 
                    onClick={handleGenerateSitemap} 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Sitemap
                      </>
                    )}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-generate"
                      checked={sitemapSettings.autoGenerate}
                      onCheckedChange={(checked) => 
                        setSitemapSettings({...sitemapSettings, autoGenerate: checked})
                      }
                    />
                    <Label htmlFor="auto-generate">Auto-generate sitemap on content updates</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-images"
                      checked={sitemapSettings.includeImages}
                      onCheckedChange={(checked) => 
                        setSitemapSettings({...sitemapSettings, includeImages: checked})
                      }
                    />
                    <Label htmlFor="include-images">Include image information in sitemap</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="change-frequency">Change Frequency</Label>
                    <Input 
                      id="change-frequency"
                      value={sitemapSettings.changeFrequency}
                      onChange={(e) => 
                        setSitemapSettings({...sitemapSettings, changeFrequency: e.target.value})
                      }
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="priority">Priority</Label>
                    <Input 
                      id="priority"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={sitemapSettings.priority}
                      onChange={(e) => 
                        setSitemapSettings({...sitemapSettings, priority: parseFloat(e.target.value)})
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="excluded-paths">Excluded Paths</Label>
                  <Input 
                    id="excluded-paths"
                    placeholder="e.g., /admin/*, /api/*"
                    value={sitemapSettings.excludedPaths}
                    onChange={(e) => 
                      setSitemapSettings({...sitemapSettings, excludedPaths: e.target.value})
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter paths to exclude from sitemap, separated by commas. Wildcards (*) are supported.
                  </p>
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button onClick={handleSaveSitemap} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Sitemap Settings'
                  )}
                </Button>
              </div>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SEO Issues</CardTitle>
                <CardDescription>
                  Pages that require attention to improve SEO rankings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seoIssues.length > 0 ? (
                        seoIssues.map((issue) => (
                          <TableRow key={issue.id}>
                            <TableCell className="font-medium">
                              <a href={issue.page} className="flex items-center hover:underline">
                                {issue.page}
                                <ArrowUpRight className="h-3 w-3 ml-1 text-muted-foreground" />
                              </a>
                            </TableCell>
                            <TableCell>{issue.issue}</TableCell>
                            <TableCell>
                              <Badge variant={
                                issue.severity === 'high' ? 'destructive' : 
                                issue.severity === 'medium' ? 'warning' : 
                                'secondary'
                              }>
                                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleFixIssue(issue.id)}
                              >
                                Fix Issue
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center space-y-1">
                              <Check className="h-8 w-8 text-green-500"/>
                              <p className="text-sm text-muted-foreground">No SEO issues found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Integration</CardTitle>
                <CardDescription>
                  Connect your site with analytics and tracking services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Google Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                          Track visitor behavior and site performance
                        </p>
                      </div>
                      <Switch
                        checked={analyticsConnections.googleAnalytics}
                        onCheckedChange={(checked) => 
                          setAnalyticsConnections({...analyticsConnections, googleAnalytics: checked})
                        }
                      />
                    </div>
                    
                    {analyticsConnections.googleAnalytics && (
                      <div className="space-y-3 pt-2">
                        <Label htmlFor="ga-tracking-id">Tracking ID</Label>
                        <Input 
                          id="ga-tracking-id"
                          placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                          value={analyticsConnections.gaTrackingId}
                          onChange={(e) => 
                            setAnalyticsConnections({...analyticsConnections, gaTrackingId: e.target.value})
                          }
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Google Search Console</h3>
                        <p className="text-sm text-muted-foreground">
                          Monitor and optimize your site's presence in search results
                        </p>
                      </div>
                      <Switch
                        checked={analyticsConnections.googleSearchConsole}
                        onCheckedChange={(checked) => 
                          setAnalyticsConnections({...analyticsConnections, googleSearchConsole: checked})
                        }
                      />
                    </div>
                    
                    {analyticsConnections.googleSearchConsole && (
                      <div className="space-y-3 pt-2">
                        <Label htmlFor="gsc-verification">Verification Code</Label>
                        <Input 
                          id="gsc-verification"
                          placeholder="meta tag content value"
                          value={analyticsConnections.gscVerification}
                          onChange={(e) => 
                            setAnalyticsConnections({...analyticsConnections, gscVerification: e.target.value})
                          }
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Bing Webmaster Tools</h3>
                        <p className="text-sm text-muted-foreground">
                          Optimize for Bing and other Microsoft search engines
                        </p>
                      </div>
                      <Switch
                        checked={analyticsConnections.bingWebmaster}
                        onCheckedChange={(checked) => 
                          setAnalyticsConnections({...analyticsConnections, bingWebmaster: checked})
                        }
                      />
                    </div>
                    
                    {analyticsConnections.bingWebmaster && (
                      <div className="space-y-3 pt-2">
                        <Label htmlFor="bing-verification">Verification Code</Label>
                        <Input 
                          id="bing-verification"
                          placeholder="meta tag content value"
                          value={analyticsConnections.bingVerification}
                          onChange={(e) => 
                            setAnalyticsConnections({...analyticsConnections, bingVerification: e.target.value})
                          }
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Facebook Pixel</h3>
                        <p className="text-sm text-muted-foreground">
                          Track conversions from Facebook ads and optimize for specific events
                        </p>
                      </div>
                      <Switch
                        checked={analyticsConnections.facebookPixel}
                        onCheckedChange={(checked) => 
                          setAnalyticsConnections({...analyticsConnections, facebookPixel: checked})
                        }
                      />
                    </div>
                    
                    {analyticsConnections.facebookPixel && (
                      <div className="space-y-3 pt-2">
                        <Label htmlFor="fb-pixel-id">Pixel ID</Label>
                        <Input 
                          id="fb-pixel-id"
                          placeholder="XXXXXXXXXX"
                          value={analyticsConnections.fbPixelId}
                          onChange={(e) => 
                            setAnalyticsConnections({...analyticsConnections, fbPixelId: e.target.value})
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="custom-scripts">Custom Head Scripts</Label>
                  <Textarea 
                    id="custom-scripts" 
                    placeholder="<!-- Custom tracking code -->" 
                    value={analyticsConnections.customHeadScripts}
                    onChange={(e) => 
                      setAnalyticsConnections({...analyticsConnections, customHeadScripts: e.target.value})
                    }
                    className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Additional tracking or analytics scripts to be inserted in the head section of your pages.
                  </p>
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button onClick={handleSaveAnalytics} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Analytics Settings'
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Optimization</CardTitle>
                <CardDescription>
                  Configure settings to improve your site's loading speed and SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Asset Optimization</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="lazy-loading"
                        checked={performanceMetrics.enableLazyLoading}
                        onCheckedChange={(checked) => 
                          setPerformanceMetrics({...performanceMetrics, enableLazyLoading: checked})
                        }
                      />
                      <Label htmlFor="lazy-loading">Enable lazy loading for images</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="minify-assets"
                        checked={performanceMetrics.minifyAssets}
                        onCheckedChange={(checked) => 
                          setPerformanceMetrics({...performanceMetrics, minifyAssets: checked})
                        }
                      />
                      <Label htmlFor="minify-assets">Minify CSS and JavaScript assets</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-webp"
                        checked={performanceMetrics.useWebP}
                        onCheckedChange={(checked) => 
                          setPerformanceMetrics({...performanceMetrics, useWebP: checked})
                        }
                      />
                      <Label htmlFor="use-webp">Use WebP image format when supported</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Loading Optimization</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preload-critical"
                        checked={performanceMetrics.preloadCriticalAssets}
                        onCheckedChange={(checked) => 
                          setPerformanceMetrics({...performanceMetrics, preloadCriticalAssets: checked})
                        }
                      />
                      <Label htmlFor="preload-critical">Preload critical assets</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="defer-js"
                        checked={performanceMetrics.deferNonCriticalJS}
                        onCheckedChange={(checked) => 
                          setPerformanceMetrics({...performanceMetrics, deferNonCriticalJS: checked})
                        }
                      />
                      <Label htmlFor="defer-js">Defer non-critical JavaScript</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-cdn"
                        checked={performanceMetrics.useCDN}
                        onCheckedChange={(checked) => 
                          setPerformanceMetrics({...performanceMetrics, useCDN: checked})
                        }
                      />
                      <Label htmlFor="use-cdn">Use CDN for static assets</Label>
                    </div>
                    
                    {performanceMetrics.useCDN && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="cdn-url">CDN URL</Label>
                        <Input 
                          id="cdn-url"
                          placeholder="https://cdn.example.com"
                          value={performanceMetrics.cdnUrl}
                          onChange={(e) => 
                            setPerformanceMetrics({...performanceMetrics, cdnUrl: e.target.value})
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Core Web Vitals</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Current performance scores based on Lighthouse analysis
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Largest Contentful Paint (LCP)</Label>
                        <span className="text-green-500 font-medium">2.1s</span>
                      </div>
                      <Progress value={85} className="bg-slate-200 h-2" indicatorClassName="bg-green-500" />
                      <p className="text-xs text-muted-foreground">Good: Under 2.5s</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>First Input Delay (FID)</Label>
                        <span className="text-green-500 font-medium">16ms</span>
                      </div>
                      <Progress value={95} className="bg-slate-200 h-2" indicatorClassName="bg-green-500" />
                      <p className="text-xs text-muted-foreground">Good: Under 100ms</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Cumulative Layout Shift (CLS)</Label>
                        <span className="text-amber-500 font-medium">0.17</span>
                      </div>
                      <Progress value={65} className="bg-slate-200 h-2" indicatorClassName="bg-amber-500" />
                      <p className="text-xs text-muted-foreground">Needs Improvement: Under 0.1 is good</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button onClick={handleSavePerformance} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Performance Settings'
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SEOManager;
