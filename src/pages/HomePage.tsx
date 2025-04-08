
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, BookOpen, Trophy, FileText, BarChart3, Headphones, MessageCircle } from 'lucide-react';

const HomePage = () => {
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
              <Link to="/practice/reading">Start Practice Test</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="how">How It Works</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>
          
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
                        Create your account and set your learning goals.
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
                        Complete our Italian language assessment to determine your current level.
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
                        Access daily personalized questions targeting your weak areas.
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
                        Monitor your improvement with detailed analytics.
                      </p>
                    </div>
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
                          "I was struggling with the grammar for my citizenship test, but the daily questions helped me focus on the most important concepts."
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
                          "The listening practice was invaluable. I couldn't find any other resource that prepared me so well for the actual exam format."
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HomePage;
