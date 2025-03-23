
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, FilePlus, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  uploadProgress: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelected,
  isProcessing,
  uploadProgress,
  accept,
  multiple = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  // Default accepted file types if none provided
  const defaultAccept = {
    'text/plain': ['.txt'],
    'text/markdown': ['.md'],
    'application/json': ['.json'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/ogg': ['.ogg'],
  };

  const acceptedFileTypes = accept || defaultAccept;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit to just the first file if multiple is false
    const filesToProcess = multiple ? acceptedFiles : [acceptedFiles[0]];
    
    if (filesToProcess.length > 0) {
      setUploadedFiles(prev => [...prev, ...filesToProcess]);
      
      // Notify parent of file selection (just the first file if multiple is false)
      onFileSelected(filesToProcess[0]);
      
      toast({
        title: "File uploaded",
        description: `${filesToProcess.length} file(s) ready for processing`,
      });
    }
  }, [multiple, onFileSelected, toast]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple,
    disabled: isProcessing,
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          
          {isDragActive ? (
            <p className="text-sm font-medium">Drop the files here...</p>
          ) : (
            <>
              <p className="text-sm font-medium">Drag and drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Supported formats: TXT, PDF, DOCX, MP3, WAV, XLS, XLSX and more
              </p>
            </>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded files:</p>
          
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between gap-2 p-2 border rounded-md bg-background">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                </div>
                
                {!isProcessing && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(index)}
                    className="h-6 w-6"
                  >
                    <FileX className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            <p className="text-sm">Processing file...</p>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
