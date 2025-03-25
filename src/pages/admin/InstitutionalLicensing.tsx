
import React from 'react';
import { Helmet } from 'react-helmet-async';
import InstitutionalLicensingManager from '@/components/admin/InstitutionalLicensingManager';

const InstitutionalLicensingPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Institutional Licensing - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <InstitutionalLicensingManager />
      </div>
    </>
  );
};

export default InstitutionalLicensingPage;
