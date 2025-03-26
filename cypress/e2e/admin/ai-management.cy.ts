
describe('AI Management Page', () => {
  beforeEach(() => {
    // Login as admin
    cy.loginAsAdmin();
    cy.visit('/admin/ai-management');
  });

  it('should render the AI management page correctly', () => {
    // Check that essential elements are present
    cy.get('h1').should('contain', 'AI Management');
    
    // Check that main section cards are present
    cy.get('[data-testid="model-settings-card"]').should('exist');
    cy.get('[data-testid="performance-metrics-card"]').should('exist');
    cy.get('[data-testid="training-data-card"]').should('exist');
    
    // Check accessibility
    cy.checkAccessibility();
  });

  it('should show AI model settings correctly', () => {
    // Check that model settings card shows current AI config
    cy.get('[data-testid="model-settings-card"]').within(() => {
      cy.get('select').should('exist'); // Model size selector
      cy.get('[data-testid="web-gpu-toggle"]').should('exist');
      cy.get('[data-testid="cache-responses-toggle"]').should('exist');
    });
  });

  it('should change model settings and save them', () => {
    // Change model size
    cy.get('[data-testid="model-settings-card"]').within(() => {
      cy.get('select').select('large');
      cy.get('button').contains('Save Settings').click();
    });
    
    // Should show success toast
    cy.get('[data-testid="toast"]').should('contain', 'Settings saved');
    
    // Refresh page to verify persistence
    cy.reload();
    
    // Check that selected option is still 'large'
    cy.get('[data-testid="model-settings-card"]').within(() => {
      cy.get('select').should('have.value', 'large');
    });
  });

  it('should toggle WebGPU acceleration', () => {
    // Toggle WebGPU setting
    cy.get('[data-testid="web-gpu-toggle"]').click();
    
    // Save settings
    cy.get('[data-testid="model-settings-card"]').within(() => {
      cy.get('button').contains('Save Settings').click();
    });
    
    // Should show success toast
    cy.get('[data-testid="toast"]').should('contain', 'Settings saved');
  });

  it('should display performance metrics', () => {
    // Check that performance metrics are displayed
    cy.get('[data-testid="performance-metrics-card"]').within(() => {
      cy.get('[data-testid="accuracy-metric"]').should('exist');
      cy.get('[data-testid="response-time-metric"]').should('exist');
      cy.get('[data-testid="requests-metric"]').should('exist');
    });
  });

  it('should navigate to training data manager when button is clicked', () => {
    // Click on manage training data button
    cy.get('button').contains('Manage Training Data').click();
    
    // Should show the training data manager
    cy.get('[data-testid="training-data-manager"]').should('be.visible');
  });

  it('should show AI system information panel', () => {
    // Expand system info panel
    cy.get('button').contains('View System Information').click();
    
    // Panel should be visible
    cy.get('[data-testid="ai-system-info-panel"]').should('be.visible');
    
    // Check for system details
    cy.get('[data-testid="ai-system-info-panel"]').within(() => {
      cy.get('[data-testid="memory-usage"]').should('exist');
      cy.get('[data-testid="model-size"]').should('exist');
      cy.get('[data-testid="initialization-time"]').should('exist');
    });
    
    // Close panel
    cy.get('button').contains('Close').click();
    cy.get('[data-testid="ai-system-info-panel"]').should('not.exist');
  });

  it('should add a new training example', () => {
    // Click on manage training data button
    cy.get('button').contains('Manage Training Data').click();
    
    // Add a new training example
    cy.get('[data-testid="add-example-button"]').click();
    cy.get('[data-testid="example-text-input"]').type('This is a test example');
    cy.get('[data-testid="example-label-select"]').select('greeting');
    cy.get('[data-testid="save-example-button"]').click();
    
    // Should show success message
    cy.get('[data-testid="toast"]').should('contain', 'Example added');
    
    // New example should appear in the list
    cy.get('[data-testid="training-examples-list"]').should('contain', 'This is a test example');
  });

  it('should reset AI model when button is clicked', () => {
    // Click reset model button
    cy.get('button').contains('Reset Model').click();
    
    // Confirmation dialog should appear
    cy.get('[data-testid="confirmation-dialog"]').should('be.visible');
    cy.get('[data-testid="confirmation-dialog"]').within(() => {
      cy.get('button').contains('Confirm').click();
    });
    
    // Should show success toast
    cy.get('[data-testid="toast"]').should('contain', 'Model reset successfully');
  });

  it('should display model usage analytics', () => {
    // Check that usage analytics are displayed
    cy.get('[data-testid="usage-analytics-card"]').should('exist');
    cy.get('[data-testid="usage-chart"]').should('exist');
  });

  it('should be responsive', () => {
    // Test on mobile viewport
    cy.viewport('iphone-x');
    cy.get('[data-testid="mobile-layout"]').should('be.visible');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.get('[data-testid="tablet-layout"]').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport('macbook-15');
    cy.get('[data-testid="desktop-layout"]').should('be.visible');
  });

  it('should match visual snapshot', () => {
    cy.captureAndCompare('ai-management-page');
  });
});
