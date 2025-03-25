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
        variant: "success",
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
            <Badge variant="secondary" className="px-3 py-1">
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
                      className="min-h-[80px]"
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
                    className="min-h-[60px]"
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
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="og-image">OG Image URL</Label>
                    <Input 
                      id="og-image" 
                      placeholder="Enter Open Graph image URL" 
                      value={metadata.ogImage}
                      onChange={(e) => setMetadata({...metadata, ogImage: e.target.value})}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium mb-3">Twitter Card Tags</h3>
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
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="twitter-image">Twitter Image URL</Label>
                    <Input 
                      id="twitter-image" 
                      placeholder="Enter Twitter image URL" 
                      value={metadata.twitterImage}
                      onChange={(e) => setMetadata({...metadata, twitterImage: e.target.value})}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium mb-3">Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="structured-data">Structured Data (JSON-LD)</Label>
                    <Textarea 
                      id="structured-data" 
                      placeholder="Enter JSON-LD structured data" 
                      value={metadata.structuredData}
                      onChange={(e) => setMetadata({...metadata, structuredData: e.target.value})}
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline">Preview</Button>
                <Button onClick={handleSaveMetadata} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SEO Issues</CardTitle>
                <CardDescription>
                  Pages with SEO issues that need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {seoIssues.length > 0 ? (
                  <div className="space-y-3">
                    {seoIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div>
                            <AlertCircle className={
                              issue.severity === 'high' ? 'text-red-500 h-5 w-5' : 
                              issue.severity === 'medium' ? 'text-amber-500 h-5 w-5' : 
                              'text-blue-500 h-5 w-5'
                            } />
                          </div>
                          <div>
                            <p className="font-medium">{issue.page}</p>
                            <p className="text-sm text-muted-foreground">{issue.issue}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleFixIssue(issue.id)}>
                          Fix Issue
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                    <h3 className="text-xl font-medium">No SEO Issues Found</h3>
                    <p className="text-muted-foreground mt-1">
                      All your pages comply with SEO best practices
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sitemap Tab */}
          <TabsContent value="sitemap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Configuration</CardTitle>
                <CardDescription>
                  Configure your sitemap settings and generation options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-generate">Auto-generate Sitemap</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate sitemap when content changes
                    </p>
                  </div>
                  <Switch 
                    id="auto-generate"
                    checked={sitemapSettings.autoGenerate}
                    onCheckedChange={(checked) => setSitemapSettings({...sitemapSettings, autoGenerate: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-images">Include Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Add image metadata to the sitemap
                    </p>
                  </div>
                  <Switch 
                    id="include-images"
                    checked={sitemapSettings.includeImages}
                    onCheckedChange={(e) => setSitemapSettings({...sitemapSettings, includeImages: e.target.checked})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="change-frequency">Default Change Frequency</Label>
                    <Select 
                      value={sitemapSettings.changeFrequency}
                      onValueChange={(value) => setSitemapSettings({...sitemapSettings, changeFrequency: value})}
                    >
                      <SelectTrigger id="change-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Always</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="priority">Default Priority</Label>
                    <Select 
                      value={sitemapSettings.priority.toString()}
                      onValueChange={(value) => setSitemapSettings({...sitemapSettings, priority: parseFloat(value)})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                        <SelectItem value="0.9">0.9</SelectItem>
                        <SelectItem value="0.8">0.8</SelectItem>
                        <SelectItem value="0.7">0.7</SelectItem>
                        <SelectItem value="0.6">0.6</SelectItem>
                        <SelectItem value="0.5">0.5 (Medium)</SelectItem>
                        <SelectItem value="0.4">0.4</SelectItem>
                        <SelectItem value="0.3">0.3</SelectItem>
                        <SelectItem value="0.2">0.2</SelectItem>
                        <SelectItem value="0.1">0.1 (Lowest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="excluded-paths">Excluded Paths</Label>
                    <Textarea 
                      id="excluded-paths" 
                      placeholder="Enter paths to exclude (one per line or comma separated)" 
                      value={sitemapSettings.excludedPaths}
                      onChange={(e) => setSitemapSettings({...sitemapSettings, excludedPaths: e.target.value})}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Supports wildcards: /admin/*, /api/*, etc.
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sitemap Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Last generated: {sitemapSettings.lastGenerated}
                      </p>
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline" onClick={handleGenerateSitemap} disabled={saving}>
                        Regenerate Now
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Submit to Search Engines
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSitemap} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Tracking</CardTitle>
                <CardDescription>
                  Connect your site to analytics and webmaster tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Google Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Track user activity and conversions
                      </p>
                    </div>
                    <Switch 
                      checked={analyticsConnections.googleAnalytics}
                      onCheckedChange={(checked) => setAnalyticsConnections({...analyticsConnections, googleAnalytics: checked})}
                    />
                  </div>
                  
                  {analyticsConnections.googleAnalytics && (
                    <div className="ml-6 space-y-3">
                      <Label htmlFor="ga-tracking-id">Tracking ID</Label>
                      <Input 
                        id="ga-tracking-id" 
                        placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" 
                        value={analyticsConnections.gaTrackingId}
                        onChange={(e) => setAnalyticsConnections({...analyticsConnections, gaTrackingId: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Google Search Console</Label>
                      <p className="text-sm text-muted-foreground">
                        Verify site ownership and track search performance
                      </p>
                    </div>
                    <Switch 
                      checked={analyticsConnections.googleSearchConsole}
                      onCheckedChange={(checked) => setAnalyticsConnections({...analyticsConnections, googleSearchConsole: checked})}
                    />
                  </div>
                  
                  {analyticsConnections.googleSearchConsole && (
                    <div className="ml-6 space-y-3">
                      <Label htmlFor="gsc-verification">Verification Code</Label>
                      <Input 
                        id="gsc-verification" 
                        placeholder="Enter Google verification code" 
                        value={analyticsConnections.gscVerification}
                        onChange={(e) => setAnalyticsConnections({...analyticsConnections, gscVerification: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Bing Webmaster Tools</Label>
                      <p className="text-sm text-muted-foreground">
                        Track performance in Bing and Microsoft search engines
                      </p>
                    </div>
                    <Switch 
                      checked={analyticsConnections.bingWebmaster}
                      onCheckedChange={(checked) => setAnalyticsConnections({...analyticsConnections, bingWebmaster: checked})}
                    />
                  </div>
                  
                  {analyticsConnections.bingWebmaster && (
                    <div className="ml-6 space-y-3">
                      <Label htmlFor="bing-verification">Verification Code</Label>
                      <Input 
                        id="bing-verification" 
                        placeholder="Enter Bing verification code" 
                        value={analyticsConnections.bingVerification}
                        onChange={(e) => setAnalyticsConnections({...analyticsConnections, bingVerification: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Facebook Pixel</Label>
                      <p className="text-sm text-muted-foreground">
                        Track conversions and retarget visitors from Facebook
                      </p>
                    </div>
                    <Switch 
                      checked={analyticsConnections.facebookPixel}
                      onCheckedChange={(checked) => setAnalyticsConnections({...analyticsConnections, facebookPixel: checked})}
                    />
                  </div>
                  
                  {analyticsConnections.facebookPixel && (
                    <div className="ml-6 space-y-3">
                      <Label htmlFor="fb-pixel-id">Pixel ID</Label>
                      <Input 
                        id="fb-pixel-id" 
                        placeholder="Enter Facebook Pixel ID" 
                        value={analyticsConnections.fbPixelId}
                        onChange={(e) => setAnalyticsConnections({...analyticsConnections, fbPixelId: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label htmlFor="custom-scripts">Custom Head Scripts</Label>
                  <Textarea 
                    id="custom-scripts" 
                    placeholder="Enter custom tracking or analytics code" 
                    value={analyticsConnections.customHeadScripts}
                    onChange={(e) => setAnalyticsConnections({...analyticsConnections, customHeadScripts: e.target.value})}
                    className="min-h-[150px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Code will be inserted into the head section of all pages
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveAnalytics} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Optimization</CardTitle>
                <CardDescription>
                  Configure settings to improve site speed and SEO ranking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="lazy-loading">Lazy Loading Images</Label>
                        <p className="text-sm text-muted-foreground">
                          Only load images when they enter viewport
                        </p>
                      </div>
                      <Switch 
                        id="lazy-loading"
                        checked={performanceMetrics.enableLazyLoading}
                        onCheckedChange={(checked) => setPerformanceMetrics({...performanceMetrics, enableLazyLoading: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="minify-assets">Minify CSS & JavaScript</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce file sizes for faster loading
                        </p>
                      </div>
                      <Switch 
                        id="minify-assets"
                        checked={performanceMetrics.minifyAssets}
                        onCheckedChange={(checked) => setPerformanceMetrics({...performanceMetrics, minifyAssets: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="use-webp">Use WebP Images</Label>
                        <p className="text-sm text-muted-foreground">
                          Convert images to WebP format for better compression
                        </p>
                      </div>
                      <Switch 
                        id="use-webp"
                        checked={performanceMetrics.useWebP}
                        onCheckedChange={(checked) => setPerformanceMetrics({...performanceMetrics, useWebP: checked})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="preload-assets">Preload Critical Assets</Label>
                        <p className="text-sm text-muted-foreground">
                          Prioritize loading of critical resources
                        </p>
                      </div>
                      <Switch 
                        id="preload-assets"
                        checked={performanceMetrics.preloadCriticalAssets}
                        onCheckedChange={(checked) => setPerformanceMetrics({...performanceMetrics, preloadCriticalAssets: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="defer-js">Defer Non-Critical JavaScript</Label>
                        <p className="text-sm text-muted-foreground">
                          Load non-essential scripts after page render
                        </p>
                      </div>
                      <Switch 
                        id="defer-js"
                        checked={performanceMetrics.deferNonCriticalJS}
                        onCheckedChange={(checked) => setPerformanceMetrics({...performanceMetrics, deferNonCriticalJS: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="use-cdn">Use CDN for Assets</Label>
                        <p className="text-sm text-muted-foreground">
                          Deliver assets from a global content delivery network
                        </p>
                      </div>
                      <Switch 
                        id="use-cdn"
                        checked={performanceMetrics.useCDN}
                        onCheckedChange={(checked) => setPerformanceMetrics({...performanceMetrics, useCDN: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                {performanceMetrics.useCDN && (
                  <div className="space-y-3 pt-4">
                    <Label htmlFor="cdn-url">CDN URL</Label>
                    <Input 
                      id="cdn-url" 
                      placeholder="Enter CDN base URL" 
                      value={performanceMetrics.cdnUrl}
                      onChange={(e) => setPerformanceMetrics({...performanceMetrics, cdnUrl: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: https://cdn.yourdomain.com or https://d1a2b3c4d5e6f7.cloudfront.net
                    </p>
                  </div>
                )}
                
                <div className="bg-muted p-4 rounded-md mt-6">
                  <h3 className="font-medium mb-2">Performance Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Mobile Page Speed</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">75/100</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Desktop Page Speed</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">92/100</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Core Web Vitals</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">68/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full">Run Performance Audit</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSavePerformance} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SEOManager;
