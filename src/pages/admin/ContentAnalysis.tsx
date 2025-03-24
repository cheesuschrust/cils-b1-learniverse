
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AIContentProcessor from '@/components/ai/AIContentProcessor';
import { ContentType } from '@/utils/textAnalysis';

const ContentAnalysis = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [content, setContent] = useState<string>("Enter your content here to generate questions.");
  const [contentType, setContentType] = useState<ContentType>("multiple-choice");

  const handleQuestionsGenerated = (generatedQuestions: any[]) => {
    setQuestions(generatedQuestions);
  };

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
      
      <AIContentProcessor 
        content={content}
        contentType={contentType}
        onQuestionsGenerated={handleQuestionsGenerated}
      />

      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Generated Questions</h2>
          <pre className="bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(questions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ContentAnalysis;
