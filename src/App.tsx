
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Button } from '@/components/ui/button';

// Create a simple Home page for now
const HomePage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome to Italian Language Learning</h1>
      <p className="mb-4">
        This application helps you prepare for your Italian citizenship test.
      </p>
      <div className="flex gap-4 mt-8">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  );
};

// Simple 404 page
const NotFoundPage = () => {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
