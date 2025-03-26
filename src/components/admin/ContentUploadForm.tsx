
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, File, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  contentType: z.enum(['flashcards', 'multipleChoice', 'writing', 'speaking', 'listening']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.enum(['english', 'italian', 'both']),
  isPublished: z.boolean().default(true),
  tags: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const ContentUploadForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingResults, setProcessingResults] = useState<{
    itemsCreated: number;
    questionsGenerated: number;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      contentType: 'flashcards',
      difficulty: 'intermediate',
      language: 'both',
      isPublished: true,
      tags: ''
    }
  });

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Reset states
    setUploadError(null);
    setProcessingResults(null);
    
    // Check file type
    const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload a text, PDF, or Word document.');
      return;
    }
    
    // Check file size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 10 MB.');
      return;
    }
    
    setFile(file);
    
    // Read file content for text files
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    } else {
      setFileContent('');
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileContent('');
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload content.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Upload file to Supabase Storage
      let fileUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `content/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('content-files')
          .upload(filePath, file);
          
        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('content-files')
          .getPublicUrl(filePath);
          
        fileUrl = publicUrl;
      }
      
      // 2. Create content record in database
      const contentId = uuidv4();
      const { error: contentError } = await supabase
        .from('content')
        .insert({
          id: contentId,
          title: values.title,
          description: values.description,
          content_type: values.contentType,
          difficulty: values.difficulty,
          language: values.language,
          tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
          created_by: user.id,
          is_published: values.isPublished,
          raw_content: fileContent || null,
          file_url: fileUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (contentError) {
        throw new Error(`Content creation failed: ${contentError.message}`);
      }
      
      toast({
        title: "Content uploaded",
        description: "Your content has been uploaded successfully.",
      });
      
      // 3. Process content to generate questions (in a real implementation, this would call an API)
      if (values.isPublished && (fileContent || fileUrl)) {
        setIsProcessing(true);
        
        // This is where we would call an AI service to process the content and generate questions
        // For this implementation, we'll just create some sample questions
        await processContent(contentId, values.contentType, values.difficulty, values.language);
      }
      
      // Reset form
      form.reset();
      clearFile();
      
    } catch (error: any) {
      console.error('Content upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your content.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  
  const processContent = async (contentId: string, contentType: string, difficulty: string, language: string) => {
    try {
      // Create some sample questions based on the content type
      const questions = [];
      const numQuestions = Math.floor(Math.random() * 5) + 3; // 3-7 questions
      
      for (let i = 0; i < numQuestions; i++) {
        const questionId = uuidv4();
        
        let question: any = {
          id: questionId,
          content_id: contentId,
          question: `Sample ${contentType} question ${i + 1}`,
          question_type: contentType,
          difficulty: difficulty,
          language: language,
          created_by: user!.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Add type-specific fields
        if (contentType === 'multipleChoice') {
          question.options = [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ];
          question.correct_answer = "Option A";
          question.explanation = "This is the explanation for the correct answer.";
        } else if (contentType === 'flashcards') {
          question.question = "Italian word or phrase";
          question.correct_answer = "English translation";
        } else {
          question.correct_answer = "Sample answer";
          question.explanation = "Sample explanation";
        }
        
        questions.push(question);
      }
      
      // Insert questions into database
      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questions);
        
      if (questionsError) {
        throw new Error(`Question creation failed: ${questionsError.message}`);
      }
      
      // Set processing results
      setProcessingResults({
        itemsCreated: 1,
        questionsGenerated: questions.length
      });
      
      toast({
        title: "Content processed",
        description: `Generated ${questions.length} questions from your content.`,
      });
      
    } catch (error: any) {
      console.error('Content processing error:', error);
      toast({
        title: "Processing failed",
        description: error.message || "There was an error processing your content.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
        <CardDescription>
          Upload documents to create flashcards, questions, and other learning materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter content title"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select
                value={form.getValues().contentType}
                onValueChange={(value: any) => form.setValue('contentType', value)}
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter content description"
              rows={3}
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={form.getValues().difficulty}
                onValueChange={(value: any) => form.setValue('difficulty', value)}
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
              <Label htmlFor="language">Language</Label>
              <Select
                value={form.getValues().language}
                onValueChange={(value: any) => form.setValue('language', value)}
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
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="grammar, verbs, b2, etc."
                {...form.register('tags')}
              />
            </div>
          </div>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {!file ? (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">Drag & drop a file or click to browse</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Supported formats: TXT, PDF, DOC, DOCX (max 10MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose file
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={onFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <File className="h-10 w-10 text-primary" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          {processingResults && (
            <Alert>
              <AlertTitle>Processing Complete</AlertTitle>
              <AlertDescription>
                Created {processingResults.itemsCreated} content item(s) and generated {processingResults.questionsGenerated} questions.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-published"
              checked={form.getValues().isPublished}
              onChange={(e) => form.setValue('isPublished', e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="is-published">Publish immediately</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          className="mr-2" 
          onClick={() => form.reset()}
          disabled={isUploading || isProcessing}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={form.handleSubmit(onSubmit)}
          disabled={isUploading || isProcessing}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Upload & Process'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentUploadForm;
