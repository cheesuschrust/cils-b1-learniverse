
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Cpu, Database, HardDrive, Server } from 'lucide-react';

interface AIModelSummaryCardProps {
  title: string;
  value: string | number;
  icon?: 'brain' | 'cpu' | 'database' | 'server' | 'storage';
  progress?: number;
  changePercentage?: number;
  subtitle?: string;
  className?: string;
}

const AIModelSummaryCard: React.FC<AIModelSummaryCardProps> = ({
  title,
  value,
  icon = 'brain',
  progress,
  changePercentage,
  subtitle,
  className
}) => {
  const getIcon = () => {
    switch(icon) {
      case 'brain': return <Brain className="h-5 w-5 text-primary" />;
      case 'cpu': return <Cpu className="h-5 w-5 text-primary" />;
      case 'database': return <Database className="h-5 w-5 text-primary" />;
      case 'server': return <Server className="h-5 w-5 text-primary" />;
      case 'storage': return <HardDrive className="h-5 w-5 text-primary" />;
      default: return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium flex items-center">
          {getIcon()}
          <span className="ml-2">{title}</span>
        </CardTitle>
        {changePercentage !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            changePercentage >= 0 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {changePercentage > 0 ? '+' : ''}{changePercentage}%
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-2" />
        )}
      </CardContent>
    </Card>
  );
};

export default AIModelSummaryCard;
