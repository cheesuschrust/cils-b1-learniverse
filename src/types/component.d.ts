import { ReactNode, ComponentType } from 'react';
import { BaseComponentProps } from './index';

// Common component prop interfaces
export interface WithChildrenProps {
  children: ReactNode;
}

export interface WithLabelProps {
  label: string;
  labelPosition?: 'top' | 'left' | 'right' | 'bottom' | 'hidden';
}

export interface WithDescriptionProps {
  description?: string;
}

export interface WithDisabledProps {
  disabled?: boolean;
}

export interface WithLoadingProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface WithValidationProps {
  error?: string;
  touched?: boolean;
  required?: boolean;
  validationState?: 'valid' | 'invalid' | 'warning';
}

export interface WithIconProps {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

// Button related props
export interface ButtonProps extends 
  BaseComponentProps, 
  Partial<WithChildrenProps>, 
  WithDisabledProps, 
  WithLoadingProps,
  WithIconProps 
{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
  disabled?: boolean;
}

// Form related props
export interface InputProps extends 
  BaseComponentProps, 
  WithDisabledProps, 
  WithValidationProps 
{
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  readOnly?: boolean;
}

export interface TextareaProps extends 
  BaseComponentProps, 
  WithDisabledProps, 
  WithValidationProps 
{
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  autoFocus?: boolean;
  readOnly?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export interface SelectProps extends 
  BaseComponentProps, 
  WithDisabledProps, 
  WithValidationProps 
{
  value?: string | string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  name?: string;
  placeholder?: string;
  multiple?: boolean;
  size?: number;
  autoFocus?: boolean;
}

export interface CheckboxProps extends 
  BaseComponentProps, 
  WithDisabledProps, 
  WithValidationProps 
{
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  indeterminate?: boolean;
}

export interface RadioProps extends 
  BaseComponentProps, 
  WithDisabledProps, 
  WithValidationProps 
{
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value: string;
}

export interface FormProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  method?: 'get' | 'post';
  action?: string;
  autoComplete?: 'on' | 'off';
  noValidate?: boolean;
}

// Layout related props
export interface CardProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  variant?: 'default' | 'destructive' | 'outline';
  orientation?: 'horizontal' | 'vertical';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface GridProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  autoRows?: string;
  autoColumns?: string;
  flow?: 'row' | 'column' | 'row dense' | 'column dense';
}

export interface FlexProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: number | string;
}

// Modal and Dialog related props
export interface DialogProps extends 
  BaseComponentProps, 
  Partial<WithChildrenProps> 
{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export interface ModalProps extends 
  BaseComponentProps 
{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

// Tab related props
export interface TabsProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export interface TabProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabPanelProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  value: string;
}

// Feedback related props
export interface AlertProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  variant?: 'default' | 'destructive' | 'outline' | 'warning' | 'success' | 'info' | 'secondary';
  title?: string;
  icon?: ReactNode;
  onClose?: () => void;
}

export interface ToastProps extends 
  BaseComponentProps 
{
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  action?: ReactNode;
  duration?: number;
  onClose?: () => void;
}

export interface ProgressProps extends 
  BaseComponentProps 
{
  value: number;
  max?: number;
  showValue?: boolean;
  valueFormatter?: (value: number, max: number) => string;
  size?: 'sm' | 'md' | 'lg';
  indicator?: string; // CSS class for the indicator
}

// Navigation props
export interface BreadcrumbProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  separator?: ReactNode;
}

export interface BreadcrumbItemProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  href?: string;
  isCurrent?: boolean;
}

export interface PaginationProps extends 
  BaseComponentProps 
{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
}

// Utility component props
export interface SkeletonProps extends 
  BaseComponentProps 
{
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: number | string;
  height?: number | string;
  count?: number;
}

export interface AvatarProps extends 
  BaseComponentProps 
{
  src?: string;
  alt?: string;
  fallback?: string | ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  bordered?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export interface BadgeProps extends 
  BaseComponentProps, 
  WithChildrenProps 
{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}
