
import React from "react";
import { RouteObject } from "react-router-dom";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import ContentManagement from "@/pages/admin/ContentManagement";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";
import SystemLogs from "@/pages/admin/SystemLogs";
import DatabasePerformance from "@/pages/admin/DatabasePerformance";
import SecuritySettings from "@/pages/admin/SecuritySettings";
import BillingAndSubscription from "@/pages/admin/BillingAndSubscription";
import SupportTickets from "@/pages/admin/SupportTickets";
import AIModelManagement from "@/pages/admin/AIModelManagement";
import VoiceSystemAdmin from "@/pages/admin/VoiceSystemAdmin";
import NewsletterManagement from "@/pages/admin/NewsletterManagement";
import EmailConfigurationPage from "@/pages/admin/EmailConfigurationPanel";
import SEODashboardPage from "@/pages/admin/SEODashboardPage";

const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AdminDashboard />,
  },
  {
    path: "users",
    element: <UserManagement />,
  },
  {
    path: "content",
    element: <ContentManagement />,
  },
  {
    path: "analytics",
    element: <AnalyticsDashboard />,
  },
  {
    path: "logs",
    element: <SystemLogs />,
  },
  {
    path: "database",
    element: <DatabasePerformance />,
  },
  {
    path: "security",
    element: <SecuritySettings />,
  },
  {
    path: "billing",
    element: <BillingAndSubscription />,
  },
  {
    path: "support",
    element: <SupportTickets />,
  },
  {
    path: "ai-models",
    element: <AIModelManagement />,
  },
  {
    path: "voice-system",
    element: <VoiceSystemAdmin />,
  },
  {
    path: "newsletter",
    element: <NewsletterManagement />,
  },
  {
    path: "email-configuration",
    element: <EmailConfigurationPage />,
  },
  {
    path: "seo",
    element: <SEODashboardPage />,
  },
];

export default adminRoutes;
