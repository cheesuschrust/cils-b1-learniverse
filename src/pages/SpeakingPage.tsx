
import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, RefreshCw, Volume, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SpeakingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('Mi chiamo... e vengo da...');
  
  const prompts = [
    'Mi chiamo... e vengo da...',
    'Cosa ti piace fare nel tempo libero?',
    'Racconta della tua famiglia',
    'Descrivi la tua città',
    'Cosa hai fatto lo scorso fine settimana?'
  ];
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };
  
  const startRecording = () => {
    // In a real app, this would connect to the browser's speech recognition API
    // For demonstration purposes, we'll just simulate recording
    setFeedback(null);
    console.log('Recording started...');
  };
  
  const stopRecording = () => {
    // Simulate speech recognition result
    setTimeout(() => {
      const sampleResponses = [
        'Mi chiamo Marco e vengo da Roma.',
        'Mi chiamo Sophia e vengo da Milano.',
        'Mi chiamo Paolo e vengo da Firenze.'
      ];
      setTranscript(sampleResponses[Math.floor(Math.random() * sampleResponses.length)]);
    }, 500);
    
    console.log('Recording stopped.');
  };
  
  const evaluatePronunciation = () => {
    // Simulate pronunciation evaluation
    setFeedback('Buona pronuncia! Hai articolato bene le parole. Continua a praticare la fluidità.');
  };
  
  const playPrompt = () => {
    // In a real app, this would use text-to-speech
    console.log('Playing prompt audio...');
  };
  
  const getNewPrompt = () => {
    const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(newPrompt);
    setTranscript('');
    setFeedback(null);
  };
  
  return (
    <>
      <Helmet>
        <title>Pratica di Conversazione | ItalianMaster</title>
      </Helmet>
      
      <div className="container max-w-3xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Pratica di Conversazione</h1>
          <p className="text-muted-foreground">
            Migliora la tua pronuncia e fluidità in italiano
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt di Conversazione</CardTitle>
              <CardDescription>
                Leggi e rispondi alla domanda ad alta voce
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">{currentPrompt}</p>
                <Button variant="ghost" size="icon" onClick={playPrompt}>
                  <Volume className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  className="flex-1"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-5 w-5 mr-2" />
                      Ferma Registrazione
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Inizia a Parlare
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={getNewPrompt}>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Nuovo Prompt
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {transcript && (
            <Card>
              <CardHeader>
                <CardTitle>La tua Risposta</CardTitle>
                <CardDescription>
                  Ecco cosa hai detto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  value={transcript} 
                  onChange={(e) => setTranscript(e.target.value)} 
                  rows={4}
                  placeholder="La tua risposta apparirà qui..."
                />
                
                <div className="flex justify-end">
                  <Button onClick={evaluatePronunciation}>
                    Valuta Pronuncia
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {feedback && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle>Feedback</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>{feedback}</p>
                
                <div className="mt-4 bg-muted p-3 rounded-md border">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Suggerimento</p>
                      <p className="text-sm text-muted-foreground">
                        Ricorda di parlare lentamente e chiaramente. La pratica costante è la chiave per migliorare!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
