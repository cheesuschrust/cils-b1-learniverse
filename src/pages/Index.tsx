
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, BookOpen, Trophy, FileText, BarChart3, Headphones, MessageCircle } from 'lucide-react';
import QuestionOfTheDay from '@/components/learning/QuestionOfTheDay';

const Index = () => {
  const [activeTab, setActiveTab] = useState('daily');
  
  // For demo purposes - in a real app, this would come from a user context
  const userId = "demo-user-1";
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">CILS Italian Citizenship Test Prep</h1>
          <p className="text-xl text-muted-foreground">
            Personalized learning for your Italian citizenship language exam
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button asChild size="lg">
              <Link to="/italian-citizenship-test">Start Practice Test</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Sign Up Free</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="daily">Question of the Day</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="how">How It Works</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <QuestionOfTheDay userId={userId} />
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>CILS B1 Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Content specifically designed for the Italian B1 Citizenship test requirements.
                    Practice with authentic exam-style questions.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>AI-Generated Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI analyzes your strengths and weaknesses to create personalized practice
                    questions that target your learning needs.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your study progress with detailed analytics. See your improvement over time
                    and identify areas that need more attention.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <Headphones className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Listening Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Improve your Italian listening skills with audio exercises at various speeds.
                    Essential for the oral component of the exam.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Instant Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Receive immediate feedback on your answers with detailed explanations and
                    suggestions for improvement.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Citizenship Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Check your readiness for the citizenship exam with our comprehensive assessment
                    tools and practice tests.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="how">
            <Card>
              <CardHeader>
                <CardTitle>How Our Platform Works</CardTitle>
                <CardDescription>
                  Four simple steps to prepare for your Italian citizenship language exam
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-medium">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Sign Up For Free</h3>
                      <p className="text-sm text-muted-foreground">
                        Create your account and set your learning goals. Free users get access
                        to one question per day in one of four key categories.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-medium">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Take The Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete our Italian language assessment to determine your current level
                        and create a personalized study plan.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-medium">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Practice Daily</h3>
                      <p className="text-sm text-muted-foreground">
                        Access daily personalized questions targeting your weak areas and 
                        essential citizenship topics for the CILS B1 exam.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-medium">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Track Your Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor your improvement with detailed analytics and adjust your
                        study plan accordingly as you prepare for the exam.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg">Ready to start?</h3>
                      <p className="text-sm text-muted-foreground">
                        Begin your Italian citizenship test preparation journey today.
                      </p>
                    </div>
                    <Button asChild size="lg">
                      <Link to="/auth">Start Free Trial</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>
                  Hear from users who successfully passed their Italian citizenship language exam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <p className="italic text-muted-foreground">
                          "I was struggling with the grammar for my citizenship test, but the daily questions helped me focus on the most important concepts. Passed my CILS B1 with flying colors!"
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 w-8 h-8 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Maria T.</p>
                            <p className="text-xs text-muted-foreground">Passed CILS B1 in May 2023</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <p className="italic text-muted-foreground">
                          "The listening practice was invaluable. I couldn't find any other resource that prepared me so well for the actual exam format and question style."
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 w-8 h-8 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Robert K.</p>
                            <p className="text-xs text-muted-foreground">Passed CILS B1 in September 2023</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <p className="italic text-muted-foreground">
                          "The personalized feedback on my writing was game-changing. I could see my progress week by week and knew exactly what to improve."
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 w-8 h-8 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Laura B.</p>
                            <p className="text-xs text-muted-foreground">Passed CILS B1 in January 2024</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <p className="italic text-muted-foreground">
                          "After failing twice, I used this platform for 3 months and finally passed my citizenship language test. The citizenship-focused content made all the difference!"
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 w-8 h-8 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm">Carlos M.</p>
                            <p className="text-xs text-muted-foreground">Passed CILS B1 in April 2024</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">Join thousands of successful users who have achieved their Italian citizenship goals with our platform.</p>
                <Button asChild>
                  <Link to="/auth">Start Your Success Story</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-10 pt-10 border-t">
          <h2 className="text-2xl font-bold text-center mb-6">Prepare for CILS B1 Citizenship Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">What is the CILS B1 Citizenship Test?</h3>
              <p className="text-muted-foreground">
                The CILS B1 Citizenship Test is a language proficiency exam required for Italian citizenship.
                It assesses your ability to communicate in Italian at an intermediate level across reading, 
                writing, listening, and speaking.
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Reading and writing sections test your comprehension and expression</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Listening exercises evaluate your ability to understand spoken Italian</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Speaking assessment checks your conversation and pronunciation skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Cultural knowledge questions ensure familiarity with Italian society</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">How Our Platform Helps You Succeed</h3>
              <p className="text-muted-foreground">
                Our comprehensive approach focuses on all aspects of the CILS B1 exam with a 
                special emphasis on citizenship-related vocabulary and concepts.
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Daily practice with AI-generated questions tailored to your level</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Citizenship-focused vocabulary and grammar exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Authentic practice tests simulating the real exam environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Detailed performance analytics to track your progress</span>
                </li>
              </ul>
              
              <div className="pt-2">
                <Button asChild>
                  <Link to="/auth">Begin Your Preparation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
