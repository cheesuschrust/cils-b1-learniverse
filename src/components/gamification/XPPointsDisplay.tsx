
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPPointsDisplayProps {
  xp: number;
  xpToday?: number;
  showTodayXP?: boolean;
  className?: string;
}

const XPPointsDisplay: React.FC<XPPointsDisplayProps> = ({
  xp,
  xpToday = 0,
  showTodayXP = false,
  className = ''
}) => {
  const [prevXp, setPrevXp] = useState(xp);
  const [isIncreasing, setIsIncreasing] = useState(false);

  // Track XP changes for animation
  useEffect(() => {
    if (xp > prevXp) {
      setIsIncreasing(true);
      const timer = setTimeout(() => {
        setIsIncreasing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    setPrevXp(xp);
  }, [xp, prevXp]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="flex items-center gap-1 py-1 px-3 font-medium border-1 border-amber-200 bg-amber-50"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isIncreasing ? [1, 1.2, 1] : 1,
                  color: isIncreasing ? ['#d97706', '#fbbf24', '#d97706'] : '#d97706'
                }}
                transition={{ duration: 1 }}
              >
                ✨
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={xp}
                  initial={{ y: isIncreasing ? 10 : 0, opacity: isIncreasing ? 0 : 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: isIncreasing ? -10 : 0, opacity: isIncreasing ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-amber-600"
                >
                  {xp.toLocaleString()} XP
                </motion.div>
              </AnimatePresence>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your total experience points</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showTodayXP && xpToday > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50 border-green-200">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+{xpToday} today</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>XP earned today</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default XPPointsDisplay;
