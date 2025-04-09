
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BrainCircuit, 
  Activity, 
  Bot, 
  LineChart, 
  BarChart2,
  RefreshCw,
  Clock,
  Users,
  MessageCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LineChart, BarChart, DonutChart } from '@/components/admin/charts';
import AIModelSummaryCard from '@/components/ai/AIModelSummaryCard';
import { supabase } from '@/integrations/supabase/client';

const AIPerformancePage: React.FC = () => {
  const [metrics, setMetrics] = React.useState({
    accuracy: 87.5,
    responseTime: 420,
    errorRate: 3.2,
    satisfactionScore: 92,
    dailyRequests: 12487,
    tokenUsage: 2450000,
    costPerDay: 32.45,
    trendData: [] as any[],
    modelDistribution: [] as any[],
    topQueries: [] as any[]
  });
  
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { toast } = useToast();
  
  // Generate sample metrics data
  React.useEffect(() => {
    const generateMetrics = () => {
      // Generate trend data for the past 14 days
      const trendData = [];
      const now = new Date();
      
      for (let i = 13; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        
        const baseAccuracy = 84 + Math.random() * 8;
        const baseResponseTime = 380 + Math.random() * 80;
        const baseRequests = 10000 + Math.random() * 5000;
        
        trendData.push({
          date: date.toISOString().split('T')[0],
          accuracy: baseAccuracy,
          responseTime: baseResponseTime,
          requests: Math.round(baseRequests),
          tokens: Math.round(baseRequests * 180 + Math.random() * 50000)
        });
      }
      
      // Model distribution data
      const modelDistribution = [
        { name: 'GPT-4', value: 35 },
        { name: 'GPT-3.5', value: 45 },
        { name: 'Custom Model', value: 15 },
        { name: 'Other', value: 5 }
      ];
      
      // Top queries data
      const topQueries = [
        { query: "Grammar correction", count: 3245, accuracy: 92.3 },
        { query: "Vocabulary translation", count: 2876, accuracy: 89.1 },
        { query: "Conversation practice", count: 2133, accuracy: 86.5 },
        { query: "Reading comprehension", count: 1892, accuracy: 83.7 },
        { query: "Cultural questions", count: 1568, accuracy: 91.2 }
      ];
      
      return {
        accuracy: 86 + Math.random() * 5,
        responseTime: 400 + Math.random() * 50,
        errorRate: 2 + Math.random() * 3,
        satisfactionScore: 90 + Math.random() * 6,
        dailyRequests: 10000 + Math.random() * 5000,
        tokenUsage: 2000000 + Math.random() * 1000000,
        costPerDay: 25 + Math.random() * 15,
        trendData,
        modelDistribution,
        topQueries
      };
    };
    
    setMetrics(generateMetrics());
  }, []);
  
  const refreshMetrics = async () => {
    setIsRefreshing(true);
    
    try {
      // In a real implementation, we would fetch actual metrics from a backend API
      // or analytics service
      
      // For demonstration, we'll generate new sample data
      const newMetrics = {
        ...metrics,
        accuracy: 86 + Math.random() * 5,
        responseTime: 400 + Math.random() * 50,
        errorRate: 2 + Math.random() * 3,
        satisfactionScore: 90 + Math.random() * 6,
        dailyRequests: 10000 + Math.random() * 5000,
        tokenUsage: 2000000 + Math.random() * 1000000,
        costPerDay: 25 + Math.random() * 15
      };
      
      setMetrics(newMetrics);
      
      // Check if we can connect to the database to verify connectivity
      try {
        await supabase.from('ai_model_performance').select('id', { count: 'exact', head: true });
      } catch (dbError) {
        console.error("Database check failed:", dbError);
      }
      
      toast({
        title: "AI Metrics Updated",
        description: `Last updated: ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error("Error refreshing AI metrics:", error);
      toast({
        title: "Error Updating Metrics",
        description: "Failed to refresh AI performance metrics.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>AI Performance Metrics</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Performance</h2>
            <p className="text-muted-foreground">
              Monitor artificial intelligence model performance and usage
            </p>
          </div>
          
          <Button 
            onClick={refreshMetrics} 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh Metrics'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AIModelSummaryCard
            title="Accuracy"
            value={`${metrics.accuracy.toFixed(1)}%`}
            icon="brain"
            progress={metrics.accuracy}
            subtitle="AI response correctness"
          />
          
          <AIModelSummaryCard
            title="Response Time"
            value={`${metrics.responseTime.toFixed(0)} ms`}
            icon="cpu"
            progress={Math.min(100, metrics.responseTime / 10)}
            subtitle="Average inference latency"
          />
          
          <AIModelSummaryCard
            title="Error Rate"
            value={`${metrics.errorRate.toFixed(1)}%`}
            icon="database"
            progress={metrics.errorRate * 5} // Scale for visibility
            subtitle="Failed responses percentage"
          />
          
          <AIModelSummaryCard
            title="User Satisfaction"
            value={`${metrics.satisfactionScore.toFixed(0)}%`}
            icon="server"
            progress={metrics.satisfactionScore}
            subtitle="Based on user feedback"
          />
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Usage & Cost
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Accuracy Trend</CardTitle>
                  <CardDescription>
                    14-day trend of AI model accuracy rate
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart 
                    data={metrics.trendData}
                    xField="date"
                    yField="accuracy"
                    color="#3b82f6"
                    height={300}
                    yAxisLabel="Accuracy (%)"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Trend</CardTitle>
                  <CardDescription>
                    14-day trend of AI response time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart 
                    data={metrics.trendData}
                    xField="date"
                    yField="responseTime"
                    color="#f59e0b"
                    height={300}
                    yAxisLabel="Response Time (ms)"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Model Distribution</CardTitle>
                  <CardDescription>
                    AI model usage distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart 
                    data={metrics.modelDistribution}
                    height={250}
                  />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Top AI Queries</CardTitle>
                  <CardDescription>
                    Most frequent query categories and their accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.topQueries.map((query, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <BrainCircuit className="h-4 w-4 mr-2 text-primary/70" />
                            <span className="font-medium">{query.query}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">
                              {query.count.toLocaleString()} queries
                            </Badge>
                            <span className={`text-sm ${
                              query.accuracy > 90 
                                ? 'text-green-500' 
                                : query.accuracy > 80 
                                  ? 'text-amber-500' 
                                  : 'text-red-500'
                            }`}>
                              {query.accuracy.toFixed(1)}% accuracy
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={query.accuracy} 
                          className="h-1" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BrainCircuit className="mr-2 h-5 w-5 text-muted-foreground" />
                    Model Accuracy Details
                  </CardTitle>
                  <CardDescription>
                    Detailed accuracy metrics by model and task
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Accuracy by Model Type</p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>GPT-4</span>
                            <span>{(metrics.accuracy + 5).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.accuracy + 5} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>GPT-3.5</span>
                            <span>{(metrics.accuracy - 2).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.accuracy - 2} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Custom Model</span>
                            <span>{(metrics.accuracy + 2).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.accuracy + 2} className="h-1" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Accuracy by Task Type</p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Translation</span>
                            <span>{(metrics.accuracy + 3).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.accuracy + 3} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Grammar Correction</span>
                            <span>{(metrics.accuracy + 6).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.accuracy + 6} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Content Generation</span>
                            <span>{(metrics.accuracy - 4).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.accuracy - 4} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Cultural Knowledge</span>
                            <span>{(metrics.accuracy + 1).toFixed(1)}%</span>
                          </div>
                          <Progress value={metrics.accuracy + 1} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                    Response Time Analysis
                  </CardTitle>
                  <CardDescription>
                    Latency metrics and performance analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Avg. Response Time</p>
                        <p className="text-2xl font-bold">{metrics.responseTime.toFixed(0)} ms</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">95th Percentile</p>
                        <p className="text-2xl font-bold">{(metrics.responseTime * 1.8).toFixed(0)} ms</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Fastest Response</p>
                        <p className="text-2xl font-bold">{(metrics.responseTime * 0.4).toFixed(0)} ms</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Slowest Response</p>
                        <p className="text-2xl font-bold">{(metrics.responseTime * 3.2).toFixed(0)} ms</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Response Time Components</p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Model Processing</span>
                            <span>{(metrics.responseTime * 0.75).toFixed(0)} ms</span>
                          </div>
                          <Progress value={75} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>API Overhead</span>
                            <span>{(metrics.responseTime * 0.15).toFixed(0)} ms</span>
                          </div>
                          <Progress value={15} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Network Latency</span>
                            <span>{(metrics.responseTime * 0.1).toFixed(0)} ms</span>
                          </div>
                          <Progress value={10} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  User Satisfaction Metrics
                </CardTitle>
                <CardDescription>
                  Feedback and satisfaction indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold text-green-500">
                        {metrics.satisfactionScore.toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Overall satisfaction</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Highly Satisfied</span>
                        <span>{(metrics.satisfactionScore * 0.7).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfied</span>
                        <span>{(metrics.satisfactionScore * 0.2).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Neutral</span>
                        <span>{(100 - metrics.satisfactionScore * 0.9).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Unsatisfied</span>
                        <span>{(100 - metrics.satisfactionScore).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm font-medium mb-4">Satisfaction by Feature</p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Response Accuracy</span>
                          <span>{(metrics.satisfactionScore + 2).toFixed(0)}%</span>
                        </div>
                        <Progress value={metrics.satisfactionScore + 2} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Response Speed</span>
                          <span>{(metrics.satisfactionScore - 4).toFixed(0)}%</span>
                        </div>
                        <Progress value={metrics.satisfactionScore - 4} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Response Clarity</span>
                          <span>{(metrics.satisfactionScore + 1).toFixed(0)}%</span>
                        </div>
                        <Progress value={metrics.satisfactionScore + 1} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Experience</span>
                          <span>{(metrics.satisfactionScore).toFixed(0)}%</span>
                        </div>
                        <Progress value={metrics.satisfactionScore} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                  <CardDescription>
                    14-day trend of AI usage metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart 
                    data={metrics.trendData}
                    xField="date"
                    yField="requests"
                    color="#8b5cf6"
                    height={300}
                    yAxisLabel="Requests"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Token Usage</CardTitle>
                  <CardDescription>
                    14-day trend of token consumption
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart 
                    data={metrics.trendData}
                    xField="date"
                    yField="tokens"
                    color="#10b981"
                    height={300}
                    yAxisLabel="Tokens"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                    Request Volume
                  </CardTitle>
                  <CardDescription>
                    Daily request statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold">{Math.round(metrics.dailyRequests).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Requests today</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Average</p>
                        <p className="text-lg font-semibold">{Math.round(metrics.dailyRequests * 0.9).toLocaleString()}/day</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Peak</p>
                        <p className="text-lg font-semibold">{Math.round(metrics.dailyRequests * 1.3).toLocaleString()}/day</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Weekly</p>
                        <p className="text-lg font-semibold">{Math.round(metrics.dailyRequests * 7).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Monthly</p>
                        <p className="text-lg font-semibold">{Math.round(metrics.dailyRequests * 30).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Growth Trend</p>
                      <div className="flex items-center">
                        <span className="text-green-500 text-sm">+5.7%</span>
                        <span className="text-sm text-muted-foreground ml-2">from last week</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-muted-foreground" />
                    Token Consumption
                  </CardTitle>
                  <CardDescription>
                    AI token usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold">{Math.round(metrics.tokenUsage).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Tokens today</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Avg. per Request</p>
                        <p className="text-lg font-semibold">{Math.round(metrics.tokenUsage / metrics.dailyRequests)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Monthly Projection</p>
                        <p className="text-lg font-semibold">{Math.round(metrics.tokenUsage * 30 / 1000000).toLocaleString()}M</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Token Distribution</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Input Tokens</span>
                            <span>{Math.round(metrics.tokenUsage * 0.3).toLocaleString()}</span>
                          </div>
                          <Progress value={30} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Output Tokens</span>
                            <span>{Math.round(metrics.tokenUsage * 0.7).toLocaleString()}</span>
                          </div>
                          <Progress value={70} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                    Cost Analysis
                  </CardTitle>
                  <CardDescription>
                    AI usage cost breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold">${metrics.costPerDay.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Cost today</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Weekly</p>
                        <p className="text-lg font-semibold">${(metrics.costPerDay * 7).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Monthly</p>
                        <p className="text-lg font-semibold">${(metrics.costPerDay * 30).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cost per Request</p>
                        <p className="text-lg font-semibold">${(metrics.costPerDay / metrics.dailyRequests).toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cost per 1K Tokens</p>
                        <p className="text-lg font-semibold">${(metrics.costPerDay / (metrics.tokenUsage / 1000)).toFixed(4)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Cost by Model</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>GPT-4</span>
                            <span>${(metrics.costPerDay * 0.65).toFixed(2)}</span>
                          </div>
                          <Progress value={65} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>GPT-3.5</span>
                            <span>${(metrics.costPerDay * 0.25).toFixed(2)}</span>
                          </div>
                          <Progress value={25} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Other Models</span>
                            <span>${(metrics.costPerDay * 0.1).toFixed(2)}</span>
                          </div>
                          <Progress value={10} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Recommendations</CardTitle>
                  <CardDescription>
                    AI-generated suggestions for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 border p-3 rounded-md">
                      <BrainCircuit className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Response Time Optimization</h4>
                        <p className="text-sm text-muted-foreground">
                          Consider using GPT-3.5 for simpler queries to reduce average response time by approximately 25%.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 border p-3 rounded-md">
                      <BrainCircuit className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Accuracy Improvement</h4>
                        <p className="text-sm text-muted-foreground">
                          Cultural knowledge queries show 5% lower accuracy. Consider enhancing the training dataset with additional cultural context material.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 border p-3 rounded-md">
                      <BrainCircuit className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Cost Optimization</h4>
                        <p className="text-sm text-muted-foreground">
                          Implementing input token length limitations could reduce costs by approximately 15% with minimal impact on user experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Usage Patterns & Insights</CardTitle>
                  <CardDescription>
                    Key insights from AI usage data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 border p-3 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Peak Usage Times</h4>
                        <p className="text-sm text-muted-foreground">
                          Usage peaks between 2-4 PM and 8-10 PM, suggesting users are practicing during lunch breaks and evenings.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 border p-3 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Popular Content Areas</h4>
                        <p className="text-sm text-muted-foreground">
                          Grammar correction and vocabulary translation account for 47% of all queries, indicating high demand for these features.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 border p-3 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">User Satisfaction Correlation</h4>
                        <p className="text-sm text-muted-foreground">
                          Users who receive responses in under 300ms report 15% higher satisfaction ratings.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 border p-3 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Premium User Behavior</h4>
                        <p className="text-sm text-muted-foreground">
                          Premium users make 3.2x more queries than free users and have a 22% higher retention rate.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Performance Comparison</CardTitle>
                <CardDescription>
                  Performance metrics compared to industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Accuracy</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Your Platform: {metrics.accuracy.toFixed(1)}%</span>
                        <span className="text-sm text-muted-foreground">Industry Avg: 82.3%</span>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-400 rounded-full absolute" style={{ width: '82.3%' }}></div>
                        <div className="h-2 bg-primary rounded-full absolute" style={{ width: `${metrics.accuracy}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Response Time</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Your Platform: {metrics.responseTime.toFixed(0)} ms</span>
                        <span className="text-sm text-muted-foreground">Industry Avg: 550 ms</span>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-400 rounded-full absolute" style={{ width: `${(550/10)}%` }}></div>
                        <div className="h-2 bg-primary rounded-full absolute" style={{ width: `${metrics.responseTime/10}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">User Satisfaction</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Your Platform: {metrics.satisfactionScore.toFixed(1)}%</span>
                        <span className="text-sm text-muted-foreground">Industry Avg: 88.5%</span>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-400 rounded-full absolute" style={{ width: '88.5%' }}></div>
                        <div className="h-2 bg-primary rounded-full absolute" style={{ width: `${metrics.satisfactionScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Cost Efficiency</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Your Platform: ${(metrics.costPerDay / metrics.dailyRequests * 1000).toFixed(2)}/1K requests</span>
                        <span className="text-sm text-muted-foreground">Industry Avg: $3.75/1K requests</span>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-400 rounded-full absolute" style={{ width: `${(3.75/5) * 100}%` }}></div>
                        <div className="h-2 bg-primary rounded-full absolute" style={{ width: `${(metrics.costPerDay / metrics.dailyRequests * 1000)/5 * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AIPerformancePage;
