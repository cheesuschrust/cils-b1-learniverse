
export interface PlanStatus {
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'not-started';
  progress: number;
  items: {
    name: string;
    status: 'completed' | 'in-progress' | 'pending' | 'not-started';
  }[];
}

export const implementationPlanStatus: PlanStatus[] = [
  {
    name: 'User Experience & Accessibility',
    status: 'completed',
    progress: 100,
    items: [
      { name: 'Theme system with light/dark mode', status: 'completed' },
      { name: 'Accessibility features', status: 'completed' },
      { name: 'Cookie consent banner', status: 'completed' },
      { name: 'Responsive design', status: 'completed' }
    ]
  },
  {
    name: 'Legal & Compliance',
    status: 'completed',
    progress: 100,
    items: [
      { name: 'Privacy Policy', status: 'completed' },
      { name: 'Terms of Service', status: 'completed' },
      { name: 'EULA', status: 'completed' },
      { name: 'GDPR Compliance', status: 'completed' },
      { name: 'Cookie Policy', status: 'completed' }
    ]
  },
  {
    name: 'Admin Dashboard',
    status: 'in-progress',
    progress: 65,
    items: [
      { name: 'Dashboard Overview', status: 'completed' },
      { name: 'Content Management', status: 'in-progress' },
      { name: 'File upload system', status: 'completed' },
      { name: 'Content categorization', status: 'in-progress' },
      { name: 'Review workflows', status: 'in-progress' },
      { name: 'User Management', status: 'in-progress' },
      { name: 'AI System Management', status: 'pending' }
    ]
  },
  {
    name: 'AI Integration',
    status: 'in-progress',
    progress: 30,
    items: [
      { name: 'Voice System Management', status: 'in-progress' },
      { name: 'AI Service Provider Config', status: 'pending' },
      { name: 'Model selection options', status: 'pending' },
      { name: 'Performance monitoring', status: 'pending' }
    ]
  },
  {
    name: 'Content Generation & Management',
    status: 'in-progress',
    progress: 25,
    items: [
      { name: 'File Processing System', status: 'in-progress' },
      { name: 'Support for multiple file types', status: 'pending' },
      { name: 'Content extraction', status: 'pending' },
      { name: 'Training Data Integration', status: 'pending' }
    ]
  },
  {
    name: 'Monetization & E-commerce',
    status: 'pending',
    progress: 15,
    items: [
      { name: 'Subscription Management', status: 'pending' },
      { name: 'Payment Processing', status: 'pending' },
      { name: 'Advertisement System', status: 'not-started' },
      { name: 'E-commerce Integration', status: 'not-started' }
    ]
  },
  {
    name: 'SEO & Analytics',
    status: 'in-progress',
    progress: 40,
    items: [
      { name: 'Analytics Dashboard', status: 'in-progress' },
      { name: 'User engagement metrics', status: 'in-progress' },
      { name: 'Content performance analysis', status: 'in-progress' },
      { name: 'SEO Configuration', status: 'pending' },
      { name: 'Meta tag management', status: 'pending' }
    ]
  }
];

export const getMockComponentsStatus = () => [
  { name: 'User Engagement Chart', status: 'mock', description: 'Mock chart on dashboard' },
  { name: 'Revenue Reports', status: 'mock', description: 'Mock revenue data in admin analytics' },
  { name: 'AI Performance Metrics', status: 'mock', description: 'Mock AI performance data' },
  { name: 'Support Ticket Data', status: 'mock', description: 'Mock support ticket statistics' },
  { name: 'User Activity Logs', status: 'mock', description: 'Mock user activity data' },
  { name: 'Content Engagement Stats', status: 'mock', description: 'Mock content usage statistics' },
  { name: 'Subscription Analytics', status: 'mock', description: 'Mock subscription conversion rates' }
];
