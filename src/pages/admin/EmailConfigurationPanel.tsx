
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EmailConfigurationPanel from '@/components/admin/EmailConfigurationPanel';

const EmailConfigurationPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Email Configuration - Admin</title>
      </Helmet>
      <EmailConfigurationPanel />
    </>
  );
};

export default EmailConfigurationPage;
