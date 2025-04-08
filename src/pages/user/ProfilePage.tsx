
import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <p className="mb-6 text-gray-600">View and edit your profile information.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
        <p>Your profile information will be displayed here.</p>
      </div>
    </div>
  );
};

export default ProfilePage;
