
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="bg-background py-20">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                CILS B2 Cittadinanza
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
                Prepare for your Italian citizenship language exam with our comprehensive learning platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
