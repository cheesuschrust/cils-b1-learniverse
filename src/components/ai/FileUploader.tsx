
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, FileUp, Check, AlertTriangle } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '../ui/spinner';

const supportedFormats = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/msword', // .doc
  'application/vnd.ms-excel', // .xls
  'application/vnd.ms-powerpoint', // .ppt
  'text/plain', // .txt
  'text/csv', // .csv
  'audio/mpeg', // .mp3
  'audio/wav', // .wav
  'image/jpeg', // .jpg, .jpeg
  'image/png', // .png
];

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'pending' | 'uploading' | 'success' | 'error'}>({});
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      const validFiles = acceptedFiles.filter(file => 
        supportedFormats.includes(file.type)
      );

      if (validFiles.length !== acceptedFiles.length) {
        toast({
          title: "Unsupported File Format",
          description: "Some files were rejected. Please upload PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, MP3, WAV, JPG, or PNG files only.",
          variant: "destructive",
        });
      }

      setFiles(prev => [...prev, ...validFiles]);
      
      // Initialize progress and status for each file
      const newProgress = { ...uploadProgress };
      const newStatus = { ...uploadStatus };
      
      validFiles.forEach(file => {
        newProgress[file.name] = 0;
        newStatus[file.name] = 'pending';
      });
      
      setUploadProgress(newProgress);
      setUploadStatus(newStatus);
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    
    // Update progress and status
    const newProgress = { ...uploadProgress };
    const newStatus = { ...uploadStatus };
    
    delete newProgress[fileName];
    delete newStatus[fileName];
    
    setUploadProgress(newProgress);
    setUploadStatus(newStatus);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    for (const file of files) {
      try {
        // Update status to uploading
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'uploading'
        }));
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
        
        // Mark as success
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'success'
        }));
        
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded and is being processed.`,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        
        // Mark as error
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: 'error'
        }));
        
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive",
        });
      }
    }
    
    setIsUploading(false);
  };

  const getFileStatusIcon = (status: 'pending' | 'uploading' | 'success' | 'error') => {
    switch (status) {
      case 'uploading':
        return <LoadingSpinner size="sm" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        
        <p className="text-lg font-medium">Drag & drop files here</p>
        <p className="text-sm text-muted-foreground mt-1">
          or click to select files (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, MP3, WAV, JPG, PNG)
        </p>
        <p className="text-xs text-muted-foreground mt-4">Maximum file size: 50MB</p>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Selected Files</h3>
          
          {files.map(file => (
            <Card key={file.name} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getFileStatusIcon(uploadStatus[file.name])}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.name);
                    }}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                    disabled={uploadStatus[file.name] === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </button>
                </div>
                
                {uploadStatus[file.name] !== 'pending' && (
                  <Progress 
                    value={uploadProgress[file.name]} 
                    className="h-1 mt-2" 
                  />
                )}
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={uploadFiles} 
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload All Files'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
