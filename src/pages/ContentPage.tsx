
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ContentPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Learning App</h1>
          <p className="text-xl text-muted-foreground">
            Master Italian with AI-powered interactive exercises
          </p>
        </div>
        
        {isAuthenticated ? (
          <div className="space-y-8">
            <div className="bg-primary/5 border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome back, {user?.first_name || 'User'}!
              </h2>
              <p className="mb-4">
                Continue your Italian learning journey with our interactive exercises.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/flashcards">Practice Flashcards</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/multiple-choice">Try Multiple Choice</Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Flashcards</h3>
                <p className="text-muted-foreground mb-4">
                  Practice vocabulary with digital flashcards
                </p>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/flashcards">Start Learning</Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Multiple Choice</h3>
                <p className="text-muted-foreground mb-4">
                  Test your knowledge with multiple choice questions
                </p>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/multiple-choice">Start Quiz</Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Listening</h3>
                <p className="text-muted-foreground mb-4">
                  Improve your listening comprehension skills
                </p>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/listening">Start Listening</Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Speaking</h3>
                <p className="text-muted-foreground mb-4">
                  Practice your pronunciation and speaking
                </p>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/speaking">Start Speaking</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary/5 border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Get Started with Italian Learning
            </h2>
            <p className="mb-6 max-w-xl mx-auto">
              Sign up to access personalized AI-powered learning exercises, track your progress, 
              and master Italian at your own pace.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/signup">Sign Up for Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
