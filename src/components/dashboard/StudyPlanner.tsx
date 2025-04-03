
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, PencilLine, AlarmClock, BookOpen, FileText, Headphones, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface StudyPlannerProps {
  userId?: string;
  onPlanUpdate?: () => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ 
  userId, 
  onPlanUpdate 
}) => {
  // Define study areas with icons and paths
  const studyAreas = [
    { name: 'vocabulary', icon: <BookOpen className="h-4 w-4" />, path: '/vocabulary' },
    { name: 'grammar', icon: <PencilLine className="h-4 w-4" />, path: '/grammar' },
    { name: 'reading', icon: <FileText className="h-4 w-4" />, path: '/reading' },
    { name: 'listening', icon: <Headphones className="h-4 w-4" />, path: '/listening' },
    { name: 'speaking', icon: <MessageSquare className="h-4 w-4" />, path: '/speaking' },
    { name: 'citizenship', icon: <BookOpen className="h-4 w-4" />, path: '/citizenship' },
  ];

  // Sample schedule data - in a real app, this would come from the database
  const todaySchedule = [
    { time: '10:00', activity: 'Daily Question', duration: 5, path: '/daily-question' },
    { time: '15:00', activity: 'Reading Practice', duration: 15, path: '/reading' },
    { time: '19:00', activity: 'Vocabulary Review', duration: 10, path: '/vocabulary' },
  ];

  const weekSchedule = {
    'Monday': ['Daily Question', 'Grammar Practice'],
    'Tuesday': ['Daily Question', 'Reading Practice'],
    'Wednesday': ['Daily Question', 'Listening Practice'],
    'Thursday': ['Daily Question', 'Speaking Practice'],
    'Friday': ['Daily Question', 'Citizenship Test Prep'],
    'Saturday': ['Vocabulary Review', 'Grammar Review'],
    'Sunday': ['Mock Test', 'Progress Review'],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Planner</CardTitle>
        <CardDescription>
          Organize your CILS B1 exam preparation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                
                <Button variant="outline" size="sm">
                  <PencilLine className="h-3.5 w-3.5 mr-1" />
                  Edit Plan
                </Button>
              </div>
              
              {todaySchedule.length > 0 ? (
                <div className="space-y-2">
                  {todaySchedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted h-9 w-9 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.activity}</p>
                          <p className="text-xs text-muted-foreground">{item.time} · {item.duration} min</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={item.path}>Start</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <AlarmClock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <h3 className="font-medium mb-1">No activities scheduled</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan your study schedule to stay on track
                  </p>
                  <Button>Create Plan</Button>
                </div>
              )}
              
              <div className="pt-4">
                <h3 className="font-medium mb-3">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {studyAreas.map((area) => (
                    <Badge
                      key={area.name}
                      variant="outline"
                      className="flex items-center gap-1 px-3 py-1 capitalize hover:bg-accent cursor-pointer"
                      asChild
                    >
                      <Link to={area.path}>
                        {area.icon}
                        {area.name}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="mt-4">
            <div className="space-y-4">
              {Object.entries(weekSchedule).map(([day, activities]) => (
                <div key={day} className="border rounded-md p-3">
                  <h3 className="font-medium text-sm mb-2">{day}</h3>
                  <div className="flex flex-wrap gap-2">
                    {activities.map((activity, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link to="/progress">View Progress</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/daily-question">Today's Question</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StudyPlanner;
