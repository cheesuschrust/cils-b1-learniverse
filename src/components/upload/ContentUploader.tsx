
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { ItalianTestSection } from '@/types/italian-types';
import { PlusCircle, FileUp, FileText, X, Check, AlertTriangle, Loader2 } from 'lucide-react';

interface ContentUploaderProps {
  onContentAnalyzed?: (content: string, type: ItalianTestSection, confidence: number) => void;
  onClose?: () => void;
}

const ContentUploader: React.FC<ContentUploaderProps> = ({
  onContentAnalyzed,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    contentType?: ItalianTestSection;
    confidence?: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { analyzeContent } = useAIUtils();
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only allow text files, PDFs, DOCs, etc.
    const allowedTypes = [
      'text/plain', 
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a text, PDF, or Word document.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload process with progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(timer);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    // Read file content (for text files)
    const reader = new FileReader();
    reader.onload = async (event) => {
      clearInterval(timer);
      setUploadProgress(100);
      
      try {
        const content = event.target?.result as string;
        setTextContent(content);
        
        // Proceed to analyze the content
        await analyzeUploadedContent(content);
      } catch (error) {
        console.error("Error reading file:", error);
        setUploadResult({
          success: false,
          message: "Failed to read file content"
        });
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      clearInterval(timer);
      setIsUploading(false);
      setUploadResult({
        success: false,
        message: "Error reading file"
      });
    };
    
    reader.readAsText(file);
  };
  
  // Analyze text content
  const handleAnalyzeText = async () => {
    if (!textContent.trim()) {
      toast({
        title: "Empty Content",
        description: "Please enter or upload some content to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    await analyzeUploadedContent(textContent);
  };
  
  // Common analysis function
  const analyzeUploadedContent = async (content: string) => {
    setIsAnalyzing(true);
    setUploadResult(null);
    
    try {
      // Here we'd typically call the AI service to analyze the content
      // For now, we'll simulate this process
      
      // In a real implementation, we'd send the content to the AI service for analysis
      const result = await analyzeContent(content);
      
      // Determine content type and confidence based on analysis
      // This would be done by the AI service in a real implementation
      let contentType: ItalianTestSection = 'grammar';
      let confidence = 0.75;
      
      if (content.includes('ciao') || content.includes('buongiorno')) {
        contentType = 'vocabulary';
        confidence = 0.9;
      } else if (content.includes('?')) {
        contentType = 'reading';
        confidence = 0.85;
      } else if (content.length > 500) {
        contentType = 'culture';
        confidence = 0.8;
      }
      
      // Simulate successful analysis
      setUploadResult({
        success: true,
        message: "Content analyzed successfully",
        contentType,
        confidence
      });
      
      // Call the callback if provided
      if (onContentAnalyzed) {
        onContentAnalyzed(content, contentType, confidence);
      }
    } catch (error) {
      console.error("Error analyzing content:", error);
      setUploadResult({
        success: false,
        message: "Failed to analyze content"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Reset the uploader
  const handleReset = () => {
    setTextContent('');
    setUploadProgress(0);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upload Italian Content</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" disabled={isUploading || isAnalyzing}>
              <FileText className="h-4 w-4 mr-2" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="file" disabled={isUploading || isAnalyzing}>
              <FileUp className="h-4 w-4 mr-2" />
              File Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Paste Italian text content</Label>
              <Textarea 
                id="text-content"
                placeholder="Paste Italian grammar rules, vocabulary lists, cultural information, or any other Italian content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            
            <Button 
              onClick={handleAnalyzeText}
              disabled={!textContent.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload a document</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx"
                  disabled={isUploading || isAnalyzing}
                />
                
                {isUploading ? (
                  <div className="space-y-4">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Uploading file...</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                ) : (
                  <div 
                    className="space-y-2 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileUp className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">
                      TXT, PDF, DOC up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {uploadResult && (
          <div className="mt-6">
            {uploadResult.success ? (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  {uploadResult.message}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  {uploadResult.message}
                </AlertDescription>
              </Alert>
            )}
            
            {uploadResult.success && uploadResult.contentType && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Detected Content Type:</span>
                  <span className="font-medium capitalize">{uploadResult.contentType}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Confidence:</span>
                  <ConfidenceIndicator score={uploadResult.confidence || 0.5} className="w-32" />
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  This content will be used to improve our AI question generation for {uploadResult.contentType} exercises.
                  Thank you for your contribution!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={isUploading || isAnalyzing}
        >
          Reset
        </Button>
        
        {onClose && (
          <Button 
            onClick={onClose}
            disabled={isUploading || isAnalyzing}
          >
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentUploader;
