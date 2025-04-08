
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

// Mock data (until Supabase integration is complete)
const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Qual è la capitale d\'Italia?',
    options: ['Roma', 'Milano', 'Napoli', 'Firenze'],
    correctAnswer: 'Roma',
    category: 'Geography',
    difficulty: 'beginner'
  },
  {
    id: '2',
    text: 'Come stai? - "___________, grazie."',
    options: ['Bene', 'Benvenuto', 'Buongiorno', 'Arrivederci'],
    correctAnswer: 'Bene',
    category: 'Conversation',
    difficulty: 'beginner'
  },
  {
    id: '3',
    text: 'Quale verbo è irregolare?',
    options: ['Parlare', 'Mangiare', 'Essere', 'Studiare'],
    correctAnswer: 'Essere',
    category: 'Grammar',
    difficulty: 'intermediate'
  }
];

// Function to get a daily question
export const getDailyQuestion = async (): Promise<Question> => {
  try {
    // First try to get from Supabase
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('question_date', today)
      .single();
    
    if (data && !error) {
      return {
        id: data.id,
        text: data.question_text,
        options: data.options || [],
        correctAnswer: data.correct_answer,
        category: data.category,
        difficulty: data.difficulty
      };
    }
    
    // Fall back to mock data if no data in Supabase
    const randomIndex = Math.floor(Math.random() * mockQuestions.length);
    return mockQuestions[randomIndex];
  } catch (error) {
    console.error('Error fetching daily question:', error);
    // Return a default question in case of error
    const randomIndex = Math.floor(Math.random() * mockQuestions.length);
    return mockQuestions[randomIndex];
  }
};

// Function to get questions by category
export const getQuestionsByCategory = async (category: string): Promise<Question[]> => {
  try {
    const { data, error } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('category', category)
      .limit(10);
    
    if (data && !error) {
      return data.map(q => ({
        id: q.id,
        text: q.question_text,
        options: q.options || [],
        correctAnswer: q.correct_answer,
        category: q.category,
        difficulty: q.difficulty
      }));
    }
    
    // Fall back to mock data
    return mockQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error(`Error fetching ${category} questions:`, error);
    return mockQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }
};

// Function to submit a user's answer
export const submitAnswer = async (
  questionId: string, 
  answer: string, 
  userId?: string
): Promise<boolean> => {
  const isCorrect = mockQuestions.find(q => q.id === questionId)?.correctAnswer === answer;
  
  // If connected to Supabase and user is logged in, record the answer
  if (userId) {
    try {
      await supabase.from('user_answers').insert({
        user_id: userId,
        question_id: questionId,
        answer,
        is_correct: isCorrect,
        answered_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording answer:', error);
    }
  }
  
  return isCorrect;
};
