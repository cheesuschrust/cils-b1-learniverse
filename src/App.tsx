
import { Routes, Route } from 'react-router-dom';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import HomePage from '@/pages/Home';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFound';
import React from 'react';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </React.Suspense>
            } 
          />
          <Route 
            path="/about" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <AboutPage />
              </React.Suspense>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <ContactPage />
              </React.Suspense>
            } 
          />
          <Route 
            path="*" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <NotFoundPage />
              </React.Suspense>
            } 
          />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
