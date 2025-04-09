
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface StepProps {
  id: string;
  label: string;
  status: 'upcoming' | 'current' | 'complete';
  icon?: React.ReactNode;
}

interface StepsProps {
  steps: StepProps[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Steps({ 
  steps, 
  currentStep, 
  onStepClick,
  className
}: StepsProps) {
  return (
    <div className={cn("flex w-full justify-between", className)}>
      {steps.map((step, index) => {
        const isComplete = step.status === 'complete';
        const isCurrent = step.status === 'current';
        
        return (
          <div 
            key={step.id}
            className={cn(
              "flex flex-col items-center relative",
              {
                "cursor-pointer": onStepClick && (isComplete || index <= currentStep + 1)
              }
            )}
            onClick={() => {
              if (onStepClick && (isComplete || index <= currentStep + 1)) {
                onStepClick(index);
              }
            }}
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "absolute left-1/2 top-4 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2",
                  isComplete ? "bg-primary" : "bg-muted"
                )}
                style={{ width: 'calc(100% * 2)', left: '50%' }}
              />
            )}
            
            {/* Step Circle */}
            <div 
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                {
                  "bg-primary border-primary text-primary-foreground": isComplete,
                  "border-primary bg-background text-primary": isCurrent,
                  "border-muted bg-muted/40 text-muted-foreground": !isComplete && !isCurrent
                }
              )}
            >
              {isComplete ? (
                <Check className="h-4 w-4" />
              ) : (
                step.icon || <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            
            {/* Step Label */}
            <div className="mt-2 text-center">
              <div 
                className={cn(
                  "text-sm font-medium",
                  {
                    "text-foreground": isCurrent || isComplete,
                    "text-muted-foreground": !isCurrent && !isComplete
                  }
                )}
              >
                {step.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
