
import React from 'react';

/**
 * Component boundary interface for isolated testing
 */
export interface ComponentBoundary {
  name: string;
  inputs: Record<string, any>;
  outputs: Array<string>;
  renderComponent: (props: any) => React.ReactElement;
}

/**
 * Creates a test boundary for a component
 * @param component Component information
 * @returns Test boundary object
 */
export function createComponentBoundary(component: ComponentBoundary) {
  return {
    ...component,
    testInputs: (overrides = {}) => {
      const inputs = { ...component.inputs, ...overrides };
      const mockOutputHandlers = component.outputs.reduce((acc, outputName) => {
        acc[outputName] = jest.fn();
        return acc;
      }, {} as Record<string, jest.Mock>);
      
      return {
        props: { ...inputs, ...mockOutputHandlers },
        mockOutputHandlers
      };
    }
  };
}

/**
 * Test isolated component behavior
 * @param boundary Component boundary
 * @param testFn Test function
 */
export function testComponentBehavior(
  boundary: ReturnType<typeof createComponentBoundary>,
  testFn: (rendered: {
    component: React.ReactElement;
    props: Record<string, any>;
    handlers: Record<string, jest.Mock>;
  }) => void
) {
  // Create default test props
  const { props, mockOutputHandlers } = boundary.testInputs();
  
  // Render the component with test props
  const component = boundary.renderComponent(props);
  
  // Execute the test function with component and handlers
  testFn({
    component,
    props,
    handlers: mockOutputHandlers
  });
}
