
describe('Dashboard Page', () => {
  beforeEach(() => {
    // Set up any initial state or cookies needed for the tests
    cy.visit('/app/dashboard');
  });

  it('should render the dashboard page correctly', () => {
    // Check that essential dashboard elements are present
    cy.get('h1').should('contain', 'Dashboard');
    cy.checkAccessibility();
  });

  it('should have working navigation links', () => {
    // Check that all navigation links are functioning
    cy.get('nav a').each(($link) => {
      const href = $link.attr('href');
      if (href && !href.includes('javascript:void') && !href.includes('mailto:') && !href.startsWith('http')) {
        cy.wrap($link).click();
        cy.url().should('include', href);
        cy.go('back');
      }
    });
  });

  it('should display user progress metrics', () => {
    // Check that progress metrics are displayed
    cy.get('[data-testid="progress-metrics"]').should('exist');
    cy.get('[data-testid="progress-metrics"]').within(() => {
      cy.get('[data-testid="completion-rate"]').should('exist');
      cy.get('[data-testid="streak-days"]').should('exist');
      cy.get('[data-testid="total-points"]').should('exist');
    });
  });

  it('should display the word of the day card', () => {
    // Check Word of the Day component is present
    cy.get('[data-testid="word-of-day"]').should('exist');
    cy.get('[data-testid="word-of-day"]').within(() => {
      cy.get('button').should('exist'); // Audio playback button
    });
  });

  it('should have working audio playback for Word of the Day', () => {
    // Mock the speech synthesis API since Cypress can't test actual audio
    cy.window().then((win) => {
      cy.stub(win.speechSynthesis, 'speak').as('speak');
    });

    // Click the audio button
    cy.get('[data-testid="word-of-day"]').find('button').click();
    
    // Verify the speak method was called
    cy.get('@speak').should('have.been.called');
  });

  it('should display recommended exercises', () => {
    // Check that recommended exercises are displayed
    cy.get('[data-testid="recommended-exercises"]').should('exist');
    cy.get('[data-testid="exercise-card"]').should('have.length.at.least', 1);
  });

  it('should navigate to an exercise when clicked', () => {
    // Click on the first exercise card
    cy.get('[data-testid="exercise-card"]').first().click();
    
    // Should navigate to the exercise page
    cy.url().should('include', '/app/');
  });

  it('should display learning streak information', () => {
    // Check that streak information is displayed
    cy.get('[data-testid="learning-streak"]').should('exist');
  });

  it('should handle theme switching', () => {
    // Find and click the theme toggle
    cy.get('[data-testid="theme-toggle"]').click();
    
    // Check if the theme attribute changed
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    
    // Toggle back
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });

  it('should have working notifications', () => {
    // Click on notifications bell
    cy.get('[data-testid="notifications-bell"]').click();
    
    // Check if notifications panel opens
    cy.get('[data-testid="notifications-panel"]').should('be.visible');
    
    // Close notifications
    cy.get('body').click();
    cy.get('[data-testid="notifications-panel"]').should('not.exist');
  });

  it('should be responsive', () => {
    // Test on mobile viewport
    cy.viewport('iphone-x');
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    
    // Open mobile menu
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.get('[data-testid="main-navigation"]').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport('macbook-15');
    cy.get('[data-testid="main-navigation"]').should('be.visible');
  });

  it('should load user data correctly', () => {
    // Check that user data is displayed
    cy.get('[data-testid="user-greeting"]').should('contain', 'Welcome');
    
    // Visual regression test
    cy.captureAndCompare('dashboard-page');
  });
});
