
import * as React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning' | 'info';
}
