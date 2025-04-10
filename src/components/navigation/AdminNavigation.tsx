
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  BarChart2, 
  AlertCircle, 
  Database, 
  Shield, 
  CreditCard, 
  LifeBuoy, 
  Bot, 
  Mic, 
  Search,
  Mail,
  Layout,
  Send
} from 'lucide-react';

const AdminNavigation: React.FC = () => {
  return (
    <nav className="space-y-1">
      <NavLink
        to="/admin"
        end
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <BarChart2 className="mr-2 h-4 w-4" />
        Dashboard
      </NavLink>

      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Users className="mr-2 h-4 w-4" />
        User Management
      </NavLink>

      <NavLink
        to="/admin/content"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <FileText className="mr-2 h-4 w-4" />
        Content Management
      </NavLink>

      <NavLink
        to="/admin/analytics"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <BarChart2 className="mr-2 h-4 w-4" />
        Analytics
      </NavLink>

      <NavLink
        to="/admin/logs"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        System Logs
      </NavLink>

      <NavLink
        to="/admin/database"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Database className="mr-2 h-4 w-4" />
        Database Performance
      </NavLink>

      <NavLink
        to="/admin/security"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Shield className="mr-2 h-4 w-4" />
        Security Settings
      </NavLink>

      <NavLink
        to="/admin/billing"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Billing & Subscription
      </NavLink>

      <NavLink
        to="/admin/support"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <LifeBuoy className="mr-2 h-4 w-4" />
        Support Tickets
      </NavLink>
      
      <NavLink
        to="/admin/ai-models"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Bot className="mr-2 h-4 w-4" />
        AI Model Management
      </NavLink>
      
      <NavLink
        to="/admin/voice-system"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Mic className="mr-2 h-4 w-4" />
        Voice System
      </NavLink>
      
      <NavLink
        to="/admin/newsletter"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Send className="mr-2 h-4 w-4" />
        Newsletter & Autoblog
      </NavLink>
      
      <NavLink
        to="/admin/seo"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Search className="mr-2 h-4 w-4" />
        SEO Management
      </NavLink>
      
      <NavLink
        to="/admin/email-configuration"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`
        }
      >
        <Mail className="mr-2 h-4 w-4" />
        Email Configuration
      </NavLink>
    </nav>
  );
};

export default AdminNavigation;
