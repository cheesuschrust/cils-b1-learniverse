
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ListeningModule from '@/components/listening/ListeningModule';

const ListeningPracticePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Italian Listening Practice | CILS B1 Exam Prep</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Listening Practice</h1>
          <p className="text-muted-foreground">
            Improve your Italian listening comprehension
          </p>
        </div>
        
        <ListeningModule />
      </div>
    </div>
  );
};

export default ListeningPracticePage;
