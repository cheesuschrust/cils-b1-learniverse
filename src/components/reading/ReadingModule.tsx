
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Volume2, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface ReadingExercise {
  id: string;
  title: string;
  text: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const ReadingModule = () => {
  const { user } = useAuth();
  const isPremium = user?.isPremiumUser || false;
  
  const [currentExercise, setCurrentExercise] = useState<ReadingExercise | null>(null);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  
  // Mock exercises data
  const exercises: ReadingExercise[] = [
    {
      id: '1',
      title: 'La Cucina Italiana',
      text: `La cucina italiana è famosa in tutto il mondo. Ogni regione ha le sue specialità e tradizioni culinarie. Al nord, in Lombardia, è comune mangiare risotto e cotoletta alla milanese. In Emilia-Romagna, puoi gustare la pasta fresca come le tagliatelle al ragù e il parmigiano reggiano. Al centro, in Toscana, la bistecca alla fiorentina è molto popolare. Al sud, in Campania, Napoli è conosciuta per la sua pizza. In Sicilia, i dolci come il cannolo e la cassata sono deliziosi. Gli italiani adorano mangiare in compagnia, e il cibo è una parte importante della cultura italiana.`,
      questions: [
        {
          id: 'q1',
          question: 'Qual è il piatto tipico della Lombardia menzionato nel testo?',
          options: [
            'Pizza', 
            'Risotto e cotoletta alla milanese', 
            'Tagliatelle al ragù', 
            'Cannolo'
          ],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'In quale regione si trova Napoli?',
          options: ['Toscana', 'Sicilia', 'Lombardia', 'Campania'],
          correctAnswer: 3
        },
        {
          id: 'q3',
          question: 'Quali sono i dolci siciliani menzionati nel testo?',
          options: [
            'Tiramisù e panna cotta', 
            'Cotoletta e risotto', 
            'Cannolo e cassata', 
            'Pizza e pasta'
          ],
          correctAnswer: 2
        }
      ],
      difficulty: 'beginner'
    }
  ];
  
  // Load the first exercise on component mount
  React.useEffect(() => {
    if (exercises.length > 0) {
      setCurrentExercise(exercises[0]);
    }
  }, []);
  
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setHighlightedText(selection.toString());
    }
  };
  
  const handleSpeakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    window.speechSynthesis.speak(utterance);
  };
  
  const handleResponseChange = (questionId: string, optionIndex: number) => {
    setResponses(prev => ({ ...prev, [questionId]: optionIndex }));
  };
  
  const handleSubmit = () => {
    if (!currentExercise) return;
    
    let correctCount = 0;
    currentExercise.questions.forEach(question => {
      if (responses[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / currentExercise.questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
  };
  
  const handleNewExercise = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading a new exercise
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, just reset with the same exercise
      setSubmitted(false);
      setResponses({});
      setHighlightedText(null);
    }, 1500);
  };
  
  // Function to highlight text in the reading passage
  const renderHighlightedText = (text: string) => {
    if (!highlightedText) return text;
    
    const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === highlightedText?.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };
  
  if (!currentExercise) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Reading Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{currentExercise.title}</CardTitle>
                  <CardDescription>
                    Difficulty: <span className="capitalize">{currentExercise.difficulty}</span>
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSpeakText(currentExercise.text)}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Read Aloud
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                onMouseUp={handleTextSelection}
              >
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {renderHighlightedText(currentExercise.text)}
                </p>
              </div>
              
              {highlightedText && (
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSpeakText(highlightedText)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Speak Selected Text
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setHighlightedText(null)}
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Comprehension Questions</CardTitle>
              <CardDescription>
                Read the text and answer the following questions
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentExercise.questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <h3 className="font-medium">
                    {index + 1}. {question.question}
                  </h3>
                  
                  <RadioGroup
                    value={responses[question.id]?.toString()}
                    onValueChange={(value) => handleResponseChange(question.id, parseInt(value))}
                    disabled={submitted}
                  >
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`flex items-center space-x-2 p-2 rounded-md ${
                          submitted && question.correctAnswer === optIndex
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : submitted && responses[question.id] === optIndex && 
                              question.correctAnswer !== optIndex
                              ? 'bg-red-100 dark:bg-red-900/20'
                              : ''
                        }`}
                      >
                        <RadioGroupItem 
                          value={optIndex.toString()} 
                          id={`${question.id}-${optIndex}`} 
                        />
                        <Label htmlFor={`${question.id}-${optIndex}`} className="flex-grow cursor-pointer">
                          {option}
                        </Label>
                        
                        {submitted && question.correctAnswer === optIndex && (
                          <span className="text-green-600">✓</span>
                        )}
                        
                        {submitted && responses[question.id] === optIndex && 
                         question.correctAnswer !== optIndex && (
                          <span className="text-red-600">✗</span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4">
                {submitted ? (
                  <>
                    <div className="space-y-1">
                      <p className="font-medium">Your Score</p>
                      <div>
                        <span className="text-2xl font-bold">
                          {score}%
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({Object.values(responses).filter(
                            (response, index) => response === currentExercise.questions[index]?.correctAnswer
                          ).length}/{currentExercise.questions.length} correct)
                        </span>
                      </div>
                    </div>
                    
                    <Button onClick={handleNewExercise}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Try Another Passage'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={currentExercise.questions.length !== Object.keys(responses).length}
                  >
                    Submit Answers
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Read the passage carefully and answer the comprehension questions.
                You can highlight text to focus on specific parts or use the read-aloud feature.
              </p>
              
              <h3 className="font-medium text-sm">Reading Tips:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Look for the main idea in the first and last paragraphs</li>
                <li>Highlight unfamiliar words and try to understand them from context</li>
                <li>Use the "Read Aloud" feature to hear pronunciation</li>
                <li>Read all questions before starting to know what to look for</li>
                <li>Take notes of important details as you read</li>
              </ul>
              
              <div className="flex items-center gap-2 text-sm font-medium pt-2">
                <BookOpen className="h-4 w-4" />
                Reading Tools:
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-auto py-1 text-xs justify-start">
                  <Volume2 className="h-3 w-3 mr-1" /> Read Aloud
                </Button>
                <div className="text-xs text-muted-foreground flex items-center">
                  Listen to the text
                </div>
                
                <Button variant="outline" size="sm" className="h-auto py-1 text-xs justify-start">
                  Highlight Text
                </Button>
                <div className="text-xs text-muted-foreground flex items-center">
                  Select text to highlight
                </div>
              </div>
              
              {!isPremium && (
                <div className="p-4 mt-4 border rounded-md bg-primary/5">
                  <h4 className="text-sm font-medium">Free User Limit</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free users can access one reading passage per day.
                    Upgrade to Premium for unlimited reading exercises.
                  </p>
                  <Button className="w-full mt-2" size="sm">
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Premium Feature</DialogTitle>
            <DialogDescription>
              Free users can access one reading exercise per day.
              Upgrade to Premium for unlimited exercises and more features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <h4 className="font-medium">Premium Benefits:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Unlimited reading passages</li>
              <li>Access to all difficulty levels</li>
              <li>Dictionary integration for vocabulary</li>
              <li>Personalized reading recommendations</li>
              <li>Detailed performance analytics</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Not Now
            </Button>
            <Button>Upgrade to Premium</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReadingModule;
