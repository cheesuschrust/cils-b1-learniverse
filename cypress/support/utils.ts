
// Helper function to format date in YYYY-MM-DD format
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper to get a random string
export const getRandomString = (length = 10): string => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Helper to get a random email
export const getRandomEmail = (): string => {
  return `test-${getRandomString(8)}@example.com`;
};

// Helper to get a random password (secure)
export const getRandomPassword = (): string => {
  return `P@ss${Math.floor(Math.random() * 10000)}!`;
};

// Helper to wait for animations to complete
export const waitForAnimations = (): void => {
  cy.wait(300); // Adjust based on your animation durations
};

// Helper to check accessibility on the current page
export const checkA11y = (context?: string): void => {
  cy.checkA11y(
    context, 
    {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    }
  );
};

// Helper to fetch data from fixture and use it
export const useFixture = <T>(fixtureName: string, callback: (data: T) => void): void => {
  cy.fixture(fixtureName).then(callback);
};

// Helper to test responsive behavior
export const testResponsive = (callback: () => void): void => {
  // Test on mobile
  cy.viewport('iphone-x');
  callback();
  
  // Test on tablet
  cy.viewport('ipad-2');
  callback();
  
  // Test on desktop
  cy.viewport(1280, 720);
  callback();
};

// Helper to test theme switching
export const testThemes = (callback: () => void): void => {
  // Test in light mode
  cy.get('html').should('have.attr', 'data-theme', 'light');
  callback();
  
  // Switch to dark mode
  cy.get('[data-testid="theme-toggle"]').click();
  cy.get('html').should('have.attr', 'data-theme', 'dark');
  callback();
};

export default {
  formatDate,
  getRandomString,
  getRandomEmail,
  getRandomPassword,
  waitForAnimations,
  checkA11y,
  useFixture,
  testResponsive,
  testThemes,
};
