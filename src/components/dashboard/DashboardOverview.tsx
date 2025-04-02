
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, 
  Headphones, 
  PenLine, 
  Mic, 
  Clock, 
  ArrowRight,
  Flashcard, 
  BarChart3,
  AlarmClock,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import DailyAllocation from '@/components/learning/DailyAllocation';

// Define icon components if not already available
const Flashcard = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="14" x="3" y="5" rx="2" />
    <path d="M3 7h18" />
    <path d="M7 5v2" />
    <path d="M17 5v2" />
  </svg>
);

interface ModuleProgress {
  module: string;
  path: string;
  icon: React.ReactNode;
  completed: number;
  total: number;
  lastActivity?: Date;
  confidenceScore: number;
}

const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPremium = user?.isPremiumUser || false;
  
  // Mock progress data
  const moduleProgress: ModuleProgress[] = [
    {
      module: "Flashcards",
      path: "/flashcards",
      icon: <Flashcard className="h-5 w-5" />,
      completed: 15,
      total: 30,
      lastActivity: new Date('2023-06-15'),
      confidenceScore: 72
    },
    {
      module: "Listening",
      path: "/listening",
      icon: <Headphones className="h-5 w-5" />,
      completed: 8,
      total: 20,
      lastActivity: new Date('2023-06-18'),
      confidenceScore: 65
    },
    {
      module: "Reading",
      path: "/reading",
      icon: <BookOpen className="h-5 w-5" />,
      completed: 12,
      total: 20,
      lastActivity: new Date('2023-06-17'),
      confidenceScore: 80
    },
    {
      module: "Writing",
      path: "/writing",
      icon: <PenLine className="h-5 w-5" />,
      completed: 5,
      total: 15,
      lastActivity: new Date('2023-06-10'),
      confidenceScore: 60
    },
    {
      module: "Speaking",
      path: "/speaking",
      icon: <Mic className="h-5 w-5" />,
      completed: 3,
      total: 10,
      lastActivity: new Date('2023-06-05'),
      confidenceScore: 55
    }
  ];
  
  // Mock data for daily questions
  const mockDailyAllocations = [
    {
      section: 'vocabulary' as const,
      completed: true,
      available: true,
      confidence: 75
    },
    {
      section: 'grammar' as const,
      completed: false,
      available: true,
      confidence: 60
    },
    {
      section: 'reading' as const,
      completed: false,
      available: !isPremium ? false : true,
      confidence: 80
    },
    {
      section: 'listening' as const,
      completed: false,
      available: !isPremium ? false : true,
      confidence: 65
    }
  ];
  
  // Mock upcoming test date
  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 45); // 45 days from now
  
  const daysUntilExam = Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate overall progress
  const overallCompletedPercentage = 
    Math.round(
      (moduleProgress.reduce((acc, curr) => acc + curr.completed, 0) / 
       moduleProgress.reduce((acc, curr) => acc + curr.total, 0)) * 100
    );
  
  // Calculate average confidence score
  const averageConfidenceScore = 
    Math.round(
      moduleProgress.reduce((acc, curr) => acc + curr.confidenceScore, 0) / moduleProgress.length
    );
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(date);
  };
  
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion</span>
                <span className="text-sm font-medium">{overallCompletedPercentage}%</span>
              </div>
              <Progress value={overallCompletedPercentage} className="h-2" />
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Confidence</span>
                <span className={`text-sm font-medium ${getConfidenceColor(averageConfidenceScore)}`}>
                  {averageConfidenceScore}%
                </span>
              </div>
              <Progress 
                value={averageConfidenceScore} 
                className="h-2"
                indicatorClassName={
                  averageConfidenceScore >= 80 ? "bg-green-500" :
                  averageConfidenceScore >= 60 ? "bg-amber-500" :
                  "bg-red-500"
                }
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 text-center p-2 border rounded-md">
                <span className="text-3xl font-bold">7.5</span>
                <p className="text-xs text-muted-foreground">Hours this week</p>
              </div>
              <div className="space-y-1 text-center p-2 border rounded-md">
                <span className="text-3xl font-bold">32</span>
                <p className="text-xs text-muted-foreground">Total hours</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              <p>Recommended: 1 hour daily for best results</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              CILS B1 Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">{daysUntilExam}</div>
              <p className="text-xs text-muted-foreground mt-1">Days until your exam</p>
              <p className="text-sm font-medium mt-2">{formatDate(examDate)}</p>
              
              {daysUntilExam <= 30 && (
                <div className="mt-2 text-xs text-amber-500">
                  <AlarmClock className="h-3 w-3 inline mr-1" />
                  Less than a month to go!
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-xs">
              Update Exam Date
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Learning Modules</CardTitle>
              <CardDescription>
                Track your progress across different learning areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleProgress.map((module) => (
                  <div key={module.module} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          {module.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-base">{module.module}</h3>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {module.lastActivity ? (
                              <span>Last activity: {formatDate(module.lastActivity)}</span>
                            ) : (
                              <span>No activity yet</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${getConfidenceColor(module.confidenceScore)}`}>
                        {module.confidenceScore}%
                      </div>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{module.completed} of {module.total} completed</span>
                        <span>{Math.round((module.completed / module.total) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(module.completed / module.total) * 100} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => navigate(module.path)}
                      >
                        Continue Learning
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <DailyAllocation
            userType={isPremium ? "premium" : "free"}
            allocatedToday={mockDailyAllocations}
            onStartExercise={(section) => {
              // Navigate to the appropriate section
              switch (section) {
                case 'vocabulary':
                case 'grammar':
                  navigate('/flashcards');
                  break;
                case 'listening':
                  navigate('/listening');
                  break;
                case 'reading':
                  navigate('/reading');
                  break;
                case 'writing':
                  navigate('/writing');
                  break;
                case 'speaking':
                  navigate('/speaking');
                  break;
                default:
                  navigate('/dashboard');
              }
            }}
            resetTime={new Date(new Date().setHours(24, 0, 0, 0))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
            <CardDescription>
              Based on your performance and learning habits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <Headphones className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">Listening Exercise</h3>
                  <p className="text-xs text-muted-foreground">Improve your comprehension skills</p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate('/listening')}>Start</Button>
            </div>
            
            <div className="border rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Mic className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Speaking Practice</h3>
                  <p className="text-xs text-muted-foreground">Your lowest confidence area</p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate('/speaking')}>Start</Button>
            </div>
            
            <div className="border rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Flashcard className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Grammar Review</h3>
                  <p className="text-xs text-muted-foreground">Focus on verb conjugations</p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate('/flashcards')}>Start</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest learning progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-green-500 pl-4 py-1">
                <p className="text-sm font-medium">Completed Listening Exercise</p>
                <p className="text-xs text-muted-foreground">Score: 85% • Today</p>
              </div>
              
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="text-sm font-medium">Reviewed 15 Flashcards</p>
                <p className="text-xs text-muted-foreground">Mastered: 12 • Yesterday</p>
              </div>
              
              <div className="border-l-2 border-amber-500 pl-4 py-1">
                <p className="text-sm font-medium">Completed Writing Exercise</p>
                <p className="text-xs text-muted-foreground">Score: 70% • 2 days ago</p>
              </div>
              
              <div className="border-l-2 border-purple-500 pl-4 py-1">
                <p className="text-sm font-medium">Practiced Speaking</p>
                <p className="text-xs text-muted-foreground">Score: 65% • 3 days ago</p>
              </div>
              
              <div className="border-l-2 border-gray-300 pl-4 py-1">
                <p className="text-sm font-medium">Added 5 New Flashcards</p>
                <p className="text-xs text-muted-foreground">Category: Vocabulary • 4 days ago</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/progress')}>
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
