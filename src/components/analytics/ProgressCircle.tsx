
import React from 'react';

interface ProgressCircleProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  title?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  maxValue,
  size = 100,
  strokeWidth = 8,
  label,
  title
}) => {
  // Calculate percentage and ensure it doesn't exceed 100%
  const normalizedValue = Math.min(value, maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="inline-flex flex-col items-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-muted/20"
        />
        
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500 ease-in-out"
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-bold">{value}</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
      
      {title && (
        <span className="mt-2 text-sm font-medium">{title}</span>
      )}
    </div>
  );
};
