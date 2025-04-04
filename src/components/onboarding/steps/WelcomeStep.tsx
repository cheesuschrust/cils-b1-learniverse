
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Rocket, UserCheck, BarChart, Certificate, Brain, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const WelcomeStep: React.FC = () => {
  return (
    <CardContent className="pt-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold">Italian Citizenship Test Prep</h2>
          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
            CILS B1 Aligned
          </Badge>
        </div>
        <p className="mb-2">
          Welcome to your personalized Italian citizenship test preparation journey. 
          Let's set up your account to optimize your learning experience for the CILS B1 certification.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="flex items-start"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={featureVariants}
        >
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Personalized Learning</h3>
            <p className="text-sm text-muted-foreground">
              We'll customize your learning experience based on your current level and goals.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-start"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={featureVariants}
        >
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <Certificate className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">CILS B1 Focused</h3>
            <p className="text-sm text-muted-foreground">
              Our content is specifically designed for the Italian citizenship language test requirements.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-start"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={featureVariants}
        >
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <BarChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Track Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your improvement with detailed analytics and confidence indicators.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-start"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={featureVariants}
        >
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">AI-Enhanced Learning</h3>
            <p className="text-sm text-muted-foreground">
              Our AI system adapts to your learning style and helps track your CILS B1 readiness.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-start"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={featureVariants}
        >
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Cultural Context</h3>
            <p className="text-sm text-muted-foreground">
              Learn Italian within the context of citizenship requirements and cultural knowledge.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-start"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={featureVariants}
        >
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Guaranteed Results</h3>
            <p className="text-sm text-muted-foreground">
              Our proven methodology has helped thousands pass their citizenship tests.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100"
      >
        <h4 className="font-medium text-blue-700 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          About CILS B1 Certification
        </h4>
        <p className="text-sm text-blue-600 mt-2">
          The CILS B1 Citizenship exam is required for Italian citizenship applications. It tests your ability to understand and communicate in everyday situations in Italian, covering reading, writing, listening, and speaking skills.
        </p>
      </motion.div>
    </CardContent>
  );
};

export default WelcomeStep;
