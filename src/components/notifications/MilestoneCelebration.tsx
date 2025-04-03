
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, Award, Calendar, BookOpen, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MilestoneCelebrationProps {
  milestone: {
    id: string;
    title: string;
    description: string;
    type: 'streak' | 'completion' | 'mastery' | 'progress';
    value: number;
    target: number;
    xpAwarded?: number;
    nextTarget?: number;
  };
  onClose: () => void;
}

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  milestone,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  // Trigger confetti explosion on mount
  useEffect(() => {
    const runConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    const timeout = setTimeout(runConfetti, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Handle close with animation
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  // Get icon based on milestone type
  const getIcon = () => {
    switch (milestone.type) {
      case 'streak':
        return <Calendar className="h-10 w-10 text-orange-500" />;
      case 'completion':
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      case 'mastery':
        return <Award className="h-10 w-10 text-indigo-500" />;
      case 'progress':
        return <BookOpen className="h-10 w-10 text-blue-500" />;
      default:
        return <Sparkles className="h-10 w-10 text-amber-500" />;
    }
  };

  // Get milestone color theme
  const getColorTheme = () => {
    switch (milestone.type) {
      case 'streak':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
          border: 'border-orange-200',
          progress: 'bg-orange-500',
          icon: 'bg-orange-100 text-orange-600',
        };
      case 'completion':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          border: 'border-green-200',
          progress: 'bg-green-500',
          icon: 'bg-green-100 text-green-600',
        };
      case 'mastery':
        return {
          bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
          border: 'border-indigo-200',
          progress: 'bg-indigo-500',
          icon: 'bg-indigo-100 text-indigo-600',
        };
      case 'progress':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          progress: 'bg-blue-500',
          icon: 'bg-blue-100 text-blue-600',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
          border: 'border-amber-200',
          progress: 'bg-amber-500',
          icon: 'bg-amber-100 text-amber-600',
        };
    }
  };

  const colors = getColorTheme();
  const progressPercent = (milestone.value / milestone.target) * 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-30`}
        >
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className={`w-full max-w-md rounded-xl overflow-hidden shadow-xl border ${colors.border} ${colors.bg}`}
          >
            <div className="relative p-6">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`h-24 w-24 rounded-full ${colors.icon} flex items-center justify-center mb-4`}
                >
                  {getIcon()}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-2xl font-bold tracking-tight mb-1">
                    {milestone.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {milestone.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Progress</span>
                        <span>{milestone.value} / {milestone.target}</span>
                      </div>
                      <Progress value={progressPercent} className={`h-2 ${colors.progress}`} />
                    </div>
                    
                    {milestone.xpAwarded && (
                      <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full py-2 px-4 font-medium">
                        <Sparkles className="h-4 w-4 mr-2" />
                        {milestone.xpAwarded} XP Awarded!
                      </div>
                    )}
                    
                    {milestone.nextTarget && (
                      <p className="text-sm text-center text-muted-foreground">
                        Next milestone: {milestone.nextTarget}
                      </p>
                    )}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6"
                >
                  <Button onClick={handleClose}>
                    Continue
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MilestoneCelebration;
