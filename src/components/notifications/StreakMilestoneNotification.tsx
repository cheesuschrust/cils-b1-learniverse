
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface StreakMilestoneNotificationProps {
  days: number;
  onClose: () => void;
  className?: string;
}

const StreakMilestoneNotification: React.FC<StreakMilestoneNotificationProps> = ({
  days,
  onClose,
  className,
}) => {
  // Determine congratulatory message based on streak length
  const getMessage = () => {
    if (days >= 365) return "Incredibile! A full year of Italian learning!";
    if (days >= 180) return "Phenomenal dedication! Six months strong!";
    if (days >= 90) return "Amazing progress! Three months of consistent learning!";
    if (days >= 30) return "Impressive! A full month of Italian every day!";
    if (days >= 14) return "Excellent! Two weeks of consistent practice!";
    if (days >= 7) return "Great job! A full week of Italian learning!";
    return "Congratulations on your consistency!";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-full md:w-80 rounded-lg shadow-lg overflow-hidden border bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
        className
      )}
    >
      <div className="p-4 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full flex items-center justify-center mb-3 bg-orange-200 dark:bg-orange-800">
          <Flame className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        
        <h3 className="font-bold text-xl">Streak Milestone!</h3>
        <p className="font-medium text-lg mt-1">
          {days} Day{days !== 1 ? 's' : ''}
        </p>
        
        <p className="text-muted-foreground text-sm mt-2 mb-3">
          {getMessage()}
        </p>
        
        <div className="bg-orange-200 dark:bg-orange-800 rounded-full px-3 py-1 text-sm font-medium text-orange-700 dark:text-orange-300">
          +{days >= 30 ? 100 : days >= 7 ? 50 : 20} XP Bonus
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700" asChild>
            <Link to="/daily-question">
              Continue Streak <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakMilestoneNotification;
