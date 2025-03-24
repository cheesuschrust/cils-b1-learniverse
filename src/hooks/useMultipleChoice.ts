
import { useState, useEffect } from 'react';
import { MultipleChoiceQuestion, QuestionSet, QuizAttempt } from '@/types/question';
import { useToast } from '@/hooks/use-toast';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAuth } from '@/contexts/AuthContext';
import { generateQuestionSet } from '@/services/questionService';

export function useMultipleChoice() {
  const [availableSets, setAvailableSets] = useState<QuestionSet[]>([]);
  const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  
  const { toast } = useToast();
  const { preferredLanguage } = useUserPreferences();
  const { user } = useAuth();
  
  // Fetch question sets on mount
  useEffect(() => {
    fetchQuestionSets();
  }, [preferredLanguage]);
  
  // Mock implementation until we have a real backend
  const fetchQuestionSets = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, we would fetch from an API
      // For now, generate a few sample sets based on language preference
      const language = preferredLanguage === 'both' ? 'italian' : preferredLanguage;
      
      const sampleSets: QuestionSet[] = [
        {
          id: '1',
          title: language === 'italian' ? 'Cultura Italiana' : 'Italian Culture',
          description: language === 'italian' ? 'Domande sulla cultura italiana' : 'Questions about Italian culture',
          category: 'culture',
          difficulty: 'Beginner',
          language,
          createdAt: new Date(),
          updatedAt: new Date(),
          questions: await generateSampleQuestions(language, 'culture', 'Beginner')
        },
        {
          id: '2',
          title: language === 'italian' ? 'Grammatica Base' : 'Basic Grammar',
          description: language === 'italian' ? 'Test sulle regole di grammatica di base' : 'Test on basic grammar rules',
          category: 'grammar',
          difficulty: 'Beginner',
          language,
          createdAt: new Date(),
          updatedAt: new Date(),
          questions: await generateSampleQuestions(language, 'grammar', 'Beginner')
        },
        {
          id: '3',
          title: language === 'italian' ? 'Vocabolario Intermedio' : 'Intermediate Vocabulary',
          description: language === 'italian' ? 'Espandi il tuo vocabolario italiano' : 'Expand your Italian vocabulary',
          category: 'vocabulary',
          difficulty: 'Intermediate',
          language,
          createdAt: new Date(),
          updatedAt: new Date(),
          questions: await generateSampleQuestions(language, 'vocabulary', 'Intermediate')
        }
      ];
      
      setAvailableSets(sampleSets);
    } catch (error) {
      console.error("Error fetching question sets:", error);
      toast({
        title: "Error",
        description: "Failed to load question sets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // For now, generate questions dynamically
  const generateSampleQuestions = async (
    language: 'english' | 'italian',
    category: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): Promise<MultipleChoiceQuestion[]> => {
    // Later we'll replace this with real data from the backend
    try {
      // Try to use the AI service to generate questions
      const questions = await generateQuestionSet(category, difficulty, language, 5);
      return questions.map((q, index) => ({
        id: `${category}-${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.options[q.correctAnswerIndex],
        explanation: q.explanation || "No explanation available",
        difficulty,
        category,
        language
      }));
    } catch (error) {
      console.error("Failed to generate questions with AI, using fallback:", error);
      
      // Fallback to hardcoded questions
      if (language === 'italian') {
        return [
          {
            id: `${category}-1`,
            question: "Quale di queste città è la capitale d'Italia?",
            options: ["Milano", "Firenze", "Roma", "Venezia"],
            correctAnswer: "Roma",
            explanation: "Roma è la capitale d'Italia dal 1871. Prima di Roma, la capitale è stata Torino e poi Firenze.",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-2`,
            question: "Cosa rappresentano i tre colori della bandiera italiana?",
            options: ["Libertà, Uguaglianza, Fraternità", "Passato, Presente, Futuro", "Mare, Pianura, Montagne", "Speranza, Fede, Carità"],
            correctAnswer: "Speranza, Fede, Carità",
            explanation: "I tre colori della bandiera italiana simboleggiano la Speranza (verde), la Fede (bianco) e la Carità (rosso).",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-3`,
            question: "Chi è stato il primo presidente della Repubblica Italiana?",
            options: ["Alcide De Gasperi", "Enrico De Nicola", "Luigi Einaudi", "Giuseppe Saragat"],
            correctAnswer: "Enrico De Nicola",
            explanation: "Enrico De Nicola è stato il primo presidente della Repubblica Italiana dal 1946 al 1948, sebbene inizialmente con il titolo di Capo Provvisorio dello Stato.",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-4`,
            question: "Quale di questi mari non bagna l'Italia?",
            options: ["Mar Tirreno", "Mar Adriatico", "Mar Baltico", "Mar Ionio"],
            correctAnswer: "Mar Baltico",
            explanation: "L'Italia è bagnata dal Mar Tirreno, dal Mar Adriatico, dal Mar Ionio e dal Mar Ligure. Il Mar Baltico si trova nel nord Europa.",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-5`,
            question: "In che anno è stata fondata la Repubblica Italiana?",
            options: ["1861", "1946", "1918", "1870"],
            correctAnswer: "1946",
            explanation: "La Repubblica Italiana è stata fondata il 2 giugno 1946, quando gli italiani votarono per abolire la monarchia in un referendum.",
            difficulty,
            category,
            language
          }
        ];
      } else {
        return [
          {
            id: `${category}-1`,
            question: "Which of these cities is the capital of Italy?",
            options: ["Milan", "Florence", "Rome", "Venice"],
            correctAnswer: "Rome",
            explanation: "Rome has been the capital of Italy since 1871. Before Rome, the capital was Turin and then Florence.",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-2`,
            question: "What do the three colors of the Italian flag represent?",
            options: ["Liberty, Equality, Fraternity", "Past, Present, Future", "Sea, Plains, Mountains", "Hope, Faith, Charity"],
            correctAnswer: "Hope, Faith, Charity",
            explanation: "The three colors of the Italian flag symbolize Hope (green), Faith (white), and Charity (red).",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-3`,
            question: "Who was the first president of the Italian Republic?",
            options: ["Alcide De Gasperi", "Enrico De Nicola", "Luigi Einaudi", "Giuseppe Saragat"],
            correctAnswer: "Enrico De Nicola",
            explanation: "Enrico De Nicola was the first president of the Italian Republic from 1946 to 1948, although initially with the title of Provisional Head of State.",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-4`,
            question: "Which of these seas does not border Italy?",
            options: ["Tyrrhenian Sea", "Adriatic Sea", "Baltic Sea", "Ionian Sea"],
            correctAnswer: "Baltic Sea",
            explanation: "Italy is bordered by the Tyrrhenian Sea, the Adriatic Sea, the Ionian Sea, and the Ligurian Sea. The Baltic Sea is located in northern Europe.",
            difficulty,
            category,
            language
          },
          {
            id: `${category}-5`,
            question: "In what year was the Italian Republic founded?",
            options: ["1861", "1946", "1918", "1870"],
            correctAnswer: "1946",
            explanation: "The Italian Republic was founded on June 2, 1946, when Italians voted to abolish the monarchy in a referendum.",
            difficulty,
            category,
            language
          }
        ];
      }
    }
  };
  
  const startQuiz = (setId: string) => {
    const set = availableSets.find(s => s.id === setId);
    if (set) {
      setCurrentSet(set);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowExplanation(false);
      setCorrectAnswers(0);
      setIncorrectAnswers(0);
      setQuizFinished(false);
      setStartTime(new Date());
    } else {
      toast({
        title: "Error",
        description: "Could not find the selected question set",
        variant: "destructive"
      });
    }
  };
  
  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };
  
  const handleSubmit = () => {
    if (!selectedOption || !currentSet) {
      toast({
        title: "Please select an answer",
        description: "You need to choose an option before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
    const currentQuestion = currentSet.questions[currentQuestionIndex];
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      // Play success sound in a real app
    } else {
      setIncorrectAnswers(prev => prev + 1);
      // Play error sound in a real app
    }
  };
  
  const handleNext = () => {
    if (!currentSet) return;
    
    if (currentQuestionIndex < currentSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      
      // Save the attempt
      if (startTime && user) {
        const endTime = new Date();
        const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        
        const userId = typeof user === 'object' && user !== null ? (user.id || 'anonymous') : 'anonymous';
        
        const newAttempt: QuizAttempt = {
          id: `${userId}-${currentSet.id}-${Date.now()}`,
          userId: userId,
          questionSetId: currentSet.id,
          score: correctAnswers,
          totalQuestions: currentSet.questions.length,
          completedAt: endTime,
          timeSpent
        };
        
        setAttempts(prev => [...prev, newAttempt]);
        
        // In a real app, we would save this to the backend
        console.log("Quiz attempt saved:", newAttempt);
      }
    }
  };
  
  const restartQuiz = () => {
    if (!currentSet) return;
    
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setQuizFinished(false);
    setStartTime(new Date());
  };
  
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  return {
    availableSets,
    currentSet,
    currentQuestionIndex,
    selectedOption,
    isSubmitted,
    correctAnswers,
    incorrectAnswers,
    isLoading,
    quizFinished,
    showExplanation,
    attempts,
    startQuiz,
    handleOptionSelect,
    handleSubmit,
    handleNext,
    restartQuiz,
    toggleExplanation,
    currentQuestion: currentSet ? currentSet.questions[currentQuestionIndex] : null
  };
}
