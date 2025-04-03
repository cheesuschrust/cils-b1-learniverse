
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, FileText, BookOpen, PenLine, Mic, HeadphonesIcon } from 'lucide-react';

interface ContentStatsCardsProps {
  period: string;
}

const ContentStatsCards: React.FC<ContentStatsCardsProps> = ({ period }) => {
  // Mock data - in a real app, this would come from API
  const stats = {
    totalContent: 3921,
    flashcards: 1425,
    multipleChoice: 856,
    reading: 742,
    writing: 524,
    speaking: 374
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Total Content
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalContent}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+32</span>
            <span className="ml-1">this week</span>
          </div>
          <Progress value={85} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Flashcards
            <Badge className="bg-blue-500">36.3%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.flashcards}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+14</span>
            <span className="ml-1">this week</span>
          </div>
          <Progress value={36.3} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Quizzes
            <Badge className="bg-green-500">21.8%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.multipleChoice}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+7</span>
            <span className="ml-1">this week</span>
          </div>
          <Progress value={21.8} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Reading
            <Badge className="bg-purple-500">18.9%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.reading}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+5</span>
            <span className="ml-1">this week</span>
          </div>
          <Progress value={18.9} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Writing
            <Badge className="bg-amber-500">13.4%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.writing}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+3</span>
            <span className="ml-1">this week</span>
          </div>
          <Progress value={13.4} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Speaking
            <Badge className="bg-rose-500">9.5%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.speaking}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+3</span>
            <span className="ml-1">this week</span>
          </div>
          <Progress value={9.5} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStatsCards;
