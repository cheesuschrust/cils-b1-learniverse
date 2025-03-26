
describe('Word of the Day Feature', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/wordofday', {
      statusCode: 200,
      body: {
        id: '123',
        italian: 'buongiorno',
        english: 'good morning',
        explanation: 'A common greeting used in the morning',
        examples: ['Buongiorno, come stai?', 'Buongiorno a tutti!'],
        audioUrl: 'https://example.com/audio/buongiorno.mp3'
      }
    }).as('wordOfDay');
    
    // Login before each test
    cy.login('test@example.com', 'password123');
  });

  it('should display word of the day on dashboard', () => {
    cy.visit('/app/dashboard');
    cy.wait('@wordOfDay');
    
    cy.get('[data-testid="word-of-day"]').should('be.visible');
    cy.get('[data-testid="word-of-day-italian"]').should('contain', 'buongiorno');
    cy.get('[data-testid="word-of-day-english"]').should('contain', 'good morning');
    cy.get('[data-testid="word-of-day-explanation"]').should('contain', 'common greeting');
  });

  it('should play audio when play button is clicked', () => {
    cy.visit('/app/dashboard');
    cy.wait('@wordOfDay');
    
    // Since we can't actually test audio playback in Cypress,
    // we'll verify the button enters the correct state
    cy.get('[data-testid="play-word-audio"]').should('be.visible');
    cy.get('[data-testid="play-word-audio"]').click();
    cy.get('[data-testid="play-word-audio"]').should('have.attr', 'data-playing', 'true');
    
    // After a delay, it should return to not playing
    cy.wait(1000); // Simulate audio duration
    cy.get('[data-testid="play-word-audio"]').should('not.have.attr', 'data-playing', 'true');
  });

  it('should display example sentences', () => {
    cy.visit('/app/dashboard');
    cy.wait('@wordOfDay');
    
    cy.get('[data-testid="word-examples"]').should('be.visible');
    cy.get('[data-testid="example-sentence"]').should('have.length', 2);
    cy.get('[data-testid="example-sentence"]').first().should('contain', 'Buongiorno, come stai?');
  });

  it('should show loading state while fetching word of the day', () => {
    // Add delay to the response to simulate loading
    cy.intercept('GET', '/api/wordofday', {
      statusCode: 200,
      body: {
        id: '123',
        italian: 'buongiorno',
        english: 'good morning',
        explanation: 'A common greeting used in the morning',
        examples: ['Buongiorno, come stai?']
      },
      delay: 1000
    }).as('delayedWordOfDay');
    
    cy.visit('/app/dashboard');
    
    // Should show loading state
    cy.get('[data-testid="word-of-day-loading"]').should('be.visible');
    
    // Should display content after loading completes
    cy.wait('@delayedWordOfDay');
    cy.get('[data-testid="word-of-day-loading"]').should('not.exist');
    cy.get('[data-testid="word-of-day-italian"]').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Simulate API error
    cy.intercept('GET', '/api/wordofday', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('wordOfDayError');
    
    cy.visit('/app/dashboard');
    cy.wait('@wordOfDayError');
    
    // Should display error state
    cy.get('[data-testid="word-of-day-error"]').should('be.visible');
    cy.get('[data-testid="word-of-day-retry"]').should('be.visible');
    
    // Test retry functionality
    cy.intercept('GET', '/api/wordofday', {
      statusCode: 200,
      body: {
        id: '123',
        italian: 'buongiorno',
        english: 'good morning',
        explanation: 'A common greeting used in the morning',
        examples: ['Buongiorno, come stai?']
      }
    }).as('wordOfDayRetry');
    
    cy.get('[data-testid="word-of-day-retry"]').click();
    cy.wait('@wordOfDayRetry');
    
    // Should display content after successful retry
    cy.get('[data-testid="word-of-day-error"]').should('not.exist');
    cy.get('[data-testid="word-of-day-italian"]').should('be.visible');
  });

  it('should add word to flashcards when button is clicked', () => {
    cy.intercept('POST', '/api/flashcards', {
      statusCode: 200,
      body: { success: true, message: 'Word added to flashcards' }
    }).as('addToFlashcards');
    
    cy.visit('/app/dashboard');
    cy.wait('@wordOfDay');
    
    cy.get('[data-testid="add-to-flashcards"]').click();
    cy.wait('@addToFlashcards');
    
    // Should show success toast
    cy.get('[data-testid="toast"]').should('be.visible');
    cy.get('[data-testid="toast"]').should('contain', 'added to flashcards');
  });

  it('should see full word details when clicking the info button', () => {
    cy.visit('/app/dashboard');
    cy.wait('@wordOfDay');
    
    cy.get('[data-testid="word-info-button"]').click();
    
    // Should show modal with full details
    cy.get('[data-testid="word-details-modal"]').should('be.visible');
    cy.get('[data-testid="word-details-modal"]').should('contain', 'buongiorno');
    cy.get('[data-testid="word-details-modal"]').should('contain', 'good morning');
    cy.get('[data-testid="word-details-modal"]').should('contain', 'common greeting');
    
    // Close modal
    cy.get('[data-testid="close-modal"]').click();
    cy.get('[data-testid="word-details-modal"]').should('not.exist');
  });

  it('should verify the word changes daily', () => {
    // Yesterday's word
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    cy.intercept('GET', '/api/wordofday', {
      statusCode: 200,
      body: {
        id: '123',
        italian: 'buongiorno',
        english: 'good morning',
        explanation: 'A common greeting used in the morning',
        examples: ['Buongiorno, come stai?'],
        date: yesterday.toISOString()
      }
    }).as('yesterdayWord');
    
    cy.visit('/app/dashboard');
    cy.wait('@yesterdayWord');
    
    // Today's word (different)
    const today = new Date();
    
    cy.intercept('GET', '/api/wordofday', {
      statusCode: 200,
      body: {
        id: '124',
        italian: 'arrivederci',
        english: 'goodbye',
        explanation: 'A formal way to say goodbye',
        examples: ['Arrivederci, a domani!'],
        date: today.toISOString()
      }
    }).as('todayWord');
    
    // Force refresh/reload to simulate coming back the next day
    cy.reload();
    cy.wait('@todayWord');
    
    // Should show the new word
    cy.get('[data-testid="word-of-day-italian"]').should('contain', 'arrivederci');
    cy.get('[data-testid="word-of-day-english"]').should('contain', 'goodbye');
  });
});
