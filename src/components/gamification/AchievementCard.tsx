
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/types/gamification';
import { Lock, Star, Trophy, Calendar } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { it } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { SpeakableWord } from '@/components/ui/speakable-word';
import { TranslateButton } from '@/components/language/TranslateButton';

interface AchievementCardProps {
  achievement: Achievement;
  progress?: number;
  className?: string;
  onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  progress = 0,
  className,
  onClick
}) => {
  const { language } = useLanguage();
  const {
    name,
    nameItalian,
    description,
    descriptionItalian,
    category,
    points,
    progressRequired = 100,
    dateUnlocked,
    isHidden = false
  } = achievement;
  
  const isUnlocked = dateUnlocked !== undefined;
  const progressPercentage = Math.min(100, (progress / progressRequired) * 100);
  
  const getDisplayName = () => {
    switch (language) {
      case 'english': return name;
      case 'italian': return nameItalian || name;
      case 'both': return `${name}${nameItalian ? ` / ${nameItalian}` : ''}`;
      default: return name;
    }
  };
  
  const getDisplayDescription = () => {
    switch (language) {
      case 'english': return description;
      case 'italian': return descriptionItalian || description;
      case 'both': return `${description}${descriptionItalian ? `\n${descriptionItalian}` : ''}`;
      default: return description;
    }
  };
  
  const formatUnlockDate = () => {
    if (!dateUnlocked) return '';
    
    const date = new Date(dateUnlocked);
    const now = new Date();
    
    return formatDistance(date, now, { 
      addSuffix: true,
      locale: language === 'italian' ? it : undefined
    });
  };
  
  const getCategoryLabel = () => {
    const categories: Record<Achievement['category'], { en: string, it: string }> = {
      'learning': { en: 'Learning', it: 'Apprendimento' },
      'streak': { en: 'Streak', it: 'Serie' },
      'mastery': { en: 'Mastery', it: 'Maestria' },
      'social': { en: 'Social', it: 'Sociale' },
      'general': { en: 'General', it: 'Generale' }
    };
    
    const cat = categories[category] || categories.general;
    
    switch (language) {
      case 'english': return cat.en;
      case 'italian': return cat.it;
      case 'both': return `${cat.en} / ${cat.it}`;
      default: return cat.en;
    }
  };
  
  // Early return for hidden, locked achievements (if we don't want to show them)
  if (isHidden && !isUnlocked) {
    return null;
  }
  
  return (
    <Card 
      className={`${className} ${isUnlocked ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10' : 'opacity-70'} transition-all hover:shadow-md`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={isUnlocked ? "default" : "outline"} className="mb-2">
            {getCategoryLabel()}
          </Badge>
          
          {isUnlocked ? (
            <Trophy className="h-5 w-5 text-amber-500" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        
        <CardTitle className="flex items-center gap-2">
          {getDisplayName()}
          
          {(language === 'english' && nameItalian) || (language === 'italian' && name) && (
            <TranslateButton 
              english={name} 
              italian={nameItalian || name} 
              size="sm"
              variant="ghost"
            />
          )}
          
          {isUnlocked && (
            <SpeakableWord 
              word={language === 'english' ? name : (nameItalian || name)}
              language={language === 'english' ? 'en-US' : 'it-IT'}
              iconOnly
              size="sm"
            />
          )}
        </CardTitle>
        
        <CardDescription className="mt-1">
          {getDisplayDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isUnlocked && progressRequired > 0 && (
          <div className="space-y-2">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>{progress} / {progressRequired}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between text-sm">
        <div className="flex items-center gap-1 text-amber-600">
          <Star className="h-4 w-4" />
          <span>{points} {language === 'english' ? 'points' : 'punti'}</span>
        </div>
        
        {isUnlocked && dateUnlocked && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatUnlockDate()}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AchievementCard;
