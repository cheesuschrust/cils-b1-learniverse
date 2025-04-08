
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectTreeMap from '@/components/admin/ProjectTreeMap';
import { 
  AreaChart, 
  PieChart, 
  Bookmark, 
  Clock,
  AlertTriangle,
  CheckCircle2 
} from 'lucide-react';

const statusData = [
  { name: 'Completed', count: 25, color: 'bg-green-500' },
  { name: 'In Progress', count: 12, color: 'bg-blue-500' },
  { name: 'Pending', count: 8, color: 'bg-amber-500' },
  { name: 'Mock Components', count: 7, color: 'bg-purple-500' },
  { name: 'Not Started', count: 5, color: 'bg-gray-300 dark:bg-gray-700' },
  { name: 'Issues', count: 2, color: 'bg-red-500' },
];

const ProjectStatus: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>Project Status - Admin</title>
        </Helmet>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Status Overview</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive view of all project components and their implementation status
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Components</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">59</div>
              <p className="text-xs text-muted-foreground">
                Pages, sections and functional components
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Implementation Status</CardTitle>
              <AreaChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73%</div>
              <p className="text-xs text-muted-foreground">
                Overall project completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Components currently being implemented
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Components with implementation issues
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Implementation Progress</CardTitle>
              <CardDescription>Status of components by project section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="text-center text-muted-foreground p-4">
                  <PieChart className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                  <p>Implementation progress chart would be rendered here</p>
                  <p className="text-xs mt-1">Showing percentage breakdown by section</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
              <CardDescription>Component status counts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusData.map((status, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${status.color} mr-2`}></div>
                    <div className="flex-1 text-sm">{status.name}</div>
                    <div className="font-medium">{status.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <ProjectTreeMap />
        
        <Card>
          <CardHeader>
            <CardTitle>Implementation Plan Status</CardTitle>
            <CardDescription>Current status of the implementation plan by section</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  User Experience & Accessibility
                </h3>
                <div className="mt-2 rounded-full bg-muted h-2.5 w-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">100% Complete</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Theme system with light/dark mode</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Accessibility features</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Cookie consent banner</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Responsive design</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  Legal & Compliance
                </h3>
                <div className="mt-2 rounded-full bg-muted h-2.5 w-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">100% Complete</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Privacy Policy</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Terms of Service</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>EULA</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>GDPR & Cookie Policy</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Admin Dashboard
                </h3>
                <div className="mt-2 rounded-full bg-muted h-2.5 w-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">65% Complete</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span>Admin layout</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-blue-500" />
                    <span>Content Management</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-blue-500" />
                    <span>User Management</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-amber-500" />
                    <span>AI System Management</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  AI Integration
                </h3>
                <div className="mt-2 rounded-full bg-muted h-2.5 w-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">30% Complete</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-blue-500" />
                    <span>Voice System Management</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-amber-500" />
                    <span>AI Service Provider Config</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  Content Generation & Management
                </h3>
                <div className="mt-2 rounded-full bg-muted h-2.5 w-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">25% Complete</div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  Monetization & E-commerce
                </h3>
                <div className="mt-2 rounded-full bg-muted h-2.5 w-full overflow-hidden">
                  <div className="bg-gray-400 h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">15% Complete</div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  SEO & Analytics
                </h3>
                <div className="mt-2 rounded-full bg-muted h-2.5 w-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">40% Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectStatus;
