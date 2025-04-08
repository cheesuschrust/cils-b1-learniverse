
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AIImplementationStatus, 
  AIModelUsageDashboard,
  AIArchitectureExplainer
} from '@/components/ai';

interface ImplementationItem {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  description: string;
  children?: ImplementationItem[];
}

const implementationPlan: ImplementationItem[] = [
  {
    id: '1',
    name: 'User Experience & Accessibility',
    status: 'completed',
    progress: 100,
    description: 'Core user experience features and accessibility improvements',
    children: [
      {
        id: '1.1',
        name: 'Theme system (light/dark mode)',
        status: 'completed',
        progress: 100,
        description: 'Toggle in header for switching between light and dark modes'
      },
      {
        id: '1.2',
        name: 'Accessibility features',
        status: 'completed',
        progress: 100,
        description: 'High contrast, reduced motion, font size options'
      },
      {
        id: '1.3',
        name: 'Cookie consent banner',
        status: 'completed',
        progress: 100,
        description: 'Proper privacy notifications and consent management'
      },
      {
        id: '1.4',
        name: 'Responsive design',
        status: 'completed',
        progress: 100,
        description: 'Design works across all device sizes'
      }
    ]
  },
  {
    id: '2',
    name: 'Legal & Compliance',
    status: 'completed',
    progress: 100,
    description: 'Legal documentation and compliance requirements',
    children: [
      {
        id: '2.1',
        name: 'Privacy Policy page',
        status: 'completed',
        progress: 100,
        description: 'Detailed privacy policy documentation'
      },
      {
        id: '2.2',
        name: 'Terms of Service page',
        status: 'completed',
        progress: 100,
        description: 'Terms of service and user agreement'
      },
      {
        id: '2.3',
        name: 'EULA',
        status: 'completed',
        progress: 100,
        description: 'End User License Agreement'
      },
      {
        id: '2.4',
        name: 'GDPR Compliance page',
        status: 'completed',
        progress: 100,
        description: 'Documentation of GDPR compliance measures'
      },
      {
        id: '2.5',
        name: 'Cookie Policy',
        status: 'completed',
        progress: 100,
        description: 'Cookie usage policy and details'
      }
    ]
  },
  {
    id: '3',
    name: 'Admin Dashboard',
    status: 'in-progress',
    progress: 85,
    description: 'Administrative tools and management interfaces',
    children: [
      {
        id: '3.1',
        name: 'Content Management',
        status: 'completed',
        progress: 100,
        description: 'File upload, categorization, tagging, review workflows'
      },
      {
        id: '3.2',
        name: 'User Management',
        status: 'completed',
        progress: 100,
        description: 'User permissions, roles, activity monitoring, account status'
      },
      {
        id: '3.3',
        name: 'AI System Management',
        status: 'completed',
        progress: 100,
        description: 'AI model configuration, training data, performance monitoring'
      },
      {
        id: '3.4',
        name: 'Analytics Dashboard',
        status: 'in-progress',
        progress: 70,
        description: 'Data visualization, usage metrics, performance analysis'
      },
      {
        id: '3.5',
        name: 'System Configuration',
        status: 'in-progress',
        progress: 60,
        description: 'Global settings, email templates, notification configuration'
      }
    ]
  },
  {
    id: '4',
    name: 'AI Integration',
    status: 'in-progress',
    progress: 65,
    description: 'AI model implementation and integration',
    children: [
      {
        id: '4.1',
        name: 'Client-side AI Models',
        status: 'completed',
        progress: 100,
        description: 'Hugging Face models for local processing (embeddings, speech, translation)'
      },
      {
        id: '4.2',
        name: 'Server-side AI Models',
        status: 'in-progress',
        progress: 70,
        description: 'Qwen models for text generation, conversation, content creation'
      },
      {
        id: '4.3',
        name: 'Voice System Management',
        status: 'in-progress',
        progress: 50,
        description: 'Voice configurations, accessibility options'
      },
      {
        id: '4.4',
        name: 'AI Service Provider Configuration',
        status: 'in-progress',
        progress: 40,
        description: 'Model selection, fallback options, performance metrics'
      },
      {
        id: '4.5',
        name: 'AI Documentation',
        status: 'completed',
        progress: 100,
        description: 'Documentation of AI models, usage, and implementation'
      }
    ]
  },
  {
    id: '5',
    name: 'Content Generation & Management',
    status: 'in-progress',
    progress: 55,
    description: 'Tools for generating and managing educational content',
    children: [
      {
        id: '5.1',
        name: 'File Processing System',
        status: 'in-progress',
        progress: 70,
        description: 'Support for multiple file types, content extraction, categorization'
      },
      {
        id: '5.2',
        name: 'Training Data Integration',
        status: 'in-progress',
        progress: 40,
        description: 'Test-aligned content generation, accuracy measurement, AI training'
      },
      {
        id: '5.3',
        name: 'Content Editor',
        status: 'in-progress',
        progress: 60,
        description: 'Rich text editor for creating and editing learning content'
      },
      {
        id: '5.4',
        name: 'Flashcard Generator',
        status: 'completed',
        progress: 100,
        description: 'Automatic generation of flashcards from learning materials'
      },
      {
        id: '5.5',
        name: 'Exercise Builder',
        status: 'in-progress',
        progress: 40,
        description: 'Tools for creating interactive exercises and assessments'
      }
    ]
  },
  {
    id: '6',
    name: 'Monetization & E-commerce',
    status: 'pending',
    progress: 25,
    description: 'Features for monetization and e-commerce integration',
    children: [
      {
        id: '6.1',
        name: 'Subscription Management',
        status: 'in-progress',
        progress: 40,
        description: 'Plan configuration, payment processing, subscription lifecycle'
      },
      {
        id: '6.2',
        name: 'Advertisement System',
        status: 'pending',
        progress: 10,
        description: 'Ad placement, provider integration, revenue analytics'
      },
      {
        id: '6.3',
        name: 'E-commerce Integration',
        status: 'pending',
        progress: 20,
        description: 'Shopping cart, product management, order processing'
      },
      {
        id: '6.4',
        name: 'Promotional Tools',
        status: 'pending',
        progress: 15,
        description: 'Coupon codes, referral system, loyalty program'
      },
      {
        id: '6.5',
        name: 'Licensing Management',
        status: 'pending',
        progress: 5,
        description: 'License generation, validation, and management'
      }
    ]
  },
  {
    id: '7',
    name: 'SEO & Analytics',
    status: 'pending',
    progress: 20,
    description: 'Search engine optimization and analytics tools',
    children: [
      {
        id: '7.1',
        name: 'SEO Configuration',
        status: 'in-progress',
        progress: 30,
        description: 'Meta tags, sitemap generation, SEO optimization'
      },
      {
        id: '7.2',
        name: 'Analytics Dashboard',
        status: 'in-progress',
        progress: 35,
        description: 'User engagement, content performance, conversion tracking'
      },
      {
        id: '7.3',
        name: 'Reporting System',
        status: 'pending',
        progress: 15,
        description: 'Scheduled reports, custom report generation'
      },
      {
        id: '7.4',
        name: 'User Behavior Tracking',
        status: 'pending',
        progress: 10,
        description: 'Heatmaps, session recording, user journey analysis'
      },
      {
        id: '7.5',
        name: 'Conversion Optimization',
        status: 'pending',
        progress: 5,
        description: 'A/B testing, funnel analysis, conversion rate optimization'
      }
    ]
  }
];

const ImplementationItemComponent: React.FC<{ item: ImplementationItem, depth?: number }> = ({ 
  item, 
  depth = 0 
}) => {
  return (
    <div className={`${depth > 0 ? 'ml-6 mt-2' : 'mt-4'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.name}</span>
          <Badge variant={
            item.status === 'completed' ? 'success' :
            item.status === 'in-progress' ? 'warning' : 'outline'
          }>
            {item.status === 'completed' ? 'Completed' :
              item.status === 'in-progress' ? 'In Progress' : 'Pending'}
          </Badge>
        </div>
        <span className="text-sm">{item.progress}%</span>
      </div>
      <Progress value={item.progress} className="h-2 mt-1" />
      {depth === 0 && (
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
      )}
      
      {item.children && (
        <div className="pl-4 border-l mt-2 space-y-3">
          {item.children.map(child => (
            <ImplementationItemComponent key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectStatus: React.FC = () => {
  // Calculate overall progress
  const overallProgress = Math.round(
    implementationPlan.reduce((acc, item) => acc + item.progress, 0) / implementationPlan.length
  );
  
  // Count by status
  const statusCounts = implementationPlan.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Project Implementation Status</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Combined implementation progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-4 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Implementation Status</CardTitle>
            <CardDescription>Status breakdown by major component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 text-green-700 p-2 rounded-md">
                <div className="text-2xl font-bold">{statusCounts.completed || 0}</div>
                <div className="text-xs">Completed</div>
              </div>
              <div className="bg-amber-50 text-amber-700 p-2 rounded-md">
                <div className="text-2xl font-bold">{statusCounts['in-progress'] || 0}</div>
                <div className="text-xs">In Progress</div>
              </div>
              <div className="bg-gray-50 text-gray-700 p-2 rounded-md">
                <div className="text-2xl font-bold">{statusCounts.pending || 0}</div>
                <div className="text-xs">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Current Focus</CardTitle>
            <CardDescription>What we're working on now</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>AI Integration: Server-side models</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>Admin Dashboard: Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>Content Generation: File Processing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span>AI Documentation: Component details</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="implementation">
        <TabsList>
          <TabsTrigger value="implementation">Implementation Plan</TabsTrigger>
          <TabsTrigger value="ai-status">AI Implementation</TabsTrigger>
          <TabsTrigger value="ai-usage">AI Usage Dashboard</TabsTrigger>
          <TabsTrigger value="ai-architecture">AI Architecture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Plan</CardTitle>
              <CardDescription>
                Detailed breakdown of project implementation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {implementationPlan.map(item => (
                    <ImplementationItemComponent key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-status">
          <AIImplementationStatus />
        </TabsContent>
        
        <TabsContent value="ai-usage">
          <AIModelUsageDashboard />
        </TabsContent>
        
        <TabsContent value="ai-architecture">
          <AIArchitectureExplainer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectStatus;
