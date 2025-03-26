
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DocumentService, { ParsedDocument } from '@/services/DocumentService';
import QuestionGenerationService from '@/services/QuestionGenerationService';
import { useQuestionLimit } from '@/hooks/useQuestionLimit';

interface DocumentUploaderProps {
  onUploadComplete?: (documentId: string, questions: any[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [contentType, setContentType] = useState<'flashcards' | 'multipleChoice' | 'writing' | 'speaking' | 'listening'>('multipleChoice');
  const [language, setLanguage] = useState('english');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<ParsedDocument | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  
  // Question limit hook to track usage
  const questionLimit = useQuestionLimit(contentType);
  
  const onDrop = (acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
      return;
    }
    
    setFile(file);
    
    // Auto-generate title from filename if empty
    if (!title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      setTitle(fileName);
    }
    
    // Display preview if it's a text file
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = reader.result as string;
          // Parse and display preview
          const preview = content.substring(0, 200) + (content.length > 200 ? '...' : '');
          
          // For text files, we can do a quick parse directly
          const parsed = DocumentService.parseTextDocument(content);
          setParsedContent(parsed);
          
          // Set language if detected
          if (parsed.metadata.language) {
            setLanguage(parsed.metadata.language);
          }
          
          // Set tags if keywords extracted
          if (parsed.metadata.keyTerms && parsed.metadata.keyTerms.length > 0) {
            setTags(parsed.metadata.keyTerms.join(', '));
          }
        } catch (e) {
          console.error('Error parsing file preview:', e);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading
  });
  
  const handleUpload = async () => {
    if (!file || !user) return;
    
    // Check question limit for free users
    if (!questionLimit.canAccessContent && contentType !== 'flashcards') {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached your daily question limit. Upgrade to premium for unlimited access.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setProcessingStep('Uploading document...');
    
    try {
      // Track question usage first
      if (contentType !== 'flashcards') {
        const canProceed = await questionLimit.trackQuestionUsage();
        if (!canProceed) {
          setIsUploading(false);
          return;
        }
      }
      
      // Upload the file
      setUploadProgress(20);
      const { path, url } = await DocumentService.uploadDocument(file, user.id);
      
      // Parse document content
      setUploadProgress(40);
      setProcessingStep('Parsing document content...');
      
      let parsedDoc: ParsedDocument;
      
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        // For text files, we already parsed the content
        parsedDoc = parsedContent || await readFileAsText(file).then(content => 
          DocumentService.parseDocumentContent(content, file.type)
        );
      } else {
        // For other file types, we'd need more complex parsing
        // This would typically be done on a server
        const content = await readFileAsText(file);
        parsedDoc = await DocumentService.parseDocumentContent(content, file.type);
      }
      
      setParsedContent(parsedDoc);
      
      // Save document metadata
      setUploadProgress(60);
      setProcessingStep('Saving document metadata...');
      
      const documentId = await DocumentService.saveDocumentMetadata({
        title,
        type: file.type,
        size: file.size,
        uploadedBy: user.id,
        contentType,
        language,
        difficulty,
        tags: tags.split(',').map(tag => tag.trim())
      }, parsedDoc);
      
      // Generate questions from content
      setUploadProgress(80);
      setProcessingStep('Generating questions...');
      
      const generatedQuestions = await QuestionGenerationService.generateQuestionsFromDocument(
        documentId,
        parsedDoc,
        contentType,
        numQuestions,
        difficulty,
        user.id
      );
      
      setQuestions(generatedQuestions);
      
      // Complete
      setUploadProgress(100);
      setProcessingStep('Upload complete!');
      
      toast({
        title: "Upload Successful",
        description: `Document processed and ${generatedQuestions.length} questions generated.`,
      });
      
      // Callback with results
      if (onUploadComplete) {
        onUploadComplete(documentId, generatedQuestions);
      }
      
    } catch (err) {
      console.error('Error processing document:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : 'Failed to process document',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };
  
  const resetForm = () => {
    setFile(null);
    setTitle('');
    setTags('');
    setContentType('multipleChoice');
    setLanguage('english');
    setDifficulty('intermediate');
    setNumQuestions(5);
    setUploadProgress(0);
    setProcessingStep('');
    setParsedContent(null);
    setQuestions([]);
    setError(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          Upload documents to generate learning materials
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* File Drop Zone */}
        {!file ? (
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            
            {isDragActive ? (
              <p className="text-primary font-medium">Drop your document here...</p>
            ) : (
              <>
                <p className="font-medium mb-1">Drag & drop a document here, or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: TXT, PDF, DOC, DOCX (max 10MB)
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4 bg-muted p-3 rounded-md">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFile(null)}
              disabled={isUploading}
            >
              Change
            </Button>
          </div>
        )}
        
        {/* User Inputs */}
        {file && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Enter a title for this document"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select 
                  value={contentType} 
                  onValueChange={(value: any) => setContentType(value)}
                  disabled={isUploading}
                >
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flashcards">Flashcards</SelectItem>
                    <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={language} 
                  onValueChange={setLanguage}
                  disabled={isUploading}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value: any) => setDifficulty(value)}
                  disabled={isUploading}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="num-questions">Number of Questions</Label>
                <Select 
                  value={numQuestions.toString()} 
                  onValueChange={(value) => setNumQuestions(parseInt(value))}
                  disabled={isUploading}
                >
                  <SelectTrigger id="num-questions">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                value={tags} 
                onChange={e => setTags(e.target.value)} 
                placeholder="grammar, vocabulary, etc."
                disabled={isUploading}
              />
            </div>
          </div>
        )}
        
        {/* Daily Usage Limit */}
        {user && !isUploading && contentType !== 'flashcards' && (
          <div className="mt-4">
            <Alert variant={questionLimit.canAccessContent ? "default" : "destructive"} className="bg-muted">
              <div className="flex items-center gap-2">
                {questionLimit.canAccessContent ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {questionLimit.canAccessContent 
                    ? "Questions Available" 
                    : "Daily Limit Reached"
                  }
                </AlertTitle>
              </div>
              <AlertDescription className="mt-1">
                {questionLimit.remainingQuestions === "unlimited" 
                  ? "You have unlimited questions available (Premium)"
                  : questionLimit.canAccessContent
                    ? `You have ${questionLimit.remainingQuestions} questions remaining today`
                    : "You've reached your daily limit. Upgrade to premium for unlimited questions."
                }
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{processingStep}</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Results Preview */}
        {questions.length > 0 && (
          <div className="mt-4 border rounded-md p-4">
            <h3 className="font-medium text-lg mb-2">Generated Questions</h3>
            <ul className="space-y-2">
              {questions.slice(0, 3).map((q, i) => (
                <li key={q.id} className="text-sm">
                  <span className="font-medium">{i+1}. {q.question.substring(0, 100)}{q.question.length > 100 ? '...' : ''}</span>
                </li>
              ))}
              {questions.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  + {questions.length - 3} more questions
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetForm}
          disabled={isUploading || !file}
        >
          Reset
        </Button>
        
        <Button 
          onClick={handleUpload}
          disabled={isUploading || !file || !title || (!questionLimit.canAccessContent && contentType !== 'flashcards')}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Upload & Generate Questions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUploader;
