
import React from 'react';
import { Helmet } from 'react-helmet-async';
import InstitutionalLicensingManager from '@/components/admin/InstitutionalLicensingManager';

// Define interface for props if needed
interface InstitutionalLicensingPageProps {}

const InstitutionalLicensingPage: React.FC<InstitutionalLicensingPageProps> = () => {
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
