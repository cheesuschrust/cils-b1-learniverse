
/**
 * Utility functions to help diagnose type issues in the application.
 * These functions can be used during development to identify missing or incompatible types.
 */

export interface DiagnosticResults {  
  missingTypes: string[];  
  incompatibleTypes: {source: string, target: string}[];  
  missingComponents: string[];  
  missingProperties: {component: string, props: string[]}[];  
}

/**
 * Runs a diagnostic check to identify type issues in the application
 */
export function runTypeDiagnostic(): DiagnosticResults {  
  console.log("Running TypeScript diagnostic...");
  
  // This is a placeholder - in a real implementation,
  // it would programmatically scan for type issues
  const results: DiagnosticResults = {  
    missingTypes: ["ExtendedAlertVariant", "User usageMetrics", "AISettings"],  
    incompatibleTypes: [{source: "string", target: "ExtendedAlertVariant"}],
    missingComponents: ["VocabularyLists", "Progress"],  
    missingProperties: [{component: "UsageLimits", props: ["usedQuestions"]}]  
  };

  // Log the results
  console.log("Diagnostic Results:", results);
  
  return results;
}

/**
 * Validates that a component has all required props
 * @param component The component to validate
 * @param requiredProps The props that should be present
 * @returns An array of missing props
 */
export function validateComponentProps(component: any, requiredProps: string[]): string[] {
  if (!component) return requiredProps;
  
  const missingProps = requiredProps.filter(prop => 
    !(prop in component) || component[prop] === undefined
  );
  
  return missingProps;
}

/**
 * Checks if types are compatible for assignment
 */
export function checkTypeCompatibility(source: any, target: string): boolean {
  // Simple implementation - in reality would be more complex
  try {
    // Type checking is done at compile time, this is just a runtime check
    if (source === null || source === undefined) return false;
    
    switch (target) {
      case 'string':
        return typeof source === 'string';
      case 'number':
        return typeof source === 'number';
      case 'boolean':
        return typeof source === 'boolean';
      case 'Date':
        return source instanceof Date;
      case 'ExtendedAlertVariant':
        const validValues = ['default', 'destructive', 'outline', 'secondary', 'warning', 'success', 'primary', 'info'];
        return typeof source === 'string' && validValues.includes(source);
      default:
        return true; // Cannot determine at runtime
    }
  } catch (error) {
    console.error("Type compatibility check error:", error);
    return false;
  }
}

/**
 * Checks for common issues with component props
 */
export function checkComponentUsage(component: string, props: Record<string, any>): string[] {
  const issues: string[] = [];
  
  // Known component validations
  if (component === 'ConfidenceIndicator') {
    if (props.contentType === 'unknown') {
      issues.push("'unknown' is not assignable to ContentType");
    }
    if (props.score === undefined) {
      issues.push("'score' property is required for ConfidenceIndicator");
    }
  }
  
  if (component === 'Alert' || component === 'Badge') {
    if (props.variant === 'warning' && component === 'Alert') {
      issues.push("Alert doesn't support 'warning' variant by default");
    }
    if (props.variant === 'success' && component === 'Badge') {
      issues.push("Badge doesn't support 'success' variant by default");
    }
  }
  
  return issues;
}
