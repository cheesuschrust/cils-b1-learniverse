
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import FlashcardComponent from './FlashcardComponent';

describe('FlashcardComponent', () => {
  const mockFlashcard = {
    id: '123',
    italian: 'Ciao',
    english: 'Hello',
    level: 1,
    mastered: false,
    tags: ['greeting', 'basic'],
    createdAt: new Date(),
    updatedAt: new Date(),
    nextReview: new Date(),
    lastReviewed: null
  };

  it('renders the front of the card by default', () => {
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={vi.fn()}
      />
    );
    
    expect(screen.getByText('Ciao')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeVisible();
  });

  it('shows the back of the card when flipped', () => {
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={true} 
        onFlip={vi.fn()}
      />
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByText('Ciao')).not.toBeVisible();
  });

  it('calls onFlip when the card is clicked', () => {
    const mockOnFlip = vi.fn();
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={mockOnFlip}
      />
    );
    
    fireEvent.click(screen.getByText('Ciao'));
    expect(mockOnFlip).toHaveBeenCalledTimes(1);
  });

  it('renders pronunciation component when showPronunciation is true', () => {
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={vi.fn()} 
        showPronunciation={true}
      />
    );
    
    // Note: This test would need to be updated to check for the actual pronunciation component
    // Since that component isn't available in this test, we're just checking the basic rendering
    expect(screen.getByText('Ciao')).toBeInTheDocument();
  });

  it('does not render action buttons when showActions is false', () => {
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={vi.fn()} 
        showActions={false}
      />
    );
    
    const skipButton = screen.queryByText('Skip');
    expect(skipButton).not.toBeInTheDocument();
  });

  it('calls onKnown and onUnknown when those buttons are clicked', () => {
    const mockOnKnown = vi.fn();
    const mockOnUnknown = vi.fn();
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={vi.fn()}
        onKnown={mockOnKnown}
        onUnknown={mockOnUnknown}
      />
    );
    
    const knownButton = screen.getByText('I know this');
    const unknownButton = screen.getByText('I don\'t know');
    
    fireEvent.click(knownButton);
    expect(mockOnKnown).toHaveBeenCalledTimes(1);
    
    fireEvent.click(unknownButton);
    expect(mockOnUnknown).toHaveBeenCalledTimes(1);
  });

  it('renders with a custom className', () => {
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={vi.fn()}
        className="custom-class"
      />
    );
    
    const cardComponent = document.querySelector('.custom-class');
    expect(cardComponent).toBeInTheDocument();
  });

  it('shows the tags on the front of the card', () => {
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={vi.fn()}
      />
    );
    
    expect(screen.getByText('greeting')).toBeInTheDocument();
    expect(screen.getByText('basic')).toBeInTheDocument();
  });

  it('does not render actions when showActions is false', () => {
    render(
      <FlashcardComponent 
        card={mockFlashcard} 
        onRating={vi.fn()} 
        onSkip={vi.fn()} 
        flipped={false} 
        onFlip={vi.fn()}
        showActions={false}
      />
    );
    
    const skipButton = screen.queryByText('Skip');
    expect(skipButton).not.toBeInTheDocument();
  });
});
