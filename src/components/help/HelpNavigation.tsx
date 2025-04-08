
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, HelpCircle, MessageSquare, FileText, Video, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

const HelpNavigation: React.FC = () => {
  const { language } = useLanguage();
  
  const navItems = [
    {
      name: 'Help Center',
      nameItalian: 'Centro Assistenza',
      path: '/help',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'User Guide',
      nameItalian: 'Guida Utente',
      path: '/help/user-guide',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'FAQ',
      nameItalian: 'Domande Frequenti',
      path: '/help/faq',
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      name: 'Tutorials',
      nameItalian: 'Tutorial',
      path: '/help/tutorials',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Video Guides',
      nameItalian: 'Video Guide',
      path: '/help/videos',
      icon: <Video className="h-5 w-5" />,
    },
    {
      name: 'Contact Support',
      nameItalian: 'Contatta il Supporto',
      path: '/support',
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            isActive 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          end={item.path === '/help'}
        >
          <span className="mr-3">{item.icon}</span>
          {language === 'italian' ? item.nameItalian : item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default HelpNavigation;
