
import React from 'react';
import { WritingModule } from '../../components/writing/WritingModule';

const WritingExercisePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Writing Exercises</h1>
      <p className="mb-6 text-gray-600">Improve your writing skills with guided practice.</p>
      <WritingModule />
    </div>
  );
};

export default WritingExercisePage;
