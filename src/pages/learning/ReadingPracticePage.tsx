
import React from 'react';
import { ReadingModule } from '../../components/reading/ReadingModule';

const ReadingPracticePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Reading Practice</h1>
      <p className="mb-6 text-gray-600">Enhance your reading comprehension with these exercises.</p>
      <ReadingModule />
    </div>
  );
};

export default ReadingPracticePage;
