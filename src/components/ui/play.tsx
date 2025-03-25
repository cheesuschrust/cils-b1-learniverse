
import React from 'react';

interface PlayProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const Play: React.FC<PlayProps> = ({ 
  size = 24, 
  color = "currentColor", 
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
    </svg>
  );
};

export default Play;
