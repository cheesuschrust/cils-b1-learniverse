
import React from 'react';

const MockExamPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mock Exam</h1>
      <p className="mb-6 text-gray-600">Test your knowledge with our comprehensive mock exams.</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Available Mock Exams</h2>
        <p>No mock exams are currently available. Please check back later.</p>
      </div>
    </div>
  );
};

export default MockExamPage;
