
import React from 'react';

export const ListeningModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Listening Practice</h2>
      <p className="mb-4">Improve your listening comprehension with these interactive exercises.</p>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Audio Comprehension</h3>
        <p>Listen to audio clips and answer questions to test your understanding.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-medium mb-2">Dictation Exercises</h3>
        <p>Practice writing what you hear to improve listening accuracy.</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-2">Conversation Practice</h3>
        <p>Listen to real-world conversations and improve your comprehension skills.</p>
      </div>
    </div>
  );
};

export default ListeningModule;
