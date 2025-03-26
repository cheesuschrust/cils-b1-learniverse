
import React from 'react';
import { render, screen } from '@/tests/test-utils';
import { ConfidenceIndicator } from './ConfidenceIndicator';

describe('ConfidenceIndicator Component', () => {
  test('renders with default props', () => {
    render(<ConfidenceIndicator value={75} />);
    
    // Check that the component renders with the data-testid
    const indicator = screen.getByTestId('confidence-indicator');
    expect(indicator).toBeInTheDocument();
    
    // Check that the progress element is present
    const progressBar = indicator.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
    
    // Check that the text displays the correct percentage
    expect(screen.getByText('75% confidence')).toBeInTheDocument();
  });

  test('applies different size classes', () => {
    const { rerender } = render(<ConfidenceIndicator value={75} size="default" />);
    
    // Default size (should use 'md')
    let progress = screen.getByRole('progressbar');
    expect(progress).toHaveClass('h-2');
    
    // Small size
    rerender(<ConfidenceIndicator value={75} size="sm" />);
    progress = screen.getByRole('progressbar');
    expect(progress).toHaveClass('h-1.5');
    
    // Large size
    rerender(<ConfidenceIndicator value={75} size="lg" />);
    progress = screen.getByRole('progressbar');
    expect(progress).toHaveClass('h-3');
  });

  test('displays correct color based on confidence value', () => {
    // Test different confidence levels and their corresponding colors
    const testCases = [
      { value: 95, expectedClass: 'bg-green-500' },
      { value: 75, expectedClass: 'bg-green-400' },
      { value: 55, expectedClass: 'bg-yellow-400' },
      { value: 35, expectedClass: 'bg-orange-400' },
      { value: 25, expectedClass: 'bg-red-500' }
    ];
    
    for (const testCase of testCases) {
      const { unmount } = render(<ConfidenceIndicator value={testCase.value} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass(testCase.expectedClass);
      
      unmount();
    }
  });

  test('passes custom className to the component', () => {
    render(<ConfidenceIndicator value={75} className="custom-test-class" />);
    
    const indicator = screen.getByTestId('confidence-indicator');
    expect(indicator).toHaveClass('custom-test-class');
  });

  test('displays exact percentage value passed in', () => {
    const { rerender } = render(<ConfidenceIndicator value={87} />);
    expect(screen.getByText('87% confidence')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator value={33} />);
    expect(screen.getByText('33% confidence')).toBeInTheDocument();
  });
});
