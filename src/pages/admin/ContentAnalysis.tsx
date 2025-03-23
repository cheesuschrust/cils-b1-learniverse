
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AIContentProcessor from '@/components/ai/AIContentProcessor';

const ContentAnalysis = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>AI Content Analysis | Admin</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Content Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload and analyze content to automatically generate learning materials
        </p>
      </div>
      
      <AIContentProcessor />
    </div>
  );
};

export default ContentAnalysis;
