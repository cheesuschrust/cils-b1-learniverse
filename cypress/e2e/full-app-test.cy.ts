
/**
 * Comprehensive End-to-End Test Suite
 * This suite tests all major aspects of the application, ensuring complete coverage
 */
describe('Full Application Test Suite', () => {
  // Before running the tests, we need to set up the application state
  before(() => {
    // Clear any existing application state
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Mock all API calls with fixtures
    cy.intercept('GET', '/api/**', { fixture: 'api-response.json' });
    
    // Inject Axe for accessibility testing
    cy.visit('/');
    cy.injectAxe();
  });
  
  context('Authentication & Initial Experience', () => {
    it('should render the landing page correctly', () => {
      cy.visit('/');
      cy.get('h1').should('be.visible');
      cy.checkAllLinks();
      cy.checkAccessibility();
      cy.captureAndCompare('landing-page');
    });
    
    it('should navigate to the login page', () => {
      cy.visit('/');
      cy.get('a[href="/login"]').click();
      cy.url().should('include', '/login');
      cy.get('form').should('be.visible');
      cy.checkAccessibility();
      cy.captureAndCompare('login-page');
    });
    
    it('should validate the login form', () => {
      cy.visit('/login');
      
      // Try submitting empty form
      cy.get('button[type="submit"]').click();
      cy.get('form').should('contain', 'required');
      
      // Try invalid email
      cy.get('input[name="email"]').type('invalidemail');
      cy.get('button[type="submit"]').click();
      cy.get('form').should('contain', 'valid email');
      
      // Try too short password
      cy.get('input[name="email"]').clear().type('test@example.com');
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();
      cy.get('form').should('contain', 'at least');
    });
    
    it('should log in successfully', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/app/dashboard');
    });
    
    it('should navigate to the signup page', () => {
      cy.visit('/');
      cy.get('a[href="/signup"]').click();
      cy.url().should('include', '/signup');
      cy.get('form').should('be.visible');
      cy.checkAccessibility();
      cy.captureAndCompare('signup-page');
    });
    
    it('should validate signup form', () => {
      cy.visit('/signup');
      
      // Try submitting empty form
      cy.get('button[type="submit"]').click();
      cy.get('form').should('contain', 'required');
      
      // Check password match validation
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('newuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password124');
      cy.get('button[type="submit"]').click();
      cy.get('form').should('contain', 'match');
    });
    
    it('should sign up successfully', () => {
      cy.visit('/signup');
      cy.get('input[name="name"]').type('New User');
      cy.get('input[name="email"]').type('newuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('input[name="terms"]').check();
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/app/dashboard');
    });
    
    it('should handle password reset', () => {
      cy.visit('/password-reset');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="toast"]').should('be.visible');
      cy.get('[data-testid="toast"]').should('contain', 'sent');
    });
  });
  
  context('Dashboard & Navigation', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123');
    });
    
    it('should render the dashboard correctly', () => {
      cy.visit('/app/dashboard');
      cy.get('h1').should('contain', 'Dashboard');
      cy.checkAccessibility();
      cy.captureAndCompare('dashboard-page');
    });
    
    it('should have working main navigation', () => {
      cy.visit('/app/dashboard');
      
      cy.get('nav a').each(($link) => {
        const href = $link.attr('href');
        if (href && href.startsWith('/app/') && !href.includes('dashboard')) {
          cy.wrap($link).click();
          cy.url().should('include', href);
          cy.go('back');
        }
      });
    });
    
    it('should toggle theme correctly', () => {
      cy.visit('/app/dashboard');
      
      // Find theme toggle button
      cy.get('[data-testid="theme-toggle"]').click();
      
      // Check if theme changed to dark
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      
      // Toggle back to light
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('html').should('have.attr', 'data-theme', 'light');
    });
    
    it('should display user profile dropdown correctly', () => {
      cy.visit('/app/dashboard');
      
      // Open user profile dropdown
      cy.get('[data-testid="user-menu-button"]').click();
      cy.get('[data-testid="user-menu"]').should('be.visible');
      
      // Profile option should lead to profile page
      cy.get('[data-testid="user-menu"]').contains('Profile').click();
      cy.url().should('include', '/app/profile');
    });
    
    it('should log out correctly', () => {
      cy.visit('/app/dashboard');
      
      // Open user menu
      cy.get('[data-testid="user-menu-button"]').click();
      
      // Click logout
      cy.get('[data-testid="user-menu"]').contains('Logout').click();
      
      // Should redirect to login page
      cy.url().should('include', '/login');
    });
  });
  
  context('Learning Modules', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123');
    });
    
    it('should render and interact with the flashcards page', () => {
      cy.visit('/app/flashcards');
      cy.get('h1').should('contain', 'Flashcards');
      
      // Check flashcard functionality
      cy.get('[data-testid="flashcard"]').first().click();
      cy.get('[data-testid="flashcard-back"]').should('be.visible');
      
      // Test audio button
      cy.get('[data-testid="speak-button"]').click();
      
      // Mark as known
      cy.get('[data-testid="mark-known-button"]').click();
      
      // Test flashcard navigation
      cy.get('[data-testid="next-card-button"]').click();
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('flashcards-page');
    });
    
    it('should render and interact with the writing exercises page', () => {
      cy.visit('/app/writing');
      cy.get('h1').should('contain', 'Writing');
      
      // Test writing input
      cy.get('textarea').type('Ciao, mi chiamo Test. Sono uno studente.');
      
      // Test analyze button
      cy.get('[data-testid="analyze-button"]').click();
      
      // Check feedback display
      cy.get('[data-testid="analysis-results"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('writing-page');
    });
    
    it('should render and interact with the word of day feature', () => {
      cy.visit('/app/word-of-day');
      
      // Check that the word of the day is displayed
      cy.get('[data-testid="word-of-day-card"]').should('be.visible');
      
      // Test audio playback
      cy.get('[data-testid="play-audio"]').click();
      
      // Check that examples are shown
      cy.get('[data-testid="word-examples"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('word-of-day-page');
    });
  });
  
  // Additional test contexts would be added here
});
