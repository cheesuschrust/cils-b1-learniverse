
import React from 'react';
import { BookOpen, Clock, ArrowRight, TrendingDown, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface StudyRecommendationProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number; // in minutes
    reason: 'weak-area' | 'upcoming-exam' | 'daily-goal' | 'streak-maintenance';
    link: string;
  };
  onDismiss?: () => void;
  className?: string;
}

const StudyRecommendation: React.FC<StudyRecommendationProps> = ({ 
  recommendation,
  onDismiss,
  className
}) => {
  // Get badge color based on category
  const getBadgeVariant = () => {
    switch (recommendation.category.toLowerCase()) {
      case 'grammar':
        return 'outline';
      case 'vocabulary':
        return 'secondary';
      case 'reading':
        return 'default';
      case 'writing':
        return 'destructive';
      case 'listening':
        return 'blue';
      case 'speaking':
        return 'green';
      default:
        return 'outline';
    }
  };

  // Get reason icon and text
  const getReasonInfo = () => {
    switch (recommendation.reason) {
      case 'weak-area':
        return {
          icon: <TrendingDown className="h-4 w-4 text-red-500 mr-1" />,
          text: 'Needs improvement',
          color: 'text-red-600',
        };
      case 'upcoming-exam':
        return {
          icon: <Clock className="h-4 w-4 text-orange-500 mr-1" />,
          text: 'Exam preparation',
          color: 'text-orange-600',
        };
      case 'daily-goal':
        return {
          icon: <BookOpen className="h-4 w-4 text-green-500 mr-1" />,
          text: 'Daily goal',
          color: 'text-green-600',
        };
      case 'streak-maintenance':
        return {
          icon: <Brain className="h-4 w-4 text-blue-500 mr-1" />,
          text: 'For your streak',
          color: 'text-blue-600',
        };
      default:
        return {
          icon: <BookOpen className="h-4 w-4 text-primary mr-1" />,
          text: 'Recommended',
          color: 'text-primary',
        };
    }
  };

  const reasonInfo = getReasonInfo();

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          <Badge variant={getBadgeVariant()} className="capitalize">
            {recommendation.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-3">
          {recommendation.description}
        </p>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            {reasonInfo.icon}
            <span className={reasonInfo.color}>{reasonInfo.text}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">
              {recommendation.estimatedTime} min
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
        <Button size="sm" className="ml-auto" asChild>
          <Link to={recommendation.link}>
            Start Learning <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyRecommendation;
