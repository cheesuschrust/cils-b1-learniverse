
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Lock } from 'lucide-react';
import BilingualText from '@/components/language/BilingualText';

interface AchievementProgressProps {
  title: {
    english: string;
    italian: string;
  };
  description?: {
    english: string;
    italian: string;
  };
  current: number;
  target: number;
  isCompleted?: boolean;
  category?: string;
  points?: number;
}

export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  title,
  description,
  current,
  target,
  isCompleted = false,
  category,
  points = 0
}) => {
  const { language } = useLanguage();
  const progress = Math.min(100, (current / target) * 100);
  
  const getCategoryLabel = (cat: string) => {
    const categories: Record<string, { en: string, it: string }> = {
      'learning': { en: 'Learning', it: 'Apprendimento' },
      'streak': { en: 'Streak', it: 'Serie' },
      'mastery': { en: 'Mastery', it: 'Maestria' },
      'social': { en: 'Social', it: 'Sociale' },
      'general': { en: 'General', it: 'Generale' }
    };
    
    const categoryInfo = categories[cat.toLowerCase()] || categories.general;
    
    switch (language) {
      case 'english': return categoryInfo.en;
      case 'italian': return categoryInfo.it;
      case 'both': return `${categoryInfo.en} / ${categoryInfo.it}`;
      default: return categoryInfo.en;
    }
  };
  
  return (
    <div className={`p-4 border rounded-lg ${isCompleted ? 'bg-primary/5 border-primary/20' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        {category && (
          <Badge variant={isCompleted ? "default" : "outline"} className="mb-2">
            {getCategoryLabel(category)}
          </Badge>
        )}
        
        {isCompleted ? (
          <Trophy className="h-5 w-5 text-amber-500" />
        ) : (
          <Lock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
        <BilingualText
          english={title.english}
          italian={title.italian}
          showTranslate={false}
          className="inline-flex"
        />
      </h3>
      
      {description && (
        <BilingualText
          english={description.english}
          italian={description.italian}
          className="text-sm text-muted-foreground mb-3"
        />
      )}
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between text-sm">
          <span>
            {current}/{target} {language === 'english' ? 'completed' : language === 'italian' ? 'completati' : 'completed/completati'}
          </span>
          
          {points > 0 && (
            <span className="text-amber-600">
              {points} {language === 'english' ? 'points' : language === 'italian' ? 'punti' : 'points/punti'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementProgress;
