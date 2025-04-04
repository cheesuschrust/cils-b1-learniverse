
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, BookOpen, Calendar, CheckCircle2, 
  Mic, GraduationCap, Book, Flag 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard | ItalianMaster</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Benvenuto, Studente!</h1>
          <p className="text-muted-foreground">
            Ecco i tuoi progressi e consigli per continuare a imparare.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* CILS B1 Progress Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                Preparazione CILS B1
              </CardTitle>
              <CardDescription>Il tuo percorso per la certificazione</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progresso Complessivo</span>
                    <Badge variant="outline">65%</Badge>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div className="grid gap-3 grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Ascolto</span>
                      <span className="text-xs">75%</span>
                    </div>
                    <Progress value={75} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Lettura</span>
                      <span className="text-xs">80%</span>
                    </div>
                    <Progress value={80} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Scrittura</span>
                      <span className="text-xs">60%</span>
                    </div>
                    <Progress value={60} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Parlato</span>
                      <span className="text-xs">50%</span>
                    </div>
                    <Progress value={50} className="h-1.5" />
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link to="/progress">Vedi Dettagli</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Citizenship Test Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Flag className="h-5 w-5 mr-2 text-primary" />
                Test di Cittadinanza
              </CardTitle>
              <CardDescription>Preparazione per l'esame di cittadinanza</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Ultimo Punteggio</p>
                    <Badge variant="outline">3/5 corrette</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Completato il 1 Aprile 2025</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progresso Materiale</span>
                    <Badge variant="outline">60%</Badge>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <Button asChild className="w-full">
                  <Link to="/italian-citizenship-test">Fai un Test</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Speaking Practice Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Mic className="h-5 w-5 mr-2 text-primary" />
                Pratica di Conversazione
              </CardTitle>
              <CardDescription>Migliora il tuo parlato italiano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Ultimo Esercizio</p>
                      <p className="text-xs text-muted-foreground">"Mi chiamo... e vengo da..."</p>
                      <p className="text-xs text-green-600 font-medium">Buona pronuncia!</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progressi Pronuncia</span>
                    <Badge variant="outline">55%</Badge>
                  </div>
                  <Progress value={55} className="h-2" />
                </div>
                
                <Button asChild className="w-full">
                  <Link to="/speaking">Pratica Ora</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Streak Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                La Tua Sequenza
              </CardTitle>
              <CardDescription>La tua attività di apprendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">5</div>
                    <div className="text-sm text-muted-foreground">Giorni consecutivi</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                        i < 5 ? 'bg-primary/90 text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {['L', 'M', 'M', 'G', 'V', 'S', 'D'][i]}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Vedi Calendario
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Statistics Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BarChart className="h-5 w-5 mr-2 text-primary" />
                Statistiche di Apprendimento
              </CardTitle>
              <CardDescription>I tuoi dati di apprendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-2xl font-bold">120</div>
                    <div className="text-xs text-muted-foreground">Parole Imparate</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-2xl font-bold">35</div>
                    <div className="text-xs text-muted-foreground">Quiz Completati</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Ore di Studio</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-xs text-muted-foreground">Risposte Corrette</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analisi Dettagliata
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Resources Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Book className="h-5 w-5 mr-2 text-primary" />
                Risorse Consigliate
              </CardTitle>
              <CardDescription>Materiali per continuare lo studio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="bg-muted p-3 rounded-md">
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Grammatica italiana di base</p>
                        <p className="text-xs text-muted-foreground">Rinforzo delle regole grammaticali</p>
                      </div>
                    </div>
                  </li>
                  <li className="bg-muted p-3 rounded-md">
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Vocabolario CILS B1</p>
                        <p className="text-xs text-muted-foreground">Parole e frasi per l'esame</p>
                      </div>
                    </div>
                  </li>
                  <li className="bg-muted p-3 rounded-md">
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Cultura italiana</p>
                        <p className="text-xs text-muted-foreground">Storia e tradizioni italiane</p>
                      </div>
                    </div>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Tutte le Risorse
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
