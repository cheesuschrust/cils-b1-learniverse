
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import EmailVerification from "@/pages/EmailVerification";
import NotFound from "@/pages/NotFound";
import UserProfile from "@/pages/UserProfile";
import Flashcards from "@/pages/Flashcards";
import Writing from "@/pages/Writing";
import Speaking from "@/pages/Speaking";
import Listening from "@/pages/Listening";
import MultipleChoice from "@/pages/MultipleChoice";
import AdminDashboard from "@/pages/admin/Dashboard";
import ContentUploader from "@/pages/admin/ContentUploader";
import EmailSettings from "@/pages/admin/EmailSettings";
import SystemLogs from "@/pages/admin/SystemLogs";
import FileUploader from "@/pages/admin/FileUploader";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookieConsent from "@/components/common/CookieConsent";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cittadinanza-theme">
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/flashcards" element={
                  <ProtectedRoute>
                    <Flashcards />
                  </ProtectedRoute>
                } />
                <Route path="/writing" element={
                  <ProtectedRoute>
                    <Writing />
                  </ProtectedRoute>
                } />
                <Route path="/speaking" element={
                  <ProtectedRoute>
                    <Speaking />
                  </ProtectedRoute>
                } />
                <Route path="/listening" element={
                  <ProtectedRoute>
                    <Listening />
                  </ProtectedRoute>
                } />
                <Route path="/multiple-choice" element={
                  <ProtectedRoute>
                    <MultipleChoice />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/content" element={
                  <ProtectedRoute requireAdmin={true}>
                    <ContentUploader />
                  </ProtectedRoute>
                } />
                <Route path="/admin/email-settings" element={
                  <ProtectedRoute requireAdmin={true}>
                    <EmailSettings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                  <ProtectedRoute requireAdmin={true}>
                    <SystemLogs />
                  </ProtectedRoute>
                } />
                <Route path="/admin/files" element={
                  <ProtectedRoute requireAdmin={true}>
                    <FileUploader />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
          <CookieConsent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
