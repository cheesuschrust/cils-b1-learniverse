
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        },
        token: 'fake-token'
      }
    }).as('loginRequest');

    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: {
        user: {
          id: '2',
          name: 'New User',
          email: 'newuser@example.com',
          role: 'user'
        },
        token: 'fake-token'
      }
    }).as('registerRequest');

    cy.intercept('POST', '/api/reset-password', {
      statusCode: 200,
      body: { message: 'Password reset email sent' }
    }).as('resetRequest');
  });

  describe('Login', () => {
    it('should display login form', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('should validate form inputs', () => {
      cy.visit('/login');
      
      // Test empty form submission
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-error"]').should('be.visible');
      cy.get('[data-testid="password-error"]').should('be.visible');
      
      // Test invalid email
      cy.get('[data-testid="email-input"]').type('invalidEmail');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-error"]').should('be.visible');
      
      // Test short password
      cy.get('[data-testid="email-input"]').clear().type('test@example.com');
      cy.get('[data-testid="password-input"]').type('123');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="password-error"]').should('be.visible');
    });

    it('should login successfully', () => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      cy.wait('@loginRequest');
      cy.url().should('include', '/app/dashboard');
      cy.get('[data-testid="user-greeting"]').should('contain', 'Test User');
    });

    it('should show error on failed login', () => {
      cy.intercept('POST', '/api/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      }).as('failedLogin');
      
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('wrong@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      cy.wait('@failedLogin');
      cy.get('[data-testid="login-error"]').should('be.visible');
      cy.get('[data-testid="login-error"]').should('contain', 'Invalid credentials');
    });
  });

  describe('Registration', () => {
    it('should display registration form', () => {
      cy.visit('/signup');
      cy.get('[data-testid="register-form"]').should('be.visible');
      cy.get('[data-testid="name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="confirm-password-input"]').should('be.visible');
      cy.get('[data-testid="register-button"]').should('be.visible');
    });

    it('should validate registration form inputs', () => {
      cy.visit('/signup');
      
      // Empty form submission
      cy.get('[data-testid="register-button"]').click();
      cy.get('[data-testid="name-error"]').should('be.visible');
      cy.get('[data-testid="email-error"]').should('be.visible');
      cy.get('[data-testid="password-error"]').should('be.visible');
      
      // Password mismatch
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password456');
      cy.get('[data-testid="register-button"]').click();
      cy.get('[data-testid="confirm-password-error"]').should('contain', 'match');
    });

    it('should register successfully', () => {
      cy.visit('/signup');
      cy.get('[data-testid="name-input"]').type('New User');
      cy.get('[data-testid="email-input"]').type('newuser@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password123');
      cy.get('[data-testid="terms-checkbox"]').check();
      cy.get('[data-testid="register-button"]').click();
      cy.wait('@registerRequest');
      cy.url().should('include', '/app/dashboard');
    });
  });

  describe('Password Reset', () => {
    it('should display password reset form', () => {
      cy.visit('/password-reset');
      cy.get('[data-testid="reset-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="reset-button"]').should('be.visible');
    });

    it('should validate email input', () => {
      cy.visit('/password-reset');
      cy.get('[data-testid="reset-button"]').click();
      cy.get('[data-testid="email-error"]').should('be.visible');
      
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="reset-button"]').click();
      cy.get('[data-testid="email-error"]').should('be.visible');
    });

    it('should send password reset email', () => {
      cy.visit('/password-reset');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="reset-button"]').click();
      cy.wait('@resetRequest');
      cy.get('[data-testid="reset-success"]').should('be.visible');
      cy.get('[data-testid="reset-success"]').should('contain', 'sent');
    });
  });

  describe('Authentication State', () => {
    it('should maintain authentication state after refresh', () => {
      // Login first
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      cy.wait('@loginRequest');
      cy.url().should('include', '/app/dashboard');
      
      // Refresh the page
      cy.reload();
      
      // Should still be logged in
      cy.url().should('include', '/app/dashboard');
      cy.get('[data-testid="user-greeting"]').should('exist');
    });

    it('should redirect to login when accessing protected routes while logged out', () => {
      // Clear any existing session
      cy.clearLocalStorage();
      cy.clearCookies();
      
      // Try to access protected route
      cy.visit('/app/dashboard');
      
      // Should redirect to login
      cy.url().should('include', '/login');
    });

    it('should logout successfully', () => {
      // Login first
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      cy.wait('@loginRequest');
      
      // Intercept logout request
      cy.intercept('POST', '/api/logout', {
        statusCode: 200,
        body: { success: true }
      }).as('logoutRequest');
      
      // Click logout
      cy.get('[data-testid="user-menu-button"]').click();
      cy.get('[data-testid="logout-button"]').click();
      cy.wait('@logoutRequest');
      
      // Should redirect to login
      cy.url().should('include', '/login');
      
      // Try to access protected route again
      cy.visit('/app/dashboard');
      cy.url().should('include', '/login');
    });
  });
});
