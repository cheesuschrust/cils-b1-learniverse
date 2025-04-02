
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import UserButton from '@/components/auth/UserButton';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Flashcard, 
  Headphones, 
  BookOpen, 
  Pencil, 
  Mic,
  BarChart3
} from 'lucide-react';

// Define icon components if not already available
const Flashcard = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="14" x="3" y="5" rx="2" />
    <path d="M3 7h18" />
    <path d="M7 5v2" />
    <path d="M17 5v2" />
  </svg>
);

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const links = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    ...(!isAuthenticated ? [] : [
      { 
        href: '/dashboard', 
        label: 'Dashboard', 
        icon: <Calendar className="h-4 w-4 mr-2" /> 
      },
      { 
        href: '/flashcards', 
        label: 'Flashcards', 
        icon: <Flashcard className="h-4 w-4 mr-2" /> 
      },
      { 
        href: '/listening', 
        label: 'Listening', 
        icon: <Headphones className="h-4 w-4 mr-2" /> 
      },
      { 
        href: '/reading', 
        label: 'Reading', 
        icon: <BookOpen className="h-4 w-4 mr-2" /> 
      },
      { 
        href: '/writing', 
        label: 'Writing', 
        icon: <Pencil className="h-4 w-4 mr-2" /> 
      },
      { 
        href: '/speaking', 
        label: 'Speaking', 
        icon: <Mic className="h-4 w-4 mr-2" /> 
      },
      { 
        href: '/progress', 
        label: 'Progress', 
        icon: <BarChart3 className="h-4 w-4 mr-2" /> 
      },
    ])
  ];
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            location.pathname === link.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
      
      <div className="flex-1" />
      
      {isAuthenticated ? (
        <UserButton />
      ) : (
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/auth/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth/register">Sign up</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
