
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import MultipleChoice from "./pages/MultipleChoice";
import Listening from "./pages/Listening";
import Writing from "./pages/Writing";
import Speaking from "./pages/Speaking";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentUploader from "./pages/admin/ContentUploader";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CookieConsent from "./components/common/CookieConsent";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
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
                  path="/listening" 
                  element={
                    <ProtectedRoute>
                      <Listening />
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
                  path="/admin/dashboard" 
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <CookieConsent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
