
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Italian Learning App</h1>
        <p className="text-lg mb-8">
          Your comprehensive platform for mastering Italian language skills
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/practice/reading" className="block">
            <div className="bg-card hover:bg-accent/50 transition-colors p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">Reading Practice</h3>
              <p className="text-muted-foreground">Improve your Italian reading comprehension</p>
            </div>
          </Link>
          
          <Link to="/practice/listening" className="block">
            <div className="bg-card hover:bg-accent/50 transition-colors p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">Listening Practice</h3>
              <p className="text-muted-foreground">Enhance your Italian listening skills</p>
            </div>
          </Link>
          
          <Link to="/practice/speaking" className="block">
            <div className="bg-card hover:bg-accent/50 transition-colors p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">Speaking Practice</h3>
              <p className="text-muted-foreground">Perfect your Italian pronunciation</p>
            </div>
          </Link>
          
          <Link to="/practice/writing" className="block">
            <div className="bg-card hover:bg-accent/50 transition-colors p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">Writing Exercise</h3>
              <p className="text-muted-foreground">Develop your Italian writing abilities</p>
            </div>
          </Link>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button asChild variant="default" size="lg">
            <Link to="/flashcards">Start with Flashcards</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
