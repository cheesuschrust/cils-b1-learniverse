
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
        CILS B1 Cittadinanza <span className="text-primary">Italian Learning</span>
      </h1>
      
      <p className="text-xl mb-12 text-center max-w-2xl">
        Prepare for your CILS B1 Citizenship exam with our comprehensive learning platform. 
        Practice speaking, listening, reading, and writing skills.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
        <Card>
          <CardHeader>
            <CardTitle>For Beginners</CardTitle>
            <CardDescription>Start your Italian learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Our platform offers guided learning paths for complete beginners to Italian. Start with essential vocabulary and basic grammar concepts.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/signup')} className="w-full">Sign Up Free</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>For CILS B1 Preparation</CardTitle>
            <CardDescription>Focus on citizenship exam requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Targeted exercises and practice tests designed specifically for the CILS B1 Citizenship exam. Prepare efficiently with our specialized content.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/login')} className="w-full">Login</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl">
        <Card className="text-center p-4">
          <h3 className="font-bold mb-2">Speaking</h3>
          <p className="text-sm">Practice pronunciation and conversation</p>
        </Card>
        
        <Card className="text-center p-4">
          <h3 className="font-bold mb-2">Listening</h3>
          <p className="text-sm">Improve your comprehension skills</p>
        </Card>
        
        <Card className="text-center p-4">
          <h3 className="font-bold mb-2">Reading</h3>
          <p className="text-sm">Enhance your text understanding</p>
        </Card>
        
        <Card className="text-center p-4">
          <h3 className="font-bold mb-2">Writing</h3>
          <p className="text-sm">Develop your written expression</p>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
