
describe('Writing Practice Page', () => {
  beforeEach(() => {
    cy.visit('/app/writing');
  });

  it('should render the writing practice page correctly', () => {
    // Check that essential elements are present
    cy.get('h1').should('contain', 'Writing Practice');
    cy.get('textarea').should('exist');
    cy.get('button').contains('Analyze Text').should('exist');
    cy.get('button').contains('Generate AI Feedback').should('exist');
    
    // Check accessibility
    cy.checkAccessibility();
  });

  it('should switch between editor and analysis tabs', () => {
    // Check that editor tab is active by default
    cy.get('[role="tabpanel"]').should('be.visible');
    cy.get('textarea').should('be.visible');
    
    // Switch to analysis tab
    cy.get('[role="tab"]').contains('Analysis').click();
    cy.get('[role="tabpanel"]').should('be.visible');
    cy.get('[role="tabpanel"]').contains('No analysis performed yet').should('be.visible');
    
    // Switch back to editor tab
    cy.get('[role="tab"]').contains('Editor').click();
    cy.get('textarea').should('be.visible');
  });

  it('should analyze text when the analyze button is clicked', () => {
    // Type some text in the editor
    cy.get('textarea').type('Ciao, mi chiamo Marco. Sono italiano e vivo a Roma.');
    
    // Click the analyze button
    cy.get('button').contains('Analyze Text').click();
    
    // Should switch to analysis tab automatically
    cy.get('[role="tab"]').contains('Analysis').should('have.attr', 'data-state', 'active');
    
    // Should display analysis results
    cy.get('[role="tabpanel"]').contains('Content Type').should('be.visible');
    cy.get('[role="tabpanel"]').contains('Processing Time').should('be.visible');
  });

  it('should generate AI feedback when the button is clicked', () => {
    // Type some text in the editor
    cy.get('textarea').type('Ciao, mi chiamo Marco. Sono italiano e vivo a Roma.');
    
    // Click the generate feedback button
    cy.get('button').contains('Generate AI Feedback').click();
    
    // Should switch to analysis tab automatically
    cy.get('[role="tab"]').contains('Analysis').should('have.attr', 'data-state', 'active');
    
    // Should display AI feedback
    cy.get('[role="tabpanel"]').contains('AI Feedback').should('be.visible');
    cy.get('textarea[readonly]').should('exist');
  });

  it('should clear text when the clear button is clicked', () => {
    // Type some text in the editor
    cy.get('textarea').type('Ciao, mi chiamo Marco.');
    
    // Click the clear button
    cy.get('button').contains('Clear Text').click();
    
    // Textarea should be empty
    cy.get('textarea').should('have.value', '');
  });

  it('should validate empty submissions', () => {
    // Try to analyze without entering text
    cy.get('button').contains('Analyze Text').click();
    
    // Should show an error toast
    cy.get('[data-testid="toast"]').should('contain', 'Empty Text');
    
    // Try to generate feedback without entering text
    cy.get('button').contains('Generate AI Feedback').click();
    
    // Should show an error toast
    cy.get('[data-testid="toast"]').should('contain', 'Empty Text');
  });

  it('should handle loading states correctly', () => {
    // Intercept API call and delay response
    cy.intercept('POST', '/api/ai/analyze', (req) => {
      req.reply({
        delay: 1000,
        body: {
          analysis: {
            label: 'Greeting',
            score: 0.92,
            feedback: 'Good job!'
          }
        }
      });
    }).as('analyzeText');
    
    // Type text and submit
    cy.get('textarea').type('Ciao, mi chiamo Marco.');
    cy.get('button').contains('Analyze Text').click();
    
    // Check for loading state
    cy.get('button').contains('Analyze Text').should('be.disabled');
    
    // Wait for response
    cy.wait('@analyzeText');
    
    // Button should be enabled again
    cy.get('button').contains('Analyze Text').should('not.be.disabled');
  });

  it('should display confidence indicators correctly', () => {
    // Type text and submit
    cy.get('textarea').type('Ciao, mi chiamo Marco. Sono italiano e vivo a Roma.');
    cy.get('button').contains('Analyze Text').click();
    
    // Check confidence indicator is displayed
    cy.get('[data-testid="confidence-indicator"]').should('exist');
  });

  it('should handle keyboard shortcuts', () => {
    // Focus on textarea - Change focus() to focused() to match Cypress's API
    cy.get('textarea').focused();
    
    // Type text
    cy.get('textarea').type('Ciao');
    
    // Use keyboard shortcut Ctrl+Enter to analyze (common pattern in text editors)
    cy.get('textarea').type('{ctrl+enter}');
    
    // Should trigger analysis
    cy.get('[role="tab"]').contains('Analysis').should('have.attr', 'data-state', 'active');
  });

  it('should match visual snapshot', () => {
    cy.captureAndCompare('writing-page-initial');
    
    // With content
    cy.get('textarea').type('Ciao, mi chiamo Marco.');
    cy.captureAndCompare('writing-page-with-content');
    
    // Analysis view
    cy.get('button').contains('Analyze Text').click();
    cy.captureAndCompare('writing-page-analysis');
  });

  it('should be fully navigable by keyboard', () => {
    // Start keyboard navigation from the top
    cy.testKeyboardNavigation();
    
    // Ensure we can reach all interactive elements
    cy.get('textarea').focus();
    cy.tab().should('have.focus'); // Should focus the next focusable element
  });
});
