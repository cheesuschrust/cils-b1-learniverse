
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ContentAnalysisProps {
  fileContent: string;
  fileContentType: 'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null;
  contentConfidence: number;
  language: 'english' | 'italian' | 'unknown';
  file: File | null;
}

const ContentAnalysis = ({
  fileContent,
  fileContentType,
  contentConfidence,
  language,
  file
}: ContentAnalysisProps) => {
  if (!fileContent || !fileContentType) return null;
  
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-3">Content Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm font-medium">Content Type</div>
            <div className="mt-1 text-lg font-semibold capitalize">
              {fileContentType === 'multipleChoice' ? 'Multiple Choice' : fileContentType}
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm font-medium">Confidence</div>
            <div className="mt-1 text-lg font-semibold">
              {contentConfidence.toFixed(1)}%
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm font-medium">Language</div>
            <div className="mt-1 text-lg font-semibold capitalize">
              {language || 'Unknown'}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Content Preview</h4>
          <div className="max-h-40 overflow-y-auto bg-muted/50 p-3 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">
              {file?.type.startsWith('audio/') 
                ? 'Audio content cannot be displayed as text' 
                : fileContent.length > 1000 
                  ? fileContent.substring(0, 1000) + '...(content truncated)' 
                  : fileContent
              }
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAnalysis;
