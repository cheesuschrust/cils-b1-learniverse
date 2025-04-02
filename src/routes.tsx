
import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { ItalianPracticeComponent } from './components/ItalianPracticeComponent';
import AuthLayout from './layouts/AuthLayout';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<div>Login page will be here</div>} />
        <Route path="register" element={<div>Register page will be here</div>} />
      </Route>
      
      <Route path="/practice" element={<ItalianPracticeComponent />} />
    </RouterRoutes>
  );
};

export default Routes;
