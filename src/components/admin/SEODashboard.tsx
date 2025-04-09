
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Search, ExternalLink, FileText, Globe, BarChart2 } from 'lucide-react';
import { getMockSeoPerformanceData, getLanguageLearningSeoCotips, SEORecommendation } from '@/utils/seo';

const SEODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const performanceData = getMockSeoPerformanceData();
  const seoTips = getLanguageLearningSeoCotips();
  
  const getRecommendationVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'important': return 'default';
      case 'suggestion': return 'outline';
      default: return 'outline';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SEO Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and optimize your website's search engine performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search pages..."
              className="pl-9 w-[250px]"
            />
          </div>
          <Button>Analyze New Page</Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall SEO Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78/100</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +5 points from last month
                </p>
                <Progress value={78} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Indexed Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12 from last month
                </p>
                <Progress value={82} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,540</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8.2% from last month
                </p>
                <Progress value={65} className="h-1 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14.2</div>
                <p className="text-xs text-muted-foreground mt-1">
                  -2.1 positions from last month
                </p>
                <Progress value={48} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Trend</CardTitle>
                <CardDescription>Organic vs Paid traffic over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Traffic visualization chart would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.deviceBreakdown.map((device, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{device.device}</div>
                        <div className="text-sm font-medium">{device.percentage}%</div>
                      </div>
                      <Progress value={device.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>Pages with highest traffic and conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground">
                  <div className="col-span-6">Page</div>
                  <div className="col-span-2 text-right">Visits</div>
                  <div className="col-span-2 text-right">Conversion</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <Separator />
                {performanceData.trafficByPage.map((page, i) => (
                  <div key={i}>
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-6 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <div className="col-span-2 text-right">{page.visits.toLocaleString()}</div>
                      <div className="col-span-2 text-right">{page.conversion}%</div>
                      <div className="col-span-2 text-right">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                Italian Language Learning SEO Recommendations
              </CardTitle>
              <CardDescription>
                Specialized recommendations for optimizing Italian language learning content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoTips.map((tip: SEORecommendation, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center border p-3 rounded-md">
                    <Badge variant={getRecommendationVariant(tip.type)} className="capitalize text-xs">
                      {tip.type}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-medium">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      {tip.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags Inspector</CardTitle>
              <CardDescription>Analyze and edit meta tags for any page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Enter page URL to analyze" className="flex-1" />
                  <Button>Analyze</Button>
                </div>
                
                <div className="space-y-3 border rounded-md p-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title Tag</label>
                    <Input value="Italian Citizenship Test Prep | CILS B1 Practice" />
                    <p className="text-xs text-muted-foreground">56 characters (recommended: 50-60)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Description</label>
                    <Textarea value="Prepare for your Italian citizenship test with comprehensive CILS B1 practice materials. Interactive exercises, vocabulary, and grammar practice designed for exam success." />
                    <p className="text-xs text-muted-foreground">154 characters (recommended: 120-160)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Focus Keywords</label>
                    <Input value="Italian citizenship test, CILS B1, practice, language exam" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
              <CardDescription>Tracking top keyword rankings and click-through rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground">
                  <div className="col-span-5">Keyword</div>
                  <div className="col-span-2 text-right">Position</div>
                  <div className="col-span-2 text-right">Clicks</div>
                  <div className="col-span-2 text-right">CTR</div>
                  <div className="col-span-1 text-right">Trend</div>
                </div>
                <Separator />
                {performanceData.keywordPerformance.map((keyword, i) => (
                  <div key={i}>
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-5 font-medium">{keyword.keyword}</div>
                      <div className="col-span-2 text-right">{keyword.position}</div>
                      <div className="col-span-2 text-right">{keyword.clicks}</div>
                      <div className="col-span-2 text-right">{keyword.ctr}%</div>
                      <div className="col-span-1 text-right text-green-500">↑</div>
                    </div>
                    <Separator className="my-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Keyword Research</CardTitle>
              <CardDescription>Find new keywords to target for Italian language learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Enter a seed keyword" className="flex-1" />
                  <Button>Find Keywords</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Here are some recommended keywords for Italian language learning, citizenship tests, and CILS preparation:
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">italian citizenship test</Badge>
                    <Badge variant="secondary">cils b1 practice</Badge>
                    <Badge variant="secondary">italian language exam</Badge>
                    <Badge variant="secondary">italian b1 test prep</Badge>
                    <Badge variant="secondary">italian for citizenship</Badge>
                    <Badge variant="secondary">cils exam practice</Badge>
                    <Badge variant="secondary">italian language certificate</Badge>
                    <Badge variant="secondary">online italian test</Badge>
                    <Badge variant="secondary">italian spouse visa language</Badge>
                    <Badge variant="secondary">italian language requirement</Badge>
                    <Badge variant="secondary">b1 italian practice</Badge>
                    <Badge variant="secondary">italian a2 test</Badge>
                    <Badge variant="secondary">learn italian online</Badge>
                    <Badge variant="secondary">italian grammar practice</Badge>
                    <Badge variant="secondary">basic italian vocabulary</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Audit</CardTitle>
              <CardDescription>SEO performance of your content pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="text-xs text-muted-foreground">
                      <th className="text-left p-2 font-medium">Page URL</th>
                      <th className="text-center p-2 font-medium">SEO Score</th>
                      <th className="text-center p-2 font-medium">Word Count</th>
                      <th className="text-center p-2 font-medium">Page Speed</th>
                      <th className="text-center p-2 font-medium">Backlinks</th>
                      <th className="text-right p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 text-sm">/courses/italian-basics</td>
                      <td className="p-2 text-center"><Badge>85</Badge></td>
                      <td className="p-2 text-center">1,450</td>
                      <td className="p-2 text-center text-green-500">92</td>
                      <td className="p-2 text-center">24</td>
                      <td className="p-2 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-sm">/practice/multiple-choice</td>
                      <td className="p-2 text-center"><Badge>76</Badge></td>
                      <td className="p-2 text-center">950</td>
                      <td className="p-2 text-center text-amber-500">78</td>
                      <td className="p-2 text-center">12</td>
                      <td className="p-2 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-sm">/flashcards/common-phrases</td>
                      <td className="p-2 text-center"><Badge>82</Badge></td>
                      <td className="p-2 text-center">1,200</td>
                      <td className="p-2 text-center text-green-500">88</td>
                      <td className="p-2 text-center">18</td>
                      <td className="p-2 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-sm">/b1-test-preparation</td>
                      <td className="p-2 text-center"><Badge variant="destructive">64</Badge></td>
                      <td className="p-2 text-center">750</td>
                      <td className="p-2 text-center text-red-500">65</td>
                      <td className="p-2 text-center">8</td>
                      <td className="p-2 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                    </tr>
                    <tr>
                      <td className="p-2 text-sm">/grammar/verb-conjugation</td>
                      <td className="p-2 text-center"><Badge>79</Badge></td>
                      <td className="p-2 text-center">2,100</td>
                      <td className="p-2 text-center text-amber-500">75</td>
                      <td className="p-2 text-center">15</td>
                      <td className="p-2 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Management</CardTitle>
              <CardDescription>Configure your sitemap.xml and robots.txt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Sitemap</h4>
                    <p className="text-xs text-muted-foreground">Last updated: April 7, 2025</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Sitemap</Button>
                    <Button size="sm">Generate New Sitemap</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">robots.txt</h4>
                    <p className="text-xs text-muted-foreground">Controls search engine crawling</p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Edit robots.txt</Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 bg-muted">
                  <pre className="text-xs">
{`User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEODashboard;
