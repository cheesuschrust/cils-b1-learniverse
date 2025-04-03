
import React, { useEffect } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelUpAnimationProps {
  level: number;
  isVisible: boolean;
  onComplete: () => void;
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  level,
  isVisible,
  onComplete
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
        <div className="relative max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-primary/80 to-indigo-700/80 backdrop-blur-lg rounded-lg p-8 text-center text-white shadow-xl border border-white/10"
          >
            {/* Particles Animation */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-yellow-300/80"
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 0
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
            
            {/* Main Content */}
            <motion.div
              className="relative z-10"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <motion.div 
                className="mb-6 flex justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
              >
                <div className="rounded-full bg-yellow-500/30 p-4 border-2 border-yellow-400">
                  <Trophy className="h-16 w-16 text-yellow-300" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
                  Level Up!
                  <Sparkles className="h-5 w-5 ml-2 text-yellow-300" />
                </h2>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                  <span className="text-4xl font-bold">Level {level}</span>
                  <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                </div>
                
                <p className="text-white/80">
                  Congratulations on reaching level {level}! Keep up the great work with your Italian studies.
                </p>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={onComplete}
                  className="mt-6 px-6 py-2 bg-white text-primary font-medium rounded-full hover:bg-white/90 transition-colors"
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default LevelUpAnimation;
