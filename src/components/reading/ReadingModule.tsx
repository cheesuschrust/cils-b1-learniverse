
import React from 'react';

export const ReadingModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Reading Practice</h2>
      <p className="mb-4">Improve your reading comprehension with these exercises.</p>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Comprehension Exercises</h3>
        <p>Read passages and answer questions to test your understanding.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Vocabulary Building</h3>
        <p>Learn new words and phrases in context through reading activities.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Speed Reading</h3>
        <p>Practice techniques to improve your reading speed and efficiency.</p>
      </div>
    </div>
  );
};

export default ReadingModule;
