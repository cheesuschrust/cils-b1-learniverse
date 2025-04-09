
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthProvider';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  const isRegister = location.pathname.includes('register');
  const title = isRegister ? 'Create an account' : 'Sign in to your account';
  const description = isRegister 
    ? 'Enter your information to create a new account' 
    : 'Enter your credentials to access your account';
    
  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Helmet>
        <title>{isRegister ? 'Sign Up' : 'Sign In'} | CILS B1 Italian Exam Prep</title>
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isRegister ? <RegisterForm /> : <LoginForm />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
