
import React from 'react';
import { Helmet } from 'react-helmet-async';
import GlobalUserDocumentation from '@/components/help/GlobalUserDocumentation';

// Define interface for props if needed
interface DocumentationPageProps {}

const DocumentationPage: React.FC<DocumentationPageProps> = () => {
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
