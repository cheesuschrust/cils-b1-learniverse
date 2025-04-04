
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { BookOpen, Rocket, UserCheck, BarChart } from 'lucide-react';

const WelcomeStep: React.FC = () => {
  return (
    <CardContent className="pt-6">
      <p className="mb-8">
        Welcome to your personalized Italian citizenship test preparation journey. 
        Let's set up your account to optimize your learning experience.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Personalized Learning</h3>
            <p className="text-sm text-muted-foreground">
              We'll customize your learning experience based on your current level and goals.
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">CILS B1 Focused</h3>
            <p className="text-sm text-muted-foreground">
              Our content is specifically designed for the Italian citizenship language test.
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <BarChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Track Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your improvement and readiness for the test with detailed analytics.
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Guaranteed Results</h3>
            <p className="text-sm text-muted-foreground">
              Our proven methodology has helped thousands pass their citizenship tests.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default WelcomeStep;
