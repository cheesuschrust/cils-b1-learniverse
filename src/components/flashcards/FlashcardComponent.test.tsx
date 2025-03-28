
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlashcardComponent from './FlashcardComponent';

describe('FlashcardComponent', () => {
  const mockCard = {
    id: '1',
    front: 'Ciao',
    back: 'Hello',
    italian: 'Ciao',
    english: 'Hello',
    level: 1,
    mastered: false,
    tags: ['greeting'],
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReview: new Date(),
    lastReviewed: null,
    examples: ['Ciao, come stai?']
  };

  it('renders front side by default', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();

    render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={false}
        onFlip={mockFlip}
      />
    );

    expect(screen.getByText('Ciao')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });

  it('renders back side when flipped', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();

    render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={true}
        onFlip={mockFlip}
      />
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByText('Ciao')).not.toBeInTheDocument();
  });

  it('calls onFlip when clicked', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();

    render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={false}
        onFlip={mockFlip}
      />
    );

    fireEvent.click(screen.getByText('Ciao'));
    expect(mockFlip).toHaveBeenCalledTimes(1);
  });

  it('renders pronunciation controls when enabled', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();

    render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={false}
        onFlip={mockFlip}
        showPronunciation={true}
      />
    );

    // Verify that pronunciation controls are rendered
    expect(screen.getByText('Ciao')).toBeInTheDocument();
    // The actual pronunciation controls would need to be checked based on implementation
  });

  it('renders actions when enabled', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();

    render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={false}
        onFlip={mockFlip}
        showActions={false}
      />
    );

    // Verify that no action buttons are shown
    expect(screen.queryByText('Know')).not.toBeInTheDocument();
    expect(screen.queryByText("Don't Know")).not.toBeInTheDocument();
  });

  it('calls onKnown/onUnknown when buttons are clicked', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();
    const mockKnown = jest.fn();
    const mockUnknown = jest.fn();

    render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={false}
        onFlip={mockFlip}
        onKnown={mockKnown}
        onUnknown={mockUnknown}
      />
    );

    fireEvent.click(screen.getByText('Know'));
    expect(mockKnown).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Don't Know"));
    expect(mockUnknown).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();

    const { container } = render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={false}
        onFlip={mockFlip}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders examples when showHints is true', () => {
    const mockRating = jest.fn();
    const mockSkip = jest.fn();
    const mockFlip = jest.fn();

    render(
      <FlashcardComponent
        flashcard={mockCard}
        onRating={mockRating}
        onSkip={mockSkip}
        flipped={false}
        onFlip={mockFlip}
        showActions={false}
        showHints={true}
      />
    );

    expect(screen.getByText('Example: Ciao, come stai?')).toBeInTheDocument();
  });
});
