
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Trophy, TrendingUp, Zap, BookOpen, Headphones, Edit, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProgressData {
  vocabulary: number;
  grammar: number;
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
  culture: number;
  citizenship: number;
}

interface UserProgressDashboardProps {
  userName?: string;
  streak?: number;
  lastActive?: Date;
  isItalianLevel?: string;
  progressData?: ProgressData;
}

const UserProgressDashboard: React.FC<UserProgressDashboardProps> = ({
  userName = "User",
  streak = 0,
  lastActive = new Date(),
  isItalianLevel = "B1 Intermediate",
  progressData
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Default progress data if none provided
  const progress: ProgressData = progressData || {
    vocabulary: 65,
    grammar: 45,
    reading: 70,
    writing: 30,
    listening: 50,
    speaking: 25,
    culture: 60,
    citizenship: 40
  };
  
  // Calculate overall progress as average of all areas
  const overallProgress = Object.values(progress).reduce((sum, value) => sum + value, 0) / Object.keys(progress).length;
  
  // Recommend focus areas (lowest progress areas)
  const focusAreas = Object.entries(progress)
    .sort(([, valueA], [, valueB]) => valueA - valueB)
    .slice(0, 3)
    .map(([key]) => key);
  
  // Format last active date
  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Welcome back, {userName}</CardTitle>
              <CardDescription>
                Your Italian citizenship exam preparation progress
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last active: {formatLastActive(lastActive)}
                </span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                <span className="text-sm font-medium">
                  {streak} day streak
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Progress Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Overall Citizenship Test Readiness</h3>
                  <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                </div>
                
                <Progress value={overallProgress} className="h-2" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Not Ready</span>
                  <span>Ready for Exam</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Focus Areas</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {focusAreas.map((area) => (
                      <div key={area} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{area}</span>
                        <Badge variant="outline" className="text-xs py-0">
                          {progress[area as keyof ProgressData]}% complete
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/${focusAreas[0]}`}>
                      Practice {focusAreas[0]} Now
                    </Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium">Italian Level</h3>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center h-20">
                    <span className="text-2xl font-bold">{isItalianLevel}</span>
                    <span className="text-xs text-muted-foreground">Current Assessment</span>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Take Assessment Test
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Vocabulary</h3>
                    <span className="ml-auto text-sm">{progress.vocabulary}%</span>
                  </div>
                  <Progress value={progress.vocabulary} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Grammar</h3>
                    <span className="ml-auto text-sm">{progress.grammar}%</span>
                  </div>
                  <Progress value={progress.grammar} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Reading</h3>
                    <span className="ml-auto text-sm">{progress.reading}%</span>
                  </div>
                  <Progress value={progress.reading} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Writing</h3>
                    <span className="ml-auto text-sm">{progress.writing}%</span>
                  </div>
                  <Progress value={progress.writing} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Headphones className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Listening</h3>
                    <span className="ml-auto text-sm">{progress.listening}%</span>
                  </div>
                  <Progress value={progress.listening} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Speaking</h3>
                    <span className="ml-auto text-sm">{progress.speaking}%</span>
                  </div>
                  <Progress value={progress.speaking} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Culture & Citizenship</h3>
                    <span className="ml-auto text-sm">{progress.culture}%</span>
                  </div>
                  <Progress value={progress.culture} className="h-2" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/plan">
              View Your Study Plan
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProgressDashboard;
