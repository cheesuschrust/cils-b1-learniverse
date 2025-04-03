
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import useOfflineCapability from '@/hooks/useOfflineCapability';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Clock, Check, X, VolumeUp, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { speak } from '@/utils/textToSpeech';

// Mock reading passages
const mockPassages = [
  {
    id: '1',
    title: 'La Vita in Italia',
    description: 'Learn about everyday life in Italy',
    level: 'beginner',
    content: `L'Italia è un paese bellissimo con una cultura ricca e una lunga storia. 
    Gli italiani amano mangiare bene, passare tempo con la famiglia e godere della vita all'aperto. 
    La colazione è un pasto leggero, spesso solo un caffè e un cornetto. 
    Il pranzo è tradizionalmente il pasto principale della giornata, mentre la cena è più leggera e si mangia tardi.
    Molti italiani fanno la "pausa caffè" al bar durante la giornata per socializzare.`,
    translation: `Italy is a beautiful country with a rich culture and a long history. 
    Italians love to eat well, spend time with family, and enjoy outdoor living. 
    Breakfast is a light meal, often just a coffee and a croissant. 
    Lunch is traditionally the main meal of the day, while dinner is lighter and eaten late.
    Many Italians take a "coffee break" at the bar during the day to socialize.`,
    readingTime: 40,
    words: 86,
    vocabulary: {
      'bellissimo': 'beautiful',
      'ricca': 'rich',
      'lunga': 'long',
      'amano': 'love to',
      'mangiare': 'to eat',
      'famiglia': 'family',
      'godere': 'to enjoy',
      'aperto': 'open, outdoor',
      'leggero': 'light',
      'cornetto': 'croissant',
      'pranzo': 'lunch',
      'principale': 'main',
      'giornata': 'day',
      'cena': 'dinner',
      'tardi': 'late',
      'pausa': 'break',
      'socializzare': 'to socialize'
    },
    questions: [
      {
        id: 'q1',
        question: 'What is the main meal of the day in Italy?',
        options: ['Breakfast', 'Lunch', 'Coffee break', 'Dinner'],
        correctAnswer: 'Lunch'
      },
      {
        id: 'q2',
        question: 'What do Italians typically have for breakfast?',
        options: ['A big meal', 'Coffee and a croissant', 'Pasta', 'Pizza'],
        correctAnswer: 'Coffee and a croissant'
      },
      {
        id: 'q3',
        question: 'Why do many Italians take a coffee break?',
        options: ['To work more', 'To sleep', 'To socialize', 'To exercise'],
        correctAnswer: 'To socialize'
      }
    ]
  },
  {
    id: '2',
    title: 'Il Sistema Scolastico Italiano',
    description: 'Discover how the Italian educational system works',
    level: 'intermediate',
    content: `Il sistema scolastico italiano è diviso in diversi livelli. L'istruzione è obbligatoria dai 6 ai 16 anni.
    La scuola primaria (elementare) dura cinque anni, seguita dalla scuola secondaria di primo grado (media) che dura tre anni.
    Dopo la scuola media, gli studenti frequentano la scuola secondaria di secondo grado, che può essere un liceo, un istituto tecnico o un istituto professionale.
    Il liceo prepara gli studenti per l'università, mentre gli istituti tecnici e professionali offrono una formazione più pratica.
    Dopo il diploma, gli studenti possono iscriversi all'università. Il sistema universitario italiano si basa sul sistema di Bologna:
    laurea triennale (3 anni), laurea magistrale (2 anni) e dottorato di ricerca.`,
    translation: `The Italian school system is divided into different levels. Education is compulsory from ages 6 to 16.
    Primary school lasts five years, followed by middle school which lasts three years.
    After middle school, students attend high school, which can be a liceo, a technical institute, or a vocational institute.
    The liceo prepares students for university, while technical and vocational institutes offer more practical training.
    After obtaining a diploma, students can enroll in university. The Italian university system is based on the Bologna system:
    bachelor's degree (3 years), master's degree (2 years), and doctorate.`,
    readingTime: 60,
    words: 131,
    vocabulary: {
      'sistema scolastico': 'school system',
      'diviso': 'divided',
      'livelli': 'levels',
      'istruzione': 'education',
      'obbligatoria': 'compulsory',
      'scuola primaria': 'primary school',
      'elementare': 'elementary',
      'dura': 'lasts',
      'seguita': 'followed by',
      'secondaria': 'secondary',
      'primo grado': 'first level',
      'media': 'middle school',
      'studenti': 'students',
      'frequentano': 'attend',
      'secondo grado': 'second level',
      'liceo': 'high school (academic)',
      'istituto tecnico': 'technical institute',
      'istituto professionale': 'vocational institute',
      'prepara': 'prepares',
      'università': 'university',
      'formazione': 'training',
      'pratica': 'practical',
      'diploma': 'diploma',
      'iscriversi': 'to enroll',
      'laurea': 'degree',
      'triennale': 'three-year',
      'magistrale': 'master\'s',
      'dottorato di ricerca': 'doctorate'
    },
    questions: [
      {
        id: 'q1',
        question: 'Until what age is education compulsory in Italy?',
        options: ['14', '16', '18', '21'],
        correctAnswer: '16'
      },
      {
        id: 'q2',
        question: 'Which type of high school prepares students for university?',
        options: ['Istituto professionale', 'Istituto tecnico', 'Liceo', 'Scuola media'],
        correctAnswer: 'Liceo'
      },
      {
        id: 'q3',
        question: 'How many years does primary school (scuola elementare) last?',
        options: ['3', '5', '8', '13'],
        correctAnswer: '5'
      },
      {
        id: 'q4',
        question: 'What is the first university degree called in Italy?',
        options: ['Laurea triennale', 'Laurea magistrale', 'Dottorato', 'Diploma'],
        correctAnswer: 'Laurea triennale'
      }
    ]
  }
];

const ReadingModule: React.FC = () => {
  const [passages, setPassages] = useState<any[]>(mockPassages);
  const [currentPassageIndex, setCurrentPassageIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [readingStartTime, setReadingStartTime] = useState<Date | null>(null);
  const [readingEndTime, setReadingEndTime] = useState<Date | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { isOnline, isOfflineReady, enableOfflineAccess } = useOfflineCapability('/reading');
  const contentRef = useRef<HTMLDivElement>(null);
  
  const isLimitReached = hasReachedLimit('readingExercises');
  const maxExercises = getLimit('readingExercises');
  const currentUsage = getUsage('readingExercises');

  useEffect(() => {
    // In a real app, fetch passages from the database
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // We'd normally fetch from API here
    }, 1000);
  }, []);
  
  useEffect(() => {
    // Track reading time when a passage is selected
    if (currentPassageIndex !== null && !readingStartTime) {
      setReadingStartTime(new Date());
    }
  }, [currentPassageIndex, readingStartTime]);

  const handleStartPassage = async (index: number) => {
    if (isLimitReached && !user?.isPremium) {
      toast({
        title: "Daily Limit Reached",
        description: `You've reached your daily limit of ${maxExercises} reading exercises. Upgrade to Premium for unlimited access.`,
        variant: "destructive"
      });
      return;
    }
    
    setCurrentPassageIndex(index);
    setSelectedAnswers({});
    setShowResults(false);
    setReadingStartTime(new Date());
    setReadingEndTime(null);
    setShowTranslation(false);
    
    // Reset score
    setScore({ correct: 0, total: 0 });
    
    try {
      await incrementUsage('readingExercises');
    } catch (err) {
      console.error("Failed to increment usage:", err);
    }
  };

  const handleWordClick = (word: string) => {
    setSelectedWord(word.toLowerCase().replace(/[.,;!?]$/, ''));
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleSubmit = () => {
    if (currentPassageIndex === null) return;
    
    const passage = passages[currentPassageIndex];
    const questions = passage.questions;
    
    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore({
      correct: correctCount,
      total: questions.length
    });
    
    setReadingEndTime(new Date());
    setShowResults(true);
    setShowTranslation(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setReadingStartTime(new Date());
    setReadingEndTime(null);
    setShowTranslation(false);
  };

  const handleBackToPassages = () => {
    setCurrentPassageIndex(null);
    setReadingStartTime(null);
    setReadingEndTime(null);
  };

  const speakText = (text: string, language: 'en' | 'it' = 'it') => {
    speak(text, language);
  };

  const calculateReadingSpeed = () => {
    if (!readingStartTime || !readingEndTime || currentPassageIndex === null) return null;
    
    const passage = passages[currentPassageIndex];
    const readingTimeInSeconds = (readingEndTime.getTime() - readingStartTime.getTime()) / 1000;
    const wordsPerMinute = Math.round((passage.words / readingTimeInSeconds) * 60);
    
    return wordsPerMinute;
  };

  const renderPassageContent = (content: string, vocabulary: Record<string, string>) => {
    const words = content.split(/(\s+)/);
    
    return words.map((word, index) => {
      // Skip spaces
      if (/^\s+$/.test(word)) return word;
      
      // Clean word for lookup (remove punctuation)
      const cleanWord = word.toLowerCase().replace(/[.,;!?]$/g, '');
      
      // Check if the word is in the vocabulary
      const isInVocabulary = Object.keys(vocabulary).some(key => 
        key.toLowerCase() === cleanWord || key.toLowerCase().includes(cleanWord)
      );
      
      if (isInVocabulary) {
        return (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <span 
                className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" 
                onClick={() => handleWordClick(cleanWord)}
              >
                {word}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                <h4 className="font-medium">Translation</h4>
                <p>{findTranslation(cleanWord, vocabulary)}</p>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => speakText(word)}>
                    <VolumeUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      }
      
      return <span key={index}>{word}</span>;
    });
  };

  const findTranslation = (word: string, vocabulary: Record<string, string>) => {
    // First try direct match
    if (vocabulary[word]) return vocabulary[word];
    
    // Then try to find as part of a phrase
    const matchingKey = Object.keys(vocabulary).find(key => 
      key.toLowerCase().includes(word.toLowerCase())
    );
    
    return matchingKey ? `${matchingKey}: ${vocabulary[matchingKey]}` : '(No translation available)';
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Italian Reading Exercises</CardTitle>
          <CardDescription>
            Please log in to access reading exercises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to use the reading exercises.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading passages...</p>
      </div>
    );
  }

  if (currentPassageIndex !== null) {
    const passage = passages[currentPassageIndex];
    
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={handleBackToPassages}>
            ← Back to Passages
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={passage.level === 'beginner' ? 'outline' : (passage.level === 'intermediate' ? 'secondary' : 'destructive')}>
              {passage.level.charAt(0).toUpperCase() + passage.level.slice(1)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {passage.readingTime}s
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {passage.words} words
            </Badge>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>{passage.title}</CardTitle>
            <CardDescription>{passage.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Italian Text</h3>
                <Button variant="ghost" size="sm" onClick={() => speakText(passage.content)}>
                  <VolumeUp className="h-4 w-4 mr-2" /> Listen
                </Button>
              </div>
              
              <div 
                ref={contentRef} 
                className="prose dark:prose-invert max-w-none"
              >
                <p className="whitespace-pre-line">
                  {renderPassageContent(passage.content, passage.vocabulary)}
                </p>
              </div>
            </div>
            
            {(showTranslation || showResults) && (
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">English Translation</h3>
                  <Button variant="ghost" size="sm" onClick={() => speakText(passage.translation, 'en')}>
                    <VolumeUp className="h-4 w-4 mr-2" /> Listen
                  </Button>
                </div>
                <p className="whitespace-pre-line text-muted-foreground">
                  {passage.translation}
                </p>
              </div>
            )}
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Comprehension Questions</h3>
              {passage.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-medium">{index + 1}. {question.question}</h3>
                  <RadioGroup 
                    value={selectedAnswers[question.id] || ''}
                    onValueChange={(value) => handleAnswerSelect(question.id, value)}
                    className="space-y-2"
                  >
                    {question.options.map((option) => {
                      const isCorrect = option === question.correctAnswer;
                      const isSelected = selectedAnswers[question.id] === option;
                      const showCorrect = showResults && isCorrect;
                      const showIncorrect = showResults && isSelected && !isCorrect;
                      
                      return (
                        <div 
                          key={option} 
                          className={`
                            flex items-center rounded-md border p-3
                            ${showCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}
                            ${showIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
                          `}
                        >
                          <RadioGroupItem 
                            value={option} 
                            id={`${question.id}-${option}`}
                            disabled={showResults}
                          />
                          <Label 
                            htmlFor={`${question.id}-${option}`}
                            className="w-full ml-2 flex justify-between"
                          >
                            {option}
                            {showCorrect && <Check className="h-4 w-4 text-green-500" />}
                            {showIncorrect && <X className="h-4 w-4 text-red-500" />}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {showResults ? (
              <>
                <div className="text-sm">
                  <p className="font-medium">
                    Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                  </p>
                  <p className="text-muted-foreground">
                    Reading speed: {calculateReadingSpeed()} words per minute
                  </p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                  </Button>
                  <Button onClick={handleBackToPassages}>
                    Back to Passages
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  {showTranslation ? 'Hide Translation' : 'Show Translation'}
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={Object.keys(selectedAnswers).length < passage.questions.length}
                >
                  Submit Answers
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Italian Reading Exercises</h1>
          <p className="text-muted-foreground">
            Improve your reading comprehension and vocabulary
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {currentUsage} / {maxExercises} Exercises
          </Badge>
          {!isOnline && !isOfflineReady && (
            <Button onClick={enableOfflineAccess} disabled={!isOnline} variant="outline" size="sm">
              Enable Offline
            </Button>
          )}
        </div>
      </div>
      
      {isLimitReached && !user?.isPremium && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Daily Limit Reached</AlertTitle>
          <AlertDescription>
            You've reached your daily limit of {maxExercises} reading exercises. 
            <Button variant="link" className="p-0 h-auto font-normal">
              Upgrade to Premium
            </Button> for unlimited access.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {passages.map((passage, index) => (
          <Card key={passage.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{passage.title}</CardTitle>
                <Badge variant={passage.level === 'beginner' ? 'outline' : (passage.level === 'intermediate' ? 'secondary' : 'destructive')}>
                  {passage.level.charAt(0).toUpperCase() + passage.level.slice(1)}
                </Badge>
              </div>
              <CardDescription>{passage.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" /> 
                  <span>{passage.words} words</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>~{passage.readingTime}s</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => handleStartPassage(index)}
                disabled={isLimitReached && !user?.isPremium}
              >
                Start Reading
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReadingModule;
