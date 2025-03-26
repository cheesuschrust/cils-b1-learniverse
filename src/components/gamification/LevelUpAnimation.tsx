
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelUpAnimationProps {
  level: number;
  isVisible: boolean;
  onComplete: () => void;
  className?: string;
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  level,
  isVisible,
  onComplete,
  className
}) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 500); // Allow exit animation to complete
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "fixed inset-0 flex items-center justify-center z-50 bg-black/40 p-4",
            className
          )}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl max-w-md mx-auto text-center"
          >
            <motion.div
              className="relative mx-auto mb-4 h-28 w-28 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.2, 1.1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.4, 0.8, 1],
                ease: "easeInOut" 
              }}
            >
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 animate-pulse bg-white opacity-5"></div>
                {/* Generate star particles */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    initial={{ 
                      width: Math.random() * 8 + 4, 
                      height: Math.random() * 8 + 4,
                      x: 64, 
                      y: 64,
                      opacity: 0
                    }}
                    animate={{ 
                      x: Math.random() * 128, 
                      y: Math.random() * 128,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: Math.random() * 2,
                      repeatType: 'loop'
                    }}
                  />
                ))}
              </div>
              <Star className="h-16 w-16 text-white" />
              <motion.div 
                className="absolute text-3xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {level}
              </motion.div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Level Up!
            </motion.h2>
            
            <motion.p 
              className="text-lg mb-4 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Congratulations! You've reached level {level}
            </motion.p>
            
            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Keep up the great work!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpAnimation;
