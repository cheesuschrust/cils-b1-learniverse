
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/EnhancedAuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <LoginForm />
      </CardContent>
      
      <CardFooter>
        <div className="text-sm text-muted-foreground text-center w-full">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </>
  );
};

export default LoginPage;
