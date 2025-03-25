
import React from 'react';
import { Helmet } from 'react-helmet-async';
import GlobalUserDocumentation from '@/components/help/GlobalUserDocumentation';

const DocumentationPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>User Documentation | Language Learning Platform</title>
      </Helmet>
      <GlobalUserDocumentation />
    </>
  );
};

export default DocumentationPage;
