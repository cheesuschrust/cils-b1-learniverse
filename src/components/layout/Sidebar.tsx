import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Book, 
  PenTool, 
  Headphones, 
  Mic, 
  GraduationCap, 
  BarChart2, 
  Trophy, 
  Settings, 
  Users, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn("h-screen flex flex-col border-r", className)}>
      <div className="flex items-center h-16 px-4 border-b">
        <span className="font-bold text-lg">LinguaLearn</span>
      </div>
      
      <nav className="flex-1 overflow-auto py-6">
        <ul className="space-y-2 px-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/flashcards"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <Book className="h-5 w-5" />
              <span>Flashcards</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/multiple-choice"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <GraduationCap className="h-5 w-5" />
              <span>Multiple Choice</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/writing"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <PenTool className="h-5 w-5" />
              <span>Writing</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/speaking"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <Mic className="h-5 w-5" />
              <span>Speaking</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/listening"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <Headphones className="h-5 w-5" />
              <span>Listening</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <BarChart2 className="h-5 w-5" />
              <span>Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/achievements"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <Trophy className="h-5 w-5" />
              <span>Achievements</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/word-of-day"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <HelpCircle className="h-5 w-5" />
              <span>Word of Day</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </NavLink>
          </li>
          
          {/* Add the new AI Assistant link */}
          <li>
            <NavLink
              to="/ai-assistant"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
                )
              }
            >
              <Sparkles className="h-5 w-5" />
              <span>AI Assistant</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="border-t p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} LinguaLearn
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
