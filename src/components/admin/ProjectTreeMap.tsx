
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileTree, CheckCircle, Clock, AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';

type StatusType = 'completed' | 'in-progress' | 'pending' | 'mock' | 'not-started' | 'issues';

interface PageStatus {
  name: string;
  path: string;
  status: StatusType;
  children?: PageStatus[];
  description?: string;
}

const StatusBadge = ({ status }: { status: StatusType }) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Complete</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-500 text-white"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
    case 'pending':
      return <Badge className="bg-amber-500 text-white"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
    case 'mock':
      return <Badge className="bg-purple-500 text-white"><HelpCircle className="h-3 w-3 mr-1" /> Mock</Badge>;
    case 'not-started':
      return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Not Started</Badge>;
    case 'issues':
      return <Badge className="bg-red-500 text-white"><AlertTriangle className="h-3 w-3 mr-1" /> Issues</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const PageNode = ({ page, depth = 0 }: { page: PageStatus; depth?: number }) => {
  return (
    <div className="mt-1" style={{ marginLeft: `${depth * 20}px` }}>
      <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors">
        <div className="flex items-center">
          <FileTree className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{page.name}</span>
          {page.description && (
            <span className="ml-2 text-xs text-muted-foreground">{page.description}</span>
          )}
        </div>
        <div className="flex items-center">
          <StatusBadge status={page.status} />
          <span className="ml-2 text-xs text-muted-foreground">{page.path}</span>
        </div>
      </div>
      {page.children && page.children.map((child, index) => (
        <PageNode key={index} page={child} depth={depth + 1} />
      ))}
    </div>
  );
};

const ProjectTreeMap: React.FC = () => {
  // Project structure and status data
  const projectStructure: PageStatus[] = [
    {
      name: 'Main Pages',
      path: '/',
      status: 'completed',
      children: [
        { name: 'Home', path: '/', status: 'completed' },
        { name: 'Dashboard', path: '/dashboard', status: 'completed' },
        { name: 'Profile', path: '/profile', status: 'completed' },
        { name: 'Progress', path: '/progress', status: 'completed' },
        { name: 'Settings', path: '/settings', status: 'completed' },
      ]
    },
    {
      name: 'Auth Pages',
      path: '/auth',
      status: 'completed',
      children: [
        { name: 'Login', path: '/login', status: 'completed' },
        { name: 'Signup', path: '/signup', status: 'completed' },
        { name: 'Forgot Password', path: '/forgot-password', status: 'completed' },
      ]
    },
    {
      name: 'Legal Pages',
      path: '/legal',
      status: 'completed',
      children: [
        { name: 'Privacy Policy', path: '/privacy', status: 'completed' },
        { name: 'Terms of Service', path: '/terms', status: 'completed' },
        { name: 'EULA', path: '/eula', status: 'completed' },
        { name: 'GDPR', path: '/gdpr', status: 'completed' },
        { name: 'Cookies', path: '/cookies', status: 'completed' },
      ]
    },
    {
      name: 'Support Pages',
      path: '/support',
      status: 'completed',
      children: [
        { name: 'Support Center', path: '/support-center', status: 'completed' },
        { name: 'Support', path: '/support', status: 'completed' },
        { name: 'Help Center', path: '/help', status: 'completed' },
        { name: 'FAQ', path: '/help/faq', status: 'completed' },
        { name: 'User Guide', path: '/help/user-guide', status: 'completed' },
        { name: 'Tutorials', path: '/help/tutorials', status: 'completed' },
        { name: 'Video Guides', path: '/help/videos', status: 'completed' },
      ]
    },
    {
      name: 'Learning Pages',
      path: '/learning',
      status: 'in-progress',
      children: [
        { name: 'Flashcards', path: '/flashcards', status: 'in-progress' },
        { name: 'Listening Practice', path: '/practice/listening', status: 'in-progress' },
        { name: 'Reading Practice', path: '/practice/reading', status: 'in-progress' },
        { name: 'Writing Exercise', path: '/practice/writing', status: 'in-progress' },
        { name: 'Speaking Practice', path: '/practice/speaking', status: 'in-progress' },
      ]
    },
    {
      name: 'Subscription Pages',
      path: '/subscription',
      status: 'in-progress',
      children: [
        { name: 'Subscription Plans', path: '/subscription', status: 'in-progress' },
        { name: 'Subscription Management', path: '/subscription/manage', status: 'in-progress' },
      ]
    },
    {
      name: 'Admin Pages',
      path: '/admin',
      status: 'in-progress',
      children: [
        { name: 'Admin Dashboard', path: '/admin', status: 'completed' },
        { name: 'User Management', path: '/admin/users', status: 'in-progress' },
        { name: 'Content Management', path: '/admin/content', status: 'in-progress' },
        { name: 'Content Uploader', path: '/admin/content-upload', status: 'in-progress' },
        { name: 'File Uploader', path: '/admin/file-uploader', status: 'completed' },
        { name: 'AI Management', path: '/admin/ai-management', status: 'pending' },
        { name: 'Support Tickets', path: '/admin/support-tickets', status: 'in-progress' },
        { name: 'Subscription Manager', path: '/admin/subscriptions', status: 'pending' },
        { name: 'System Health', path: '/admin/system-health', status: 'pending' },
        { name: 'Analytics', path: '/admin/analytics', status: 'in-progress' },
      ]
    },
  ];

  // Mock data and components 
  const mockComponents = [
    { name: 'User Engagement Chart', status: 'mock', description: 'Mock chart on dashboard' },
    { name: 'Revenue Reports', status: 'mock', description: 'Mock revenue data in admin analytics' },
    { name: 'AI Performance Metrics', status: 'mock', description: 'Mock AI performance data' },
    { name: 'Support Ticket Data', status: 'mock', description: 'Mock support ticket statistics' },
    { name: 'User Activity Logs', status: 'mock', description: 'Mock user activity data' },
    { name: 'Content Engagement Stats', status: 'mock', description: 'Mock content usage statistics' },
    { name: 'Subscription Analytics', status: 'mock', description: 'Mock subscription conversion rates' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Project Structure & Status</CardTitle>
        <CardDescription>Full overview of project pages and components with their implementation status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-md bg-muted p-2 text-center">
              <div className="text-2xl font-bold">
                {projectStructure.reduce((acc, section) => 
                  acc + (section.children?.length || 0), 0)} Pages
              </div>
              <div className="text-sm text-muted-foreground">Total Pages</div>
            </div>
            <div className="rounded-md bg-green-100 dark:bg-green-900 p-2 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projectStructure.reduce((acc, section) => 
                  acc + (section.children?.filter(c => c.status === 'completed').length || 0), 0)}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
            </div>
            <div className="rounded-md bg-amber-100 dark:bg-amber-900 p-2 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {projectStructure.reduce((acc, section) => 
                  acc + (section.children?.filter(c => c.status !== 'completed').length || 0), 0)}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">In Progress/Pending</div>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="bg-muted/50 px-4 py-2 flex justify-between items-center font-semibold">
              <span>Route Path</span>
              <span>Status</span>
            </div>
            {projectStructure.map((section, index) => (
              <PageNode key={index} page={section} />
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Mock Components & Placeholder Data</CardTitle>
              <CardDescription>Components using simulated data for development purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockComponents.map((mock, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                    <div>
                      <div className="font-medium">{mock.name}</div>
                      <div className="text-xs text-muted-foreground">{mock.description}</div>
                    </div>
                    <StatusBadge status={mock.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTreeMap;
