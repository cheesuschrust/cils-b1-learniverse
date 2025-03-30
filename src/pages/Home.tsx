
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, CheckCircle, Sparkles, MessageCircle, Award, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>CILS B1 Learniverse - Italian Language Exam Preparation</title>
      </Helmet>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
            Master the CILS B1 Exam with <span className="text-primary">Confidence</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete preparation platform for the CILS B1 Italian language certification with AI-powered practice, personalized feedback, and comprehensive resources.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Button asChild size="lg">
                <Link to="/app/dashboard">
                  Continue Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">
                    Login
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive CILS B1 Preparation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Complete Study Materials</h3>
              <p className="text-muted-foreground">
                Access comprehensive resources covering reading, writing, listening and speaking sections of the CILS B1 exam.
              </p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Practice Exams</h3>
              <p className="text-muted-foreground">
                Test your readiness with full-length practice exams that simulate the actual CILS B1 certification test.
              </p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">AI-Powered Learning</h3>
              <p className="text-muted-foreground">
                Get personalized feedback on writing and speaking exercises with advanced AI that helps improve your Italian skills.
              </p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Interactive Exercises</h3>
              <p className="text-muted-foreground">
                Engage with thousands of interactive exercises designed specifically for the B1 level Italian learners.
              </p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement over time with detailed analytics and progress tracking tools.
              </p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"></path>
                  <path d="m12 11 3 3"></path>
                  <path d="M11 7v5h5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Study on Your Schedule</h3>
              <p className="text-muted-foreground">
                Access your materials anytime, anywhere, with a flexible platform designed for busy language learners.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your CILS B1 Exam?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of successful students who have mastered Italian with our comprehensive CILS B1 preparation platform.
          </p>
          <Button asChild size="lg">
            <Link to={user ? "/app/dashboard" : "/signup"}>
              {user ? "Go to Dashboard" : "Start Learning Today"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;
