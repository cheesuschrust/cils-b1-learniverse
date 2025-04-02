
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import { ItalianPracticeComponent } from './components/ItalianPracticeComponent';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';

// Learning module components - these will be implemented later
const FlashcardsPage = () => <div>Flashcards will go here</div>;
const ListeningPage = () => <div>Listening exercises will go here</div>;
const ReadingPage = () => <div>Reading comprehension will go here</div>;
const WritingPage = () => <div>Writing exercises will go here</div>;
const SpeakingPage = () => <div>Speaking exercises will go here</div>;
const QuestionOfTheDayPage = () => <div>Question of the Day will go here</div>;

// Support pages - these will be implemented later
const FAQPage = () => <div>FAQ will go here</div>;
const SupportPage = () => <div>Support will go here</div>;
const AboutPage = () => <div>About page will go here</div>;
const ContactPage = () => <div>Contact page will go here</div>;
const PrivacyPolicyPage = () => <div>Privacy Policy will go here</div>;
const TermsOfServicePage = () => <div>Terms of Service will go here</div>;

const Routes = () => {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      
      {/* Auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      
      {/* Practice route - will be updated to be protected later */}
      <Route path="/practice" element={<ItalianPracticeComponent />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Learning modules */}
      <Route path="/learn">
        <Route path="flashcards" element={
          <ProtectedRoute>
            <FlashcardsPage />
          </ProtectedRoute>
        } />
        <Route path="listening" element={
          <ProtectedRoute>
            <ListeningPage />
          </ProtectedRoute>
        } />
        <Route path="reading" element={
          <ProtectedRoute>
            <ReadingPage />
          </ProtectedRoute>
        } />
        <Route path="writing" element={
          <ProtectedRoute>
            <WritingPage />
          </ProtectedRoute>
        } />
        <Route path="speaking" element={
          <ProtectedRoute>
            <SpeakingPage />
          </ProtectedRoute>
        } />
        <Route path="daily-question" element={
          <ProtectedRoute>
            <QuestionOfTheDayPage />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Support and information pages */}
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default Routes;
