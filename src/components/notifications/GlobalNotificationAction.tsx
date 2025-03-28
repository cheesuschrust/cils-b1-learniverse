
import React from 'react';
import { Button } from '@/components/ui/button';

interface GlobalNotificationActionProps {
  label: string;
  onClick: (id: string) => void;
  id: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'success' | 'warning';
  className?: string;
  icon?: React.ReactNode;
}

/**
 * A wrapper component that handles converting a function that expects an ID parameter
 * to a function that takes no arguments, for use with notification action buttons.
 */
const GlobalNotificationAction: React.FC<GlobalNotificationActionProps> = ({
  label,
  onClick,
  id,
  variant = 'default',
  className = '',
  icon
}) => {
  const handleClick = () => {
    onClick(id);
  };

  return (
    <Button 
      variant={variant} 
      size="sm" 
      className={className}
      onClick={handleClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
};

export default GlobalNotificationAction;
