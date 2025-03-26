
import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfidenceIndicator from './ConfidenceIndicator';

describe('ConfidenceIndicator', () => {
  test('renders with default props', () => {
    render(<ConfidenceIndicator value={0.75} />);
    
    expect(screen.getByText('Confidence Score')).toBeInTheDocument();
    expect(screen.getByText('Good (75%)')).toBeInTheDocument();
    
    // Progress bar should be present
    const progressBar = document.querySelector('.progress-bar-fill');
    expect(progressBar).toBeInTheDocument();
  });

  test('accepts score prop for backward compatibility', () => {
    render(<ConfidenceIndicator score={0.85} value={0} />);
    
    expect(screen.getByText('Excellent (85%)')).toBeInTheDocument();
  });

  test('renders with different sizes', () => {
    const { rerender } = render(<ConfidenceIndicator value={0.5} size="sm" />);
    
    // Small size should have specific classes
    let progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toHaveClass('h-1.5');
    
    // Medium size
    rerender(<ConfidenceIndicator value={0.5} size="md" />);
    progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toHaveClass('h-2');
    
    // Large size
    rerender(<ConfidenceIndicator value={0.5} size="lg" />);
    progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toHaveClass('h-3');
  });

  test('uses correct colors based on confidence level', () => {
    const { rerender } = render(<ConfidenceIndicator value={0.9} />);
    
    // High confidence (green)
    let progressFill = document.querySelector('.progress-bar-fill');
    expect(progressFill).toHaveClass('bg-green-500');
    
    // Good confidence (yellow)
    rerender(<ConfidenceIndicator value={0.7} />);
    progressFill = document.querySelector('.progress-bar-fill');
    expect(progressFill).toHaveClass('bg-yellow-500');
    
    // Fair confidence (orange)
    rerender(<ConfidenceIndicator value={0.5} />);
    progressFill = document.querySelector('.progress-bar-fill');
    expect(progressFill).toHaveClass('bg-orange-500');
    
    // Low confidence (red)
    rerender(<ConfidenceIndicator value={0.3} />);
    progressFill = document.querySelector('.progress-bar-fill');
    expect(progressFill).toHaveClass('bg-red-500');
  });

  test('shows different descriptions based on contentType', () => {
    const { rerender } = render(<ConfidenceIndicator value={0.8} contentType="writing" />);
    expect(screen.getByText('Writing Quality')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator value={0.8} contentType="speaking" />);
    expect(screen.getByText('Pronunciation')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator value={0.8} contentType="listening" />);
    expect(screen.getByText('Comprehension')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator value={0.8} contentType="unknown" />);
    expect(screen.getByText('Confidence Score')).toBeInTheDocument();
  });

  test('passes custom className to the component', () => {
    render(<ConfidenceIndicator value={0.6} className="custom-class" />);
    
    const container = screen.getByText('Confidence Score').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  test('displays correct label based on confidence level', () => {
    const { rerender } = render(<ConfidenceIndicator value={0.85} />);
    expect(screen.getByText('Excellent (85%)')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator value={0.65} />);
    expect(screen.getByText('Good (65%)')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator value={0.45} />);
    expect(screen.getByText('Fair (45%)')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator value={0.25} />);
    expect(screen.getByText('Needs Work (25%)')).toBeInTheDocument();
  });
});
