import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Activity, BookOpen, TrendingUp, Zap, Clock, CheckCircle, BarChart2, Server, HardDrive } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  // Mock data for dashboard
  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of the application
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,428</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>+201 since last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Currently online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,875</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Activity className="h-4 w-4 mr-2" />
                    <span>+45 since last hour</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Total lessons finished
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18,759</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>+342 today</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    AI feature usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127,543</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 mr-2" />
                    <span>+1,254 today</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>
                    Active users over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View Details</Button>
                </CardFooter>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>
                    Popular content categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Explore Content</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Website visits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,456</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>+12% from last week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-sm font-medium">Average Time on Site</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    User session duration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3:45</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>+30 seconds from last week</span>
                  </div>
                </CardContent>
              </Card>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        AI feature engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78%</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Zap className="h-4 w-4 mr-2" />
                        <span>+5% from last week</span>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">AI Usage Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed metrics on AI feature usage.
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Text Generation: 45%</li>
                      <li>Translation: 30%</li>
                      <li>Speech Recognition: 25%</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>System Report</CardTitle>
                <CardDescription>
                  Detailed system information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Server Status</span>
                    <Badge variant="secondary">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Version</span>
                    <span>v3.2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Version</span>
                    <span>v1.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WebGPU Support</span>
                    <span>Yes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Generate Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
