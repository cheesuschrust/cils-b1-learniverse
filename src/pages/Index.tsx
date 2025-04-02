
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">CILS Italian Citizenship Question of the Day</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Prepare for your Italian Citizenship Test with personalized daily practice questions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
  );
};

export default Index;
