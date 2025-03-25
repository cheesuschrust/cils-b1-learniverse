import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Plus, Video, Smartphone, Globe, Share2, Search, Star, Download, FileText, Users, BarChart2, Upload, ChevronRight, Settings, Check, Copy, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'it', name: 'Italian' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' }
];

const AppStoreListing: React.FC = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('app-store');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const [formData, setFormData] = useState({
    name: 'CILS B2 Cittadinanza',
    subtitle: 'Learn Italian for Citizenship',
    description: 'Prepare for your Italian CILS B2 exam with comprehensive lessons, flashcards, and practice exercises designed specifically for the citizenship pathway.',
    keywords: 'italian, language learning, cils, b2, citizenship, italian citizenship, language exam, flashcards, lessons',
    privacyUrl: 'https://example.com/privacy',
    supportUrl: 'https://example.com/support',
    marketingUrl: 'https://example.com',
    version: '1.0.0',
    categoryId: 'education',
    secondaryCategoryId: 'productivity',
    notes: 'Initial submission for CILS B2 Italian learning app',
    bundleId: 'com.cilsb2cittadinanza.app',
    screenshotsUploaded: {
      iphone: 0,
      ipad: 0,
      android: 0
    },
    appIcon: null,
    promotionalText: 'Master Italian for your CILS B2 citizenship exam with our comprehensive learning suite',
    price: 'Free with In-App Purchases',
    inAppPurchases: [
      { id: 'premium_monthly', name: 'Premium Monthly', price: '$4.99' },
      { id: 'premium_yearly', name: 'Premium Yearly', price: '$49.99' },
    ],
    contentRating: '4+',
    ageRating: 'For all ages',
    appSize: '45 MB',
    locales: ['en', 'it'],
    supportedDevices: ['iPhone', 'iPad', 'Android Phones', 'Android Tablets'],
  });
  
  const handleInputChange = (key: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmit = () => {
    toast({
      title: "Listing saved",
      description: "Your app store listing has been saved. It's ready for submission.",
    });
  };
  
  const handlePreview = () => {
    toast({
      title: "Preview generated",
      description: "Your app store listing preview has been generated.",
    });
  };
  
  const handleUploadScreenshots = (platform: 'iphone' | 'ipad' | 'android') => {
    // Simulate upload
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        screenshotsUploaded: {
          ...prev.screenshotsUploaded,
          [platform]: platform === 'iphone' ? 5 : platform === 'ipad' ? 3 : 6
        }
      }));
      
      toast({
        title: "Screenshots uploaded",
        description: `${platform === 'iphone' ? 'iPhone' : platform === 'ipad' ? 'iPad' : 'Android'} screenshots have been uploaded successfully.`,
      });
    }, 1500);
  };
  
  const handleUploadIcon = () => {
    // Simulate upload
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        appIcon: '/assets/icon.png'
      }));
      
      toast({
        title: "App icon uploaded",
        description: "Your app icon has been uploaded successfully.",
      });
    }, 1500);
  };
  
  const handleDownloadTemplate = () => {
    toast({
      title: "Template downloaded",
      description: "Screenshot template has been downloaded to your computer.",
    });
  };

  return (
    <>
      <Helmet>
        <title>App Store Listing - Admin</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">App Store Listing</h1>
            <p className="text-muted-foreground">
              Prepare and manage your app listings for both the App Store and Google Play
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Listing
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="app-store">App Store</TabsTrigger>
            <TabsTrigger value="google-play">Google Play</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="app-store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>App Information</CardTitle>
                <CardDescription>
                  Basic information about your app for the Apple App Store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                  >
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">App Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      maxLength={30}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max 30 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input 
                      id="subtitle" 
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      maxLength={30}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max 30 characters
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Clear, compelling description of your app's features and functionality
                    </p>
                    <p className="text-xs">
                      {formData.description.length}/4000 characters
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input 
                    id="keywords" 
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated keywords to help users discover your app (max 100 characters)
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="privacy-url">Privacy Policy URL</Label>
                    <Input 
                      id="privacy-url" 
                      type="url"
                      value={formData.privacyUrl}
                      onChange={(e) => handleInputChange('privacyUrl', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-url">Support URL</Label>
                    <Input 
                      id="support-url" 
                      type="url"
                      value={formData.supportUrl}
                      onChange={(e) => handleInputChange('supportUrl', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marketing-url">Marketing URL</Label>
                    <Input 
                      id="marketing-url" 
                      type="url"
                      value={formData.marketingUrl}
                      onChange={(e) => handleInputChange('marketingUrl', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input 
                      id="version" 
                      value={formData.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bundle-id">Bundle ID</Label>
                    <Input 
                      id="bundle-id" 
                      value={formData.bundleId}
                      onChange={(e) => handleInputChange('bundleId', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Unique identifier for your app (e.g., com.company.appname)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="promotional-text">Promotional Text</Label>
                  <Input 
                    id="promotional-text" 
                    value={formData.promotionalText}
                    onChange={(e) => handleInputChange('promotionalText', e.target.value)}
                    maxLength={170}
                  />
                  <p className="text-xs text-muted-foreground">
                    Promotional text that can be updated without submitting a new version (max 170 characters)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for Review</Label>
                  <Textarea 
                    id="notes" 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Any information that would be helpful for the App Store review team
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSubmit}>
                    Save App Information
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Availability</CardTitle>
                <CardDescription>
                  Configure pricing and availability settings for the App Store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>In-App Purchases</Label>
                  <div className="border rounded-md divide-y">
                    {formData.inAppPurchases.map((purchase, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{purchase.name}</p>
                          <p className="text-sm text-muted-foreground">{purchase.id}</p>
                        </div>
                        <Badge>{purchase.price}</Badge>
                      </div>
                    ))}
                    <div className="p-4">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add In-App Purchase
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="content-rating">Content Rating</Label>
                    <Input 
                      id="content-rating" 
                      value={formData.contentRating}
                      onChange={(e) => handleInputChange('contentRating', e.target.value)}
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age-rating">Age Rating</Label>
                    <Input 
                      id="age-rating" 
                      value={formData.ageRating}
                      onChange={(e) => handleInputChange('ageRating', e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSubmit}>
                    Save Pricing & Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="google-play" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google Play Store Information</CardTitle>
                <CardDescription>
                  Configure your app listing for the Google Play Store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center p-12">
                  <Button onClick={() => setCurrentTab('app-store')}>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Configure Google Play Store Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="screenshots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>App Screenshots & Media</CardTitle>
                <CardDescription>
                  Upload screenshots, previews, and app icon for app stores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">iPhone Screenshots</CardTitle>
                      <CardDescription>
                        6.5" Super Retina (1284 x 2778 px)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                        <Smartphone className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium">iPhone Screenshots</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Upload 3-10 screenshots in PNG or JPEG format
                        </p>
                        {formData.screenshotsUploaded.iphone > 0 ? (
                          <div className="space-y-2 w-full">
                            <div className="bg-green-50 text-green-700 rounded-md p-2 flex items-center justify-center">
                              <Check className="h-4 w-4 mr-2" />
                              {formData.screenshotsUploaded.iphone} screenshots uploaded
                            </div>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleUploadScreenshots('iphone')}>
                              <Upload className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => handleUploadScreenshots('iphone')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        )}
                      </div>
                      <div className="mt-2">
                        <Button variant="link" size="sm" className="text-xs" onClick={handleDownloadTemplate}>
                          <Download className="h-3 w-3 mr-1" />
                          Download Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">iPad Screenshots</CardTitle>
                      <CardDescription>
                        12.9" iPad Pro (2048 x 2732 px)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                        <Tablet className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium">iPad Screenshots</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Upload 3-10 screenshots in PNG or JPEG format
                        </p>
                        {formData.screenshotsUploaded.ipad > 0 ? (
                          <div className="space-y-2 w-full">
                            <div className="bg-green-50 text-green-700 rounded-md p-2 flex items-center justify-center">
                              <Check className="h-4 w-4 mr-2" />
                              {formData.screenshotsUploaded.ipad} screenshots uploaded
                            </div>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleUploadScreenshots('ipad')}>
                              <Upload className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => handleUploadScreenshots('ipad')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        )}
                      </div>
                      <div className="mt-2">
                        <Button variant="link" size="sm" className="text-xs" onClick={handleDownloadTemplate}>
                          <Download className="h-3 w-3 mr-1" />
                          Download Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Android Screenshots</CardTitle>
                      <CardDescription>
                        Phone & Tablet (1440 x 3200 px)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                        <Smartphone className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium">Android Screenshots</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Upload 3-8 screenshots in PNG or JPEG format
                        </p>
                        {formData.screenshotsUploaded.android > 0 ? (
                          <div className="space-y-2 w-full">
                            <div className="bg-green-50 text-green-700 rounded-md p-2 flex items-center justify-center">
                              <Check className="h-4 w-4 mr-2" />
                              {formData.screenshotsUploaded.android} screenshots uploaded
                            </div>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleUploadScreenshots('android')}>
                              <Upload className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => handleUploadScreenshots('android')}>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        )}
                      </div>
                      <div className="mt-2">
                        <Button variant="link" size="sm" className="text-xs" onClick={handleDownloadTemplate}>
                          <Download className="h-3 w-3 mr-1" />
                          Download Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">App Icon</CardTitle>
                      <CardDescription>
                        1024 x 1024 px PNG format with no transparency
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                        {formData.appIcon ? (
                          <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-3 bg-gray-200 rounded-xl overflow-hidden">
                              <img src={formData.appIcon} alt="App Icon" className="w-full h-full object-cover" />
                            </div>
                            <Button size="sm" variant="outline" onClick={handleUploadIcon}>
                              <Upload className="h-4 w-4 mr-1" />
                              Update Icon
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Image className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">App Icon</p>
                            <p className="text-xs text-muted-foreground mb-3">
                              1024 x 1024 px PNG format with no transparency
                            </p>
                            <Button size="sm" onClick={handleUploadIcon}>
                              <Upload className="h-4 w-4 mr-1" />
                              Upload Icon
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">App Preview Video</CardTitle>
                      <CardDescription>
                        Showcase your app's features with a short preview video
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                        <Video className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium">App Preview Video</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          15-30 second video showing your app in action
                        </p>
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload Video
                        </Button>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Formats: MP4, MOV. Dimensions should match screenshot sizes.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSubmit}>
                    Save Media Assets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>App Metadata & Technical Information</CardTitle>
                <CardDescription>
                  Additional technical details and metadata for your app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Supported Languages</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.locales.map(locale => (
                        <Badge key={locale} variant="outline">
                          {languages.find(l => l.code === locale)?.name || locale}
                        </Badge>
                      ))}
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Language
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Supported Devices</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.supportedDevices.map((device, index) => (
                        <Badge key={index} variant="outline">
                          {device}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app-size">App Size</Label>
                  <Input 
                    id="app-size" 
                    value={formData.appSize}
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">
                    Estimated download size of your app
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Required Permissions</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Network/Internet Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Microphone (for voice recognition)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Notifications</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Export Compliance</Label>
                  <div className="border rounded-md p-4 bg-yellow-50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Export Compliance Information Required</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You need to provide export compliance information for your app 
                          before submission. This includes declaring whether your app 
                          uses encryption and, if so, whether it qualifies for exemptions.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Complete Export Compliance
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSubmit}>
                    Save Metadata
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

export default AppStoreListing;
