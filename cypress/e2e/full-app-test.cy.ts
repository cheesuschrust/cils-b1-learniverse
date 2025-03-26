
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
    
    it('should render and interact with multiple choice exercises', () => {
      cy.visit('/app/multiple-choice');
      cy.get('h1').should('contain', 'Multiple Choice');
      
      // Select an exercise
      cy.get('[data-testid="exercise-card"]').first().click();
      
      // Answer questions
      cy.get('[data-testid="option"]').first().click();
      cy.get('[data-testid="check-answer-button"]').click();
      
      // Test feedback display
      cy.get('[data-testid="feedback"]').should('be.visible');
      
      // Navigate to next question
      cy.get('[data-testid="next-question-button"]').click();
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('multiple-choice-page');
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
    
    it('should render and interact with the speaking practice page', () => {
      cy.visit('/app/speaking');
      cy.get('h1').should('contain', 'Speaking');
      
      // Select a speaking exercise
      cy.get('[data-testid="exercise-card"]').first().click();
      
      // Test recording controls (mock recording)
      cy.get('[data-testid="start-recording-button"]').click();
      cy.get('[data-testid="recording-indicator"]').should('be.visible');
      
      // Stop recording
      cy.get('[data-testid="stop-recording-button"]').click();
      
      // Test playback
      cy.get('[data-testid="play-recording-button"]').click();
      
      // Test submission
      cy.get('[data-testid="submit-recording-button"]').click();
      
      // Check feedback
      cy.get('[data-testid="feedback"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('speaking-page');
    });
    
    it('should render and interact with the listening exercises page', () => {
      cy.visit('/app/listening');
      cy.get('h1').should('contain', 'Listening');
      
      // Select a listening exercise
      cy.get('[data-testid="exercise-card"]').first().click();
      
      // Play audio
      cy.get('[data-testid="play-audio-button"]').click();
      
      // Test answering questions
      cy.get('[data-testid="answer-input"]').type('Test answer');
      
      // Submit answer
      cy.get('[data-testid="submit-answer-button"]').click();
      
      // Check feedback
      cy.get('[data-testid="feedback"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('listening-page');
    });
    
    it('should render and interact with the learning calendar', () => {
      cy.visit('/app/calendar');
      cy.get('h1').should('contain', 'Learning Calendar');
      
      // Check calendar UI
      cy.get('[data-testid="calendar"]').should('be.visible');
      
      // Click on a day with activity
      cy.get('[data-testid="calendar-day"][data-has-activity="true"]').first().click();
      
      // Check day details
      cy.get('[data-testid="day-details"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('calendar-page');
    });
  });
  
  context('User Settings and Profile', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123');
    });
    
    it('should render and interact with the profile page', () => {
      cy.visit('/app/profile');
      cy.get('h1').should('contain', 'Profile');
      
      // Check profile information display
      cy.get('[data-testid="user-info"]').should('be.visible');
      
      // Test edit profile functionality
      cy.get('[data-testid="edit-profile-button"]').click();
      cy.get('[data-testid="edit-profile-form"]').should('be.visible');
      
      // Update display name
      cy.get('input[name="name"]').clear().type('Updated Name');
      
      // Save changes
      cy.get('[data-testid="save-profile-button"]').click();
      
      // Check for success message
      cy.get('[data-testid="toast"]').should('contain', 'updated');
      
      // Check that the name was updated
      cy.get('[data-testid="user-info"]').should('contain', 'Updated Name');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('profile-page');
    });
    
    it('should render and interact with the settings page', () => {
      cy.visit('/app/settings');
      cy.get('h1').should('contain', 'Settings');
      
      // Test theme settings
      cy.get('[data-testid="theme-settings"]').should('be.visible');
      cy.get('[data-testid="theme-select"]').select('dark');
      
      // Test notification settings
      cy.get('[data-testid="notification-settings"]').should('be.visible');
      cy.get('[data-testid="email-notifications-toggle"]').click();
      
      // Test voice settings
      cy.get('[data-testid="voice-settings"]').should('be.visible');
      cy.get('[data-testid="voice-rate-slider"]').invoke('val', 1.2).trigger('change');
      
      // Save settings
      cy.get('[data-testid="save-settings-button"]').click();
      
      // Check for success message
      cy.get('[data-testid="toast"]').should('contain', 'saved');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('settings-page');
    });
    
    it('should render and interact with the AI settings', () => {
      cy.visit('/app/settings');
      
      // Navigate to AI tab
      cy.get('[data-testid="ai-settings-tab"]').click();
      
      // Toggle AI features
      cy.get('[data-testid="ai-enabled-toggle"]').click();
      
      // Change model size
      cy.get('[data-testid="model-size-select"]').select('large');
      
      // Save settings
      cy.get('[data-testid="save-ai-settings-button"]').click();
      
      // Check for success message
      cy.get('[data-testid="toast"]').should('contain', 'saved');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('ai-settings-page');
    });
  });
  
  context('Admin Functionality', () => {
    beforeEach(() => {
      cy.loginAsAdmin();
    });
    
    it('should render and interact with the admin dashboard', () => {
      cy.visit('/admin/dashboard');
      cy.get('h1').should('contain', 'Admin Dashboard');
      
      // Check dashboard cards
      cy.get('[data-testid="dashboard-card"]').should('have.length.at.least', 3);
      
      // Check analytics charts
      cy.get('[data-testid="analytics-chart"]').should('be.visible');
      
      // Check quick actions
      cy.get('[data-testid="quick-actions"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('admin-dashboard-page');
    });
    
    it('should render and interact with the user management page', () => {
      cy.visit('/admin/users');
      cy.get('h1').should('contain', 'User Management');
      
      // Test user search
      cy.get('[data-testid="user-search"]').type('test');
      cy.get('[data-testid="search-button"]').click();
      
      // Test user filtering
      cy.get('[data-testid="role-filter"]').select('admin');
      
      // Test user actions
      cy.get('[data-testid="user-row"]').first().within(() => {
        cy.get('[data-testid="user-actions-button"]').click();
      });
      
      cy.get('[data-testid="edit-user-button"]').click();
      cy.get('[data-testid="edit-user-modal"]').should('be.visible');
      
      // Close modal
      cy.get('[data-testid="close-modal-button"]').click();
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('user-management-page');
    });
    
    it('should render and interact with the content uploader page', () => {
      cy.visit('/admin/content');
      cy.get('h1').should('contain', 'Content Uploader');
      
      // Test content type selection
      cy.get('[data-testid="content-type-select"]').select('flashcards');
      
      // Test file dropzone (mock file upload)
      cy.get('[data-testid="file-dropzone"]').should('be.visible');
      
      // Test CSV template download
      cy.get('[data-testid="download-template-button"]').click();
      
      // Check upload history
      cy.get('[data-testid="upload-history"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('content-uploader-page');
    });
    
    it('should render and interact with the AI management page', () => {
      cy.visit('/admin/ai-management');
      cy.get('h1').should('contain', 'AI Management');
      
      // Test model settings
      cy.get('[data-testid="model-settings"]').should('be.visible');
      cy.get('[data-testid="model-size-select"]').select('medium');
      
      // Test training data management
      cy.get('[data-testid="manage-training-data-button"]').click();
      cy.get('[data-testid="training-data-manager"]').should('be.visible');
      
      // Close training data manager
      cy.get('[data-testid="close-manager-button"]').click();
      
      // Test performance metrics display
      cy.get('[data-testid="performance-metrics"]').should('be.visible');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('ai-management-page');
    });
    
    it('should render and interact with the system logs page', () => {
      cy.visit('/admin/logs');
      cy.get('h1').should('contain', 'System Logs');
      
      // Test log filtering
      cy.get('[data-testid="log-level-filter"]').select('error');
      cy.get('[data-testid="date-range-picker"]').should('be.visible');
      
      // Test log search
      cy.get('[data-testid="log-search"]').type('api');
      cy.get('[data-testid="search-button"]').click();
      
      // Test log export
      cy.get('[data-testid="export-logs-button"]').click();
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('system-logs-page');
    });
    
    it('should render and interact with the support tickets page', () => {
      cy.visit('/admin/support-tickets');
      cy.get('h1').should('contain', 'Support Tickets');
      
      // Test ticket filtering
      cy.get('[data-testid="status-filter"]').select('open');
      
      // Test ticket search
      cy.get('[data-testid="ticket-search"]').type('help');
      cy.get('[data-testid="search-button"]').click();
      
      // Test ticket actions
      cy.get('[data-testid="ticket-row"]').first().click();
      cy.get('[data-testid="ticket-details"]').should('be.visible');
      
      // Test reply to ticket
      cy.get('[data-testid="reply-button"]').click();
      cy.get('[data-testid="reply-form"]').should('be.visible');
      cy.get('[data-testid="reply-input"]').type('This is a test reply');
      cy.get('[data-testid="send-reply-button"]').click();
      
      // Check for success message
      cy.get('[data-testid="toast"]').should('contain', 'sent');
      
      // Check accessibility
      cy.checkAccessibility();
      cy.captureAndCompare('support-tickets-page');
    });
  });
  
  context('Error Handling and Edge Cases', () => {
    it('should handle 404 pages correctly', () => {
      cy.visit('/non-existent-page');
      cy.get('h1').should('contain', '404');
      cy.get('a').contains('home').should('be.visible');
      cy.checkAccessibility();
      cy.captureAndCompare('404-page');
    });
    
    it('should handle network errors gracefully', () => {
      // Force network error
      cy.intercept('GET', '/api/**', { forceNetworkError: true });
      
      cy.login('test@example.com', 'password123');
      cy.visit('/app/dashboard');
      
      // Should show error state
      cy.get('[data-testid="error-state"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
      
      // Test retry functionality
      cy.intercept('GET', '/api/**', { fixture: 'api-response.json' });
      cy.get('[data-testid="retry-button"]').click();
      
      // Content should load successfully
      cy.get('[data-testid="dashboard-content"]').should('be.visible');
    });
    
    it('should handle slow connections gracefully', () => {
      // Simulate slow connection
      cy.intercept('GET', '/api/**', (req) => {
        req.reply({
          delay: 3000,
          fixture: 'api-response.json'
        });
      });
      
      cy.login('test@example.com', 'password123');
      cy.visit('/app/dashboard');
      
      // Should show loading state
      cy.get('[data-testid="loading-state"]').should('be.visible');
      
      // Should eventually load
      cy.get('[data-testid="dashboard-content"]', { timeout: 5000 }).should('be.visible');
    });
    
    it('should handle invalid input gracefully', () => {
      cy.login('test@example.com', 'password123');
      
      // Test form validation
      cy.visit('/app/profile');
      cy.get('[data-testid="edit-profile-button"]').click();
      
      // Try invalid email
      cy.get('input[name="email"]').clear().type('invalid-email');
      cy.get('[data-testid="save-profile-button"]').click();
      
      // Should show validation error
      cy.get('[data-testid="email-error"]').should('be.visible');
      
      // Try valid email
      cy.get('input[name="email"]').clear().type('valid@example.com');
      cy.get('[data-testid="save-profile-button"]').click();
      
      // Should update successfully
      cy.get('[data-testid="toast"]').should('contain', 'updated');
    });
  });
  
  context('Accessibility and Cross-Browser Testing', () => {
    it('should be keyboard navigable throughout the app', () => {
      cy.login('test@example.com', 'password123');
      cy.visit('/app/dashboard');
      
      // Start from body
      cy.get('body').focus();
      cy.testKeyboardNavigation();
      
      // Test modal keyboard navigation
      cy.get('[data-testid="settings-button"]').click();
      cy.get('[data-testid="settings-modal"]').should('be.visible');
      cy.testKeyboardNavigation();
      
      // Close modal with Escape key
      cy.get('body').type('{esc}');
      cy.get('[data-testid="settings-modal"]').should('not.exist');
    });
    
    it('should handle screen reader navigation', () => {
      // This test focuses on correct ARIA attributes and semantic HTML
      cy.login('test@example.com', 'password123');
      cy.visit('/app/dashboard');
      
      // Check headings hierarchy
      cy.get('h1').should('have.length', 1);
      cy.get('h2').each(($el) => {
        cy.wrap($el).should('have.attr', 'id');
      });
      
      // Check landmark regions
      cy.get('main').should('exist');
      cy.get('nav').should('have.attr', 'aria-label');
      
      // Check form labels
      cy.get('form label').each(($label) => {
        const forAttr = $label.attr('for');
        if (forAttr) {
          cy.get(`#${forAttr}`).should('exist');
        }
      });
      
      // Check button and link text
      cy.get('button:not([aria-label])').each(($button) => {
        expect($button.text().trim()).to.not.equal('');
      });
      
      cy.get('a:not([aria-label])').each(($link) => {
        expect($link.text().trim()).to.not.equal('');
      });
    });
    
    it('should have appropriate color contrast', () => {
      // Run automated accessibility checks
      cy.visit('/');
      cy.checkAccessibility();
      
      cy.login('test@example.com', 'password123');
      cy.visit('/app/dashboard');
      cy.checkAccessibility();
      
      // Test dark mode contrast
      cy.get('[data-testid="theme-toggle"]').click();
      cy.checkAccessibility();
    });
  });
  
  context('Performance Testing', () => {
    it('should load the dashboard in a reasonable time', () => {
      const startTime = Date.now();
      cy.visit('/app/dashboard');
      cy.get('[data-testid="dashboard-content"]').should('be.visible');
      cy.window().then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });
    
    it('should load and render flashcards efficiently', () => {
      cy.login('test@example.com', 'password123');
      const startTime = Date.now();
      cy.visit('/app/flashcards');
      cy.get('[data-testid="flashcard-deck"]').should('be.visible');
      cy.window().then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(2000); // 2 seconds
      });
    });
  });
});
