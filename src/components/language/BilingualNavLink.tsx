
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BilingualNavLinkProps {
  to: string;
  english: string;
  italian: string;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const BilingualNavLink: React.FC<BilingualNavLinkProps> = ({
  to,
  english,
  italian,
  className,
  activeClassName,
  onClick,
  icon
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const getText = () => {
    switch (language) {
      case 'english': return english;
      case 'italian': return italian;
      case 'both': return `${english} / ${italian}`;
      default: return english;
    }
  };
  
  return (
    <Link
      to={to}
      className={cn(
        className,
        isActive && activeClassName
      )}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {getText()}
    </Link>
  );
};

export default BilingualNavLink;
