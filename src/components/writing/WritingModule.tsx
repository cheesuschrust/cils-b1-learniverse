
import React from 'react';

export const WritingModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Writing Exercises</h2>
      <p className="mb-4">Improve your writing skills with guided practice.</p>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Grammar Practice</h3>
        <p>Exercises to improve your grammar and sentence structure.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Essay Writing</h3>
        <p>Practice writing essays on various topics with guidance.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Creative Writing</h3>
        <p>Express yourself through creative writing exercises and prompts.</p>
      </div>
    </div>
  );
};

export default WritingModule;
