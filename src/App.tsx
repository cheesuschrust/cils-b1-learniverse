
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import routes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { GamificationProvider } from './contexts/GamificationContext';
import NotificationManager from './components/notifications/NotificationManager';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationsProvider>
          <GamificationProvider>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
            <NotificationManager />
            <Toaster />
          </GamificationProvider>
        </NotificationsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
