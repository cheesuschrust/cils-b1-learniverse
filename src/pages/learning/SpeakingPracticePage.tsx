
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SpeakingPracticePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Italian Speaking Practice | CILS B1 Exam Prep</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Speaking Practice</h1>
          <p className="text-muted-foreground">
            Improve your Italian speaking skills
          </p>
        </div>
        
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-lg mb-4">Speaking practice modules are currently being developed.</p>
          <p>Check back soon for interactive Italian speaking exercises tailored to the CILS B1 exam!</p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPracticePage;
