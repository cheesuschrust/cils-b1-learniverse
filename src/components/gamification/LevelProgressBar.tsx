
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { calculateLevelProgress } from '@/lib/learning-utils';

interface LevelProgressBarProps {
  currentXP: number;
  level: number;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ currentXP, level }) => {
  const [levelInfo, setLevelInfo] = useState({
    level: 1,
    currentLevelXp: 0,
    nextLevelXp: 100,
    xpProgress: 0
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);

  useEffect(() => {
    // Calculate level progress based on XP
    const progress = calculateLevelProgress(currentXP);
    setLevelInfo(progress);
    
    // Check for level up animation
    if (level > prevLevel) {
      setShowLevelUp(true);
      const timer = setTimeout(() => {
        setShowLevelUp(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    setPrevLevel(level);
  }, [currentXP, level, prevLevel]);

  // Calculate percentage progress to next level
  const progressPercentage = ((levelInfo.xpProgress) / 
    (levelInfo.nextLevelXp - levelInfo.currentLevelXp)) * 100;

  // Get level title based on level number
  const getLevelTitle = (level: number): string => {
    if (level < 5) return 'Beginner';
    if (level < 10) return 'Elementary';
    if (level < 15) return 'Intermediate';
    if (level < 20) return 'Advanced';
    if (level < 25) return 'Expert';
    if (level < 30) return 'Master';
    return 'Grand Master';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {levelInfo.level}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div>
            <h3 className="font-medium leading-none">{getLevelTitle(levelInfo.level)}</h3>
            <p className="text-xs text-muted-foreground mt-1">Level {levelInfo.level}</p>
          </div>
        </div>
        
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-amber-500">
                Level Up!
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">
            {levelInfo.xpProgress} / {levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP
          </span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span>Level {levelInfo.level + 1}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next level: {getLevelTitle(levelInfo.level + 1)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Level {levelInfo.level}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>
    </div>
  );
};

export default LevelProgressBar;
