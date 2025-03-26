
import { Question, QuestionSet, QuizAttempt, MultipleChoiceQuestion, TextInputQuestion, MatchingQuestion, TrueFalseQuestion } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const QUESTION_SETS_KEY = 'question-sets';
const QUIZ_ATTEMPTS_KEY = 'quiz-attempts';

// Initialize from localStorage
const loadQuestionSets = (): QuestionSet[] => {
  const savedSets = localStorage.getItem(QUESTION_SETS_KEY);
  return savedSets ? JSON.parse(savedSets) : [];
};

const loadQuizAttempts = (): QuizAttempt[] => {
  const savedAttempts = localStorage.getItem(QUIZ_ATTEMPTS_KEY);
  return savedAttempts ? JSON.parse(savedAttempts) : [];
};

// Save to localStorage
const saveQuestionSets = (sets: QuestionSet[]): void => {
  localStorage.setItem(QUESTION_SETS_KEY, JSON.stringify(sets));
};

const saveQuizAttempts = (attempts: QuizAttempt[]): void => {
  localStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(attempts));
};

// Create and manage question sets
export const createQuestionSet = (set: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): QuestionSet => {
  const now = new Date();
  const newSet: QuestionSet = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    ...set
  };
  
  const sets = loadQuestionSets();
  sets.push(newSet);
  saveQuestionSets(sets);
  
  return newSet;
};

export const updateQuestionSet = (id: string, updates: Partial<QuestionSet>): QuestionSet | null => {
  const sets = loadQuestionSets();
  const index = sets.findIndex(set => set.id === id);
  
  if (index === -1) return null;
  
  const updated: QuestionSet = {
    ...sets[index],
    ...updates,
    updatedAt: new Date()
  };
  
  sets[index] = updated;
  saveQuestionSets(sets);
  
  return updated;
};

export const deleteQuestionSet = (id: string): boolean => {
  const sets = loadQuestionSets();
  const index = sets.findIndex(set => set.id === id);
  
  if (index === -1) return false;
  
  sets.splice(index, 1);
  saveQuestionSets(sets);
  
  return true;
};

export const getQuestionSets = (): QuestionSet[] => {
  return loadQuestionSets();
};

export const getQuestionSetById = (id: string): QuestionSet | null => {
  const sets = loadQuestionSets();
  return sets.find(set => set.id === id) || null;
};

// Create and manage questions
export const createQuestion = <T extends Question>(
  setId: string, 
  question: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): T | null => {
  const sets = loadQuestionSets();
  const setIndex = sets.findIndex(set => set.id === setId);
  
  if (setIndex === -1) return null;
  
  const now = new Date();
  const newQuestion = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    ...question
  } as T;
  
  sets[setIndex].questions.push(newQuestion);
  sets[setIndex].updatedAt = now;
  saveQuestionSets(sets);
  
  return newQuestion;
};

export const updateQuestion = <T extends Question>(
  setId: string,
  questionId: string,
  updates: Partial<T>
): T | null => {
  const sets = loadQuestionSets();
  const setIndex = sets.findIndex(set => set.id === setId);
  
  if (setIndex === -1) return null;
  
  const questionIndex = sets[setIndex].questions.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) return null;
  
  const updated = {
    ...sets[setIndex].questions[questionIndex],
    ...updates,
    updatedAt: new Date()
  } as T;
  
  sets[setIndex].questions[questionIndex] = updated;
  sets[setIndex].updatedAt = new Date();
  saveQuestionSets(sets);
  
  return updated;
};

export const deleteQuestion = (setId: string, questionId: string): boolean => {
  const sets = loadQuestionSets();
  const setIndex = sets.findIndex(set => set.id === setId);
  
  if (setIndex === -1) return false;
  
  const questionIndex = sets[setIndex].questions.findIndex(q => q.id === questionId);
  
  if (questionIndex === -1) return false;
  
  sets[setIndex].questions.splice(questionIndex, 1);
  sets[setIndex].updatedAt = new Date();
  saveQuestionSets(sets);
  
  return true;
};

// Quiz attempts
export const saveQuizAttempt = (attempt: Omit<QuizAttempt, 'createdAt'>): QuizAttempt => {
  const newAttempt: QuizAttempt = {
    ...attempt,
    createdAt: new Date()
  };
  
  const attempts = loadQuizAttempts();
  attempts.push(newAttempt);
  saveQuizAttempts(attempts);
  
  return newAttempt;
};

export const getQuizAttempts = (userId?: string): QuizAttempt[] => {
  const attempts = loadQuizAttempts();
  return userId ? attempts.filter(a => a.userId === userId) : attempts;
};

export const getQuizAttemptsForSet = (setId: string, userId?: string): QuizAttempt[] => {
  const attempts = loadQuizAttempts();
  return attempts.filter(a => 
    a.questionSetId === setId && 
    (userId ? a.userId === userId : true)
  );
};

// Helper functions
export const createMultipleChoiceQuestion = (
  setId: string,
  question: string,
  options: string[],
  correctAnswer: string,
  explanation?: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate',
  category: string = 'General',
  tags: string[] = [],
  language: 'english' | 'italian' = 'english'
): MultipleChoiceQuestion | null => {
  return createQuestion<MultipleChoiceQuestion>(setId, {
    type: 'multiple-choice',
    question,
    options,
    correctAnswer,
    explanation,
    difficulty,
    category,
    tags,
    language
  });
};

export const createTextInputQuestion = (
  setId: string,
  question: string,
  correctAnswers: string[],
  caseSensitive: boolean = false,
  explanation?: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate',
  category: string = 'General',
  tags: string[] = [],
  language: 'english' | 'italian' = 'english'
): TextInputQuestion | null => {
  return createQuestion<TextInputQuestion>(setId, {
    type: 'text-input',
    question,
    correctAnswers,
    caseSensitive,
    explanation,
    difficulty,
    category,
    tags,
    language
  });
};

export const createMatchingQuestion = (
  setId: string,
  question: string,
  pairs: { left: string; right: string }[],
  explanation?: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate',
  category: string = 'General',
  tags: string[] = [],
  language: 'english' | 'italian' = 'english'
): MatchingQuestion | null => {
  return createQuestion<MatchingQuestion>(setId, {
    type: 'matching',
    question,
    pairs,
    explanation,
    difficulty,
    category,
    tags,
    language
  });
};

export const createTrueFalseQuestion = (
  setId: string,
  question: string,
  correctAnswer: boolean,
  explanation?: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate',
  category: string = 'General',
  tags: string[] = [],
  language: 'english' | 'italian' = 'english'
): TrueFalseQuestion | null => {
  return createQuestion<TrueFalseQuestion>(setId, {
    type: 'true-false',
    question,
    correctAnswer,
    explanation,
    difficulty,
    category,
    tags,
    language
  });
};

// Initialize with sample data if no questions exist
export const initializeWithSampleData = (): void => {
  const sets = loadQuestionSets();
  
  if (sets.length === 0) {
    const sampleSet = createQuestionSet({
      title: 'Italian Basics Sample Quiz',
      description: 'A sample quiz to demonstrate the multiple choice feature.',
      questions: [],
      category: 'Vocabulary',
      difficulty: 'Beginner',
      language: 'english'
    });
    
    createMultipleChoiceQuestion(
      sampleSet.id,
      'What is the Italian word for "hello"?',
      ['Ciao', 'Arrivederci', 'Grazie', 'Prego'],
      'Ciao',
      'Ciao is a casual greeting in Italian, equivalent to "hello" or "hi" in English.',
      'Beginner',
      'Vocabulary',
      ['greeting', 'basic'],
      'english'
    );
    
    createMultipleChoiceQuestion(
      sampleSet.id,
      'Which of these is NOT an Italian word for a type of pasta?',
      ['Spaghetti', 'Penne', 'Panini', 'Linguine'],
      'Panini',
      'Panini is actually the Italian word for sandwiches. The other options are all types of pasta.',
      'Beginner',
      'Food',
      ['food', 'pasta'],
      'english'
    );
    
    createMultipleChoiceQuestion(
      sampleSet.id,
      'What is the Italian word for "thank you"?',
      ['Prego', 'Grazie', 'Scusi', 'Per favore'],
      'Grazie',
      '"Grazie" means "thank you" in Italian. "Prego" means "you\'re welcome".',
      'Beginner',
      'Vocabulary',
      ['greeting', 'polite'],
      'english'
    );
  }
};

// Initialize sample data when module is imported
initializeWithSampleData();

// Export the service
const questionService = {
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
  getQuestionSets,
  getQuestionSetById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  saveQuizAttempt,
  getQuizAttempts,
  getQuizAttemptsForSet,
  createMultipleChoiceQuestion,
  createTextInputQuestion,
  createMatchingQuestion,
  createTrueFalseQuestion
};

export default questionService;
