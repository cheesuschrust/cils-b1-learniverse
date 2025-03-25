
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdManager from '@/components/admin/AdManager';

const AdManagementPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Ad Management - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <AdManager />
      </div>
    </>
  );
};

export default AdManagementPage;
