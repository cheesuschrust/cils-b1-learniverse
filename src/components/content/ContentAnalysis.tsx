
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircle } from 'lucide-react';

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
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-amber-600"; 
    return "text-red-600";
  };
  
  const getContentTypeInfo = (type: string) => {
    switch(type) {
      case 'flashcards':
        return "Vocabulary learning through card-based repetition";
      case 'multipleChoice':
        return "Questions with multiple answer options";
      case 'listening':
        return "Audio-based exercises for comprehension";
      case 'writing':
        return "Written composition exercises";
      case 'speaking':
        return "Oral practice exercises";
      default:
        return "Unknown content type";
    }
  };
  
  const getLanguageInfo = (lang: string) => {
    switch(lang) {
      case 'english':
        return "Content is primarily in English";
      case 'italian':
        return "Content is primarily in Italian";
      default:
        return "Could not determine the primary language";
    }
  };
  
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-3">Content Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center gap-1">
              <div className="text-sm font-medium">Content Type</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{getContentTypeInfo(fileContentType)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1 text-lg font-semibold capitalize">
              {fileContentType === 'multipleChoice' ? 'Multiple Choice' : fileContentType}
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center gap-1">
              <div className="text-sm font-medium">Confidence</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How confident the system is about the content type detection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className={`mt-1 text-lg font-semibold ${getConfidenceColor(contentConfidence)}`}>
              {contentConfidence.toFixed(1)}%
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center gap-1">
              <div className="text-sm font-medium">Language</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getLanguageInfo(language)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-1 text-lg font-semibold capitalize">
              {language || 'Unknown'}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2 flex items-center gap-1">
            Content Preview
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview of the content being analyzed. For large files, only a portion is shown.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <div className="max-h-60 overflow-y-auto bg-muted/50 p-3 rounded-md">
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
