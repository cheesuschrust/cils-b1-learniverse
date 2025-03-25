
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { FlashcardPronunciation } from '@/components/flashcards/FlashcardPronunciation';
import { Mic, Volume, Play, Pause, Loader2, RefreshCcw, XCircle, CheckCircle, Info, VolumeX, AlertCircle } from 'lucide-react';
import SpeakableWord from '@/components/learning/SpeakableWord';

// Interfaces for speaking exercises
interface ConversationPrompt {
  id: string;
  prompt: string;
  response: string;
  translation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface PronunciationChallenge {
  id: string;
  text: string;
  translation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
}

interface PracticePhrase {
  id: string;
  phrase: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

// Mock data for speaking exercises
const PRACTICE_PHRASES: PracticePhrase[] = [
  { id: '1', phrase: 'Buongiorno, come stai?', translation: 'Good morning, how are you?', difficulty: 'beginner', category: 'Greetings' },
  { id: '2', phrase: 'Mi chiamo Marco. E tu?', translation: 'My name is Marco. And you?', difficulty: 'beginner', category: 'Introductions' },
  { id: '3', phrase: 'Quanto costa questo?', translation: 'How much does this cost?', difficulty: 'beginner', category: 'Shopping' },
  { id: '4', phrase: 'Dov\'è la stazione?', translation: 'Where is the station?', difficulty: 'beginner', category: 'Directions' },
  { id: '5', phrase: 'Un tavolo per due, per favore.', translation: 'A table for two, please.', difficulty: 'beginner', category: 'Restaurant' },
  { id: '6', phrase: 'Potrei avere il conto, per favore?', translation: 'Could I have the bill, please?', difficulty: 'intermediate', category: 'Restaurant' },
  { id: '7', phrase: 'Scusi, può parlare più lentamente?', translation: 'Excuse me, can you speak more slowly?', difficulty: 'intermediate', category: 'Communication' },
  { id: '8', phrase: 'Secondo me, il film era molto interessante.', translation: 'In my opinion, the movie was very interesting.', difficulty: 'intermediate', category: 'Opinion' },
  { id: '9', phrase: 'Mi piacerebbe visitare il museo domani.', translation: 'I would like to visit the museum tomorrow.', difficulty: 'intermediate', category: 'Tourism' },
  { id: '10', phrase: 'Se avessi più tempo, studierei di più.', translation: 'If I had more time, I would study more.', difficulty: 'advanced', category: 'Conditional' },
  { id: '11', phrase: 'Nonostante la pioggia, siamo andati a fare una passeggiata.', translation: 'Despite the rain, we went for a walk.', difficulty: 'advanced', category: 'Weather' },
  { id: '12', phrase: 'Ti consiglierei di provare la cucina locale.', translation: 'I would recommend you try the local cuisine.', difficulty: 'advanced', category: 'Recommendations' },
];

const PRONUNCIATION_CHALLENGES: PronunciationChallenge[] = [
  { id: '1', text: 'Gli gnocchi sono deliziosi.', translation: 'The gnocchi are delicious.', difficulty: 'beginner' },
  { id: '2', text: 'Scienza, coscienza, conoscenza.', translation: 'Science, conscience, knowledge.', difficulty: 'intermediate' },
  { id: '3', text: 'Cinque minuti in silenzio.', translation: 'Five minutes in silence.', difficulty: 'beginner' },
  { id: '4', text: 'Un bicchiere d\'acqua, per favore.', translation: 'A glass of water, please.', difficulty: 'beginner' },
  { id: '5', text: 'Il cioccolato è la mia debolezza.', translation: 'Chocolate is my weakness.', difficulty: 'intermediate' },
  { id: '6', text: 'La famiglia è importante nella cultura italiana.', translation: 'Family is important in Italian culture.', difficulty: 'intermediate' },
  { id: '7', text: 'Gli spaghetti aglio e olio sono un piatto tradizionale.', translation: 'Spaghetti with garlic and oil is a traditional dish.', difficulty: 'intermediate' },
  { id: '8', text: 'Bisogna attraversare il ponte per arrivare al centro.', translation: 'You need to cross the bridge to reach the center.', difficulty: 'advanced' },
  { id: '9', text: 'L\'architetto ha progettato un edificio straordinario.', translation: 'The architect designed an extraordinary building.', difficulty: 'advanced' },
  { id: '10', text: 'Il proprietario dell\'appartamento ha chiesto una caparra.', translation: 'The apartment owner asked for a deposit.', difficulty: 'advanced' },
];

const CONVERSATION_PROMPTS: ConversationPrompt[] = [
  { 
    id: '1', 
    prompt: 'Chiedi informazioni su un ristorante.', 
    response: 'Mi può consigliare un buon ristorante qui vicino?', 
    translation: 'Could you recommend a good restaurant nearby?',
    difficulty: 'beginner' 
  },
  { 
    id: '2', 
    prompt: 'Ordina un caffè in un bar.', 
    response: 'Buongiorno, vorrei un caffè, per favore.', 
    translation: 'Good morning, I would like a coffee, please.',
    difficulty: 'beginner' 
  },
  { 
    id: '3', 
    prompt: 'Chiedi a qualcuno come sta.', 
    response: 'Ciao, come stai oggi?', 
    translation: 'Hi, how are you today?',
    difficulty: 'beginner' 
  },
  { 
    id: '4', 
    prompt: 'Prenota una camera d\'albergo per tre notti.', 
    response: 'Buongiorno, vorrei prenotare una camera per tre notti, a partire da venerdì prossimo.', 
    translation: 'Good morning, I would like to book a room for three nights, starting from next Friday.',
    difficulty: 'intermediate' 
  },
  { 
    id: '5', 
    prompt: 'Descrivi il tuo film preferito.', 
    response: 'Il mio film preferito è un thriller ambientato a Roma. Ha un finale sorprendente e attori molto bravi.', 
    translation: 'My favorite movie is a thriller set in Rome. It has a surprising ending and very good actors.',
    difficulty: 'intermediate' 
  },
  { 
    id: '6', 
    prompt: 'Spiega come arrivare dalla stazione al centro città.', 
    response: 'Per arrivare al centro dalla stazione, prendi l\'autobus numero 7 e scendi dopo tre fermate. Poi gira a destra e cammina per cinque minuti.', 
    translation: 'To get to the center from the station, take bus number 7 and get off after three stops. Then turn right and walk for five minutes.',
    difficulty: 'intermediate' 
  },
  { 
    id: '7', 
    prompt: 'Racconta cosa hai fatto durante le ultime vacanze.', 
    response: 'Durante le mie ultime vacanze, ho visitato le Dolomiti. Ho fatto escursioni ogni giorno, ho mangiato piatti tipici e ho scattato molte fotografie. È stata un\'esperienza indimenticabile.', 
    translation: 'During my last vacation, I visited the Dolomites. I went hiking every day, ate typical dishes, and took many photographs. It was an unforgettable experience.',
    difficulty: 'advanced' 
  },
  { 
    id: '8', 
    prompt: 'Esprimi la tua opinione sui cambiamenti climatici.', 
    response: 'Ritengo che i cambiamenti climatici rappresentino una delle sfide più urgenti del nostro tempo. È necessario che governi, aziende e cittadini collaborino per ridurre le emissioni di gas serra e trovare soluzioni sostenibili.', 
    translation: 'I believe that climate change represents one of the most urgent challenges of our time. Governments, companies, and citizens need to collaborate to reduce greenhouse gas emissions and find sustainable solutions.',
    difficulty: 'advanced' 
  },
  { 
    id: '9', 
    prompt: 'Descrivi quali sono i vantaggi e gli svantaggi dello smart working.', 
    response: 'Lo smart working offre maggiore flessibilità e risparmio di tempo negli spostamenti, ma può anche portare a un senso di isolamento e difficoltà nel separare vita privata e professionale. Un approccio ibrido potrebbe essere la soluzione ottimale.', 
    translation: 'Smart working offers greater flexibility and time savings in commuting, but it can also lead to a sense of isolation and difficulty in separating private and professional life. A hybrid approach could be the optimal solution.',
    difficulty: 'advanced' 
  },
];

const SpeakingPage: React.FC = () => {
  const { toast } = useToast();
  const { 
    isAIEnabled, 
    speakText, 
    isSpeaking, 
    processAudioStream, 
    stopAudioProcessing, 
    isTranscribing, 
    hasActiveMicrophone, 
    checkMicrophoneAccess 
  } = useAIUtils();
  
  // State for speaking practice
  const [practiceMode, setPracticeMode] = useState<'phrases' | 'pronunciation' | 'conversation'>('phrases');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [similarities, setSimilarities] = useState<{score: number, feedback: string} | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [micAccessError, setMicAccessError] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.8);
  const [stopRecordingFunc, setStopRecordingFunc] = useState<(() => void) | null>(null);
  
  // References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Check microphone access on mount
  useEffect(() => {
    const checkMic = async () => {
      try {
        const hasMic = await checkMicrophoneAccess();
        setMicAccessError(hasMic ? null : 'Microphone access required for speaking practice.');
      } catch (error) {
        console.error('Microphone check error:', error);
        setMicAccessError('Error accessing microphone. Please ensure microphone permissions are granted.');
      }
    };
    
    checkMic();
  }, [checkMicrophoneAccess]);
  
  // Filter items based on difficulty
  const filteredItems = useCallback(() => {
    switch (practiceMode) {
      case 'phrases':
        return PRACTICE_PHRASES.filter(phrase => phrase.difficulty === difficulty);
      case 'pronunciation':
        return PRONUNCIATION_CHALLENGES.filter(challenge => challenge.difficulty === difficulty);
      case 'conversation':
        return CONVERSATION_PROMPTS.filter(prompt => prompt.difficulty === difficulty);
      default:
        return [];
    }
  }, [practiceMode, difficulty]);
  
  // Update current item index if we switch modes or difficulty
  useEffect(() => {
    setCurrentItemIndex(0);
    setSimilarities(null);
    setTranscribedText('');
  }, [practiceMode, difficulty]);
  
  // Get current item
  const currentItem = filteredItems()[currentItemIndex];
  
  // Speak the current phrase
  const handleSpeak = async () => {
    if (!currentItem) return;
    
    try {
      const textToSpeak = practiceMode === 'phrases' 
        ? (currentItem as PracticePhrase).phrase 
        : practiceMode === 'pronunciation' 
          ? (currentItem as PronunciationChallenge).text 
          : (currentItem as ConversationPrompt).response;
          
      await speakText(textToSpeak, 'it-IT');
    } catch (error) {
      console.error('Speech error:', error);
      toast({
        title: 'Speech Error',
        description: 'Unable to speak the text. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Start recording
  const handleStartRecording = async () => {
    if (!isAIEnabled) {
      toast({
        title: 'Feature Disabled',
        description: 'AI features are required for speech recognition. Please enable them in settings.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!hasActiveMicrophone) {
      toast({
        title: 'Microphone Required',
        description: 'Please ensure you have a working microphone and have granted permission.',
        variant: 'destructive',
      });
      return;
    }
    
    setTranscribedText('');
    setSimilarities(null);
    setIsRecording(true);
    
    try {
      const stopFunc = await processAudioStream((text, isFinal) => {
        setTranscribedText(text);
        
        if (isFinal) {
          // Compare the transcribed text with the expected text
          evaluatePronunciation(text);
        }
      });
      
      setStopRecordingFunc(() => stopFunc);
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (stopFunc && isRecording) {
          stopFunc();
          setIsRecording(false);
          setStopRecordingFunc(null);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      
      toast({
        title: 'Recording Error',
        description: error instanceof Error ? error.message : 'Failed to start recording',
        variant: 'destructive',
      });
    }
  };
  
  // Stop recording
  const handleStopRecording = () => {
    if (stopRecordingFunc) {
      stopRecordingFunc();
    } else {
      stopAudioProcessing();
    }
    
    setIsRecording(false);
    setStopRecordingFunc(null);
  };
  
  // Next phrase
  const handleNextPhrase = () => {
    if (currentItemIndex < filteredItems().length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setTranscribedText('');
      setSimilarities(null);
    } else {
      // Loop back to first phrase
      setCurrentItemIndex(0);
      setTranscribedText('');
      setSimilarities(null);
      
      toast({
        title: 'Practice Complete',
        description: 'You have completed all phrases in this category!',
      });
    }
  };
  
  // Previous phrase
  const handlePrevPhrase = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
      setTranscribedText('');
      setSimilarities(null);
    }
  };
  
  // Calculate similarity between spoken text and expected text
  const evaluatePronunciation = (spokenText: string) => {
    if (!currentItem) return;
    
    const expectedText = practiceMode === 'phrases' 
      ? (currentItem as PracticePhrase).phrase
      : practiceMode === 'pronunciation' 
        ? (currentItem as PronunciationChallenge).text 
        : (currentItem as ConversationPrompt).response;
    
    // Convert both to lowercase and remove punctuation
    const cleanExpected = expectedText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const cleanSpoken = spokenText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    
    // Simple similarity score based on Levenshtein distance
    const similarity = calculateSimilarity(cleanExpected, cleanSpoken);
    const score = Math.min(Math.round(similarity * 100), 100);
    
    let feedback: string;
    if (score >= 90) {
      feedback = "Eccellente! La tua pronuncia è perfetta.";
    } else if (score >= 70) {
      feedback = "Molto bene! La tua pronuncia è buona, con piccole imperfezioni.";
    } else if (score >= 50) {
      feedback = "Abbastanza bene. Continua a esercitarti per migliorare.";
    } else {
      feedback = "Prova ancora. Ascolta attentamente la pronuncia corretta e prova di nuovo.";
    }
    
    setSimilarities({ score, feedback });
    
    // Auto advance to next phrase if enabled and score is good
    if (autoAdvance && score >= 70) {
      setTimeout(() => {
        handleNextPhrase();
      }, 1500);
    }
  };
  
  // Calculate text similarity (Levenshtein distance based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    
    const distance = track[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  };
  
  // Get score badge color
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 70) return 'bg-yellow-500 text-white';
    if (score >= 50) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Speaking Practice</h1>
          <p className="text-muted-foreground">Practice your pronunciation and speaking skills</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConfidenceIndicator contentType="speaking" />
        </div>
      </header>
      
      {micAccessError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{micAccessError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice Settings</CardTitle>
              <CardDescription>
                Customize your speaking practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="practice-mode">Practice Mode</Label>
                <Select 
                  value={practiceMode} 
                  onValueChange={(value) => setPracticeMode(value as any)}
                >
                  <SelectTrigger id="practice-mode">
                    <SelectValue placeholder="Select a practice mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phrases">Common Phrases</SelectItem>
                    <SelectItem value="pronunciation">Pronunciation Challenges</SelectItem>
                    <SelectItem value="conversation">Conversation Prompts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as any)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-translation">Show Translation</Label>
                  <Switch 
                    id="show-translation" 
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-advance">Auto Advance</Label>
                  <Switch 
                    id="auto-advance" 
                    checked={autoAdvance}
                    onCheckedChange={setAutoAdvance}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically move to the next phrase when you pronounce correctly
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="playback-speed">Playback Speed: {playbackRate.toFixed(1)}x</Label>
                <Slider 
                  id="playback-speed"
                  min={0.5} 
                  max={1.0} 
                  step={0.1}
                  value={[playbackRate]}
                  onValueChange={(value) => setPlaybackRate(value[0])}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Speaking Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <h3 className="font-medium">Basic Italian Pronunciation</h3>
                <ul className="text-sm text-muted-foreground ml-5 list-disc">
                  <li>Vowels are always pronounced clearly</li>
                  <li>C + e/i sounds like "ch" in "chess"</li>
                  <li>G + e/i sounds like "j" in "jet"</li>
                  <li>Stress is usually on the penultimate syllable</li>
                  <li>Double consonants are pronounced longer</li>
                </ul>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium">Practice Strategies</h3>
                <ul className="text-sm text-muted-foreground ml-5 list-disc">
                  <li>Listen carefully before speaking</li>
                  <li>Practice slowly, then increase speed</li>
                  <li>Record and compare your pronunciation</li>
                  <li>Focus on pronunciation, not just vocabulary</li>
                  <li>Practice daily for best results</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          {/* Practice Card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {practiceMode === 'phrases' 
                    ? 'Common Phrases' 
                    : practiceMode === 'pronunciation' 
                      ? 'Pronunciation Challenges' 
                      : 'Conversation Practice'}
                </CardTitle>
                <Badge variant="outline" className="capitalize">
                  {difficulty}
                </Badge>
              </div>
              <CardDescription>
                {practiceMode === 'phrases' 
                  ? 'Practice these common Italian phrases' 
                  : practiceMode === 'pronunciation' 
                    ? 'Master challenging Italian sounds and words' 
                    : 'Practice responding to conversation prompts'}
              </CardDescription>
            </CardHeader>
            
            {/* Progress bar */}
            <div className="px-6">
              <Progress 
                value={((currentItemIndex + 1) / filteredItems().length) * 100} 
                className="h-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Phrase {currentItemIndex + 1} of {filteredItems().length}</span>
                <span>
                  {practiceMode === 'phrases' 
                    ? (currentItem as PracticePhrase)?.category || ''
                    : ''}
                </span>
              </div>
            </div>
            
            <CardContent className="space-y-6 pt-6">
              {currentItem && (
                <div className="space-y-6">
                  {/* Current phrase/challenge */}
                  <div className="text-center space-y-4">
                    {practiceMode === 'conversation' && (
                      <div className="bg-muted p-3 rounded-md text-sm mb-4">
                        <span className="font-medium">Prompt: </span>
                        {(currentItem as ConversationPrompt).prompt}
                      </div>
                    )}
                    
                    <div className="text-2xl font-medium">
                      <SpeakableWord 
                        word={practiceMode === 'phrases' 
                          ? (currentItem as PracticePhrase).phrase 
                          : practiceMode === 'pronunciation' 
                            ? (currentItem as PronunciationChallenge).text 
                            : (currentItem as ConversationPrompt).response}
                        language="it"
                        size="lg"
                        autoPlay={false}
                        showTooltip={false}
                      />
                    </div>
                    
                    {showTranslation && (
                      <p className="text-muted-foreground">
                        {practiceMode === 'phrases' 
                          ? (currentItem as PracticePhrase).translation 
                          : practiceMode === 'pronunciation' 
                            ? (currentItem as PronunciationChallenge).translation 
                            : (currentItem as ConversationPrompt).translation}
                      </p>
                    )}
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-16 w-16 rounded-full"
                      onClick={handleSpeak}
                      disabled={isSpeaking}
                    >
                      {isSpeaking ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Volume className="h-6 w-6" />
                      )}
                    </Button>
                    
                    <Button 
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      className="h-16 w-16 rounded-full"
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      disabled={!isAIEnabled || !hasActiveMicrophone}
                    >
                      {isRecording || isTranscribing ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Transcription */}
                  {(transcribedText || isRecording) && (
                    <div className="border rounded-md p-4 bg-muted/20 relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Your Speech:</h3>
                        {isRecording && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 animate-pulse">
                            Recording...
                          </Badge>
                        )}
                      </div>
                      <p className="italic">
                        {transcribedText || "Listening..."}
                      </p>
                    </div>
                  )}
                  
                  {/* Feedback */}
                  {similarities && (
                    <div className="border rounded-md p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Pronunciation Feedback:</h3>
                        <Badge className={getScoreBadgeColor(similarities.score)}>
                          {similarities.score}% Match
                        </Badge>
                      </div>
                      <p>{similarities.feedback}</p>
                      
                      {similarities.score < 70 && (
                        <div className="flex items-center mt-3 text-sm">
                          <Info className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Try listening to the correct pronunciation again and repeat.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevPhrase}
                disabled={currentItemIndex === 0}
              >
                Previous
              </Button>
              
              <FlashcardPronunciation 
                text={practiceMode === 'phrases' 
                  ? (currentItem as PracticePhrase)?.phrase || ''
                  : practiceMode === 'pronunciation' 
                    ? (currentItem as PronunciationChallenge)?.text || ''
                    : (currentItem as ConversationPrompt)?.response || ''}
                language="it-IT"
                showTranscription={true}
              />
              
              <Button 
                onClick={handleNextPhrase}
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
