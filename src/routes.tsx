
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { 
  Home,
  Dashboard,
  Login,
  Signup,
  Profile,
  Flashcards,
  MultipleChoice,
  Writing,
  Listening,
  Speaking,
  Settings,
  Support,
  Achievements,
  NotFound,
  Analytics,
  VocabularyLists,
  Progress,
  EmailVerification,
  ResetPassword,
  AIAssistant,
  // Admin pages
  AdminDashboard,
  UserManagement,
  ContentUploader,
  ContentAnalysis,
  AIManagement,
  SystemLogs,
  SystemTests,
  SystemSettings
} from "./pages/imports";

// Import auth components
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

// Import the Calendar page
import Calendar from "./pages/Calendar";

// Wrap each route element with AuthProvider
const withAuth = (element: React.ReactNode) => (
  <AuthProvider>{element}</AuthProvider>
);

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: withAuth(<RootLayout />),
    children: [
      {
        index: true,
        element: <Layout><Home /></Layout>,
      },
      {
        path: "login",
        element: <Layout><LoginForm /></Layout>,
      },
      {
        path: "signup",
        element: <Layout><RegisterForm /></Layout>,
      },
      {
        path: "reset-password",
        element: <Layout><ResetPassword /></Layout>,
      },
      {
        path: "email-verification",
        element: <Layout><EmailVerification /></Layout>,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>,
      },
      {
        path: "calendar",
        element: <ProtectedRoute><DashboardLayout><Calendar /></DashboardLayout></ProtectedRoute>,
      },
      {
        path: "app",
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "calendar",
            element: <Calendar />,
          },
          {
            path: "flashcards",
            element: <Flashcards />,
          },
          {
            path: "multiple-choice",
            element: <MultipleChoice />,
          },
          {
            path: "writing",
            element: <Writing />,
          },
          {
            path: "listening",
            element: <Listening />,
          },
          {
            path: "speaking",
            element: <Speaking />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          {
            path: "vocabulary-lists",
            element: <VocabularyLists />,
          },
          {
            path: "achievements",
            element: <Achievements />,
          },
          {
            path: "progress",
            element: <Progress />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "support",
            element: <Support />,
          },
          {
            path: "ai-assistant",
            element: <AIAssistant />,
          },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "user-management",
            element: <UserManagement />,
          },
          {
            path: "content-uploader",
            element: <ContentUploader />,
          },
          {
            path: "content-analysis",
            element: <ContentAnalysis />,
          },
          {
            path: "ai-management",
            element: <AIManagement />,
          },
          {
            path: "system-logs",
            element: <SystemLogs />,
          },
          {
            path: "system-tests",
            element: <SystemTests />,
          },
          {
            path: "system-settings",
            element: <SystemSettings />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
