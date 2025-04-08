
import React from 'react';

export const SpeakingModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Speaking Practice</h2>
      <p className="mb-4">Practice your speaking skills with these interactive exercises.</p>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Pronunciation Practice</h3>
        <p>Record yourself pronouncing common phrases and get feedback.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Conversation Simulation</h3>
        <p>Practice realistic conversations in various scenarios.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Guided Speaking Exercises</h3>
        <p>Follow guided exercises to improve your speaking fluency.</p>
      </div>
    </div>
  );
};

export default SpeakingModule;
