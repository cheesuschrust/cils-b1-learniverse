
import React from 'react';

const ContentManagement: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      <p className="mb-6 text-gray-600">Manage all content in the system.</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Content Library</h2>
        <p>No content items are currently available. Add new content using the form below.</p>
      </div>
    </div>
  );
};

export default ContentManagement;
