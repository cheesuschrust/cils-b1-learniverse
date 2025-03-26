
import { rest } from 'msw';
import { mockUser, mockFlashcards, mockExercises } from './mockData';

export const handlers = [
  // Authentication handlers
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body as { email: string; password: string };
    
    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          user: mockUser,
          token: 'mock-jwt-token',
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({
        error: 'Invalid credentials',
      })
    );
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        user: mockUser,
        token: 'mock-jwt-token',
      })
    );
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
      })
    );
  }),

  rest.post('/api/auth/reset-password', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
      })
    );
  }),

  // User profile handlers
  rest.get('/api/user/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockUser)
    );
  }),

  rest.put('/api/user/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        ...mockUser,
        ...req.body,
      })
    );
  }),

  // Flashcard handlers
  rest.get('/api/flashcards', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockFlashcards)
    );
  }),

  rest.get('/api/flashcards/:id', (req, res, ctx) => {
    const { id } = req.params;
    const flashcard = mockFlashcards.find(card => card.id === id);
    
    if (flashcard) {
      return res(
        ctx.status(200),
        ctx.json(flashcard)
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({
        error: 'Flashcard not found',
      })
    );
  }),

  rest.post('/api/flashcards', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-flashcard-id',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  // Exercise handlers
  rest.get('/api/exercises', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockExercises)
    );
  }),

  rest.get('/api/exercises/:id', (req, res, ctx) => {
    const { id } = req.params;
    const exercise = mockExercises.find(ex => ex.id === id);
    
    if (exercise) {
      return res(
        ctx.status(200),
        ctx.json(exercise)
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({
        error: 'Exercise not found',
      })
    );
  }),

  // Progress tracking handlers
  rest.get('/api/progress', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalExercises: 120,
        completedExercises: 75,
        streakDays: 12,
        masteredWords: 250,
        level: 'Intermediate',
        points: 2450,
      })
    );
  }),

  // Settings handlers
  rest.get('/api/settings', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        theme: 'light',
        notifications: true,
        audioAutoplay: true,
        language: 'english',
      })
    );
  }),

  rest.put('/api/settings', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        ...req.body,
      })
    );
  }),

  // AI handlers
  rest.post('/api/ai/generate', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        generated: "This is AI-generated content for testing purposes.",
      })
    );
  }),

  rest.post('/api/ai/analyze', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        analysis: {
          score: 85,
          feedback: "Good attempt! Here's some feedback for improvement...",
          corrections: [
            { original: "io sono andato", corrected: "io sono andato", isCorrect: true },
            { original: "tu sei felice", corrected: "tu sei felice", isCorrect: true }
          ]
        }
      })
    );
  }),
];
