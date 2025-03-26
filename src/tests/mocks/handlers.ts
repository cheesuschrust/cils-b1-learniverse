
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]);
  }),
  
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    
    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        },
        token: 'fake-jwt-token'
      });
    }
    
    return new HttpResponse(null, { status: 401 });
  }),
  
  http.get('/api/flashcards', () => {
    return HttpResponse.json({
      flashcards: [
        {
          id: '1',
          italian: 'casa',
          english: 'house',
          level: 0,
          mastered: false,
          tags: ['basics', 'nouns'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nextReview: new Date().toISOString(),
          lastReviewed: null
        }
      ]
    });
  }),
  
  http.get('/api/wordofday', () => {
    return HttpResponse.json({
      id: '123',
      italian: 'buongiorno',
      english: 'good morning',
      explanation: 'A common greeting used in the morning',
      examples: ['Buongiorno, come stai?']
    });
  })
];
