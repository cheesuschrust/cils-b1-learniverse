
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface LevelUpNotificationProps {
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
  className?: string;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  oldLevel,
  newLevel,
  onClose,
  className,
}) => {
  // Trigger confetti effect when component mounts
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8, x: 0.8 }
    });
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-full md:w-80 rounded-lg shadow-lg overflow-hidden border bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800",
        className
      )}
    >
      <div className="p-4 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full flex items-center justify-center mb-3 bg-indigo-200 dark:bg-indigo-800">
          <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <h3 className="font-bold text-xl">Level Up!</h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-indigo-200 dark:bg-indigo-800 h-8 w-8 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
            {oldLevel}
          </div>
          <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <div className="bg-indigo-600 dark:bg-indigo-500 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {newLevel}
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mt-3 mb-2">
          Congratulations! You've reached a new level in your Italian learning journey.
        </p>
        
        <div className="bg-indigo-200 dark:bg-indigo-800 rounded-full px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-3">
          New abilities unlocked!
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" asChild>
            <Link to="/profile">
              View Profile <Award className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LevelUpNotification;
