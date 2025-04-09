
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudyPlanPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>CILS B1 Study Plan | Italian Language Practice</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your CILS B1 Study Plan</h1>
          <p className="text-muted-foreground">
            Personalized learning roadmap
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Study Plan Overview</CardTitle>
            <CardDescription>
              A structured approach to prepare for your CILS B1 certification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              This personalized study plan is designed to help you prepare efficiently for the CILS B1 exam
              over a 12-week period, covering all required skills and knowledge areas.
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="bycategory">By Skill Area</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Week 1-2: Foundation</CardTitle>
                <CardDescription>Building essential vocabulary and grammar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Review basic Italian grammar structures</li>
                  <li>Build core vocabulary (500-800 most common words)</li>
                  <li>Practice basic listening with slow, clear dialogues</li>
                  <li>Begin simple reading exercises with short texts</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Week 3-5: Development</CardTitle>
                <CardDescription>Expanding communication skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Intermediate grammar structures (conditional, subjunctive)</li>
                  <li>Vocabulary expansion in everyday topics</li>
                  <li>Practice comprehension with authentic materials</li>
                  <li>Begin structured writing exercises</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Week 6-8: Refinement</CardTitle>
                <CardDescription>Polishing all four language skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Advanced grammar review and practice</li>
                  <li>Targeted vocabulary for specific exam topics</li>
                  <li>Regular speaking practice with structured exercises</li>
                  <li>Focus on common writing formats for the exam</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Week 9-10: Exam Preparation</CardTitle>
                <CardDescription>Specific exam strategies and practice</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Work through practice exams under timed conditions</li>
                  <li>Review and perfect writing techniques</li>
                  <li>Practice speaking with exam-style questions</li>
                  <li>Targeted practice for weaker areas</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Week 11-12: Final Review</CardTitle>
                <CardDescription>Consolidation and confidence building</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Complete full mock exams</li>
                  <li>Final grammar and vocabulary review</li>
                  <li>Last-minute tips and strategies</li>
                  <li>Relaxation techniques for exam day</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bycategory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Listening</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Focus areas for CILS B1 listening comprehension:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Understanding everyday conversations</li>
                    <li>Following announcements and instructions</li>
                    <li>Comprehending main points in audio media</li>
                    <li>Identifying speaker attitudes and intentions</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reading</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Focus areas for CILS B1 reading comprehension:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Understanding factual texts on familiar topics</li>
                    <li>Following instructions and public information</li>
                    <li>Comprehending descriptions of events and feelings</li>
                    <li>Identifying main conclusions in texts</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Writing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Focus areas for CILS B1 writing section:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Writing personal letters and notes</li>
                    <li>Describing experiences and impressions</li>
                    <li>Producing simple connected texts</li>
                    <li>Expressing opinions and explaining advantages/disadvantages</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Speaking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Focus areas for CILS B1 speaking section:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Managing conversations on familiar topics</li>
                    <li>Explaining viewpoints on issues</li>
                    <li>Describing experiences, events, and plans</li>
                    <li>Narrating a story or the plot of a book/film</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="space-y-6">
              <p className="text-lg">Below are recommended resources to support your CILS B1 exam preparation:</p>
              
              <Card>
                <CardHeader>
                  <CardTitle>Textbooks & Study Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>"Nuovo Contatto B1" (Loescher Editore)</li>
                    <li>"Preparazione al CILS B1" (Edilingua)</li>
                    <li>"Grammatica Avanzata della Lingua Italiana" (Alma Edizioni)</li>
                    <li>"Vocabolario Italiano per Stranieri" (Alma Edizioni)</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Online Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>RAI Italia (videos and podcasts)</li>
                    <li>Podcast Italiano (authentic listening materials)</li>
                    <li>News in Slow Italian (graded listening practice)</li>
                    <li>CILS official website (sample exams)</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Practice Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Daily vocabulary practice with flashcards</li>
                    <li>Weekly writing assignments with feedback</li>
                    <li>Conversation exchanges with native speakers</li>
                    <li>Regular timed practice tests</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudyPlanPage;
