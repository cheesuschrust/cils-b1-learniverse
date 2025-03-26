
import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReviewCelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
  className?: string;
}

const ReviewCelebration: React.FC<ReviewCelebrationProps> = ({
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
      }, 3000);
      
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
            "fixed inset-0 flex items-center justify-center z-50 bg-black/40",
            className
          )}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md mx-auto text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 2, duration: 0.5 }}
              className="mb-4 inline-block text-green-500"
            >
              <CheckCircle size={64} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">All Reviews Complete!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Great job! You've completed all your reviews for today.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Come back tomorrow for more reviews.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewCelebration;
