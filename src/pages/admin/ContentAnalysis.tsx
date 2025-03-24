
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AIContentProcessor from '@/components/ai/AIContentProcessor';
import { ContentType } from '@/utils/textAnalysis';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Brain, FileText, Eye, Code, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContentAnalysis = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [content, setContent] = useState<string>("Enter your content here to generate questions.");
  const [contentType, setContentType] = useState<ContentType>("multiple-choice");
  const [activeTab, setActiveTab] = useState<string>("input");
  const [savedQuestions, setSavedQuestions] = useState<any[]>([]);
  
  const { toast } = useToast();

  const handleQuestionsGenerated = (generatedQuestions: any[]) => {
    setQuestions(generatedQuestions);
    setActiveTab("preview");
    
    toast({
      title: "Questions Generated",
      description: `Successfully generated ${generatedQuestions.length} questions.`,
    });
  };
  
  const handleSaveQuestions = () => {
    setSavedQuestions([...savedQuestions, ...questions]);
    
    toast({
      title: "Questions Saved",
      description: `${questions.length} questions have been saved to your library.`,
    });
    
    // Reset current questions
    setQuestions([]);
  };
  
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    
    toast({
      title: "Question Removed",
      description: "The question has been removed from the list.",
    });
  };
  
  const renderQuestionPreview = (question: any, index: number, allowDelete: boolean = true) => {
    return (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Question {index + 1}</span>
            {allowDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteQuestion(index)}
                className="h-8 w-8 p-0"
              >
                &times;
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium mb-3">{question.question}</p>
          
          <div className="space-y-2">
            {question.options.map((option: string, optIndex: number) => (
              <div 
                key={optIndex} 
                className={`p-2 rounded-md ${
                  question.correctAnswerIndex === optIndex 
                    ? 'bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700' 
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    question.correctAnswerIndex === optIndex 
                      ? 'bg-green-500 text-white' 
                      : 'bg-muted-foreground/30 text-muted-foreground'
                  }`}>
                    {String.fromCharCode(65 + optIndex)}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Difficulty: {question.difficulty}</p>
            <p>Type: {question.type}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>AI Content Analysis | Admin</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Content Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload and analyze content to automatically generate learning materials
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="input" className="flex-1 flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2" />
                Input Content
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                Preview Questions
              </TabsTrigger>
              <TabsTrigger value="library" className="flex-1 flex items-center justify-center">
                <Save className="h-4 w-4 mr-2" />
                Saved Questions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Content Input
                  </CardTitle>
                  <CardDescription>
                    Enter or paste content to analyze and generate questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select 
                      value={contentType} 
                      onValueChange={(value: ContentType) => setContentType(value)}
                    >
                      <SelectTrigger id="contentType">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="flashcards">Flashcards</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="speaking">Speaking</SelectItem>
                        <SelectItem value="listening">Listening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter your content here..."
                      className="min-h-[300px]"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <AIContentProcessor 
                  content={content}
                  contentType={contentType}
                  onQuestionsGenerated={handleQuestionsGenerated}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Generated Questions</span>
                    {questions.length > 0 && (
                      <Button onClick={handleSaveQuestions}>
                        <Save className="h-4 w-4 mr-2" />
                        Save All
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Review and edit generated questions before saving
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((question, index) => 
                        renderQuestionPreview(question, index)
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        No questions generated yet. Go to the "Input Content" tab to generate questions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="library">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Questions Library</CardTitle>
                  <CardDescription>
                    Access your saved questions for future use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedQuestions.length > 0 ? (
                    <div className="space-y-4">
                      {savedQuestions.map((question, index) => 
                        renderQuestionPreview(question, index, false)
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Save className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        No saved questions yet. Generate and save questions to build your library.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                JSON Output
              </CardTitle>
              <CardDescription>
                Technical view of the generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
                <pre className="text-xs">
                  {questions.length > 0 
                    ? JSON.stringify(questions, null, 2)
                    : "No questions generated yet."}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalysis;
