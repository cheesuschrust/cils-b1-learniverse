/**
 * End-to-end test for a complete user learning flow through the application
 * Tests the core learning path: Login -> Dashboard -> Flashcards -> Writing -> Multiple Choice
 */

describe('User Learning Flow', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/flashcards', { fixture: 'flashcards.json' }).as('getFlashcards');
    cy.intercept('GET', '/api/wordofday', { fixture: 'wordOfDay.json' }).as('getWordOfDay');
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        },
        token: 'fake-jwt-token'
      }
    }).as('login');
    
    // Mock AI analysis response
    cy.intercept('POST', '/api/analyze', {
      statusCode: 200,
      body: [
        {
          label: 'Intermediate Italian',
          score: 0.87
        }
      ]
    }).as('analyzeText');
    
    // Clear any existing local storage
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  
  it('completes a full learning session with multiple exercise types', () => {
    // 1. Login to the application
    cy.visit('/login');
    
    // Fill in login form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for login API call to complete and verify redirection
    cy.wait('@login');
    cy.url().should('include', '/app/dashboard');
    
    // 2. Check dashboard loads with user greeting
    cy.get('h1').should('contain', 'Dashboard');
    cy.contains('Welcome back').should('be.visible');
    
    // Verify dashboard widgets load properly
    cy.contains('Learning Progress').should('be.visible');
    cy.contains('Word of the Day').should('be.visible');
    cy.wait('@getWordOfDay');
    
    // 3. Navigate to Flashcards page
    cy.contains('Flashcards').click();
    cy.url().should('include', '/app/flashcards');
    cy.wait('@getFlashcards');
    
    // Verify flashcards loaded
    cy.get('[data-testid="flashcard"]').should('be.visible');
    
    // Test flashcard interaction
    cy.get('[data-testid="flashcard"]').first().click();
    cy.get('[data-testid="flashcard-back"]').should('be.visible');
    
    // Rate flashcard as "Easy"
    cy.contains('button', 'Easy').click();
    
    // Switch to library tab
    cy.contains('button', 'Library').click();
    
    // Search for a flashcard
    cy.get('input[placeholder*="Search"]').type('casa');
    cy.contains('casa').should('be.visible');
    
    // 4. Navigate to Writing page
    cy.contains('Writing').click();
    cy.url().should('include', '/app/writing');
    
    // Verify writing page loads
    cy.contains('Writing Practice').should('be.visible');
    
    // Enter text for analysis
    cy.get('textarea').type('Ciao, mi chiamo Test. Sono uno studente di italiano. Mi piace studiare le lingue straniere.');
    
    // Click analyze button
    cy.contains('button', 'Analyze Text').click();
    cy.wait('@analyzeText');
    
    // Switch to analysis tab and verify results
    cy.contains('button', 'Analysis').click();
    cy.contains('Analysis Results').should('be.visible');
    cy.get('[data-testid="analysis-results"]').should('be.visible');
    cy.contains('Intermediate Italian').should('be.visible');
    
    // Generate AI feedback
    cy.contains('button', 'Generate AI Feedback').click();
    cy.get('textarea[readonly]').should('be.visible');
    
    // 5. Navigate to Multiple Choice exercises
    cy.contains('Exercises').click();
    cy.url().should('include', '/app/exercises');
    
    // Select multiple choice option
    cy.contains('Multiple Choice').click();
    cy.url().should('include', '/app/multiple-choice');
    
    // Verify quiz interface loads
    cy.contains('Multiple Choice').should('be.visible');
    
    // Select a quiz category if available
    cy.get('select').first().select(1);
    
    // Start a quiz
    cy.contains('button', 'Start Quiz').click();
    
    // Answer a question
    cy.get('input[type="radio"]').first().check();
    cy.contains('button', 'Submit Answer').click();
    
    // Verify feedback is shown
    cy.contains('Explanation').should('be.visible');
    
    // Go to next question
    cy.contains('button', 'Next Question').click();
    
    // 6. Check profile and settings
    cy.get('[data-testid="user-menu-button"]').click();
    cy.contains('Profile').click();
    cy.url().should('include', '/app/profile');
    
    // Verify profile information
    cy.contains('Account Information').should('be.visible');
    cy.contains('test@example.com').should('be.visible');
    
    // Check learning statistics
    cy.contains('Learning Statistics').should('be.visible');
    
    // 7. Test notifications
    cy.get('[data-testid="notification-bell"]').click();
    cy.get('[data-testid="notifications-panel"]').should('be.visible');
    
    // 8. Log out
    cy.get('[data-testid="user-menu-button"]').click();
    cy.contains('Logout').click();
    
    // Verify redirection to login page
    cy.url().should('include', '/login');
  });
  
  it('handles errors gracefully in the learning flow', () => {
    // 1. Mock failed login
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials'
      }
    }).as('failedLogin');
    
    cy.visit('/login');
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@failedLogin');
    cy.contains('Invalid credentials').should('be.visible');
    
    // 2. Mock successful login to continue test
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        },
        token: 'fake-jwt-token'
      }
    }).as('login');
    
    cy.get('input[name="email"]').clear().type('test@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    cy.url().should('include', '/app/dashboard');
    
    // 3. Mock failed flashcards API
    cy.intercept('GET', '/api/flashcards', {
      statusCode: 500,
      body: {
        message: 'Server error'
      }
    }).as('failedFlashcards');
    
    cy.contains('Flashcards').click();
    cy.wait('@failedFlashcards');
    
    // Should show error state
    cy.contains('Error loading flashcards').should('be.visible');
    
    // 4. Mock failed AI analysis
    cy.contains('Writing').click();
    
    cy.intercept('POST', '/api/analyze', {
      statusCode: 500,
      body: {
        message: 'AI processing error'
      }
    }).as('failedAnalysis');
    
    cy.get('textarea').type('Ciao, mi chiamo Test.');
    cy.contains('button', 'Analyze Text').click();
    cy.wait('@failedAnalysis');
    
    // Should show error toast
    cy.contains('Analysis Failed').should('be.visible');
    
    // 5. Test offline behavior
    cy.intercept('GET', '*', { forceNetworkError: true }).as('networkError');
    cy.intercept('POST', '*', { forceNetworkError: true }).as('postNetworkError');
    
    cy.contains('Dashboard').click();
    cy.contains('Offline').should('be.visible');
    
    // 6. Resume normal navigation after restoring connectivity
    cy.intercept('GET', '*').as('getRequests');
    cy.intercept('POST', '*').as('postRequests');
    
    cy.reload();
    cy.contains('Dashboard').should('be.visible');
  });
  
  it('tests accessibility during the learning flow', () => {
    // Login to the application
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    
    // Check accessibility on dashboard
    cy.injectAxe();
    cy.checkA11y();
    
    // Check keyboard navigation
    cy.get('body').tab();
    cy.focused().should('exist');
    
    // Navigate through main menu using keyboard
    cy.testKeyboardNavigation();
    
    // Test flashcards page accessibility
    cy.contains('Flashcards').click();
    cy.wait('@getFlashcards');
    cy.checkA11y();
    
    // Test writing page accessibility
    cy.contains('Writing').click();
    cy.checkA11y();
    
    // Focus on the textarea - Fix: Changed from focus() to focused()
    cy.get('textarea').focused(); 
    cy.focused().should('have.prop', 'tagName').and('eq', 'TEXTAREA');
    
    // Type using keyboard
    cy.focused().type('Testing keyboard accessibility.');
    
    // Tab to the analyze button and press it with keyboard
    cy.focused().tab().tab();
    cy.focused().should('contain.text', 'Analyze Text');
    cy.focused().type('{enter}');
    cy.wait('@analyzeText');
    
    // Test profile page accessibility
    cy.get('[data-testid="user-menu-button"]').click();
    cy.contains('Profile').click();
    cy.checkA11y();
  });
  
  it('verifies responsive design across different devices', () => {
    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    
    // Test on mobile viewport
    cy.viewport('iphone-x');
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    cy.contains('Flashcards').click();
    cy.url().should('include', '/app/flashcards');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.contains('Writing').click();
    cy.url().should('include', '/app/writing');
    cy.get('textarea').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport('macbook-15');
    cy.get('[data-testid="desktop-navigation"]').should('be.visible');
    cy.contains('Dashboard').click();
    cy.url().should('include', '/app/dashboard');
  });
});
