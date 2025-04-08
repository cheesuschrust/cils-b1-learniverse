
import React from 'react';

const StudyPlanPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Study Plan</h1>
      <p className="mb-6 text-gray-600">Follow your personalized study plan to optimize your learning journey.</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Study Plan</h2>
        <p>No study plan has been generated yet. Please complete your assessment to receive a personalized plan.</p>
      </div>
    </div>
  );
};

export default StudyPlanPage;
