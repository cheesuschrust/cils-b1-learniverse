
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Headphones, PenTool, MessageCircle, Calendar, GraduationCap } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">CILS Italian Citizenship Question of the Day</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Prepare for your Italian Citizenship Test with personalized daily practice questions
        </p>
        {isAuthenticated ? (
          <Button size="lg" asChild>
            <Link to="/dashboard">
              <Calendar className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Daily Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              New questions every day to help you practice for the citizenship test
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Vocabulary Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Master essential Italian vocabulary for the citizenship test
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              Adaptive Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Content tailored to your skill level and learning progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-primary" />
              Conversation Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Improve your speaking and listening with interactive exercises
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Complete Learning Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Practice Questions</CardTitle>
              <CardDescription>Test your knowledge with our daily practice questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access personalized questions designed to help you prepare for the CILS B1 Italian Language Test.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/practice" className="w-full">
                <Button className="w-full">Start Practicing</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Register to track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create a free account to save your progress and access more features.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/auth/register" className="w-full">
                <Button className="w-full" variant="outline">Register</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Already have an account?</CardTitle>
              <CardDescription>Log in to continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sign in to your existing account to continue where you left off.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/auth/login" className="w-full">
                <Button className="w-full" variant="secondary">Login</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Comprehensive Learning Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Flashcards
              </CardTitle>
              <CardDescription>Build your vocabulary</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interactive flashcards to help you learn and remember essential Italian vocabulary.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Headphones className="mr-2 h-5 w-5 text-primary" />
                Listening
              </CardTitle>
              <CardDescription>Improve comprehension</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Audio exercises to enhance your Italian listening skills and understanding.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenTool className="mr-2 h-5 w-5 text-primary" />
                Writing
              </CardTitle>
              <CardDescription>Express yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Practice writing in Italian with guided exercises and personalized feedback.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Speaking
              </CardTitle>
              <CardDescription>Perfect pronunciation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interactive speaking exercises to build confidence in your verbal skills.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Reading
              </CardTitle>
              <CardDescription>Understand text</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Reading comprehension exercises to help you understand written Italian.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Daily Challenge
              </CardTitle>
              <CardDescription>Stay consistent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Daily questions to keep your learning consistent and track your progress over time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Ready to start your Italian citizenship journey?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of learners preparing for the CILS B1 Citizenship Test with our personalized learning platform.
        </p>
        {isAuthenticated ? (
          <Button size="lg" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button size="lg" asChild>
            <Link to="/auth/register">Get Started for Free</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
