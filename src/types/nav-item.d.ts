
import { LucideIcon } from 'lucide-react';

declare module '@/types' {
  interface NavItem {
    title: string;
    href: string;
    icon?: React.ReactNode | LucideIcon;
    disabled?: boolean;
    external?: boolean;
    label?: string;
    color?: string;
    bgColor?: string;
  }
}
