
import React from 'react';
import { Achievement } from '@/types/gamification';
import AchievementBadge from './AchievementBadge';
import { cn } from '@/lib/utils';

interface AchievementsGridProps {
  achievements: Achievement[];
  filter?: string;
  className?: string;
}

const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements,
  filter,
  className
}) => {
  // Filter achievements by category if filter is provided
  const filteredAchievements = filter 
    ? achievements.filter(a => a.category === filter)
    : achievements;
    
  // Group achievements by category for display
  const groupedAchievements = filteredAchievements.reduce<Record<string, Achievement[]>>((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});
  
  // Get category display name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'learning': return 'Learning';
      case 'streak': return 'Streaks';
      case 'mastery': return 'Mastery';
      case 'social': return 'Social';
      case 'challenge': return 'Challenges';
      case 'special': return 'Special';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  if (filteredAchievements.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No achievements found.
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <div key={category} className="space-y-3">
          <h3 className="font-medium text-lg">{getCategoryName(category)}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {categoryAchievements.map(achievement => (
              <div key={achievement.id} className="flex flex-col items-center gap-2">
                <AchievementBadge achievement={achievement} size="md" />
                <div className="text-xs text-center font-medium truncate w-full">
                  {achievement.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsGrid;
