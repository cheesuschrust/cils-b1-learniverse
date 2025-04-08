
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  File, 
  Clock, 
  Check, 
  BookOpen,
  Headphones, 
  Pen, 
  Mic,
  CalendarCheck, 
  Play, 
  Award,
  ArrowLeft,
  Calendar as CalendarIcon,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock study plan data
const studyPlanWeeks = [
  {
    id: 1,
    title: 'Week 1: Basics & Introduction',
    description: 'Getting started with essential vocabulary and basic grammar',
    progress: 100,
    isCompleted: true,
    days: [
      {
        id: 1,
        title: 'Day 1: Introductions',
        activities: [
          { id: 1, type: 'vocabulary', title: 'Basic Greetings', duration: 20, isCompleted: true },
          { id: 2, type: 'grammar', title: 'Present Tense Basics', duration: 25, isCompleted: true },
          { id: 3, type: 'speaking', title: 'Introduction Practice', duration: 15, isCompleted: true }
        ]
      },
      {
        id: 2,
        title: 'Day 2: Personal Information',
        activities: [
          { id: 4, type: 'vocabulary', title: 'Personal Details', duration: 20, isCompleted: true },
          { id: 5, type: 'writing', title: 'Writing Your Profile', duration: 20, isCompleted: true },
          { id: 6, type: 'quiz', title: 'Day 2 Review Quiz', duration: 10, isCompleted: true }
        ]
      },
      // More days...
    ]
  },
  {
    id: 2,
    title: 'Week 2: Daily Life & Citizenship',
    description: 'Vocabulary and structures related to everyday life in Italy',
    progress: 75,
    isCompleted: false,
    days: [
      {
        id: 8,
        title: 'Day 8: Daily Routines',
        activities: [
          { id: 20, type: 'vocabulary', title: 'Daily Activities', duration: 20, isCompleted: true },
          { id: 21, type: 'grammar', title: 'Reflexive Verbs', duration: 25, isCompleted: true },
          { id: 22, type: 'listening', title: 'Listening: Daily Routines', duration: 15, isCompleted: false }
        ]
      },
      {
        id: 9,
        title: 'Day 9: Public Services',
        activities: [
          { id: 23, type: 'vocabulary', title: 'Public Offices and Services', duration: 20, isCompleted: true },
          { id: 24, type: 'reading', title: 'Reading: At the Post Office', duration: 20, isCompleted: true },
          { id: 25, type: 'quiz', title: 'Day 9 Review Quiz', duration: 10, isCompleted: false }
        ]
      },
      // More days...
    ]
  },
  {
    id: 3,
    title: 'Week 3: Work & Education',
    description: 'Terms and expressions related to professional life and education',
    progress: 30,
    isCompleted: false,
    days: [
      {
        id: 15,
        title: 'Day 15: Professions',
        activities: [
          { id: 40, type: 'vocabulary', title: 'Jobs and Professions', duration: 20, isCompleted: true },
          { id: 41, type: 'grammar', title: 'Future Tense', duration: 25, isCompleted: false },
          { id: 42, type: 'speaking', title: 'Talking About Your Job', duration: 15, isCompleted: false }
        ]
      },
      {
        id: 16,
        title: 'Day 16: Education System',
        activities: [
          { id: 43, type: 'vocabulary', title: 'Schools and Universities', duration: 20, isCompleted: true },
          { id: 44, type: 'reading', title: 'Italian Education System', duration: 20, isCompleted: false },
          { id: 45, type: 'quiz', title: 'Day 16 Review Quiz', duration: 10, isCompleted: false }
        ]
      },
      // More days...
    ]
  },
  {
    id: 4,
    title: 'Week 4: Housing & Environment',
    description: 'Vocabulary related to housing, environment and citizenship',
    progress: 0,
    isCompleted: false,
    days: [
      {
        id: 22,
        title: 'Day 22: Housing',
        activities: [
          { id: 60, type: 'vocabulary', title: 'Houses and Apartments', duration: 20, isCompleted: false },
          { id: 61, type: 'grammar', title: 'Prepositions of Place', duration: 25, isCompleted: false },
          { id: 62, type: 'listening', title: 'Listening: Apartment Hunting', duration: 15, isCompleted: false }
        ]
      },
      {
        id: 23,
        title: 'Day 23: Environment',
        activities: [
          { id: 63, type: 'vocabulary', title: 'Environment and Sustainability', duration: 20, isCompleted: false },
          { id: 64, type: 'writing', title: 'Writing: Environmental Issues', duration: 20, isCompleted: false },
          { id: 65, type: 'quiz', title: 'Day 23 Review Quiz', duration: 10, isCompleted: false }
        ]
      },
      // More days...
    ]
  }
];

const StudyPlanPage = () => {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1, 2]);
  const [selectedViewMode, setSelectedViewMode] = useState<string>('weeks');
  const { toast } = useToast();
  
  const toggleWeekExpansion = (weekId: number) => {
    if (expandedWeeks.includes(weekId)) {
      setExpandedWeeks(expandedWeeks.filter(id => id !== weekId));
    } else {
      setExpandedWeeks([...expandedWeeks, weekId]);
    }
  };
  
  const markActivityComplete = (activityId: number) => {
    // In a real app, this would update the activity in the database
    toast({
      title: "Activity Completed",
      description: "Your progress has been updated.",
    });
  };
  
  const startActivity = (activity: { id: number, title: string, type: string }) => {
    // In a real app, this would navigate to the activity
    toast({
      title: "Starting Activity",
      description: `Loading: ${activity.title}`,
    });
  };
  
  const generateStudyPlan = () => {
    toast({
      title: "Study Plan Generated",
      description: "Your personalized study plan has been updated based on your progress.",
    });
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return <BookOpen className="h-4 w-4" />;
      case 'grammar':
        return <File className="h-4 w-4" />;
      case 'reading':
        return <BookOpen className="h-4 w-4" />;
      case 'writing':
        return <Pen className="h-4 w-4" />;
      case 'listening':
        return <Headphones className="h-4 w-4" />;
      case 'speaking':
        return <Mic className="h-4 w-4" />;
      case 'quiz':
        return <Award className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  // Determine today's study activities
  const today = new Date();
  const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  
  // For demo purposes, we'll use Week 2, Day 9 as "today"
  const currentWeek = studyPlanWeeks[1];
  const currentDay = currentWeek.days[1];
  
  const overallProgress = Math.round(
    studyPlanWeeks.reduce((acc, week) => acc + week.progress, 0) / studyPlanWeeks.length
  );

  return (
    <>
      <Helmet>
        <title>Study Plan | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Your personalized study plan for the CILS B1 citizenship test - organized day by day to maximize your progress." />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/exam-prep">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exam Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Study Plan</h1>
            <p className="text-muted-foreground">Personalized preparation for your CILS B1 citizenship exam</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedViewMode} onValueChange={setSelectedViewMode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weeks">Weekly View</SelectItem>
                <SelectItem value="days">Daily View</SelectItem>
                <SelectItem value="calendar">Calendar View</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Export Calendar
            </Button>
            
            <Button onClick={generateStudyPlan}>
              <Settings className="mr-2 h-4 w-4" />
              Adjust Plan
            </Button>
          </div>
        </div>
        
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Study Plan Progress</CardTitle>
            <CardDescription>
              Track your overall preparation progress for the CILS B1 exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Overall progress</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {studyPlanWeeks.map(week => (
                  <div key={week.id} className="border rounded p-3">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Week {week.id}</span>
                      <span className="font-medium">{week.progress}%</span>
                    </div>
                    <Progress value={week.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Today's Plan */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between">
              <div>
                <CardTitle>Today's Study Plan</CardTitle>
                <CardDescription>{todayFormatted}</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <CalendarCheck className="mr-1 h-4 w-4" />
                Day {currentDay.id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-lg mb-3">{currentDay.title}</h3>
            <div className="space-y-4">
              {currentDay.activities.map(activity => (
                <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${activity.isCompleted ? 'bg-green-100' : 'bg-primary/10'}`}>
                    {activity.isCompleted ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      getActivityIcon(activity.type)
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {activity.duration} minutes
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2 md:mt-0">
                        <Badge variant="outline" className="mr-2 capitalize">
                          {activity.type}
                        </Badge>
                        
                        {activity.isCompleted ? (
                          <Button size="sm" variant="outline" className="h-8">
                            Review
                          </Button>
                        ) : (
                          <Button size="sm" className="h-8" onClick={() => startActivity(activity)}>
                            <Play className="mr-1 h-3 w-3" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous Day
              </Button>
              <div className="text-sm text-muted-foreground">
                {currentDay.activities.filter(a => a.isCompleted).length} of {currentDay.activities.length} activities completed
              </div>
              <Button variant="outline" size="sm">
                Next Day
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Weekly Plan */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Complete Study Plan</h2>
          
          {studyPlanWeeks.map(week => (
            <Card key={week.id}>
              <CardHeader className="pb-3">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleWeekExpansion(week.id)}
                >
                  <div>
                    <CardTitle className="flex items-center">
                      {week.title}
                      {week.isCompleted && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{week.description}</CardDescription>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-sm font-medium">{week.progress}%</div>
                    {expandedWeeks.includes(week.id) ? (
                      <ChevronRight className="h-5 w-5 transform rotate-90" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedWeeks.includes(week.id) && (
                <CardContent>
                  <div className="space-y-5">
                    {week.days.map(day => (
                      <div key={day.id} className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">{day.title}</h3>
                        <div className="space-y-3">
                          {day.activities.map(activity => (
                            <div key={activity.id} className="flex items-center gap-3 p-2.5 border rounded-md">
                              <div className={`p-1.5 rounded-full ${activity.isCompleted ? 'bg-green-100' : 'bg-primary/10'}`}>
                                {activity.isCompleted ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  getActivityIcon(activity.type)
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <div className="font-medium">{activity.title}</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {activity.duration} minutes
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center mt-2 md:mt-0">
                                    <Badge variant="outline" className="mr-2 text-xs capitalize">
                                      {activity.type}
                                    </Badge>
                                    
                                    {activity.isCompleted ? (
                                      <Button size="sm" variant="outline" className="h-7 text-xs">
                                        Review
                                      </Button>
                                    ) : (
                                      <Button size="sm" className="h-7 text-xs" onClick={() => startActivity(activity)}>
                                        <Play className="mr-1 h-3 w-3" />
                                        Start
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudyPlanPage;
