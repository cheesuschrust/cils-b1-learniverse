
import React, { useEffect, useState } from 'react';
import { CitizenshipReadinessProps, ItalianTestSection } from '../types/type-definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';

export function CitizenshipReadinessComponent({
  userId,
  onStatusChange
}: CitizenshipReadinessProps) {
  const [readiness, setReadiness] = useState<number>(0);
  const [sectionScores, setSectionScores] = useState<Record<ItalianTestSection, number>>({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    grammar: 0,
    vocabulary: 0,
    culture: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReadinessData();
  }, [userId]);

  const loadReadinessData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/citizenship-readiness?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load citizenship readiness data');
      }
      
      const data = await response.json();
      setReadiness(data.overallReadiness);
      setSectionScores(data.sectionScores);
      
      if (onStatusChange) {
        onStatusChange(data.overallReadiness);
      }
    } catch (error) {
      console.error('Error loading citizenship readiness:', error);
      setError('Failed to load your readiness data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getReadinessLabel = (score: number): string => {
    if (score >= 90) return 'Eccellente';
    if (score >= 75) return 'Molto Buono';
    if (score >= 60) return 'Buono';
    if (score >= 45) return 'Sufficiente';
    if (score >= 30) return 'Necessita Pratica';
    return 'Inizio';
  };

  const getReadinessColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 60) return 'bg-lime-500';
    if (score >= 45) return 'bg-amber-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getReadinessTextClass = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-emerald-600';
    if (score >= 60) return 'text-lime-600';
    if (score >= 45) return 'text-amber-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Caricamento stato preparazione...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadReadinessData} 
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preparazione per l'Esame di Cittadinanza</CardTitle>
        <CardDescription>
          Il tuo stato di preparazione per il test B1 per la cittadinanza italiana
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="overall-readiness flex items-center justify-center py-4">
          <div className="readiness-gauge relative flex flex-col items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="16"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={`hsl(var(--${readiness >= 60 ? 'primary' : 'warning'}))`}
                strokeWidth="16"
                strokeDasharray={`${readiness * 4.4} 440`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold">{Math.round(readiness)}%</span>
              <span className={`text-sm font-medium ${getReadinessTextClass(readiness)}`}>
                {getReadinessLabel(readiness)}
              </span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="section-scores">
          <h3 className="text-lg font-medium mb-4">Punteggi per Sezione</h3>
          <div className="space-y-4">
            {(Object.entries(sectionScores) as [ItalianTestSection, number][]).map(([section, score]) => (
              <div key={section} className="score-bar-item">
                <div className="flex justify-between mb-1">
                  <div className="section-label capitalize">
                    {section}
                  </div>
                  <div className={`section-score font-medium ${getReadinessTextClass(score)}`}>
                    {Math.round(score)}%
                  </div>
                </div>
                <Progress 
                  value={score} 
                  className={`h-2 ${score < 40 && 'text-red-600'}`} 
                />
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="readiness-suggestions">
          <h3 className="text-lg font-medium mb-3">Suggerimenti per il Miglioramento</h3>
          <div className="bg-muted rounded-md p-4 space-y-3">
            {readiness < 60 && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <p>
                  <strong>Necessaria maggiore pratica:</strong> Il tuo punteggio di preparazione è sotto il 60%,
                  ti consigliamo di concentrarti sulle sezioni con i punteggi più bassi.
                </p>
              </div>
            )}
            
            {sectionScores.culture < 50 && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <p>
                  <strong>Cultura e storia italiana:</strong> Dedica più tempo allo studio della cultura
                  e storia italiana, elementi essenziali per il test di cittadinanza.
                </p>
              </div>
            )}
            
            {sectionScores.listening < 50 && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <p>
                  <strong>Comprensione orale:</strong> Migliora la tua capacità di comprensione ascoltando
                  regolarmente podcast o guardando video in italiano.
                </p>
              </div>
            )}
            
            {sectionScores.grammar < 50 && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <p>
                  <strong>Grammatica:</strong> Rafforza le tue conoscenze grammaticali concentrandoti
                  sulle regole fondamentali dell'italiano.
                </p>
              </div>
            )}
            
            {sectionScores.vocabulary < 50 && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <p>
                  <strong>Vocabolario:</strong> Espandi il tuo vocabolario italiano, particolarmente
                  nelle aree relative alla cittadinanza e vita civile.
                </p>
              </div>
            )}
            
            {readiness >= 75 && (
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p>
                  <strong>Ottimo lavoro!</strong> Sei sulla buona strada per superare l'esame.
                  Continua a praticare per mantenere il tuo livello di preparazione.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={loadReadinessData}
            variant="outline"
            size="sm"
            className="w-full md:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna Dati
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
