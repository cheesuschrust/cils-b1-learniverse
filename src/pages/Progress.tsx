
import React from 'react';
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { BarChart, Calendar, CheckCircle2, ListChecks, Activity, BookOpen, Headphones, Edit, MessageSquare } from "lucide-react";
import UserProgressDashboard from '@/components/dashboard/UserProgressDashboard';
import ProgressChart from '@/components/progress/ProgressChart';
import ProgressSummary from '@/components/progress/ProgressSummary';
import SkillBreakdown from '@/components/progress/SkillBreakdown';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function Progress() {
  const { toast } = useToast();
  
  // Mock data representing user's test progress aligned with CILS B1 requirements
  const testProgress = {
    sections: {
      listening: { 
        score: 72, 
        total: 100,
        timeSpent: 180, // minutes
        completedExercises: 24,
        totalExercises: 30
      },
      reading: { 
        score: 65, 
        total: 100,
        timeSpent: 210, 
        completedExercises: 18,
        totalExercises: 25
      },
      writing: { 
        score: 58, 
        total: 100,
        timeSpent: 120,
        completedExercises: 12,
        totalExercises: 20
      },
      speaking: { 
        score: 62, 
        total: 100,
        timeSpent: 90,
        completedExercises: 15,
        totalExercises: 22
      }
    },
    overall: {
      score: 65,
      requiredScore: 80,
      estimatedReadiness: 75,
      daysStudied: 28,
      totalDays: 45,
      longestStreak: 14
    },
    cilsInfo: {
      examDate: "Not scheduled",
      passingScore: 80,
      timePerSection: {
        listening: "30 minutes",
        reading: "40 minutes",
        writing: "60 minutes",
        speaking: "10 minutes"
      }
    }
  };

  // Historical progress data for charts
  const historicalData = [
    { date: '2023-01-01', listening: 45, reading: 40, writing: 30, speaking: 35, overall: 38 },
    { date: '2023-01-08', listening: 50, reading: 42, writing: 35, speaking: 40, overall: 42 },
    { date: '2023-01-15', listening: 55, reading: 48, writing: 40, speaking: 42, overall: 46 },
    { date: '2023-01-22', listening: 62, reading: 54, writing: 45, speaking: 47, overall: 52 },
    { date: '2023-01-29', listening: 65, reading: 60, writing: 50, speaking: 55, overall: 58 },
    { date: '2023-02-05', listening: 70, reading: 62, writing: 55, speaking: 60, overall: 62 },
    { date: '2023-02-12', listening: 72, reading: 65, writing: 58, speaking: 62, overall: 65 }
  ];

  // Handle assessment request
  const handleAssessmentRequest = () => {
    toast({
      title: "Assessment Scheduled",
      description: "Your CILS readiness assessment will be available tomorrow."
    });
  };

  return (
    <>
      <Helmet>
        <title>Learning Progress | CILS B1 Cittadinanza</title>
        <meta name="description" content="Track your Italian language learning progress for the CILS B1 Citizenship exam" />
      </Helmet>
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Learning Progress</h1>
          <p className="text-muted-foreground mt-2">
            Track your preparation for the CILS B1 Citizenship exam
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1">
          {/* User Progress Summary */}
          <UserProgressDashboard 
            userName="User" 
            streak={testProgress.overall.longestStreak}
            lastActive={new Date()}
            isItalianLevel="B1 Intermediate"
            progressData={{
              vocabulary: 65,
              grammar: 45,
              reading: testProgress.sections.reading.score,
              writing: testProgress.sections.writing.score,
              listening: testProgress.sections.listening.score,
              speaking: testProgress.sections.speaking.score,
              culture: 60,
              citizenship: 40
            }}
          />
          
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>CILS B1 Exam Readiness</CardTitle>
              <CardDescription>
                Your estimated readiness for each section of the CILS B1 Citizenship exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ProgressSummary 
                  overall={testProgress.overall.estimatedReadiness} 
                  targetScore={testProgress.cilsInfo.passingScore}
                  sections={[
                    { name: 'Listening', score: testProgress.sections.listening.score, icon: <Headphones className="h-4 w-4" /> },
                    { name: 'Reading', score: testProgress.sections.reading.score, icon: <BookOpen className="h-4 w-4" /> },
                    { name: 'Writing', score: testProgress.sections.writing.score, icon: <Edit className="h-4 w-4" /> },
                    { name: 'Speaking', score: testProgress.sections.speaking.score, icon: <MessageSquare className="h-4 w-4" /> }
                  ]}
                />
                
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Next scheduled CILS B1 exam: {testProgress.cilsInfo.examDate}</p>
                    <p className="text-xs text-muted-foreground">Required passing score: {testProgress.cilsInfo.passingScore}%</p>
                  </div>
                  <Button onClick={handleAssessmentRequest}>
                    Take Readiness Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Charts and Details Tabs */}
          <Tabs defaultValue="progress-over-time" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
              <TabsTrigger value="progress-over-time">Progress Over Time</TabsTrigger>
              <TabsTrigger value="skill-breakdown">Skill Breakdown</TabsTrigger>
              <TabsTrigger value="study-time">Study Time</TabsTrigger>
              <TabsTrigger value="test-performance" className="hidden md:block">Test Performance</TabsTrigger>
              <TabsTrigger value="cils-requirements" className="hidden md:block">CILS Requirements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress-over-time">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Progress Over Time
                  </CardTitle>
                  <CardDescription>
                    Track how your scores have improved across all CILS B1 exam sections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ProgressChart data={historicalData} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skill-breakdown">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Skill Breakdown
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of your performance in each skill category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <SkillBreakdown sections={[
                      {
                        name: 'Listening',
                        icon: <Headphones className="h-5 w-5 text-blue-500" />,
                        skills: [
                          { name: 'Comprehension', score: 75 },
                          { name: 'Note-taking', score: 65 },
                          { name: 'Detail recognition', score: 70 },
                          { name: 'Main idea identification', score: 80 }
                        ],
                        strengths: ['Main idea identification', 'Dialogue comprehension'],
                        weaknesses: ['Fast speech comprehension', 'Regional accents']
                      },
                      {
                        name: 'Reading',
                        icon: <BookOpen className="h-5 w-5 text-green-500" />,
                        skills: [
                          { name: 'Comprehension', score: 70 },
                          { name: 'Scanning', score: 75 },
                          { name: 'Detail analysis', score: 60 },
                          { name: 'Vocabulary recognition', score: 65 }
                        ],
                        strengths: ['Scanning for information', 'Basic comprehension'],
                        weaknesses: ['Complex text analysis', 'Technical vocabulary']
                      },
                      {
                        name: 'Writing',
                        icon: <Edit className="h-5 w-5 text-amber-500" />,
                        skills: [
                          { name: 'Grammar', score: 60 },
                          { name: 'Vocabulary', score: 65 },
                          { name: 'Text structure', score: 55 },
                          { name: 'Task completion', score: 70 }
                        ],
                        strengths: ['Basic sentence construction', 'Task completion'],
                        weaknesses: ['Complex grammar structures', 'Verb tenses']
                      },
                      {
                        name: 'Speaking',
                        icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
                        skills: [
                          { name: 'Pronunciation', score: 65 },
                          { name: 'Fluency', score: 60 },
                          { name: 'Vocabulary range', score: 70 },
                          { name: 'Interaction', score: 75 }
                        ],
                        strengths: ['Basic conversation', 'Question responses'],
                        weaknesses: ['Extended monologues', 'Complex opinions']
                      }
                    ]} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="study-time">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Study Time Analysis
                  </CardTitle>
                  <CardDescription>
                    Review of your study habits and time spent on each section
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Time Distribution</h3>
                      <div className="h-64">
                        {/* Placeholder for time distribution chart - will be implemented */}
                        <div className="h-full bg-muted/20 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Study time distribution chart</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Study Consistency</h3>
                      <div className="h-64">
                        {/* Placeholder for study consistency chart - will be implemented */}
                        <div className="h-full bg-muted/20 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Study consistency heatmap</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium mb-3">Hours Spent vs. CILS Recommendation</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <Headphones className="h-4 w-4 mr-2 text-blue-500" />
                              <span>Listening</span>
                            </div>
                            <span className="font-medium">{testProgress.sections.listening.timeSpent / 60} hrs of 30 hrs recommended</span>
                          </div>
                          <ProgressBar value={(testProgress.sections.listening.timeSpent / 60 / 30) * 100} className="h-2 bg-blue-100" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-green-500" />
                              <span>Reading</span>
                            </div>
                            <span className="font-medium">{testProgress.sections.reading.timeSpent / 60} hrs of 35 hrs recommended</span>
                          </div>
                          <ProgressBar value={(testProgress.sections.reading.timeSpent / 60 / 35) * 100} className="h-2 bg-green-100" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <Edit className="h-4 w-4 mr-2 text-amber-500" />
                              <span>Writing</span>
                            </div>
                            <span className="font-medium">{testProgress.sections.writing.timeSpent / 60} hrs of 40 hrs recommended</span>
                          </div>
                          <ProgressBar value={(testProgress.sections.writing.timeSpent / 60 / 40) * 100} className="h-2 bg-amber-100" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                              <span>Speaking</span>
                            </div>
                            <span className="font-medium">{testProgress.sections.speaking.timeSpent / 60} hrs of 25 hrs recommended</span>
                          </div>
                          <ProgressBar value={(testProgress.sections.speaking.timeSpent / 60 / 25) * 100} className="h-2 bg-purple-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="test-performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Test Performance
                  </CardTitle>
                  <CardDescription>
                    Results from your practice tests and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Recent Practice Tests</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">Date</th>
                              <th className="text-left py-2 font-medium">Type</th>
                              <th className="text-left py-2 font-medium">Listening</th>
                              <th className="text-left py-2 font-medium">Reading</th>
                              <th className="text-left py-2 font-medium">Writing</th>
                              <th className="text-left py-2 font-medium">Speaking</th>
                              <th className="text-left py-2 font-medium">Overall</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">Feb 12, 2023</td>
                              <td className="py-2">Full Test</td>
                              <td className="py-2 text-blue-600">72%</td>
                              <td className="py-2 text-green-600">65%</td>
                              <td className="py-2 text-amber-600">58%</td>
                              <td className="py-2 text-purple-600">62%</td>
                              <td className="py-2 font-medium">65%</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">Feb 05, 2023</td>
                              <td className="py-2">Full Test</td>
                              <td className="py-2 text-blue-600">70%</td>
                              <td className="py-2 text-green-600">62%</td>
                              <td className="py-2 text-amber-600">55%</td>
                              <td className="py-2 text-purple-600">60%</td>
                              <td className="py-2 font-medium">62%</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2">Jan 29, 2023</td>
                              <td className="py-2">Full Test</td>
                              <td className="py-2 text-blue-600">65%</td>
                              <td className="py-2 text-green-600">60%</td>
                              <td className="py-2 text-amber-600">50%</td>
                              <td className="py-2 text-purple-600">55%</td>
                              <td className="py-2 font-medium">58%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Question Type Performance</h3>
                        <span className="text-xs text-muted-foreground">Based on last 10 practice sessions</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Multiple Choice Questions</span>
                            <span className="font-medium">78%</span>
                          </div>
                          <ProgressBar value={78} className="h-2" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Fill in the Blanks</span>
                            <span className="font-medium">65%</span>
                          </div>
                          <ProgressBar value={65} className="h-2" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Short Answer Questions</span>
                            <span className="font-medium">60%</span>
                          </div>
                          <ProgressBar value={60} className="h-2" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Essay Questions</span>
                            <span className="font-medium">55%</span>
                          </div>
                          <ProgressBar value={55} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cils-requirements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ListChecks className="h-5 w-5 mr-2" />
                    CILS B1 Exam Requirements
                  </CardTitle>
                  <CardDescription>
                    Official requirements and format for the B1 Citizenship language test
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Listening Test</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Duration: 30 minutes</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Two recordings played twice each</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Multiple choice and fill-in-the-blank questions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Topics: everyday conversations, announcements, radio programs</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Passing score: 11/20</span>
                          </li>
                        </ul>
                        
                        <h3 className="text-base font-medium pt-2">Reading Test</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Duration: 40 minutes</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Three texts with varying lengths</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Multiple choice, matching, and true/false questions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Topics: notices, regulations, newspaper articles</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Passing score: 11/20</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Writing Test</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Duration: 60 minutes</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Two writing tasks: form completion and short composition</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Composition: 80-100 words</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Topics: personal letters, descriptions, simple narratives</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Passing score: 11/20</span>
                          </li>
                        </ul>
                        
                        <h3 className="text-base font-medium pt-2">Speaking Test</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Duration: 10 minutes</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Interview with an examiner</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Three parts: personal introduction, guided discussion, role play</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Topics: personal information, daily routines, interests, opinions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                            <span>Passing score: 11/20</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-base font-medium mb-3">Overall Requirements</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                          <span>Required for Italian citizenship application: CILS B1 Cittadinanza</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                          <span>Total exam duration: 2 hours 20 minutes</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                          <span>Overall passing score: 11/20 in each section</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                          <span>Certificate validity: Indefinite for citizenship purposes</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                          <span>Test locations: Authorized Italian language testing centers</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
