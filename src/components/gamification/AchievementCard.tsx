
import React from 'react';
import { Award, Trophy, Star, Zap, Check, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types/gamification';
import { BilingualText } from '@/components/language/BilingualText';
import { SpeakableWord } from '@/components/ui/speakable-word';
import { useLanguage } from '@/contexts/LanguageContext';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked?: boolean;
  progress?: number;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  unlocked = false,
  progress = 0,
  className
}) => {
  const { language } = useLanguage();
  
  // Get icon based on achievement category
  const getIcon = () => {
    switch (achievement.category) {
      case 'learning':
        return <Star className={cn("h-5 w-5", unlocked ? "text-amber-500" : "text-muted-foreground")} />;
      case 'streak':
        return <Zap className={cn("h-5 w-5", unlocked ? "text-orange-500" : "text-muted-foreground")} />;
      case 'mastery':
        return <Trophy className={cn("h-5 w-5", unlocked ? "text-indigo-500" : "text-muted-foreground")} />;
      case 'social':
        return <Check className={cn("h-5 w-5", unlocked ? "text-green-500" : "text-muted-foreground")} />;
      default:
        return <Award className={cn("h-5 w-5", unlocked ? "text-primary" : "text-muted-foreground")} />;
    }
  };

  // Determine the color style based on the achievement category
  const getCategoryColor = () => {
    if (!unlocked) return "bg-muted text-muted-foreground";
    
    switch (achievement.category) {
      case 'learning':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case 'streak':
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case 'mastery':
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case 'social':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getAudioButtonLanguage = () => {
    if (language === 'english') return 'en-US';
    if (language === 'italian') return 'it-IT';
    return achievement.nameItalian ? 'it-IT' : 'en-US'; // Default to Italian if available
  };

  return (
    <Card className={cn("relative overflow-hidden transition-all", 
      unlocked ? "border-primary/20" : "border-muted-foreground/20 opacity-80",
      className
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className={cn(
            "p-2 rounded-lg",
            unlocked ? getCategoryColor() : "bg-muted"
          )}>
            {getIcon()}
          </div>
          <div className="flex items-center space-x-2">
            {unlocked && (
              <Badge variant="outline" className="bg-primary/10">+{achievement.points} XP</Badge>
            )}
            {!unlocked && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <BilingualText
              english={achievement.name}
              italian={achievement.nameItalian || achievement.name}
              className="font-medium"
            />
            {unlocked && achievement.name && (
              <SpeakableWord 
                word={language === 'italian' ? (achievement.nameItalian || achievement.name) : achievement.name} 
                language={getAudioButtonLanguage()}
                size="sm"
                iconOnly
              />
            )}
          </div>
          
          <BilingualText
            english={achievement.description}
            italian={achievement.descriptionItalian || achievement.description}
            className="text-sm text-muted-foreground"
          />
        </div>
        
        {achievement.progressRequired && (
          <div className="space-y-1">
            <Progress value={(progress / achievement.progressRequired) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {progress}/{achievement.progressRequired}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
