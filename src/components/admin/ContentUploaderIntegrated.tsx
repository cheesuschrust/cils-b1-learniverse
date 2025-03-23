
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, File, AlertCircle, CheckCircle, X, Image, FileText, FileAudio } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadSuccess?: (fileData: { url: string; name: string; type: string; size: number }) => void;
  onUploadError?: (error: string) => void;
  onUploading?: (progress: number) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  description?: string;
  className?: string;
}

const ContentUploaderIntegrated: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  onUploading,
  acceptedTypes = ".pdf,.doc,.docx,.txt,.mp3,.wav,.jpg,.png",
  maxSizeMB = 10,
  description = "Upload content files for the learning platform",
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("all-files");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      return false;
    }
    
    // Check file type based on active tab
    const fileType = file.type;
    let isValidType = true;
    
    switch (activeTab) {
      case "documents":
        isValidType = fileType.includes("pdf") || 
                     fileType.includes("doc") || 
                     fileType.includes("text/plain");
        break;
      case "images":
        isValidType = fileType.includes("image");
        break;
      case "audio":
        isValidType = fileType.includes("audio");
        break;
      case "all-files":
        // For all-files, we'll trust the acceptedTypes filter on the input
        isValidType = true;
        break;
    }
    
    if (!isValidType) {
      setError(`Invalid file type for the selected category. Please upload an appropriate file.`);
      return false;
    }
    
    return true;
  };
  
  const processFile = async (file: File) => {
    if (!validateFile(file)) {
      if (onUploadError) onUploadError(error || "File validation failed");
      return;
    }
    
    // Reset states
    setError(null);
    setSuccess(false);
    setUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);
    
    // Simulate upload progress
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        setUploadProgress(Math.floor(progress));
        if (onUploading) onUploading(Math.floor(progress));
        
        if (progress >= 100) {
          clearInterval(interval);
          handleUploadSuccess(file);
        }
      }, 300);
    };
    
    simulateUpload();
  };
  
  const handleUploadSuccess = (file: File) => {
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      
      // Create a fake URL for the file
      const fileURL = URL.createObjectURL(file);
      
      if (onUploadSuccess) {
        onUploadSuccess({
          url: fileURL,
          name: file.name,
          type: file.type,
          size: file.size
        });
      }
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      });
    }, 500);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const cancelUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setUploadedFile(null);
    setError(null);
    setSuccess(false);
    
    toast({
      title: "Upload cancelled",
      description: "You've cancelled the upload.",
    });
  };
  
  const getFileIcon = (file: File) => {
    const fileType = file.type;
    
    if (fileType.includes("image")) {
      return <Image className="h-6 w-6 text-blue-500" />;
    } else if (fileType.includes("audio")) {
      return <FileAudio className="h-6 w-6 text-purple-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes("doc")) {
      return <FileText className="h-6 w-6 text-blue-700" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getAcceptTypes = (): string => {
    switch (activeTab) {
      case "documents":
        return ".pdf,.doc,.docx,.txt";
      case "images":
        return ".jpg,.jpeg,.png,.gif,.webp";
      case "audio":
        return ".mp3,.wav,.ogg,.m4a";
      default:
        return acceptedTypes;
    }
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Content Uploader</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all-files">All Files</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-files">
            <div className="mt-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors",
                  dragActive ? "border-primary bg-muted/50" : "border-border",
                  (uploading || error || success) ? "py-4" : "py-12"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={getAcceptTypes()}
                  onChange={handleChange}
                  className="hidden"
                />
                
                {!uploading && !error && !success && (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center bg-muted rounded-full">
                      <UploadCloud className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Drag & drop your file here, or 
                        <Button variant="link" className="px-1 text-primary" onClick={handleButtonClick}>
                          browse
                        </Button>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PDF, DOCX, TXT, MP3, WAV, JPG, PNG (up to {maxSizeMB}MB)
                      </p>
                    </div>
                  </div>
                )}
                
                {uploading && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {uploadedFile && getFileIcon(uploadedFile)}
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {uploadedFile?.name}
                          </p>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={cancelUpload}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {uploadedFile && getFileIcon(uploadedFile)}
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {uploadedFile?.name}
                          </p>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Upload complete
                      </p>
                      <Button variant="outline" size="sm" onClick={() => {
                        setUploadedFile(null);
                        setSuccess(false);
                      }}>
                        Upload another
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="mt-4">
              {/* Same content as all-files but with document-specific instructions */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors",
                  dragActive ? "border-primary bg-muted/50" : "border-border",
                  (uploading || error || success) ? "py-4" : "py-12"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleChange}
                  className="hidden"
                />
                
                {!uploading && !error && !success && (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center bg-muted rounded-full">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Upload documents for language content analysis
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PDF, DOCX, TXT (up to {maxSizeMB}MB)
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="secondary"
                        onClick={handleButtonClick}
                      >
                        Select Document
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Same upload progress and status indicators as the all-files tab */}
                {(uploading || error || success) && (
                  <div className="space-y-4">
                    {/* Content the same as in all-files tab */}
                    {uploading && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          {uploadedFile && getFileIcon(uploadedFile)}
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {uploadedFile?.name}
                              </p>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={cancelUpload}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {uploadedFile && getFileIcon(uploadedFile)}
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {uploadedFile?.name}
                              </p>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Upload complete
                          </p>
                          <Button variant="outline" size="sm" onClick={() => {
                            setUploadedFile(null);
                            setSuccess(false);
                          }}>
                            Upload another
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images">
            {/* Same structure as documents but with image specific guidance */}
            <div className="mt-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors",
                  dragActive ? "border-primary bg-muted/50" : "border-border",
                  (uploading || error || success) ? "py-4" : "py-12"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleChange}
                  className="hidden"
                />
                
                {!uploading && !error && !success && (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center bg-muted rounded-full">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Upload images for visual learning content
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports JPG, PNG, GIF, WEBP (up to {maxSizeMB}MB)
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="secondary"
                        onClick={handleButtonClick}
                      >
                        Select Image
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Upload indicators same as other tabs */}
                {(uploading || error || success) && (
                  <div className="space-y-4">
                    {/* Same content as other tabs */}
                    {uploading && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          {uploadedFile && getFileIcon(uploadedFile)}
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {uploadedFile?.name}
                              </p>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={cancelUpload}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {uploadedFile && getFileIcon(uploadedFile)}
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {uploadedFile?.name}
                              </p>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Upload complete
                          </p>
                          <Button variant="outline" size="sm" onClick={() => {
                            setUploadedFile(null);
                            setSuccess(false);
                          }}>
                            Upload another
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audio">
            {/* Same structure as documents but with audio specific guidance */}
            <div className="mt-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors",
                  dragActive ? "border-primary bg-muted/50" : "border-border",
                  (uploading || error || success) ? "py-4" : "py-12"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".mp3,.wav,.ogg,.m4a"
                  onChange={handleChange}
                  className="hidden"
                />
                
                {!uploading && !error && !success && (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center bg-muted rounded-full">
                      <FileAudio className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Upload audio for listening exercises
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports MP3, WAV, OGG, M4A (up to {maxSizeMB}MB)
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="secondary"
                        onClick={handleButtonClick}
                      >
                        Select Audio
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Upload indicators same as other tabs */}
                {(uploading || error || success) && (
                  <div className="space-y-4">
                    {/* Same content as other tabs */}
                    {uploading && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          {uploadedFile && getFileIcon(uploadedFile)}
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {uploadedFile?.name}
                              </p>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={cancelUpload}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {uploadedFile && getFileIcon(uploadedFile)}
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {uploadedFile?.name}
                              </p>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Upload complete
                          </p>
                          <Button variant="outline" size="sm" onClick={() => {
                            setUploadedFile(null);
                            setSuccess(false);
                          }}>
                            Upload another
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentUploaderIntegrated;
