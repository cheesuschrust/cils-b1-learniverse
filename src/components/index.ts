

// Re-export all components to fix case sensitivity issues
export { default as AIContentProcessor } from './ai/AIContentProcessor';
export { EnhancedErrorBoundary } from './EnhancedErrorBoundary';

// Re-export the fixed components with both default and named exports
export { CitizenshipContentProcessor } from './CitizenshipContentProcessor';
export { default as CitizenshipContentProcessor } from './CitizenshipContentProcessor';
export { ItalianPracticeComponent } from './ItalianPracticeComponent';
export { default as ItalianPracticeComponent } from './ItalianPracticeComponent';
export { default as CitizenshipReadinessComponent } from './CitizenshipReadinessComponent';

