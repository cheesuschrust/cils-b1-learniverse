
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, BookOpen, Trophy, FileText, BarChart3, Headphones, MessageCircle } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Prepare for the Italian citizenship language exam with our comprehensive CILS B1 learning platform." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Master Italian for Your <span className="text-primary">Citizenship Test</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform helps you prepare specifically for the CILS B1 Cittadinanza exam with personalized study plans.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link to="/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/mock-exam">Try Demo Exam</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive CILS B1 Preparation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in your Italian citizenship language test
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Exam-Focused Content</CardTitle>
                <CardDescription>
                  Materials specifically designed for the Italian B1 Citizenship test requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Official CILS B1 exam format practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Citizenship-related vocabulary focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Authentic exam-style questions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                  <Headphones className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Complete Skill Coverage</CardTitle>
                <CardDescription>
                  Practice all four language skills required for the exam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Reading comprehension exercises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Listening practice with native speakers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Writing and speaking exercises with feedback</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>AI-Powered Learning</CardTitle>
                <CardDescription>
                  Personalized study experience based on your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Adaptive learning path that focuses on your weak areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Progress tracking and performance analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>AI-generated practice questions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to prepare for your Italian citizenship language exam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-12">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-2 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Sign Up For Free</h3>
                  <p className="text-muted-foreground">
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
                  <h3 className="text-xl font-medium mb-2">Take The Assessment</h3>
                  <p className="text-muted-foreground">
                    Complete our Italian language assessment to determine your current level
                    and create a personalized study plan.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-2 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Practice Daily</h3>
                  <p className="text-muted-foreground">
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
                  <h3 className="text-xl font-medium mb-2">Track Your Progress</h3>
                  <p className="text-muted-foreground">
                    Monitor your improvement with detailed analytics and adjust your
                    study plan accordingly as you prepare for the exam.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button asChild size="lg">
              <Link to="/signup">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose a plan that fits your needs and begin your preparation for the Italian citizenship test today.
          </p>
          <Button asChild size="lg">
            <Link to="/pricing">View Pricing Plans</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
