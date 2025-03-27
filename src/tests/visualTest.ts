
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '@/utils/testHelpers';

/**
 * Creates a snapshot test for a component
 * @param ui Component to test
 * @param options Render options 
 */
export function createSnapshotTest(
  ui: React.ReactElement,
  options: {
    withProviders?: boolean;
    name?: string;
  } = {}
): void {
  const { withProviders = true, name = 'component snapshot' } = options;
  
  test(`matches ${name}`, () => {
    const renderResult: RenderResult = withProviders 
      ? renderWithProviders(ui)
      : render(ui);
    
    expect(renderResult.container).toMatchSnapshot();
  });
}

/**
 * Performs a snapshot test for multiple component states
 * @param componentFn Function that returns a component with different props
 * @param states Array of state objects to test
 */
export function createMultiSnapshotTest<T>(
  componentFn: (props: T) => React.ReactElement,
  states: Array<{ props: T; name: string }>
): void {
  describe('snapshot tests', () => {
    states.forEach(({ props, name }) => {
      test(`matches snapshot for ${name}`, () => {
        const component = componentFn(props);
        const { container } = renderWithProviders(component);
        expect(container).toMatchSnapshot();
      });
    });
  });
}
