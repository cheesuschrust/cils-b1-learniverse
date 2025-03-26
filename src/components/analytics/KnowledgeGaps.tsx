
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface KnowledgeGapsProps {
  data: Array<{
    tag: string;
    count: number;
    difficulty: string[];
    percentage: number;
  }>;
}

const KnowledgeGaps: React.FC<KnowledgeGapsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No knowledge gaps identified yet</p>
      </div>
    );
  }

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {data.slice(0, 5).map((gap, index) => (
        <div key={gap.tag} className="space-y-2">
          <div className="flex justify-between">
            <h4 className="font-medium">{gap.tag}</h4>
            <span className="text-sm text-muted-foreground">{gap.percentage}%</span>
          </div>
          
          <Progress value={gap.percentage} className="h-2" />
          
          <div className="flex flex-wrap gap-1 mt-1">
            {gap.difficulty.map(diff => (
              <Badge 
                key={diff} 
                variant="outline"
                className={`text-xs ${getDifficultyColor(diff)}`}
              >
                {diff}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KnowledgeGaps;
