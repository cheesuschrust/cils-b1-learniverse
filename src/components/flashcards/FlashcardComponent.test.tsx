
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlashcardComponent from './FlashcardComponent';
import { expect, describe, test, vi } from 'vitest';

// Mock flashcard for testing
const mockFlashcard = {
  id: 'test-1',
  italian: 'casa',
  english: 'house',
  level: 0,
  mastered: false,
  tags: ['basics', 'nouns'],
  createdAt: new Date(),
  updatedAt: new Date(),
  nextReview: new Date(),
  lastReviewed: null,
};

describe('FlashcardComponent', () => {
  test('renders the Italian text when not flipped', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock} 
      />
    );
    
    // Assert
    expect(screen.getByText('casa')).toBeInTheDocument();
    expect(screen.queryByText('house')).not.toBeInTheDocument();
  });
  
  test('renders the English text when flipped', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={true} 
        onFlip={onFlipMock} 
      />
    );
    
    // Assert
    expect(screen.getByText('house')).toBeInTheDocument();
    expect(screen.queryByText('casa')).not.toBeInTheDocument();
  });
  
  test('calls onFlip when card is clicked', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock} 
      />
    );
    
    fireEvent.click(screen.getByText('casa').closest('.card'));
    
    // Assert
    expect(onFlipMock).toHaveBeenCalledTimes(1);
  });
  
  test('displays pronunciation button when showPronunciation is true', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock}
        showPronunciation={true}
      />
    );
    
    // Assert
    expect(screen.getByText('Pronounce')).toBeInTheDocument();
  });
  
  test('hides pronunciation button when showPronunciation is false', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock}
        showPronunciation={false}
      />
    );
    
    // Assert
    expect(screen.queryByText('Pronounce')).not.toBeInTheDocument();
  });
  
  test('shows custom buttons when onKnown and onUnknown are provided', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    const onKnownMock = vi.fn();
    const onUnknownMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock}
        showActions={true}
        onKnown={onKnownMock}
        onUnknown={onUnknownMock}
      />
    );
    
    // Assert
    expect(screen.getByText('Know It')).toBeInTheDocument();
    expect(screen.getByText("Don't Know")).toBeInTheDocument();
    expect(screen.queryByText('Easy')).not.toBeInTheDocument();
    expect(screen.queryByText('Hard')).not.toBeInTheDocument();
  });
  
  test('calls onSkip when Skip button is clicked', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock}
      />
    );
    
    fireEvent.click(screen.getByText('Skip'));
    
    // Assert
    expect(onSkipMock).toHaveBeenCalledTimes(1);
    expect(onSkipMock).toHaveBeenCalledWith(mockFlashcard.id);
  });
  
  test('applies custom className when provided', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock}
        className="custom-class"
      />
    );
    
    // Assert
    expect(screen.getByText('casa').closest('.custom-class')).toBeInTheDocument();
  });
  
  test('hides action buttons when showActions is false', () => {
    // Arrange
    const onRatingMock = vi.fn();
    const onSkipMock = vi.fn();
    const onFlipMock = vi.fn();
    
    // Act
    render(
      <FlashcardComponent 
        flashcard={mockFlashcard} 
        onRating={onRatingMock} 
        onSkip={onSkipMock} 
        flipped={false} 
        onFlip={onFlipMock}
        showActions={false}
      />
    );
    
    // Assert
    expect(screen.queryByText('Skip')).not.toBeInTheDocument();
    expect(screen.queryByText('Hard')).not.toBeInTheDocument();
    expect(screen.queryByText('Medium')).not.toBeInTheDocument();
    expect(screen.queryByText('Easy')).not.toBeInTheDocument();
  });
});
