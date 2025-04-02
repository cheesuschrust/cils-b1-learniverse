
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-zinc-900">
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" 
              alt="Italian Citizenship" 
              className="block h-full w-full object-cover opacity-20"
            />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link to="/">
              <img 
                src="/logo.svg" 
                alt="CILS Italian Citizenship Test Prep" 
                className="h-8"
              />
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Preparing for the CILS B2 Citizenship test has never been easier. This platform 
                helped me practice effectively and I passed with confidence!"
              </p>
              <footer className="text-sm">Sofia Bianchi</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {children}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By using our service, you agree to our{" "}
              <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
