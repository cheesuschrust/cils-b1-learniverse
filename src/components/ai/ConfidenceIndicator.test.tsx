
import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfidenceIndicator from './ConfidenceIndicator';

describe('ConfidenceIndicator', () => {
  test('renders with default props using score percentage value', () => {
    render(<ConfidenceIndicator score={75} />);
    
    expect(screen.getByText('Confidence Score')).toBeInTheDocument();
    expect(screen.getByText('Good (75%)')).toBeInTheDocument();
    
    // Progress bar should be present
    const progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toBeInTheDocument();
  });
  
  test('renders with decimal value (backward compatibility)', () => {
    render(<ConfidenceIndicator score={0.85} />);
    
    expect(screen.getByText('Excellent (85%)')).toBeInTheDocument();
  });
  
  test('supports value prop for backward compatibility', () => {
    render(<ConfidenceIndicator score={0} value={0.65} />);
    
    expect(screen.getByText('Good (65%)')).toBeInTheDocument();
  });

  test('renders with different sizes', () => {
    const { rerender } = render(<ConfidenceIndicator score={50} size="sm" />);
    
    // Small size should have specific classes
    let progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toHaveClass('h-1.5');
    
    // Medium size
    rerender(<ConfidenceIndicator score={50} size="md" />);
    progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toHaveClass('h-2');
    
    // Large size
    rerender(<ConfidenceIndicator score={50} size="lg" />);
    progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toHaveClass('h-3');
  });

  test('uses correct colors based on confidence level', () => {
    const { rerender } = render(<ConfidenceIndicator score={90} />);
    
    // High confidence (green)
    let progressFill = document.querySelector('.progress-bar-fill');
    expect(progressFill).toHaveClass('bg-green-500');
    
    // Medium confidence (yellow)
    rerender(<ConfidenceIndicator score={70} />);
    progressFill = document.querySelector('.progress-bar-fill');
    expect(progressFill).toHaveClass('bg-yellow-500');
    
    // Low confidence (red)
    rerender(<ConfidenceIndicator score={30} />);
    progressFill = document.querySelector('.progress-bar-fill');
    expect(progressFill).toHaveClass('bg-red-500');
  });

  test('shows different descriptions based on contentType', () => {
    const { rerender } = render(<ConfidenceIndicator score={80} contentType="writing" />);
    expect(screen.getByText('Writing Quality')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator score={80} contentType="speaking" />);
    expect(screen.getByText('Pronunciation')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator score={80} contentType="listening" />);
    expect(screen.getByText('Comprehension')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator score={80} contentType="unknown" />);
    expect(screen.getByText('Confidence Score')).toBeInTheDocument();
  });

  test('passes custom className to the component', () => {
    render(<ConfidenceIndicator score={60} className="custom-class" />);
    
    const container = screen.getByText('Confidence Score').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  test('displays correct label based on confidence level', () => {
    const { rerender } = render(<ConfidenceIndicator score={85} />);
    expect(screen.getByText('Excellent (85%)')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator score={65} />);
    expect(screen.getByText('Good (65%)')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator score={45} />);
    expect(screen.getByText('Fair (45%)')).toBeInTheDocument();
    
    rerender(<ConfidenceIndicator score={25} />);
    expect(screen.getByText('Needs Work (25%)')).toBeInTheDocument();
  });
});
