import React from 'react';
import { Alert } from "@/components/ui/alert";

const FileProcessor: React.FC = () => {
  return (
    <div>
      <Alert variant="outline">
        Upload your files for processing
      </Alert>
    </div>
  );
};

export default FileProcessor;
