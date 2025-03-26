
describe('Dashboard Functionality', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 200,
      body: {
        learningStreak: 5,
        wordsLearned: 120,
        wordsReviewed: 350,
        accuracy: 85,
        timeSpent: 1200,
        fluencyScore: 72
      }
    }).as('dashboardStats');
    
    cy.intercept('GET', '/api/wordofday', {
      statusCode: 200,
      body: {
        id: '123',
        italian: 'buongiorno',
        english: 'good morning',
        explanation: 'A common greeting used in the morning',
        examples: ['Buongiorno, come stai?']
      }
    }).as('wordOfDay');
    
    cy.intercept('GET', '/api/user/progress', {
      statusCode: 200,
      body: {
        weeklyProgress: [
          { day: 'Mon', minutes: 15 },
          { day: 'Tue', minutes: 20 },
          { day: 'Wed', minutes: 0 },
          { day: 'Thu', minutes: 30 },
          { day: 'Fri', minutes: 25 },
          { day: 'Sat', minutes: 10 },
          { day: 'Sun', minutes: 0 }
        ]
      }
    }).as('progressData');
    
    cy.intercept('GET', '/api/flashcards/due', {
      statusCode: 200,
      body: {
        count: 12
      }
    }).as('dueCards');
    
    // Login before each test
    cy.login('test@example.com', 'password123');
  });

  it('should load dashboard with correct metrics', () => {
    cy.visit('/app/dashboard');
    cy.wait(['@dashboardStats', '@wordOfDay', '@progressData', '@dueCards']);
    
    // Check main stats
    cy.get('[data-testid="learning-streak"]').should('contain', '5');
    cy.get('[data-testid="words-learned"]').should('contain', '120');
    cy.get('[data-testid="accuracy-score"]').should('contain', '85%');
    cy.get('[data-testid="fluency-score"]').should('contain', '72');
    
    // Check Word of the Day
    cy.get('[data-testid="word-of-day"]').should('contain', 'buongiorno');
    cy.get('[data-testid="word-translation"]').should('contain', 'good morning');
    
    // Check progress chart exists
    cy.get('[data-testid="progress-chart"]').should('be.visible');
    
    // Check due cards widget
    cy.get('[data-testid="due-cards-count"]').should('contain', '12');
  });

  it('should handle errors in metrics loading gracefully', () => {
    // Simulate failure fetching dashboard stats
    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('dashboardStatsFailed');
    
    cy.visit('/app/dashboard');
    cy.wait('@dashboardStatsFailed');
    
    // Should show error state
    cy.get('[data-testid="stats-error-state"]').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
    
    // Test retry functionality
    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 200,
      body: {
        learningStreak: 5,
        wordsLearned: 120,
        wordsReviewed: 350,
        accuracy: 85,
        timeSpent: 1200,
        fluencyScore: 72
      }
    }).as('dashboardStatsRetry');
    
    cy.get('[data-testid="retry-button"]').click();
    cy.wait('@dashboardStatsRetry');
    
    // Stats should now be visible
    cy.get('[data-testid="learning-streak"]').should('contain', '5');
  });

  it('should be able to play Word of the Day audio', () => {
    cy.visit('/app/dashboard');
    cy.wait('@wordOfDay');
    
    // Check audio playback
    cy.get('[data-testid="play-word-audio"]').should('be.visible');
    cy.get('[data-testid="play-word-audio"]').click();
    
    // Audio should be playing (we can't actually test the audio, but we can check UI state)
    cy.get('[data-testid="play-word-audio"]').should('have.attr', 'data-playing', 'true');
  });

  it('should navigate to flashcards from due cards widget', () => {
    cy.visit('/app/dashboard');
    cy.wait('@dueCards');
    
    cy.get('[data-testid="review-due-cards-button"]').click();
    cy.url().should('include', '/app/flashcards');
  });

  it('should display recent activity', () => {
    cy.intercept('GET', '/api/user/activity', {
      statusCode: 200,
      body: {
        activities: [
          { 
            id: '1', 
            type: 'flashcard_review', 
            details: 'Reviewed 20 flashcards', 
            timestamp: new Date().toISOString() 
          },
          { 
            id: '2', 
            type: 'lesson_completed', 
            details: 'Completed "Basics 1" lesson', 
            timestamp: new Date(Date.now() - 3600000).toISOString() 
          }
        ]
      }
    }).as('recentActivity');
    
    cy.visit('/app/dashboard');
    cy.wait('@recentActivity');
    
    cy.get('[data-testid="activity-list"]').should('be.visible');
    cy.get('[data-testid="activity-item"]').should('have.length', 2);
    cy.get('[data-testid="activity-item"]').first().should('contain', 'Reviewed 20 flashcards');
  });

  it('should navigate to other sections from quick links', () => {
    cy.visit('/app/dashboard');
    
    // Test navigation to different sections
    cy.get('[data-testid="flashcards-link"]').click();
    cy.url().should('include', '/app/flashcards');
    
    cy.go('back');
    cy.get('[data-testid="speaking-link"]').click();
    cy.url().should('include', '/app/speaking');
    
    cy.go('back');
    cy.get('[data-testid="writing-link"]').click();
    cy.url().should('include', '/app/writing');
  });

  it('should be responsive on mobile screens', () => {
    // Test on mobile viewport
    cy.viewport('iphone-x');
    cy.visit('/app/dashboard');
    cy.wait(['@dashboardStats', '@wordOfDay', '@progressData', '@dueCards']);
    
    // Elements should still be visible and properly formatted
    cy.get('[data-testid="dashboard-content"]').should('be.visible');
    cy.get('[data-testid="learning-streak"]').should('be.visible');
    cy.get('[data-testid="word-of-day"]').should('be.visible');
    
    // Menu should be collapsed
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
  });
});
