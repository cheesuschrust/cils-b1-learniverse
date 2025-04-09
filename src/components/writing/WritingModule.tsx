
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const WRITING_PROMPTS = [
  {
    id: 1,
    title: "Mi presento",
    description: "Scrivi un'email ad un amico italiano per presentarti. Includi informazioni su di te, la tua famiglia, i tuoi interessi e chiedi informazioni sul tuo amico.",
    minWords: 80,
    maxWords: 120,
    level: "B1",
    example: "Caro Marco,\n\nMi chiamo Elena e sono una studentessa americana. Ho 22 anni e studio lingue all'università. La mia famiglia è composta da mia madre, mio padre e mio fratello minore. Nei miei tempi liberi mi piace leggere, ascoltare musica e fare escursioni. Sto imparando l'italiano perché..."
  },
  {
    id: 2,
    title: "Un viaggio memorabile",
    description: "Descrivi un viaggio che hai fatto di recente. Dove sei andato/a? Cosa hai visto? Quali esperienze hai avuto?",
    minWords: 100,
    maxWords: 150,
    level: "B1",
    example: "L'estate scorsa ho visitato Roma per la prima volta. È stata un'esperienza indimenticabile. La città è ricca di storia e cultura, con monumenti antichi ad ogni angolo. Ho visitato il Colosseo, i Musei Vaticani e la Fontana di Trevi. Il cibo era delizioso e..."
  },
  {
    id: 3,
    title: "Il mio quartiere",
    description: "Descrivi il quartiere in cui vivi. Com'è? Cosa c'è? Cosa ti piace e cosa non ti piace del tuo quartiere?",
    minWords: 90,
    maxWords: 130,
    level: "B1",
    example: "Vivo in un quartiere tranquillo nella zona est della città. È un'area residenziale con molte case a due piani e piccoli giardini. Ci sono diversi parchi dove posso fare jogging la mattina. Nel centro del quartiere c'è una piazza con alcuni negozi, un supermercato e un paio di caffè. Mi piace la tranquillità, ma..."
  }
];

// Simulated AI feedback for demo purposes
const SIMULATED_FEEDBACK = [
  "Buon uso dei tempi verbali. Hai utilizzato correttamente il passato prossimo e l'imperfetto.",
  "Buona struttura generale del testo. I paragrafi sono ben organizzati.",
  "Attenzione all'accordo tra aggettivi e sostantivi. Ricorda che in italiano gli aggettivi devono concordare in genere e numero con i sostantivi.",
  "Potresti ampliare il tuo vocabolario utilizzando sinonimi per evitare ripetizioni.",
  "Fai attenzione alle preposizioni, specialmente con i verbi di movimento.",
  "Buon uso dei connettivi per collegare le frasi."
];

const WritingModule: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [userText, setUserText] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handlePromptSelect = (promptId: number) => {
    setSelectedPrompt(promptId);
    setUserText('');
    setShowExample(false);
    setFeedback([]);
    setConfidenceScore(null);
    setSkillLevels({});
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getWordCountColor = () => {
    if (!selectedPrompt) return "text-muted-foreground";
    
    const prompt = WRITING_PROMPTS.find(p => p.id === selectedPrompt);
    if (!prompt) return "text-muted-foreground";
    
    const wordCount = countWords(userText);
    
    if (wordCount < prompt.minWords) return "text-yellow-500";
    if (wordCount > prompt.maxWords) return "text-red-500";
    return "text-green-500";
  };

  const handleAnalyze = () => {
    if (!selectedPrompt) return;
    
    const prompt = WRITING_PROMPTS.find(p => p.id === selectedPrompt);
    if (!prompt) return;
    
    const wordCount = countWords(userText);
    
    if (wordCount < prompt.minWords) {
      toast({
        title: "Too few words",
        description: `Your text has ${wordCount} words. Please write at least ${prompt.minWords} words.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Select random feedback points (3-5)
      const randomFeedback = [...SIMULATED_FEEDBACK]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3);
      
      // Generate random skill levels
      const skills = {
        'Grammar': Math.random() * 0.3 + 0.6, // 60-90%
        'Vocabulary': Math.random() * 0.3 + 0.6, // 60-90%
        'Coherence': Math.random() * 0.3 + 0.6, // 60-90%
        'Task Completion': Math.random() * 0.2 + 0.7 // 70-90%
      };
      
      // Calculate overall confidence score (weighted average)
      const overallScore = (
        skills['Grammar'] * 0.3 +
        skills['Vocabulary'] * 0.3 +
        skills['Coherence'] * 0.2 +
        skills['Task Completion'] * 0.2
      ) * 100;
      
      setFeedback(randomFeedback);
      setSkillLevels(skills);
      setConfidenceScore(Math.round(overallScore));
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Your text has been analyzed with a confidence level of ${Math.round(overallScore)}%.`,
      });
    }, 2000);
  };

  const handleSave = () => {
    toast({
      title: "Writing Saved",
      description: "Your writing has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!feedback.length}>Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="space-y-4 mt-4">
          {!selectedPrompt ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Select a writing prompt to start your exercise.</p>
              <Button onClick={() => document.querySelector('[value="prompts"]')?.dispatchEvent(new Event('click'))}>
                Browse Writing Prompts
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{WRITING_PROMPTS.find(p => p.id === selectedPrompt)?.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {WRITING_PROMPTS.find(p => p.id === selectedPrompt)?.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    Level: {WRITING_PROMPTS.find(p => p.id === selectedPrompt)?.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowExample(!showExample)}
                  >
                    {showExample ? "Hide Example" : "Show Example"}
                  </Button>
                </div>
                
                {showExample && (
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <p className="italic text-muted-foreground whitespace-pre-line">
                      {WRITING_PROMPTS.find(p => p.id === selectedPrompt)?.example}
                    </p>
                  </div>
                )}
                
                <Textarea
                  placeholder="Start writing here..."
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  className="min-h-[200px]"
                />
                
                <div className="flex justify-between items-center mt-2">
                  <span className={getWordCountColor()}>
                    Words: {countWords(userText)} / 
                    {WRITING_PROMPTS.find(p => p.id === selectedPrompt)?.minWords}-
                    {WRITING_PROMPTS.find(p => p.id === selectedPrompt)?.maxWords}
                  </span>
                  
                  {confidenceScore !== null && (
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Overall Score:</span>
                      <Badge variant={confidenceScore >= 70 ? "default" : "outline"}>
                        {confidenceScore}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleSave}
                  disabled={countWords(userText) === 0}
                >
                  Save Draft
                </Button>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={countWords(userText) === 0 || isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="prompts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WRITING_PROMPTS.map((prompt) => (
              <Card 
                key={prompt.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedPrompt === prompt.id ? 'border-primary' : ''}`}
                onClick={() => handlePromptSelect(prompt.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription>
                    Level: {prompt.level} | Words: {prompt.minWords}-{prompt.maxWords}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.description}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePromptSelect(prompt.id);
                      setTimeout(() => {
                        document.querySelector('[value="write"]')?.dispatchEvent(new Event('click'));
                      }, 100);
                    }}
                  >
                    Start Writing
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-4">
          {feedback.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    AI assessment of your writing skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Overall Score</h3>
                      <div className="flex items-center space-x-2">
                        <Progress value={confidenceScore || 0} className="w-full" />
                        <span className="text-sm font-medium">{confidenceScore}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Skills Breakdown</h3>
                      <div className="space-y-3">
                        {Object.entries(skillLevels).map(([skill, level]) => (
                          <div key={skill} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{skill}</span>
                              <span>{Math.round(level * 100)}%</span>
                            </div>
                            <Progress value={level * 100} className="w-full h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Feedback</h3>
                      <ul className="space-y-2">
                        {feedback.map((item, index) => (
                          <li key={index} className="text-sm">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback</CardTitle>
                  <CardDescription>
                    Detailed analysis of your writing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={`Ecco un'analisi del tuo testo:

${feedback.join('\n\n')}

Continua a esercitarti e vedrai miglioramenti nella tua scrittura in italiano. Ricorda di leggere regolarmente testi in italiano per arricchire il tuo vocabolario.`}
                    readOnly
                    className="min-h-[200px]"
                  />
                  <Button className="mt-4" variant="outline" onClick={() => document.querySelector('[value="write"]')?.dispatchEvent(new Event('click'))}>
                    Back to Writing
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WritingModule;
