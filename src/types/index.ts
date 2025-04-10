
// Common types used across the application

// Navigation item interface
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  description?: string;
  badge?: string;
  color?: string;
  bgColor?: string;
}

// Basic content item structure
export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content?: string | Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  status?: 'draft' | 'published' | 'archived';
  authorId?: string;
  authorName?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// User type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'moderator';
  isVerified?: boolean;
  isPremiumUser?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

// Base component props that most components extend
export interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

// Shared Pagination props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNextPrev?: boolean;
  showFirstLast?: boolean;
}

// Common form field props
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  hideLabel?: boolean;
}
