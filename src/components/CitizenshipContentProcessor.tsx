
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Upload, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase-client';
import ConfidenceIndicator from './ai/ConfidenceIndicator';

type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';
type AIQuestion = {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  type: string;
};

interface CitizenshipContentProcessorProps {
  initialContent?: string;
  level?: ItalianLevel;
}

export const CitizenshipContentProcessor: React.FC<CitizenshipContentProcessorProps> = ({ 
  initialContent = '', 
  level = 'intermediate' 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [content, setContent] = useState<string>(initialContent);
  const [selectedLevel, setSelectedLevel] = useState<ItalianLevel>(level);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('text-input');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [documentTitle, setDocumentTitle] = useState('');
  const [includeInTraining, setIncludeInTraining] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleProcessDocument = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to process documents.",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessingStatus('processing');
      let documentContent = '';

      if (activeTab === 'file-upload') {
        if (!uploadedFile) {
          throw new Error('No file selected');
        }
        documentContent = await readFileContent(uploadedFile);
      } else {
        documentContent = content;
      }

      if (!documentContent.trim()) {
        throw new Error('Document content is empty');
      }

      // Call the process-document edge function
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          documentContent,
          userId: user.id,
          includeInTraining,
          level: selectedLevel
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.questions) {
        // Add unique IDs to questions
        const questionsWithIds = data.questions.map((q: any, idx: number) => ({
          ...q,
          id: `q-${idx}-${Date.now()}`
        }));
        setQuestions(questionsWithIds);
        setAnalysisResult(data.analysis);
      }

      toast({
        title: "Document Processed",
        description: "Your document has been successfully processed and questions have been generated.",
      });

      setProcessingStatus('done');
    } catch (error) {
      console.error("Document processing error:", error);
      toast({
        title: "Processing Failed",
        description: error.message || "There was an error processing your document.",
        variant: "destructive"
      });
      setProcessingStatus('idle');
    }
  };

  const handleGenerateQuestions = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate questions.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Empty Content",
        description: "Please enter some text to generate questions.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call the process-document edge function for just question generation
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: {
          documentContent: content,
          userId: user.id,
          includeInTraining: false,
          documentType: 'citizenship'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.questions) {
        // Add unique IDs to questions
        const questionsWithIds = data.questions.map((q: any, idx: number) => ({
          ...q,
          id: `q-${idx}-${Date.now()}`
        }));
        setQuestions(questionsWithIds);
      }

      toast({
        title: "Questions Generated",
        description: `Successfully generated ${data.questions?.length || 0} questions.`,
      });
    } catch (error) {
      console.error("Question generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "There was an error generating questions.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text-input">Enter Text</TabsTrigger>
            <TabsTrigger value="file-upload">Upload Document</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text-input">
            <div className="space-y-2">
              <Label htmlFor="italian-content">Enter Italian citizenship text</Label>
              <Textarea 
                id="italian-content"
                placeholder="Paste Italian content here to generate practice questions..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="mt-4">
              <Label>Difficulty Level</Label>
              <RadioGroup 
                value={selectedLevel} 
                onValueChange={(value) => setSelectedLevel(value as ItalianLevel)}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="level-beginner" />
                  <Label htmlFor="level-beginner">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="level-intermediate" />
                  <Label htmlFor="level-intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="level-advanced" />
                  <Label htmlFor="level-advanced">Advanced</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              onClick={handleGenerateQuestions}
              disabled={isGenerating || !content.trim()}
              className="w-full md:w-auto mt-4"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Citizenship Questions
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="file-upload">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-title">Document Title</Label>
                <Input 
                  id="document-title" 
                  value={documentTitle} 
                  onChange={(e) => setDocumentTitle(e.target.value)} 
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Upload Document</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload a text document (.txt, .doc, .pdf)</p>
                  <Input
                    type="file"
                    className="max-w-sm"
                    onChange={handleFileChange}
                    accept=".txt,.doc,.docx,.pdf"
                  />
                  {uploadedFile && (
                    <p className="text-sm mt-2">Selected: {uploadedFile.name}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  id="include-in-training" 
                  checked={includeInTraining}
                  onChange={(e) => setIncludeInTraining(e.target.checked)}
                  className="mt-1"
                />
                <Label htmlFor="include-in-training" className="font-normal text-sm">
                  Include this document in the AI training dataset to improve future content generation
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <RadioGroup 
                  value={selectedLevel} 
                  onValueChange={(value) => setSelectedLevel(value as ItalianLevel)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="level-beginner-file" />
                    <Label htmlFor="level-beginner-file">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="level-intermediate-file" />
                    <Label htmlFor="level-intermediate-file">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="level-advanced-file" />
                    <Label htmlFor="level-advanced-file">Advanced</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={handleProcessDocument} 
                disabled={processingStatus === 'processing' || !uploadedFile}
                className="w-full"
              >
                {processingStatus === 'processing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : processingStatus === 'done' ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Processed
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Process Document
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {analysisResult && (
          <div className="p-4 border rounded-md bg-muted/40 mt-4">
            <h3 className="font-medium mb-2">Content Analysis</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Content Type:</span> {analysisResult.contentType}
              </div>
              <div>
                <span className="font-semibold">Difficulty Level:</span> {analysisResult.difficultyLevel}
              </div>
              <div>
                <span className="font-semibold">Language:</span> {analysisResult.languageDetected}
              </div>
              <div>
                <span className="font-semibold">Confidence:</span> <ConfidenceIndicator score={analysisResult.confidence} />
              </div>
              {analysisResult.topicsDetected && (
                <div className="col-span-2">
                  <span className="font-semibold">Topics:</span> {analysisResult.topicsDetected.join(", ")}
                </div>
              )}
            </div>
          </div>
        )}
        
        {questions.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Generated Questions</h3>
            
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Question {index + 1}:</p>
                  <ConfidenceIndicator score={0.75 + (index * 0.05) % 0.25} />
                </div>
                <p className="mb-4">{question.text}</p>
                
                {question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full border ${option === question.correctAnswer ? 'bg-primary border-primary' : 'border-gray-300'}`} />
                        <span className={option === question.correctAnswer ? 'font-medium' : ''}>{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.explanation && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p className="font-medium">Explanation:</p>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Also export as default
export default CitizenshipContentProcessor;
