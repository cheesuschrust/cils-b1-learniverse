import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminNotificationCenter from '@/components/admin/AdminNotificationCenter';

const AdminDashboard = () => {
  return (
    <div className="container py-6">
      <Helmet>
        <title>Admin Dashboard | Language Learning Platform</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <AdminNotificationCenter />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards would go here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
