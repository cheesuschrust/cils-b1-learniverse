
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { SEOConfiguration } from '@/contexts/shared-types';
import { API } from '@/services/api';
import { Search, Globe, FileBadge, Code, BarChart4, RefreshCw } from 'lucide-react';

const SEOSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [seoConfig, setSeoConfig] = useState<SEOConfiguration>({
    defaultTitle: 'Italian Language Learning Platform',
    defaultDescription: 'Learn Italian with interactive lessons, quizzes, and exercises.',
    defaultKeywords: ['italian', 'language', 'learning', 'lessons', 'vocabulary', 'grammar'],
    siteMap: {
      enabled: true,
      lastGenerated: new Date().toISOString(),
    },
    robotsTxt: {
      enabled: true,
      content: 'User-agent: *\nAllow: /'
    },
    analytics: {
      provider: 'google',
      trackingId: 'G-EXAMPLE123',
      enabled: true
    }
  });

  useEffect(() => {
    const fetchSEOSettings = async () => {
      setIsLoading(true);
      try {
        const response = await API.handleRequest<SEOConfiguration>('/admin/seo/settings', 'GET');
        setSeoConfig(response);
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
        toast({
          title: 'Failed to load SEO settings',
          description: 'There was an error loading the SEO configuration.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSEOSettings();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean);
    setSeoConfig(prev => ({ ...prev, defaultKeywords: keywords }));
  };

  const handleToggleChange = (field: string) => (checked: boolean) => {
    if (field === 'siteMap.enabled') {
      setSeoConfig(prev => ({ 
        ...prev, 
        siteMap: { ...prev.siteMap, enabled: checked } 
      }));
    } else if (field === 'robotsTxt.enabled') {
      setSeoConfig(prev => ({ 
        ...prev, 
        robotsTxt: { ...prev.robotsTxt, enabled: checked } 
      }));
    } else if (field === 'analytics.enabled') {
      setSeoConfig(prev => ({ 
        ...prev, 
        analytics: { ...prev.analytics, enabled: checked } 
      }));
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await API.handleRequest<SEOConfiguration>('/admin/seo/settings', 'PUT', seoConfig);
      toast({
        title: 'SEO settings saved',
        description: 'Your SEO configuration has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast({
        title: 'Failed to save settings',
        description: 'There was an error updating the SEO configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSitemap = async () => {
    setIsLoading(true);
    try {
      await API.handleRequest('/admin/seo/generate-sitemap', 'POST');
      setSeoConfig(prev => ({
        ...prev,
        siteMap: {
          ...prev.siteMap,
          lastGenerated: new Date().toISOString()
        }
      }));
      toast({
        title: 'Sitemap generated',
        description: 'The sitemap has been generated successfully.',
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: 'Failed to generate sitemap',
        description: 'There was an error generating the sitemap.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SEO Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Sitemap
          </TabsTrigger>
          <TabsTrigger value="robots" className="flex items-center gap-2">
            <FileBadge className="h-4 w-4" />
            Robots.txt
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General SEO Settings</CardTitle>
              <CardDescription>
                Configure the default SEO settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultTitle">Default Title</Label>
                <Input 
                  id="defaultTitle"
                  name="defaultTitle"
                  value={seoConfig.defaultTitle}
                  onChange={handleInputChange}
                  placeholder="Enter default page title"
                />
                <p className="text-sm text-muted-foreground">
                  This will be used when no specific title is provided
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultDescription">Default Meta Description</Label>
                <Textarea 
                  id="defaultDescription"
                  name="defaultDescription"
                  value={seoConfig.defaultDescription}
                  onChange={handleInputChange}
                  placeholder="Enter default meta description"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Aim for 150-160 characters for optimal display in search results
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultKeywords">Default Keywords</Label>
                <Textarea 
                  id="defaultKeywords"
                  name="defaultKeywords"
                  value={seoConfig.defaultKeywords.join(', ')}
                  onChange={handleKeywordsChange}
                  placeholder="Enter keywords separated by commas"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  While less important for ranking, keywords can help with content organization
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Configuration</CardTitle>
              <CardDescription>
                Configure and generate your website's sitemap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate and serve an XML sitemap for search engines
                  </p>
                </div>
                <Switch 
                  checked={seoConfig.siteMap.enabled}
                  onCheckedChange={handleToggleChange('siteMap.enabled')}
                />
              </div>

              <div className="border rounded-md p-4 bg-muted/20">
                <p className="text-sm mb-2">
                  Last generated: {new Date(seoConfig.siteMap.lastGenerated).toLocaleString()}
                </p>
                <Button 
                  onClick={generateSitemap} 
                  disabled={isLoading || !seoConfig.siteMap.enabled}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Sitemap
                </Button>
              </div>

              <div>
                <Label className="block mb-2">Sitemap URL</Label>
                <div className="flex items-center">
                  <Input 
                    value={window.location.origin + '/sitemap.xml'} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + '/sitemap.xml');
                      toast({ title: 'URL copied to clipboard' });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="robots">
          <Card>
            <CardHeader>
              <CardTitle>Robots.txt Configuration</CardTitle>
              <CardDescription>
                Configure your robots.txt file to control search engine crawling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Robots.txt</Label>
                  <p className="text-sm text-muted-foreground">
                    Serve a robots.txt file to guide search engine crawlers
                  </p>
                </div>
                <Switch 
                  checked={seoConfig.robotsTxt.enabled}
                  onCheckedChange={handleToggleChange('robotsTxt.enabled')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="robotsContent">Robots.txt Content</Label>
                <Textarea 
                  id="robotsContent"
                  value={seoConfig.robotsTxt.content}
                  onChange={(e) => setSeoConfig(prev => ({ 
                    ...prev, 
                    robotsTxt: { ...prev.robotsTxt, content: e.target.value } 
                  }))}
                  placeholder="Enter robots.txt content"
                  rows={8}
                  className="font-mono text-sm"
                  disabled={!seoConfig.robotsTxt.enabled}
                />
                <p className="text-sm text-muted-foreground">
                  Standard format includes User-agent and Allow/Disallow directives
                </p>
              </div>

              <div>
                <Label className="block mb-2">Robots.txt URL</Label>
                <div className="flex items-center">
                  <Input 
                    value={window.location.origin + '/robots.txt'} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + '/robots.txt');
                      toast({ title: 'URL copied to clipboard' });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Configuration</CardTitle>
              <CardDescription>
                Configure web analytics to track user engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Track user behavior and interactions
                  </p>
                </div>
                <Switch 
                  checked={seoConfig.analytics.enabled}
                  onCheckedChange={handleToggleChange('analytics.enabled')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analyticsProvider">Analytics Provider</Label>
                <select
                  id="analyticsProvider"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={seoConfig.analytics.provider}
                  onChange={(e) => setSeoConfig(prev => ({ 
                    ...prev, 
                    analytics: { ...prev.analytics, provider: e.target.value as 'google' | 'matomo' | 'custom' } 
                  }))}
                  disabled={!seoConfig.analytics.enabled}
                >
                  <option value="google">Google Analytics</option>
                  <option value="matomo">Matomo (Piwik)</option>
                  <option value="custom">Custom Solution</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackingId">Tracking ID</Label>
                <Input 
                  id="trackingId"
                  value={seoConfig.analytics.trackingId}
                  onChange={(e) => setSeoConfig(prev => ({ 
                    ...prev, 
                    analytics: { ...prev.analytics, trackingId: e.target.value } 
                  }))}
                  placeholder={
                    seoConfig.analytics.provider === 'google' 
                      ? 'Enter Google Analytics ID (G-XXXXXXXXXX)' 
                      : seoConfig.analytics.provider === 'matomo'
                      ? 'Enter Matomo Site ID'
                      : 'Enter tracking identifier'
                  }
                  disabled={!seoConfig.analytics.enabled}
                />
                <p className="text-sm text-muted-foreground">
                  {seoConfig.analytics.provider === 'google' 
                    ? 'Your Google Analytics 4 Measurement ID (G-XXXXXXXXXX)' 
                    : seoConfig.analytics.provider === 'matomo'
                    ? 'Your Matomo Site ID and optional URL'
                    : 'Identifier for your custom analytics solution'}
                </p>
              </div>

              {seoConfig.analytics.provider === 'matomo' && (
                <div className="space-y-2">
                  <Label htmlFor="matomoUrl">Matomo URL</Label>
                  <Input 
                    id="matomoUrl"
                    placeholder="https://analytics.example.com/"
                    disabled={!seoConfig.analytics.enabled}
                  />
                </div>
              )}

              {seoConfig.analytics.provider === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customScript">Custom Tracking Script</Label>
                  <Textarea 
                    id="customScript"
                    placeholder="<!-- Paste your custom tracking script here -->"
                    rows={6}
                    className="font-mono text-sm"
                    disabled={!seoConfig.analytics.enabled}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" className="mr-2">
          Cancel
        </Button>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SEOSettings;
