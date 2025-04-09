
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, RefreshCw, Sparkles, Clock, Check, AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const topics = [
  "Travel and Tourism",
  "Food and Cooking",
  "Daily Life",
  "Work and Business",
  "Health and Wellness",
  "Technology",
  "Environment",
  "Arts and Entertainment",
  "Sports and Leisure",
  "Current Events"
];

const ReadingPractice = () => {
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState(50);
  const [timeLimit, setTimeLimit] = useState("10");
  const [generatingText, setGeneratingText] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [activeTab, setActiveTab] = useState("settings");
  const [showComprehensionQuestions, setShowComprehensionQuestions] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  // Mock comprehension questions
  const mockQuestions = [
    "What is the main idea of this passage?",
    "Which details support the main argument?",
    "What conclusion can you draw from the information presented?"
  ];
  
  const [activeQuestion, setActiveQuestion] = useState(mockQuestions[0]);
  
  const generateText = () => {
    if (!selectedTopic) {
      toast({
        title: "Topic required",
        description: "Please select a topic before generating a reading passage",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingText(true);
    
    // This is a mock implementation - in a real application, 
    // this would call an API to generate text based on the selected parameters
    setTimeout(() => {
      let difficultyLabel = "intermediate";
      if (difficulty < 33) difficultyLabel = "beginner";
      if (difficulty > 66) difficultyLabel = "advanced";
      
      // Mock generated text based on topic
      if (selectedTopic === "Food and Cooking") {
        setGeneratedText(`
          <h3>La Cucina Italiana: Una Tradizione Ricca di Sapori</h3>
          
          <p>La cucina italiana è conosciuta in tutto il mondo per la sua semplicità e per l'uso di ingredienti freschi e di alta qualità. Ogni regione dell'Italia ha le sue specialità culinarie, influenzate dalla geografia, dal clima e dalla storia locale.</p>
          
          <p>Al nord, in regioni come il Piemonte e la Lombardia, i piatti tendono ad essere più ricchi e sostanziosi, spesso a base di burro e carne. Il risotto alla milanese, con il suo caratteristico colore giallo dato dallo zafferano, è un esempio perfetto della tradizione culinaria lombarda.</p>
          
          <p>Nel centro Italia, in Toscana, Umbria e Lazio, l'olio d'oliva diventa l'ingrediente protagonista. Qui si trovano piatti come la bistecca alla fiorentina, una succulenta bistecca di manzo cotta alla griglia, o i pici all'aglione, un tipo di pasta fatta a mano servita con una salsa di pomodoro e aglio.</p>
          
          <p>Al sud, in Campania, Puglia, Calabria e Sicilia, il clima mediterraneo favorisce la coltivazione di pomodori, melanzane, peperoni e altri ortaggi che sono alla base di molti piatti tradizionali. La pizza napoletana, con il suo bordo alto e il centro sottile, è forse il piatto italiano più famoso al mondo.</p>
          
          <p>In tutta Italia, la pasta occupa un posto speciale nella tradizione culinaria. Esistono centinaia di forme diverse di pasta, ognuna ideata per accogliere al meglio specifici condimenti. Ad esempio, le pappardelle larghe sono perfette per sughi di carne ricchi, mentre i bucatini, simili agli spaghetti ma forati al centro, sono ideali per l'amatriciana.</p>
          
          <p>La cucina italiana non è solo cibo; è un'espressione culturale che riflette la storia e le tradizioni del paese. Ogni piatto racconta una storia di famiglia, di territorio e di passione per gli ingredienti di qualità.</p>
        `);
      } else if (selectedTopic === "Travel and Tourism") {
        setGeneratedText(`
          <h3>Esplorando le Meraviglie d'Italia</h3>
          
          <p>L'Italia, con il suo ricco patrimonio culturale, paesaggi mozzafiato e delizie culinarie, è una delle destinazioni turistiche più popolari al mondo. Da nord a sud, ogni regione offre esperienze uniche che attirano milioni di visitatori ogni anno.</p>
          
          <p>Roma, la Città Eterna, è un museo a cielo aperto. Il Colosseo, il Foro Romano e il Pantheon raccontano la storia dell'antica Roma, mentre la Città del Vaticano ospita la Basilica di San Pietro e i Musei Vaticani, dove si può ammirare la famosa Cappella Sistina di Michelangelo.</p>
          
          <p>Firenze, culla del Rinascimento, è una città che respira arte ad ogni angolo. La Galleria degli Uffizi, il Duomo e il Ponte Vecchio sono solo alcune delle attrazioni che rendono questa città toscana un paradiso per gli amanti dell'arte e della storia.</p>
          
          <p>Venezia, con i suoi canali, gondole e palazzi storici, offre un'esperienza unica. Piazza San Marco, il Palazzo Ducale e il ponte di Rialto sono simboli di una città che sembra galleggiare sull'acqua.</p>
          
          <p>Nel sud Italia, la Costiera Amalfitana con i suoi villaggi colorati aggrappati alle scogliere, e la Sicilia con i suoi templi greci, spiagge dorate e il maestoso vulcano Etna, offrono un mix perfetto di cultura, natura e relax.</p>
          
          <p>Per gli amanti della natura, le Dolomiti nel nord Italia offrono panorami alpini spettacolari, mentre i laghi di Como, Garda e Maggiore combinano acque cristalline con eleganti ville e giardini.</p>
          
          <p>Ogni regione italiana ha anche le sue tradizioni culinarie uniche. Dalla pizza napoletana ai risotti del nord, dal tartufo di Alba ai cannoli siciliani, il viaggio attraverso l'Italia è anche un viaggio gastronomico.</p>
        `);
      } else {
        // Generic text for other topics
        setGeneratedText(`
          <h3>L'Italia: Un Paese di Cultura e Tradizione</h3>
          
          <p>L'Italia è un paese ricco di storia, arte, cultura e tradizioni. Da nord a sud, ogni regione offre esperienze uniche che riflettono la diversità e la ricchezza del patrimonio italiano.</p>
          
          <p>La storia d'Italia è visibile nelle sue città antiche, nei monumenti e nei siti archeologici. Roma, con il Colosseo e il Foro Romano, racconta la storia dell'Impero Romano. Firenze, con i suoi palazzi rinascimentali e le sue gallerie d'arte, testimonia il periodo in cui l'Italia era al centro del Rinascimento europeo.</p>
          
          <p>La cultura italiana è nota in tutto il mondo per la sua arte, musica, letteratura e cinema. Artisti come Leonardo da Vinci, Michelangelo e Caravaggio, compositori come Verdi e Puccini, scrittori come Dante e Calvino, e registi come Fellini e Sorrentino hanno lasciato un'impronta indelebile nella cultura mondiale.</p>
          
          <p>Le tradizioni italiane sono profondamente radicate nella vita quotidiana. Dalle feste religiose alle sagre gastronomiche, dai carnevali ai festival musicali, gli italiani celebrano la loro cultura con passione e entusiasmo.</p>
          
          <p>La lingua italiana, con le sue melodie e sfumature, è considerata una delle più belle al mondo. È la lingua dell'opera, della poesia e dell'amore, ed è studiata da milioni di persone in tutto il mondo.</p>
          
          <p>Ma l'Italia non è solo passato; è anche un paese moderno e dinamico, leader in settori come la moda, il design, la gastronomia e l'innovazione tecnologica. Questa combinazione di tradizione e modernità è ciò che rende l'Italia un paese così affascinante e unico.</p>
        `);
      }
      
      setGeneratingText(false);
      setActiveTab("reading");
      setTimeRemaining(parseInt(timeLimit) * 60);
    }, 2000);
  };
  
  const startReading = () => {
    setIsReading(true);
    setTimerRunning(true);
    
    // Start the timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up the timer on component unmount
    return () => clearInterval(timer);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleQuestionSubmit = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer to the question",
        variant: "destructive"
      });
      return;
    }
    
    setFeedbackGiven(true);
    
    toast({
      title: "Answer submitted",
      description: "Your comprehension has been evaluated.",
    });
  };
  
  const resetPractice = () => {
    setGeneratedText("");
    setIsReading(false);
    setTimerRunning(false);
    setShowComprehensionQuestions(false);
    setUserAnswer("");
    setFeedbackGiven(false);
    setActiveTab("settings");
  };
  
  const finishReading = () => {
    setTimerRunning(false);
    setShowComprehensionQuestions(true);
  };
  
  const getDifficultyLabel = () => {
    if (difficulty < 33) return "Beginner";
    if (difficulty < 67) return "Intermediate";
    return "Advanced";
  };
  
  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/reading">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reading Exercises
        </Link>
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">Reading Practice Mode</h1>
      <p className="text-muted-foreground mb-6">Customize your reading practice experience</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          {generatedText && <TabsTrigger value="reading">Reading</TabsTrigger>}
          {showComprehensionQuestions && <TabsTrigger value="questions">Questions</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Settings</CardTitle>
              <CardDescription>Customize your reading practice experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger id="topic">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map(topic => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Difficulty Level</Label>
                  <span className="text-sm text-muted-foreground">{getDifficultyLabel()}</span>
                </div>
                <Slider
                  value={[difficulty]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([val]) => setDifficulty(val)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time Limit (minutes)</Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateText} 
                disabled={!selectedTopic || generatingText}
                className="w-full"
              >
                {generatingText ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Reading Passage
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reading" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Reading Passage</span>
                {isReading && (
                  <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={timeRemaining < 60 ? "text-red-500 font-medium" : ""}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {isReading ? 
                  "Read carefully to understand the main ideas and details" : 
                  "Click 'Start Reading' when you're ready to begin the timer"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedText }} />
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isReading ? (
                <Button onClick={startReading} className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Reading
                </Button>
              ) : (
                <Button 
                  onClick={finishReading}
                  className="w-full"
                  variant={timeRemaining === 0 ? "destructive" : "default"}
                >
                  {timeRemaining === 0 ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Time's up! Continue to Questions
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      I'm Done Reading
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprehension Questions</CardTitle>
              <CardDescription>Answer the following questions based on the passage you just read</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">{activeQuestion}</h3>
                
                <Textarea 
                  placeholder="Type your answer here..." 
                  className="min-h-[150px]"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={feedbackGiven}
                />
                
                {feedbackGiven && (
                  <Alert className="bg-green-50 border-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Good comprehension!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your answer demonstrates a solid understanding of the passage. You've identified the key points and provided relevant details.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {feedbackGiven ? (
                <Button onClick={resetPractice} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Another Practice
                </Button>
              ) : (
                <Button onClick={handleQuestionSubmit} disabled={!userAnswer.trim()} className="w-full">
                  Submit Answer
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Need more structured practice? Try our guided reading exercises.
        </p>
        <Button variant="outline" asChild>
          <Link to="/reading">View Reading Exercises</Link>
        </Button>
      </div>
    </div>
  );
};

export default ReadingPractice;
