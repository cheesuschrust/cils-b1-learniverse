
import React from 'react';
import { 
  ArrowRight, Check, CreditCard, File, FileText, Github, 
  Laptop, LifeBuoy, LogOut, Mail, MessageSquare, 
  Plus, PlusCircle, Settings, User, Users, Video
} from 'lucide-react';

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2L4 7.4v9.2L12 22l8-5.4V7.4L12 2z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  ),
  close: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  spinner: (props: IconProps) => (
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  google: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.9 6.2l-2.47 1.37c-.32-.68-.9-1.15-1.68-1.34-.19-.05-.38-.1-.59-.1-1.56 0-2.82 1.27-2.82 2.83 0 1.57 1.26 2.83 2.82 2.83.92 0 1.73-.46 2.23-1.14l2.36 1.31c-.9 1.5-2.55 2.5-4.4 2.5-2.83 0-5.13-2.3-5.13-5.13 0-2.83 2.3-5.13 5.13-5.13 1.9 0 3.57.95 4.55 2.4z"
        fill="currentColor"
      />
    </svg>
  ),
  apple: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M17.05 17.526c-.345.733-.818 1.4-1.429 2.022-.45.456-.836.733-1.156.822-.467.159-.999.18-1.587.06-.617-.12-1.182-.27-1.693-.45-.529-.18-1.107-.27-1.735-.27-.628 0-1.2.09-1.714.27-.511.18-1.06.33-1.66.45-.465.12-.953.151-1.463.09-.58-.06-.998-.21-1.47-.48-.361-.21-.773-.566-1.239-1.08-.532-.57-1-1.179-1.405-1.826C.833 15.967.416 14.7.12 13.304c-.243-1.29-.316-2.52-.214-3.705.126-1.53.457-2.85.994-3.96.416-.87.97-1.597 1.661-2.181.69-.585 1.444-.879 2.258-.879.442 0 1.022.12 1.74.36.7.24 1.155.36 1.35.36.165 0 .723-.15 1.666-.45 1.147-.33 1.944-.33 2.374-.03 1.75.48 3.063 1.665 3.938 3.536-1.564.87-2.346 2.085-2.346 3.646 0 1.215.45 2.22 1.35 3.015.4.39.85.69 1.35.9-.108.33-.222.645-.345.945zM13.235.605c0 .96-.35 1.86-1.05 2.699C11.5 4.26 10.52 4.694 9.44 4.62c-.008-.09-.016-.18-.016-.27 0-.915.389-1.89 1.079-2.699.345-.406.782-.752 1.312-1.035.529-.27 1.029-.427 1.5-.457.016.09.024.181.024.287v.159z"
        fill="currentColor"
      />
    </svg>
  ),
  facebook: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M24 12.073c0-5.8-4.675-10.5-10.45-10.5s-10.45 4.7-10.45 10.5c0 5.234 3.84 9.577 8.86 10.367v-7.327H8.76v-3.04h3.2v-2.317c0-3.175 1.883-4.933 4.774-4.933 1.383 0 2.831.248 2.831.248v3.124h-1.595c-1.571 0-2.061.981-2.061 1.982v2.38h3.51l-.567 3.04h-2.943v7.344c5.02-.8 8.859-5.143 8.859-10.377z"
        fill="currentColor"
      />
    </svg>
  ),
  arrowRight: ArrowRight,
  check: Check,
  creditCard: CreditCard,
  file: File,
  fileText: FileText,
  github: Github,
  laptop: Laptop,
  lifebuoy: LifeBuoy,
  logout: LogOut,
  mail: Mail,
  messageSquare: MessageSquare,
  plus: Plus,
  plusCircle: PlusCircle,
  settings: Settings,
  user: User,
  users: Users,
  video: Video,
};
