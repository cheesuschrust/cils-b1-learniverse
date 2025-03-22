
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import UserProfile from "./pages/UserProfile";
import Flashcards from "./pages/Flashcards";
import MultipleChoice from "./pages/MultipleChoice";
import Writing from "./pages/Writing";
import Speaking from "./pages/Speaking";
import Listening from "./pages/Listening";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ContentUploader from "./pages/admin/ContentUploader";
import FileUploader from "./pages/admin/FileUploader";
import SystemLogs from "./pages/admin/SystemLogs";
import EmailSettings from "./pages/admin/EmailSettings";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import CookieConsent from "./components/common/CookieConsent";

import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="italian-app-theme">
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/flashcards"
                  element={
                    <ProtectedRoute>
                      <Flashcards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/multiple-choice"
                  element={
                    <ProtectedRoute>
                      <MultipleChoice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/writing"
                  element={
                    <ProtectedRoute>
                      <Writing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/speaking"
                  element={
                    <ProtectedRoute>
                      <Speaking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/listening"
                  element={
                    <ProtectedRoute>
                      <Listening />
                    </ProtectedRoute>
                  }
                />
                
                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/content-uploader"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ContentUploader />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/file-uploader"
                  element={
                    <ProtectedRoute requireAdmin>
                      <FileUploader />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/system-logs"
                  element={
                    <ProtectedRoute requireAdmin>
                      <SystemLogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/email-settings"
                  element={
                    <ProtectedRoute requireAdmin>
                      <EmailSettings />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <CookieConsent />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
