
import { axe } from 'jest-axe';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '@/utils/testHelpers';

/**
 * Test component for accessibility violations using axe
 * @param ui Component to test
 * @param options Render options
 * @returns Promise resolving to accessibility results
 */
export async function testAccessibility(
  ui: React.ReactElement,
  options: {
    withProviders?: boolean;
    axeOptions?: any;
  } = {}
): Promise<any> {
  const { withProviders = true, axeOptions = {} } = options;
  
  // Render the component, with or without providers
  const renderResult: RenderResult = withProviders 
    ? renderWithProviders(ui)
    : render(ui);
  
  // Run axe on the component
  const axeResults = await axe(renderResult.container, axeOptions);
  
  // Return the results for assertion
  return {
    axeResults,
    renderResult
  };
}

/**
 * Helper function to assert no accessibility violations
 */
export function expectNoA11yViolations(axeResults: any) {
  expect(axeResults.violations).toEqual([]);
}
