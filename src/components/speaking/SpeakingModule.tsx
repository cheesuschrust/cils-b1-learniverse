
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, PlayCircle, Check, RefreshCcw, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SpeakingConfidenceIndicator } from '@/components/speaking/SpeakingConfidenceIndicator';
import { trackProgress } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Basic speaking exercise
const basicPhrases = [
  { italian: 'Buongiorno, come stai?', english: 'Good morning, how are you?', difficulty: 1 },
  { italian: 'Mi chiamo Mario. E tu?', english: 'My name is Mario. And you?', difficulty: 1 },
  { italian: 'Piacere di conoscerti.', english: 'Nice to meet you.', difficulty: 1 },
  { italian: 'Vorrei un caffè, per favore.', english: 'I would like a coffee, please.', difficulty: 2 },
  { italian: 'Dov\'è la stazione?', english: 'Where is the station?', difficulty: 2 },
  { italian: 'Quanto costa questo?', english: 'How much does this cost?', difficulty: 2 },
  { italian: 'Potrebbe parlare più lentamente?', english: 'Could you speak more slowly?', difficulty: 3 },
  { italian: 'Sono in Italia per studiare.', english: 'I am in Italy to study.', difficulty: 3 },
  { italian: 'Ho bisogno di aiuto con il mio italiano.', english: 'I need help with my Italian.', difficulty: 3 },
];

// CILS B1 citizenship phrases
const citizenshipPhrases = [
  { italian: 'Vorrei richiedere la cittadinanza italiana.', english: 'I would like to apply for Italian citizenship.', difficulty: 2 },
  { italian: 'I miei nonni erano italiani.', english: 'My grandparents were Italian.', difficulty: 1 },
  { italian: 'Ho vissuto in Italia per più di dieci anni.', english: 'I have lived in Italy for more than ten years.', difficulty: 3 },
  { italian: 'Conosco la Costituzione italiana.', english: 'I know the Italian Constitution.', difficulty: 3 },
  { italian: 'Ho superato l\'esame di lingua italiana.', english: 'I passed the Italian language exam.', difficulty: 3 },
  { italian: 'Dove posso trovare informazioni sui miei diritti?', english: 'Where can I find information about my rights?', difficulty: 3 },
];

export const SpeakingModule = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(basicPhrases[0]);
  const [transcription, setTranscription] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [speechSpeed, setSpeechSpeed] = useState(0.8);
  const [selectedTab, setSelectedTab] = useState('basic');
  const [isCitizenshipMode, setIsCitizenshipMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Set phrases based on selected tab
    setIsCitizenshipMode(selectedTab === 'citizenship');
    setCurrentPhrase(selectedTab === 'basic' ? basicPhrases[0] : citizenshipPhrases[0]);
  }, [selectedTab]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscription('');
    
    // Simulate recording and speech recognition
    toast({
      title: "Recording started",
      description: "Speak clearly into your microphone",
    });
    
    // Mock recording (will replace with real Web Speech API)
    setTimeout(() => {
      handleStopRecording();
    }, 5000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Processing your speech...",
    });
    
    // Mock speech recognition result with random accuracy
    setTimeout(() => {
      // Simulate transcription with varying accuracy
      const accuracy = Math.random();
      const perfectTranscription = currentPhrase.italian;
      
      let simulatedTranscription;
      if (accuracy > 0.8) {
        // Almost perfect transcription
        simulatedTranscription = perfectTranscription;
      } else if (accuracy > 0.5) {
        // Small errors (e.g., missing/wrong accent)
        simulatedTranscription = perfectTranscription
          .replace('è', 'e')
          .replace('ò', 'o')
          .replace('à', 'a');
      } else {
        // More significant errors (missing words)
        const words = perfectTranscription.split(' ');
        const randomIndex = Math.floor(Math.random() * words.length);
        words.splice(randomIndex, 1);
        simulatedTranscription = words.join(' ');
      }
      
      setTranscription(simulatedTranscription);
      const score = Math.floor(accuracy * 100);
      setConfidenceScore(score);
      
      // Save progress if user is logged in
      if (user) {
        trackProgress({
          user_id: user.id,
          content_id: isCitizenshipMode ? 'citizenship-speaking' : 'basic-speaking',
          score: score,
          completed: true,
          progress_percentage: 100,
          time_spent: 5,
        }).catch(console.error);
      }
    }, 1000);
  };

  const playAudio = () => {
    toast({
      title: "Playing audio",
      description: "Listen carefully to the pronunciation",
    });
    
    // In a real implementation, this would use Web Speech API for TTS
    // For now we'll just show a toast
  };

  const getNextPhrase = () => {
    const currentPhrases = isCitizenshipMode ? citizenshipPhrases : basicPhrases;
    const currentIndex = currentPhrases.findIndex(p => p.italian === currentPhrase.italian);
    const nextIndex = (currentIndex + 1) % currentPhrases.length;
    setCurrentPhrase(currentPhrases[nextIndex]);
    setTranscription('');
    setConfidenceScore(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Speaking Practice</CardTitle>
            <CardDescription>
              Practice your Italian pronunciation with these phrases
            </CardDescription>
          </div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="basic">Basic Phrases</TabsTrigger>
              <TabsTrigger value="citizenship">Citizenship</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-1">
              <div className="text-sm font-medium">Difficulty Level</div>
              <div className="flex items-center">
                {Array.from({ length: currentPhrase.difficulty }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary mr-1"></div>
                ))}
                {Array.from({ length: 3 - currentPhrase.difficulty }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-muted mr-1"></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Speech Speed:</span>
              <Slider
                className="w-24"
                min={0.5}
                max={1.5}
                step={0.1}
                value={[speechSpeed]}
                onValueChange={(values) => setSpeechSpeed(values[0])}
              />
              <span className="text-sm">{speechSpeed}x</span>
            </div>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-lg font-medium">{currentPhrase.italian}</p>
                <p className="text-sm text-muted-foreground">{currentPhrase.english}</p>
              </div>
              <Button variant="outline" size="sm" onClick={playAudio}>
                <Volume2 className="h-4 w-4 mr-2" />
                Listen
              </Button>
            </div>
            
            {transcription && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Your pronunciation:</div>
                <div className={`p-3 rounded-md ${
                  confidenceScore > 80 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                  confidenceScore > 60 ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' :
                  'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {transcription}
                </div>
              </div>
            )}
          </div>
          
          {confidenceScore > 0 && (
            <div className="space-y-2">
              <SpeakingConfidenceIndicator confidenceScore={confidenceScore} cils_level="B1" />
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                {confidenceScore >= 80 ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <Check className="h-3 w-3 mr-1" /> Excellent pronunciation
                  </Badge>
                ) : confidenceScore >= 60 ? (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    Good attempt
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    Needs practice
                  </Badge>
                )}
                
                <span className="text-xs">CILS B1 aligned</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant={isRecording ? "destructive" : "default"}
          className="w-full sm:w-auto"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={getNextPhrase}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Next Phrase
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpeakingModule;
