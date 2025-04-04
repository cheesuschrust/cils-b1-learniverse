
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Check, AlertCircle, Info, Bell, Award, Mic, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'info' | 'warning' | 'achievement' | 'speaking' | 'listening';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  actions?: React.ReactNode;
}

const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  title,
  description,
  icon,
  onClose,
  actions,
  className,
  ...props
}) => {
  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'speaking':
        return <Mic className="h-4 w-4 text-purple-500" />;
      case 'listening':
        return <Volume2 className="h-4 w-4 text-blue-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-900';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-900';
      case 'achievement':
        return 'border-amber-200 bg-amber-50 text-amber-900';
      case 'speaking':
        return 'border-purple-200 bg-purple-50 text-purple-900';
      case 'listening':
        return 'border-blue-200 bg-blue-50 text-blue-900';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-900';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-lg border p-4 shadow-md',
        getStyles(),
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">{getIcon()}</div>
        <div className="flex-grow">
          <h5 className="font-medium leading-none tracking-tight">{title}</h5>
          {description && (
            <div className="mt-1 text-sm opacity-90">{description}</div>
          )}
          {actions && <div className="mt-3">{actions}</div>}
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export { Notification };
