
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Clock,
  Send,
  RotateCcw,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  Info,
  HelpCircle,
  Lightbulb,
  Pen,
} from "lucide-react";

// Sample writing prompts
const writingPrompts = [
  {
    id: 1,
    title: "La tua vita in Italia",
    prompt:
      "Scrivi un breve testo su come immagini la tua vita in Italia. Includi informazioni sulle città che vorresti visitare, il lavoro che vorresti fare, e le tradizioni italiane che ti interessano di più.",
    minWords: 50,
    maxWords: 150,
    example:
      "Immagino la mia vita in Italia piena di sole e cultura. Vorrei vivere a Firenze, una città ricca di storia e arte. Mi piacerebbe lavorare come insegnante di lingue o forse in un museo. Sono molto interessato alla tradizione culinaria italiana e vorrei imparare a cucinare piatti tipici come la pasta fatta in casa. Nei fine settimana, visiterei altre città come Roma, Venezia e Milano. L'idea di vivere in un paese con una storia così ricca e una cultura così vibrante mi entusiasma molto.",
  },
  {
    id: 2,
    title: "I diritti e i doveri dei cittadini",
    prompt:
      "Descrivi quali sono, secondo te, i principali diritti e doveri di un cittadino in una società democratica.",
    minWords: 50,
    maxWords: 150,
    example:
      "In una società democratica, ogni cittadino ha diritti fondamentali come la libertà di espressione, il diritto al voto, e l'accesso all'istruzione e alla sanità. Questi diritti sono essenziali per garantire una vita dignitosa. Allo stesso tempo, ci sono doveri importanti come rispettare le leggi, pagare le tasse, e partecipare attivamente alla vita civica. È un equilibrio delicato: godere delle libertà garantite dallo stato, ma anche contribuire al benessere collettivo. Credo che la partecipazione attiva sia particolarmente importante, poiché una democrazia funziona meglio quando i cittadini sono informati e impegnati nel processo democratico.",
  },
  {
    id: 3,
    title: "L'importanza della lingua italiana",
    prompt:
      "Spiega perché è importante imparare la lingua italiana per chi vuole ottenere la cittadinanza italiana. Quali vantaggi offre conoscere bene l'italiano?",
    minWords: 50,
    maxWords: 150,
    example:
      "Imparare l'italiano è fondamentale per chi desidera la cittadinanza italiana. Innanzitutto, permette di comunicare efficacemente nella vita quotidiana, facilitando l'integrazione nella società. Conoscere la lingua aiuta a trovare lavoro e a costruire relazioni sociali. Inoltre, l'italiano è la chiave per comprendere la ricca cultura italiana: la letteratura, il cinema, la musica. Dal punto di vista pratico, è necessario per gestire documenti ufficiali, partecipare alle elezioni e comprendere i propri diritti e doveri. Infine, parlare italiano dimostra rispetto per il paese e la sua cultura, un aspetto apprezzato nel processo di cittadinanza.",
  },
];

const Writing = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(writingPrompts[0]);
  const [userResponse, setUserResponse] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({
    score: 0,
    grammar: [],
    vocabulary: [],
    content: "",
    suggestions: "",
  });
  const [showExample, setShowExample] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const { toast } = useToast();
  
  // Calculate word count when response changes
  useEffect(() => {
    const words = userResponse.trim().split(/\s+/);
    setWordCount(userResponse.trim() === "" ? 0 : words.length);
  }, [userResponse]);
  
  // Timer functionality
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isTimerActive && timeLeft !== null && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isTimerActive && timeLeft === 0) {
      toast({
        title: "Time's up!",
        description: "Your time for this writing task has ended.",
        variant: "destructive",
      });
      setIsTimerActive(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerActive, timeLeft, toast]);
  
  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };
  
  // Change prompt
  const handlePromptChange = (promptId: number) => {
    if (isSubmitted) {
      toast({
        title: "Cannot change prompt",
        description:
          "You've already submitted your response. Reset to try a different prompt.",
        variant: "destructive",
      });
      return;
    }
    
    const newPrompt = writingPrompts.find((p) => p.id === promptId);
    if (newPrompt) {
      setSelectedPrompt(newPrompt);
      setUserResponse("");
      setIsSubmitted(false);
      setFeedback({
        score: 0,
        grammar: [],
        vocabulary: [],
        content: "",
        suggestions: "",
      });
      setShowExample(false);
    }
  };
  
  // Start timer (20 minutes)
  const startTimer = () => {
    setTimeLeft(20 * 60);
    setIsTimerActive(true);
    toast({
      title: "Timer started",
      description: "You have 20 minutes to complete this writing task.",
    });
  };
  
  // Reset timer
  const resetTimer = () => {
    setTimeLeft(null);
    setIsTimerActive(false);
    toast({
      title: "Timer reset",
      description: "The timer has been reset.",
    });
  };
  
  // Submit response
  const handleSubmit = () => {
    if (wordCount < selectedPrompt.minWords) {
      toast({
        title: "Too few words",
        description: `Your response should be at least ${selectedPrompt.minWords} words.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
    setIsTimerActive(false);
    
    // Mock AI feedback
    setTimeout(() => {
      // This would be replaced with actual API call to AI service
      const mockFeedback = {
        score: Math.floor(Math.random() * 3) + 3, // 3-5 out of 5
        grammar: [
          {
            original: userResponse.split(" ").slice(3, 6).join(" "),
            correction:
              "corrected version of " +
              userResponse.split(" ").slice(3, 6).join(" "),
            explanation: "Brief explanation of the grammar rule",
          },
        ],
        vocabulary: [
          {
            original: userResponse.split(" ").slice(8, 10).join(" "),
            suggestion: "better word choice",
            explanation: "Why this word choice is more appropriate",
          },
        ],
        content:
          "Your writing addresses the main points of the prompt effectively. The ideas are well-organized and show good understanding of the topic.",
        suggestions:
          "Try to use more advanced connectors between ideas. Consider expanding on your thoughts about cultural integration.",
      };
      
      setFeedback(mockFeedback);
      
      toast({
        title: "Feedback received",
        description: "AI has analyzed your writing and provided feedback.",
      });
    }, 2000);
  };
  
  // Reset everything
  const handleReset = () => {
    setUserResponse("");
    setIsSubmitted(false);
    setFeedback({
      score: 0,
      grammar: [],
      vocabulary: [],
      content: "",
      suggestions: "",
    });
    setShowExample(false);
    setTimeLeft(null);
    setIsTimerActive(false);
  };
  
  // Toggle example visibility
  const toggleExample = () => {
    setShowExample(!showExample);
  };
  
  // Render writing prompt card
  const renderPromptCard = () => (
    <Card className="w-full backdrop-blur-sm border-accent/20 animate-fade-up">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{selectedPrompt.title}</CardTitle>
            <CardDescription>Writing Exercise</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-1 rounded-md border text-sm"
              value={selectedPrompt.id}
              onChange={(e) => handlePromptChange(Number(e.target.value))}
              disabled={isSubmitted}
            >
              {writingPrompts.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.title}
                </option>
              ))}
            </select>
            
            {timeLeft === null ? (
              <Button
                variant="outline"
                size="sm"
                onClick={startTimer}
                className="flex items-center"
                disabled={isSubmitted}
              >
                <Clock className="h-4 w-4 mr-1" />
                Start Timer
              </Button>
            ) : (
              <Button
                variant={isTimerActive ? "default" : "outline"}
                size="sm"
                onClick={resetTimer}
                className="flex items-center"
                disabled={isSubmitted}
              >
                <Clock className="h-4 w-4 mr-1" />
                {isTimerActive
                  ? `Time: ${formatTime(timeLeft)}`
                  : "Reset Timer"}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExample}
              className="flex items-center"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              {showExample ? "Hide Example" : "Show Example"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Prompt:</h3>
          <p>{selectedPrompt.prompt}</p>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4 mr-1" />
            Write between {selectedPrompt.minWords} and {selectedPrompt.maxWords}{" "}
            words
          </div>
        </div>
        
        {showExample && (
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <h3 className="font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-1 text-primary" />
              Example Response:
            </h3>
            <p className="text-sm italic">{selectedPrompt.example}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="response" className="text-sm font-medium">
              Your Response:
            </label>
            <span
              className={`text-xs ${
                wordCount < selectedPrompt.minWords
                  ? "text-red-500"
                  : wordCount > selectedPrompt.maxWords
                  ? "text-amber-500"
                  : "text-green-500"
              }`}
            >
              {wordCount} / {selectedPrompt.minWords}-{selectedPrompt.maxWords}{" "}
              words
            </span>
          </div>
          <Textarea
            id="response"
            placeholder="Start writing your response here..."
            className="min-h-[200px] resize-y"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            disabled={isSubmitted}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex items-center"
          disabled={
            isSubmitted ||
            wordCount < selectedPrompt.minWords ||
            userResponse.trim() === ""
          }
        >
          <Send className="h-4 w-4 mr-1" />
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Render feedback card
  const renderFeedbackCard = () => (
    <Card className="w-full backdrop-blur-sm border-accent/20 mt-8 animate-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          Writing Feedback
        </CardTitle>
        <CardDescription>
          AI-powered feedback on your writing response
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg">
          <div className="flex items-center">
            <Award className="h-6 w-6 text-primary mr-2" />
            <div>
              <h3 className="font-medium">Overall Score</h3>
              <p className="text-sm text-muted-foreground">
                Based on grammar, vocabulary, and content
              </p>
            </div>
          </div>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center mx-1 ${
                  index < feedback.score
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grammar Corrections */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center">
              <Pen className="h-4 w-4 mr-2 text-primary" />
              Grammar & Structure
            </h3>
            {feedback.grammar.length > 0 ? (
              <div className="space-y-3">
                {feedback.grammar.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-secondary/30 rounded-lg text-sm"
                  >
                    <div className="flex items-start">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="line-through">{item.original}</p>
                        <p className="text-green-600 mt-1">{item.correction}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No major grammar issues detected.
              </div>
            )}
          </div>
          
          {/* Vocabulary Suggestions */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Vocabulary & Word Choice
            </h3>
            {feedback.vocabulary.length > 0 ? (
              <div className="space-y-3">
                {feedback.vocabulary.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-secondary/30 rounded-lg text-sm"
                  >
                    <div className="flex items-start">
                      <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p>
                          Consider replacing "
                          <span className="italic">{item.original}</span>" with "
                          <span className="text-primary font-medium">
                            {item.suggestion}
                          </span>
                          "
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Your vocabulary usage is appropriate for this level.
              </div>
            )}
          </div>
        </div>
        
        {/* Content Analysis */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
            Content Analysis
          </h3>
          <div className="p-4 bg-accent/10 rounded-lg text-sm">
            <p>{feedback.content}</p>
          </div>
        </div>
        
        {/* Improvement Suggestions */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-primary" />
            Suggestions for Improvement
          </h3>
          <div className="p-4 bg-accent/10 rounded-lg text-sm">
            <p>{feedback.suggestions}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Another Prompt
        </Button>
        <Button>Download Feedback</Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in">
        Writing Practice
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Improve your Italian writing skills with guided exercises
      </p>
      
      {renderPromptCard()}
      {isSubmitted && renderFeedbackCard()}
    </div>
  );
};

export default Writing;
