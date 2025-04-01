
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CitizenshipContentProcessor } from '@/components/CitizenshipContentProcessor';
import CitizenshipReadinessComponent from '@/components/CitizenshipReadinessComponent';
import { ItalianPracticeComponent } from '@/components/ItalianPracticeComponent';
import { AnswerResults } from '@/types/core-types';

const CitizenshipTest: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('practice');
  const [readinessScore, setReadinessScore] = useState<number>(65);
  
  const handleCompletePractice = (results: AnswerResults) => {
    // Update readiness score based on practice results
    const newScore = Math.min(100, readinessScore + (results.score > 80 ? 5 : results.score > 60 ? 2 : -1));
    setReadinessScore(newScore);
  };
  
  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Citizenship Test Preparation</h1>
          <p className="text-muted-foreground">
            Practice and prepare for the CILS B1 Italian Citizenship Test
          </p>
        </div>
        
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-8">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Italian Citizenship Practice</CardTitle>
              <CardDescription>
                Practice Italian language skills with citizenship-focused content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItalianPracticeComponent 
                initialSection="culture" 
                level="intermediate"
                isCitizenshipMode={true}
                onComplete={handleCompletePractice}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Citizenship Content</CardTitle>
              <CardDescription>
                Upload Italian citizenship materials for AI-generated practice questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CitizenshipContentProcessor />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Upload Italian content related to citizenship to generate targeted practice questions.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="readiness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Citizenship Test Readiness</CardTitle>
              <CardDescription>
                Track your preparedness for the CILS B1 Citizenship Test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CitizenshipReadinessComponent 
                readinessScore={readinessScore} 
                level="intermediate"
                assessmentAvailable={true}
                lastAssessmentDate={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)} // 7 days ago
                onStartAssessment={() => setActiveTab('practice')}
              />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Your readiness score is updated based on your performance in practice sessions.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CitizenshipTest;
