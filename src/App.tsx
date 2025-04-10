
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import HomePage from '@/pages/Home';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
            } 
          />
          <Route 
            path="/about" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AboutPage />
              </Suspense>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ContactPage />
              </Suspense>
            } 
          />
          <Route 
            path="*" 
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <NotFoundPage />
              </Suspense>
            } 
          />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
