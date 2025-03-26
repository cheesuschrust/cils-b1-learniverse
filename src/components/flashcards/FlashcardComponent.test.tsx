
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import FlashcardComponent from './FlashcardComponent';
import { Flashcard } from '@/types/flashcard';
import { render as customRender } from '@/tests/test-utils';

// Mock the hooks and components used by FlashcardComponent
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className, disabled, size, type, ...rest }: any) => (
    <button 
      onClick={onClick} 
      data-variant={variant} 
      className={className}
      disabled={disabled}
      data-size={size}
      type={type || 'button'}
      data-testid={`button-${children.toString().toLowerCase().replace(/\s+/g, '-')}`}
      {...rest}
    >
      {children}
    </button>
  ),
}));

describe('FlashcardComponent', () => {
  // Test data
  const mockFlashcard: Flashcard = {
    id: 'card-1',
    italian: 'Ciao',
    english: 'Hello',
    level: 1,
    mastered: false,
    tags: ['greeting', 'basics'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    nextReview: new Date('2023-01-02'),
    lastReviewed: null,
  };

  // Mock handlers
  const mockOnRating = vi.fn();
  const mockOnSkip = vi.fn();
  const mockOnFlip = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  test('renders the card with the Italian text when not flipped', () => {
    customRender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // Should show Italian text
    expect(screen.getByText('Ciao')).toBeInTheDocument();
    
    // Should not show English text
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    
    // Tags should be visible
    mockFlashcard.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test('renders the card with the English text when flipped', () => {
    customRender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={true}
        onFlip={mockOnFlip}
      />
    );

    // Should show English text
    expect(screen.getByText('Hello')).toBeInTheDocument();
    
    // Should not show Italian text
    expect(screen.queryByText('Ciao')).not.toBeInTheDocument();
  });

  test('calls onFlip when the card is clicked', () => {
    customRender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // Find the card and click it
    const card = screen.getByText('Ciao').closest('.cursor-pointer');
    expect(card).toBeInTheDocument();
    
    if (card) {
      fireEvent.click(card);
      expect(mockOnFlip).toHaveBeenCalledTimes(1);
    }
  });

  test('calls onSkip when the skip button is clicked', () => {
    customRender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // Find the skip button and click it
    const skipButton = screen.getByTestId('button-skip');
    fireEvent.click(skipButton);
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  test('calls onRating with correct values when rating buttons are clicked', () => {
    customRender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // Check the three rating buttons: Hard, Medium, Easy
    const hardButton = screen.getByTestId('button-hard');
    const mediumButton = screen.getByTestId('button-medium');
    const easyButton = screen.getByTestId('button-easy');

    // Click Hard button and check if onRating is called with rating 1
    fireEvent.click(hardButton);
    expect(mockOnRating).toHaveBeenCalledWith(mockFlashcard, 1);
    
    // Reset mock
    mockOnRating.mockClear();
    
    // Click Medium button and check if onRating is called with rating 2
    fireEvent.click(mediumButton);
    expect(mockOnRating).toHaveBeenCalledWith(mockFlashcard, 2);
    
    // Reset mock
    mockOnRating.mockClear();
    
    // Click Easy button and check if onRating is called with rating 4
    fireEvent.click(easyButton);
    expect(mockOnRating).toHaveBeenCalledWith(mockFlashcard, 4);
  });

  test('renders explanation text when flipped and explanation exists', () => {
    const flashcardWithExplanation: Flashcard = {
      ...mockFlashcard,
      explanation: 'A common greeting in Italian',
    };

    customRender(
      <FlashcardComponent
        flashcard={flashcardWithExplanation}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={true}
        onFlip={mockOnFlip}
      />
    );

    // Should show explanation text
    expect(screen.getByText('A common greeting in Italian')).toBeInTheDocument();
  });

  test('does not show explanation text when not flipped even if explanation exists', () => {
    const flashcardWithExplanation: Flashcard = {
      ...mockFlashcard,
      explanation: 'A common greeting in Italian',
    };

    customRender(
      <FlashcardComponent
        flashcard={flashcardWithExplanation}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // Should not show explanation text
    expect(screen.queryByText('A common greeting in Italian')).not.toBeInTheDocument();
  });

  test('handles flashcards with long text appropriately', () => {
    const longTextFlashcard: Flashcard = {
      ...mockFlashcard,
      italian: 'A'.repeat(100),
      english: 'B'.repeat(100),
    };

    customRender(
      <FlashcardComponent
        flashcard={longTextFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // Should show the long text
    expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();

    // Flip the card
    const card = screen.getByText('A'.repeat(100)).closest('.cursor-pointer');
    if (card) {
      fireEvent.click(card);
      expect(mockOnFlip).toHaveBeenCalledTimes(1);
    }
  });

  test('applies different styles based on flipped state', () => {
    const { rerender } = customRender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // When not flipped
    let card = screen.getByText('Ciao').closest('.card');
    expect(card).not.toHaveClass('bg-primary/5');

    // When flipped
    rerender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={true}
        onFlip={mockOnFlip}
      />
    );

    card = screen.getByText('Hello').closest('.card');
    expect(card).toHaveClass('bg-primary/5');
  });

  test('verifies card actually flips when clicked', async () => {
    // Custom render with state management to test flipping
    const TestWrapper = () => {
      const [isFlipped, setIsFlipped] = React.useState(false);
      return (
        <FlashcardComponent
          flashcard={mockFlashcard}
          onRating={mockOnRating}
          onSkip={mockOnSkip}
          flipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      );
    };

    customRender(<TestWrapper />);
    
    // Initially should show Italian text
    expect(screen.getByText('Ciao')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    
    // Click the card to flip it
    const card = screen.getByText('Ciao').closest('.cursor-pointer');
    if (card) {
      fireEvent.click(card);
      
      // After flipping, should show English text
      await waitFor(() => {
        expect(screen.queryByText('Ciao')).not.toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
      });
    }
  });

  test('buttons are accessible with keyboard navigation', () => {
    customRender(
      <FlashcardComponent
        flashcard={mockFlashcard}
        onRating={mockOnRating}
        onSkip={mockOnSkip}
        flipped={false}
        onFlip={mockOnFlip}
      />
    );

    // Test keyboard accessibility for rating buttons
    const hardButton = screen.getByTestId('button-hard');
    hardButton.focus();
    expect(document.activeElement).toBe(hardButton);
    
    // Simulate keyboard enter press
    fireEvent.keyDown(hardButton, { key: 'Enter', code: 'Enter' });
    expect(mockOnRating).toHaveBeenCalledWith(mockFlashcard, 1);
  });
});
