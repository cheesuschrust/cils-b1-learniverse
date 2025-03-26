
import React from "react";
import { Helmet } from "react-helmet-async";
import UserManagementComponent from "@/components/admin/UserManagementComponent";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const UserManagement = () => {
  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>User Management - Admin</title>
        </Helmet>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        
        <UserManagementComponent />
      </div>
    </ProtectedRoute>
  );
};

export default UserManagement;
