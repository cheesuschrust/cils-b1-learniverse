
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">CILS B1 Cittadinanza</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/about" className="text-muted-foreground hover:text-foreground">About</a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Card className="w-full shadow-lg">
            <Outlet />
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By using this service, you agree to our{" "}
              <a href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CILS B1 Cittadinanza. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
