
import React from 'react';
import { SpeakingModule } from '../../components/speaking/SpeakingModule';

const SpeakingPracticePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Speaking Practice</h1>
      <p className="mb-6 text-gray-600">Improve your speaking skills with interactive exercises.</p>
      <SpeakingModule />
    </div>
  );
};

export default SpeakingPracticePage;
