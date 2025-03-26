
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FlashcardComponent from './FlashcardComponent';
import { Flashcard } from '@/types/flashcard';

// Mock component dependencies
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  )
}));

vi.mock('@/components/flashcards/FlashcardPronunciation', () => ({
  default: () => <div data-testid="flashcard-pronunciation">Pronunciation Component</div>
}));

describe('FlashcardComponent', () => {
  const mockFlashcard: Flashcard = {
    id: '123',
    italian: 'ciao',
    english: 'hello',
    level: 1,
    mastered: false,
    tags: ['greeting'],
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReview: new Date(),
    lastReviewed: null
  };

  it('renders correctly', () => {
    render(<FlashcardComponent flashcard={mockFlashcard} />);
    expect(screen.getByText('ciao')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('flips the card when clicked', () => {
    render(<FlashcardComponent flashcard={mockFlashcard} />);
    
    // Initially shows the front (Italian)
    expect(screen.getByText('ciao')).toBeVisible();
    
    // Click to flip
    fireEvent.click(screen.getByTestId('flashcard'));
    
    // Now should show the back (English) prominently
    expect(screen.getByText('hello')).toBeVisible();
  });

  it('shows pronunciation component when showPronunciation is true', () => {
    render(<FlashcardComponent flashcard={mockFlashcard} showPronunciation={true} />);
    expect(screen.getByTestId('flashcard-pronunciation')).toBeInTheDocument();
  });

  it('does not show pronunciation component when showPronunciation is false', () => {
    render(<FlashcardComponent flashcard={mockFlashcard} showPronunciation={false} />);
    expect(screen.queryByTestId('flashcard-pronunciation')).not.toBeInTheDocument();
  });

  it('passes correct actions to action buttons', () => {
    const handleKnown = vi.fn();
    const handleUnknown = vi.fn();
    
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard}
        showActions={true}
        onKnown={handleKnown}
        onUnknown={handleUnknown}
      />
    );
    
    // Click the "I know this" button
    fireEvent.click(screen.getByText(/I know this/i));
    expect(handleKnown).toHaveBeenCalledWith(mockFlashcard.id);
    
    // Click the "Still learning" button
    fireEvent.click(screen.getByText(/Still learning/i));
    expect(handleUnknown).toHaveBeenCalledWith(mockFlashcard.id);
  });

  it('applies custom className', () => {
    const { container } = render(
      <FlashcardComponent 
        flashcard={mockFlashcard}
        className="custom-class"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('does not show action buttons when showActions is false', () => {
    render(<FlashcardComponent flashcard={mockFlashcard} showActions={false} />);
    
    expect(screen.queryByText(/I know this/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Still learning/i)).not.toBeInTheDocument();
  });
});
