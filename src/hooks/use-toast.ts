
// This hook is a wrapper around the toast component
import { Toast, ToastActionElement, ToastProps } from '@/components/ui/toast'
import {
  toast as showToast,
  ToastOptions as SonnerToastOptions
} from 'sonner'

type ToastProps_ = Omit<ToastProps, 'children'> & { description?: React.ReactNode }

export type ToastActionProps = {
  altText: string
  onClick: () => void
  children?: React.ReactNode
}

export interface ToastOptions extends SonnerToastOptions {
  description?: React.ReactNode
  action?: ToastActionElement
}

const toast = ({ description, action, ...props }: ToastProps_ & ToastOptions) => {
  showToast(props.title, {
    description,
    action,
    ...props,
  })
}

export { toast, showToast, type ToastOptions }
export const useToast = () => ({ toast })
