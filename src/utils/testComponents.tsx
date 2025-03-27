
import React from 'react';

/**
 * Mock Component for testing
 */
export const TestComponent: React.FC<{prop?: string}> = ({prop}) => (
  <div data-testid="test-component">{prop || 'Default'}</div>
);

/**
 * Complex mock component with proper JSX structure
 */
export const ComplexMock: React.FC = () => (
  <div>
    <span>Test</span>
  </div>
);
