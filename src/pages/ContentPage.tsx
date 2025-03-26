
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentUploader from '@/components/content/DocumentUploader';
import QuestionAnsweringComponent from '@/components/learning/QuestionAnsweringComponent';
import UsageLimits from '@/components/common/UsageLimits';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Upload, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const ContentPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [contentType, setContentType] = useState<'multipleChoice' | 'flashcards' | 'writing' | 'speaking' | 'listening'>('multipleChoice');
  const [isLoading, setIsLoading] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  
  // Fetch recent documents when component mounts
  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecentDocuments();
    }
  }, [isAuthenticated, user]);
  
  const fetchRecentDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setRecentDocuments(data || []);
    } catch (err) {
      console.error('Error fetching recent documents:', err);
      toast({
        title: "Error",
        description: "Could not load your recent documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadComplete = (documentId: string, questions: any[]) => {
    setGeneratedQuestions(questions);
    setActiveTab('practice');
    
    // Determine content type from first question
    if (questions.length > 0 && questions[0].questionType) {
      setContentType(questions[0].questionType);
    }
    
    // Refresh the document list
    fetchRecentDocuments();
  };
  
  const loadQuestionsForDocument = async (documentId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('content_id', documentId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Convert from database format to component format
        const formattedQuestions = data.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          questionType: q.question_type,
          difficulty: q.difficulty
        }));
        
        setGeneratedQuestions(formattedQuestions);
        setContentType(data[0].question_type);
        setActiveTab('practice');
        
        toast({
          title: "Questions Loaded",
          description: `Loaded ${formattedQuestions.length} questions for practice.`,
        });
      } else {
        toast({
          title: "No Questions Found",
          description: "This document doesn't have any generated questions.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      toast({
        title: "Error",
        description: "Could not load questions for this document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Content & Questions | Learning App</title>
      </Helmet>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <h1 className="text-3xl font-bold mb-6">Content & Questions</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </TabsTrigger>
              <TabsTrigger value="practice" disabled={generatedQuestions.length === 0}>
                <FileText className="h-4 w-4 mr-2" />
                Practice Questions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-6">
              {!isAuthenticated ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>
                    Please log in to upload documents and generate questions.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <DocumentUploader onUploadComplete={handleUploadComplete} />
                  
                  {recentDocuments.length > 0 && (
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>Recent Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentDocuments.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between border-b pb-3">
                              <div>
                                <h3 className="font-medium">{doc.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(doc.created_at).toLocaleDateString()} • {doc.content_type}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => loadQuestionsForDocument(doc.id)}
                                disabled={isLoading}
                              >
                                Practice
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="practice" className="mt-6">
              {generatedQuestions.length > 0 ? (
                <QuestionAnsweringComponent 
                  questions={generatedQuestions} 
                  contentType={contentType}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No Questions Available</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Upload a document first to generate practice questions.
                  </p>
                  <Button onClick={() => setActiveTab('upload')}>
                    Upload Document
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          {/* Usage limits for authenticated users */}
          {isAuthenticated && (
            <UsageLimits showUpgradeButton={true} />
          )}
          
          {/* Help card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <p className="font-medium">1. Upload Documents</p>
                <p className="text-muted-foreground">
                  Upload text, PDF, or Word documents to automatically generate learning materials.
                </p>
              </div>
              <div>
                <p className="font-medium">2. Generate Questions</p>
                <p className="text-muted-foreground">
                  Our AI analyzes your content and creates various types of questions.
                </p>
              </div>
              <div>
                <p className="font-medium">3. Practice & Learn</p>
                <p className="text-muted-foreground">
                  Answer generated questions to reinforce your learning and track your progress.
                </p>
              </div>
              <Alert className="bg-primary/5 border-primary/20 mt-4">
                <AlertTitle>Free Plan Limits</AlertTitle>
                <AlertDescription className="text-xs">
                  Free users can generate 1 question of each type per day. Upgrade to premium for unlimited access.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
