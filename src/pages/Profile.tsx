
import React from 'react';
import UserProfile from '@/components/user/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }
  
  // If still loading, show a loading state
  if (isLoading) {
    return <div className="container py-8 flex justify-center">Loading profile...</div>;
  }
  
  return (
    <div className="container py-8">
      <UserProfile />
    </div>
  );
};

export default Profile;
