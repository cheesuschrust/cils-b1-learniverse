
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/EnhancedAuthContext';

const RegisterPage: React.FC = () => {
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
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <RegisterForm />
      </CardContent>
      
      <CardFooter>
        <div className="text-sm text-muted-foreground text-center w-full">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </div>
      </CardFooter>
    </>
  );
};

export default RegisterPage;
