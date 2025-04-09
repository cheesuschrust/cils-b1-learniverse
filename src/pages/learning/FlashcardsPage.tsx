
import React from 'react';
import { Helmet } from 'react-helmet-async';
import FlashcardModule from '@/components/flashcards/FlashcardModule';

const FlashcardsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Italian Flashcards | CILS B1 Exam Prep</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground">
            Build your Italian vocabulary with flashcards
          </p>
        </div>
        
        <FlashcardModule />
      </div>
    </div>
  );
};

export default FlashcardsPage;
