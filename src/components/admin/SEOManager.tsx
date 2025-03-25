
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  ArrowUp,
  BarChart,
  Check,
  ChevronDown,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  Globe,
  MoreHorizontal,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface PageSEO {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  score: number;
  lastUpdated: Date;
  status: 'good' | 'needs-improvement' | 'poor';
  canonicalUrl?: string;
  indexable: boolean;
  ogImage?: string;
  twitterCard?: string;
  schema?: Record<string, any>;
  issues?: string[];
}

interface SiteSettings {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  sitemapEnabled: boolean;
  robotsTxtEnabled: boolean;
  structuredDataEnabled: boolean;
  analyticsEnabled: boolean;
  analyticsId?: string;
}

const SEOManager: React.FC = () => {
  const { toast } = useToast();
  
  // Site-wide SEO settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'CILS B2 Cittadinanza',
    defaultTitle: 'Learn Italian - CILS B2 Preparation App',
    defaultDescription: 'Prepare for your Italian CILS B2 exam with comprehensive lessons, flashcards, and practice exercises.',
    defaultKeywords: ['italian', 'language learning', 'cils', 'b2', 'cittadinanza', 'italian citizenship'],
    defaultOgImage: '/images/og-default.png',
    sitemapEnabled: true,
    robotsTxtEnabled: true,
    structuredDataEnabled: true,
    analyticsEnabled: true,
    analyticsId: 'G-XXXXXXXX',
  });
  
  // Individual page SEO data
  const [pages, setPages] = useState<PageSEO[]>([
    {
      id: '1',
      url: '/',
      title: 'Learn Italian - CILS B2 Preparation App',
      description: 'Prepare for your Italian CILS B2 exam with comprehensive lessons, flashcards, and practice exercises.',
      keywords: ['italian', 'language learning', 'cils', 'b2'],
      score: 92,
      lastUpdated: new Date('2023-06-15'),
      status: 'good',
      canonicalUrl: 'https://example.com/',
      indexable: true,
      ogImage: '/images/og-home.png',
      twitterCard: 'summary_large_image',
    },
    {
      id: '2',
      url: '/lessons',
      title: 'Italian Lessons - CILS B2 Preparation',
      description: 'Access comprehensive Italian lessons designed for CILS B2 preparation. Learn grammar, vocabulary, and more.',
      keywords: ['italian lessons', 'cils b2', 'grammar', 'vocabulary'],
      score: 78,
      lastUpdated: new Date('2023-05-20'),
      status: 'needs-improvement',
      canonicalUrl: 'https://example.com/lessons',
      indexable: true,
      issues: ['Missing meta description', 'Title too short'],
    },
    {
      id: '3',
      url: '/flashcards',
      title: 'Italian Flashcards - Practice Vocabulary',
      description: 'Practice Italian vocabulary with our interactive flashcards system.',
      keywords: ['flashcards', 'vocabulary', 'italian practice'],
      score: 65,
      lastUpdated: new Date('2023-04-10'),
      status: 'poor',
      indexable: true,
      issues: ['Missing og:image', 'No structured data', 'Keyword density too low'],
    },
    {
      id: '4',
      url: '/speaking',
      title: 'Italian Speaking Practice - CILS B2 Preparation',
      description: 'Improve your Italian speaking skills with our interactive exercises.',
      keywords: ['speaking', 'pronunciation', 'italian practice'],
      score: 88,
      lastUpdated: new Date('2023-06-01'),
      status: 'good',
      canonicalUrl: 'https://example.com/speaking',
      indexable: true,
    },
    {
      id: '5',
      url: '/admin',
      title: 'Admin Dashboard - CILS B2 App',
      description: 'Admin dashboard for managing CILS B2 app content and users.',
      keywords: ['admin', 'dashboard'],
      score: 55,
      lastUpdated: new Date('2023-03-15'),
      status: 'poor',
      indexable: false,
      issues: ['Page should not be indexed', 'No canonical URL'],
    },
  ]);
  
  const [selectedPage, setSelectedPage] = useState<PageSEO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPage, setEditedPage] = useState<PageSEO | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pages');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPages = pages.filter(page => 
    page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePageSelect = (page: PageSEO) => {
    setSelectedPage(page);
    setEditedPage(page);
    setIsEditing(false);
  };
  
  const handleSavePage = () => {
    if (!editedPage) return;
    
    setPages(prev => 
      prev.map(page => 
        page.id === editedPage.id ? editedPage : page
      )
    );
    
    setSelectedPage(editedPage);
    setIsEditing(false);
    
    toast({
      title: "SEO settings saved",
      description: `SEO settings for ${editedPage.url} have been updated.`,
    });
  };
  
  const handleGenerateSitemap = () => {
    setIsGenerating(true);
    
    // Simulate sitemap generation
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Sitemap generated",
        description: "sitemap.xml has been created successfully and submitted to search engines.",
      });
    }, 2000);
  };
  
  const handleGenerateRobotsTxt = () => {
    setIsGenerating(true);
    
    // Simulate robots.txt generation
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Robots.txt generated",
        description: "robots.txt has been created successfully with your specified rules.",
      });
    }, 1500);
  };
  
  const handleSaveSiteSettings = () => {
    toast({
      title: "Site settings saved",
      description: "Your SEO site settings have been updated successfully.",
    });
  };
  
  const getStatusBadge = (status: 'good' | 'needs-improvement' | 'poor') => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Good</Badge>;
      case 'needs-improvement':
        return <Badge variant="warning" className="bg-amber-500 text-white"><AlertCircle className="w-3 h-3 mr-1" /> Needs Improvement</Badge>;
      case 'poor':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" /> Poor</Badge>;
      default:
        return null;
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SEO Management</h2>
        <p className="text-muted-foreground mt-2">
          Optimize your app's visibility in search engines and improve your SEO ranking.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pages..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="shrink-0" onClick={handleGenerateSitemap} disabled={isGenerating}>
          {isGenerating ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Globe className="mr-2 h-4 w-4" />
          )}
          Generate Sitemap
        </Button>
        <Button variant="outline" className="shrink-0" onClick={handleGenerateRobotsTxt} disabled={isGenerating}>
          {isGenerating ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Generate Robots.txt
        </Button>
      </div>

      <Tabs defaultValue="pages" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pages">Page SEO</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="schema">Structured Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Pages</CardTitle>
                <CardDescription>Manage SEO for individual pages</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-1">
                    {filteredPages.map((page) => (
                      <Button
                        key={page.id}
                        variant={selectedPage?.id === page.id ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handlePageSelect(page)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="truncate flex-1 flex flex-col">
                            <span className="text-sm">{page.url}</span>
                            <span className="text-xs text-muted-foreground truncate">{page.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-bold ${getScoreColor(page.score)}`}>
                              {page.score}
                            </span>
                            {getStatusBadge(page.status)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Page SEO Details</CardTitle>
                    <CardDescription>
                      {selectedPage ? (
                        <span>Edit SEO settings for <code>{selectedPage.url}</code></span>
                      ) : (
                        <span>Select a page to view and edit SEO settings</span>
                      )}
                    </CardDescription>
                  </div>
                  
                  {selectedPage && (
                    <div className="flex space-x-2">
                      {!isEditing ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setEditedPage(selectedPage);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSavePage}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.open(`https://example.com${selectedPage?.url}`, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Page
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            if (selectedPage) {
                              navigator.clipboard.writeText(`https://example.com${selectedPage.url}`);
                              toast({
                                title: "URL copied",
                                description: "Page URL has been copied to clipboard.",
                              });
                            }
                          }}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            toast({
                              title: "Analysis started",
                              description: "SEO analysis for this page has been initiated.",
                            });
                          }}>
                            <BarChart className="h-4 w-4 mr-2" />
                            Analyze SEO
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {selectedPage ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`text-2xl font-bold ${getScoreColor(selectedPage.score)}`}>
                          {isEditing && editedPage ? editedPage.score : selectedPage.score}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          SEO Score
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <Progress 
                          value={isEditing && editedPage ? editedPage.score : selectedPage.score} 
                          className={getProgressColor(isEditing && editedPage ? editedPage.score : selectedPage.score)}
                        />
                      </div>
                      
                      <div>
                        {getStatusBadge(isEditing && editedPage ? editedPage.status : selectedPage.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Page URL</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={`https://example.com${isEditing && editedPage ? editedPage.url : selectedPage.url}`}
                            readOnly
                          />
                          <Button variant="outline" size="icon" onClick={() => {
                            navigator.clipboard.writeText(`https://example.com${selectedPage.url}`);
                            toast({
                              title: "URL copied",
                              description: "Page URL has been copied to clipboard.",
                            });
                          }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Meta Title</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={isEditing && editedPage ? editedPage.title : selectedPage.title}
                            readOnly={!isEditing}
                            onChange={(e) => editedPage && setEditedPage({...editedPage, title: e.target.value})}
                          />
                          {isEditing && (
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {editedPage ? editedPage.title.length : 0}/60
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Recommended length: 50-60 characters. Include your main keyword near the beginning.
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <div className="flex items-start space-x-2">
                          <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={isEditing && editedPage ? editedPage.description : selectedPage.description}
                            readOnly={!isEditing}
                            onChange={(e) => editedPage && setEditedPage({...editedPage, description: e.target.value})}
                          />
                          {isEditing && (
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {editedPage ? editedPage.description.length : 0}/160
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Recommended length: 150-160 characters. Include your primary keyword and a call to action.
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Keywords</Label>
                        <Input 
                          value={isEditing && editedPage ? editedPage.keywords.join(', ') : selectedPage.keywords.join(', ')}
                          readOnly={!isEditing}
                          onChange={(e) => editedPage && setEditedPage({
                            ...editedPage, 
                            keywords: e.target.value.split(',').map(k => k.trim())
                          })}
                        />
                        {isEditing && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter keywords separated by commas. Focus on relevant, targeted keywords.
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Canonical URL</Label>
                          <Input 
                            value={isEditing && editedPage ? editedPage.canonicalUrl || '' : selectedPage.canonicalUrl || ''}
                            readOnly={!isEditing}
                            onChange={(e) => editedPage && setEditedPage({...editedPage, canonicalUrl: e.target.value})}
                            placeholder="https://example.com/page"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>OG Image</Label>
                          <Input 
                            value={isEditing && editedPage ? editedPage.ogImage || '' : selectedPage.ogImage || ''}
                            readOnly={!isEditing}
                            onChange={(e) => editedPage && setEditedPage({...editedPage, ogImage: e.target.value})}
                            placeholder="/images/og-image.png"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="indexable"
                          checked={isEditing && editedPage ? editedPage.indexable : selectedPage.indexable}
                          disabled={!isEditing}
                          onCheckedChange={(checked) => editedPage && setEditedPage({...editedPage, indexable: checked})}
                        />
                        <Label htmlFor="indexable">Allow search engines to index this page</Label>
                      </div>
                    </div>
                    
                    {selectedPage.issues && selectedPage.issues.length > 0 && (
                      <div className="mt-6 border rounded-md p-4 bg-red-50">
                        <h4 className="font-medium flex items-center text-red-800">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          SEO Issues Detected
                        </h4>
                        <ul className="mt-2 space-y-1 text-sm text-red-700">
                          {selectedPage.issues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                              <X className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Select a page from the list to view and edit SEO settings
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site-wide SEO Settings</CardTitle>
              <CardDescription>
                Configure default SEO settings for your entire application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input 
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Default Title Template</Label>
                  <Input 
                    value={siteSettings.defaultTitle}
                    onChange={(e) => setSiteSettings({...siteSettings, defaultTitle: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used when a page doesn't have a specific title.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Default Meta Description</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={siteSettings.defaultDescription}
                  onChange={(e) => setSiteSettings({...siteSettings, defaultDescription: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Default description when a page doesn't have a specific one.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Default Keywords</Label>
                <Input 
                  value={siteSettings.defaultKeywords.join(', ')}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings, 
                    defaultKeywords: e.target.value.split(',').map(k => k.trim())
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Default OG Image</Label>
                <Input 
                  value={siteSettings.defaultOgImage}
                  onChange={(e) => setSiteSettings({...siteSettings, defaultOgImage: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Used for social media sharing when a page doesn't have a specific image.
                </p>
              </div>
              
              <div className="border p-4 rounded-md space-y-4">
                <h4 className="font-medium">Technical SEO</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center">
                        <Switch 
                          id="sitemap"
                          checked={siteSettings.sitemapEnabled}
                          onCheckedChange={(checked) => setSiteSettings({...siteSettings, sitemapEnabled: checked})}
                        />
                        <Label htmlFor="sitemap" className="ml-2">Enable Sitemap</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatically generate and maintain a sitemap.xml file.
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateSitemap}
                      disabled={!siteSettings.sitemapEnabled || isGenerating}
                    >
                      {isGenerating ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Generate Now
                    </Button>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center">
                        <Switch 
                          id="robots"
                          checked={siteSettings.robotsTxtEnabled}
                          onCheckedChange={(checked) => setSiteSettings({...siteSettings, robotsTxtEnabled: checked})}
                        />
                        <Label htmlFor="robots" className="ml-2">Enable Robots.txt</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Create and maintain a robots.txt file with your crawling preferences.
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateRobotsTxt}
                      disabled={!siteSettings.robotsTxtEnabled || isGenerating}
                    >
                      {isGenerating ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Generate Now
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="structured-data"
                      checked={siteSettings.structuredDataEnabled}
                      onCheckedChange={(checked) => setSiteSettings({...siteSettings, structuredDataEnabled: checked})}
                    />
                    <Label htmlFor="structured-data" className="ml-2">Enable Structured Data</Label>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center">
                        <Switch 
                          id="analytics"
                          checked={siteSettings.analyticsEnabled}
                          onCheckedChange={(checked) => setSiteSettings({...siteSettings, analyticsEnabled: checked})}
                        />
                        <Label htmlFor="analytics" className="ml-2">Enable Analytics Integration</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add Google Analytics tracking to all pages.
                      </p>
                    </div>
                    
                    <Input 
                      value={siteSettings.analyticsId || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, analyticsId: e.target.value})}
                      placeholder="G-XXXXXXXXXX"
                      className="w-48"
                      disabled={!siteSettings.analyticsEnabled}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSiteSettings}>Save Site Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>SEO Analytics Dashboard</CardTitle>
              <CardDescription>
                Monitor your SEO performance and visibility in search engines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20 text-muted-foreground space-y-4">
                <BarChart className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-medium">Analytics Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect Google Analytics or another SEO tool to view performance metrics here.
                  </p>
                </div>
                <Button className="mt-4">
                  Connect Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Structured Data Management</CardTitle>
              <CardDescription>
                Configure JSON-LD structured data for enhanced search results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Organization Schema</h3>
                  <textarea 
                    className="font-mono text-xs w-full h-40 p-2 border rounded bg-slate-50"
                    defaultValue={`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CILS B2 Cittadinanza",
  "url": "https://example.com",
  "logo": "https://example.com/images/logo.png",
  "sameAs": [
    "https://facebook.com/cilsb2app",
    "https://twitter.com/cilsb2app",
    "https://instagram.com/cilsb2app"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service",
    "email": "support@example.com"
  }
}`}
                  />
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">WebSite Schema</h3>
                  <textarea 
                    className="font-mono text-xs w-full h-40 p-2 border rounded bg-slate-50"
                    defaultValue={`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CILS B2 Cittadinanza",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}
                  />
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Course Schema (for Lessons)</h3>
                  <textarea 
                    className="font-mono text-xs w-full h-40 p-2 border rounded bg-slate-50"
                    defaultValue={`{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "CILS B2 Italian Language Course",
  "description": "Comprehensive preparation for the CILS B2 Italian language certification exam",
  "provider": {
    "@type": "Organization",
    "name": "CILS B2 Cittadinanza",
    "sameAs": "https://example.com"
  }
}`}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button>
                  Save Structured Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOManager;
