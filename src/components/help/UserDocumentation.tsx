
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';
import { BookOpen, Bookmark, Lightbulb, GraduationCap, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocumentSection {
  id: string;
  title: {
    english: string;
    italian: string;
  };
  content: {
    english: string;
    italian: string;
  };
  icon: React.ReactNode;
}

const UserDocumentation: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('getting-started');
  
  const documentSections: DocumentSection[] = [
    {
      id: 'getting-started',
      title: {
        english: 'Getting Started',
        italian: 'Per Iniziare'
      },
      content: {
        english: `
# Getting Started with Italian Learning

Welcome to our Italian language learning platform! This guide will help you navigate the essentials to start your language journey.

## Creating Your Account

1. Sign up with your email or social accounts
2. Complete your profile with your learning goals
3. Take the placement test to determine your current level

## Setting Your Learning Schedule

Consistency is key to language learning. We recommend:

- Setting aside at least 15-20 minutes daily
- Establishing a regular time for practice
- Using the calendar feature to set reminders

## Understanding Your Dashboard

Your dashboard is your learning command center:
- **Progress tracker**: See how far you've come
- **Daily goals**: Track your daily activity
- **Recommended lessons**: Personalized content based on your level
- **Streak counter**: Stay motivated by maintaining your learning streak

## Your First Lesson

Ready to start learning? Here's what to do:
1. Click on "Lessons" in the main navigation
2. Select a beginner lesson from the recommended list
3. Follow the interactive exercises
4. Complete the practice quiz at the end

Remember, language learning is a journey. Don't worry about making mistakes—they're an essential part of the learning process!
`,
        italian: `
# Iniziare con l'Apprendimento dell'Italiano

Benvenuto nella nostra piattaforma di apprendimento della lingua italiana! Questa guida ti aiuterà a navigare tra gli elementi essenziali per iniziare il tuo percorso linguistico.

## Creare il Tuo Account

1. Registrati con la tua email o i tuoi account social
2. Completa il tuo profilo con i tuoi obiettivi di apprendimento
3. Fai il test di livello per determinare il tuo livello attuale

## Impostare il Tuo Programma di Studio

La costanza è fondamentale per l'apprendimento delle lingue. Consigliamo di:

- Dedicare almeno 15-20 minuti al giorno
- Stabilire un orario regolare per la pratica
- Utilizzare la funzione calendario per impostare promemoria

## Comprendere la Tua Dashboard

La tua dashboard è il tuo centro di comando per l'apprendimento:
- **Tracker dei progressi**: Vedi quanto hai progredito
- **Obiettivi giornalieri**: Tieni traccia della tua attività quotidiana
- **Lezioni consigliate**: Contenuti personalizzati in base al tuo livello
- **Contatore di serie consecutive**: Rimani motivato mantenendo la tua serie di apprendimento

## La Tua Prima Lezione

Pronto per iniziare a imparare? Ecco cosa fare:
1. Clicca su "Lezioni" nella navigazione principale
2. Seleziona una lezione per principianti dall'elenco consigliato
3. Segui gli esercizi interattivi
4. Completa il quiz di pratica alla fine

Ricorda, l'apprendimento di una lingua è un viaggio. Non preoccuparti di fare errori: sono una parte essenziale del processo di apprendimento!
`
      },
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: 'flashcards',
      title: {
        english: 'Using Flashcards',
        italian: 'Utilizzo delle Flashcard'
      },
      content: {
        english: `
# Mastering Vocabulary with Flashcards

Flashcards are one of the most effective tools for vocabulary learning. Our platform offers a comprehensive flashcard system designed specifically for Italian language learners.

## Creating Your First Flashcard Set

1. Navigate to the Flashcards section
2. Click on "Create New Set"
3. Name your set (e.g., "Food Vocabulary" or "Travel Phrases")
4. Add cards with Italian terms on one side and English translations on the other

## Effective Flashcard Strategies

To maximize your learning:

- **Spaced repetition**: Our system automatically schedules reviews based on your performance
- **Small batches**: Study 10-20 new cards per session rather than overwhelming yourself
- **Active recall**: Try to recall the answer before flipping the card
- **Pronunciation practice**: Say the Italian words aloud as you study

## Organizing Your Flashcards

Keep your flashcards organized by:
- **Categories**: Group cards by topic (food, travel, business, etc.)
- **Difficulty levels**: Tag cards as easy, medium, or difficult
- **Custom tags**: Create your own system for organizing content

## Using Pre-made Decks

Don't want to create cards from scratch?
1. Browse our library of pre-made decks
2. Filter by level and topic
3. Add the deck to your collection with one click
4. Customize as needed by adding or removing cards

Remember to review your flashcards regularly—consistency is key to committing vocabulary to long-term memory!
`,
        italian: `
# Padroneggiare il Vocabolario con le Flashcard

Le flashcard sono uno degli strumenti più efficaci per l'apprendimento del vocabolario. La nostra piattaforma offre un sistema completo di flashcard progettato specificamente per gli studenti di lingua italiana.

## Creare il Tuo Primo Set di Flashcard

1. Naviga alla sezione Flashcard
2. Clicca su "Crea Nuovo Set"
3. Dai un nome al tuo set (es. "Vocabolario del Cibo" o "Frasi di Viaggio")
4. Aggiungi carte con termini italiani da un lato e traduzioni inglesi dall'altro

## Strategie Efficaci per le Flashcard

Per massimizzare il tuo apprendimento:

- **Ripetizione spaziata**: Il nostro sistema programma automaticamente le revisioni in base alle tue prestazioni
- **Piccoli gruppi**: Studia 10-20 nuove carte per sessione invece di sovraccaricarti
- **Richiamo attivo**: Cerca di ricordare la risposta prima di girare la carta
- **Pratica della pronuncia**: Pronuncia le parole italiane ad alta voce mentre studi

## Organizzare le Tue Flashcard

Mantieni le tue flashcard organizzate per:
- **Categorie**: Raggruppa le carte per argomento (cibo, viaggi, affari, ecc.)
- **Livelli di difficoltà**: Etichetta le carte come facili, medie o difficili
- **Tag personalizzati**: Crea il tuo sistema per organizzare i contenuti

## Utilizzare Mazzi Preconfezionati

Non vuoi creare carte da zero?
1. Sfoglia la nostra libreria di mazzi già pronti
2. Filtra per livello e argomento
3. Aggiungi il mazzo alla tua collezione con un solo clic
4. Personalizza secondo necessità aggiungendo o rimuovendo carte

Ricorda di rivedere regolarmente le tue flashcard: la costanza è fondamentale per fissare il vocabolario nella memoria a lungo termine!
`
      },
      icon: <Bookmark className="h-5 w-5" />
    },
    {
      id: 'practice-exercises',
      title: {
        english: 'Practice Exercises',
        italian: 'Esercizi Pratici'
      },
      content: {
        english: `
# Enhancing Your Skills with Practice Exercises

Our platform offers a variety of exercise types to help you develop all aspects of your Italian language skills.

## Types of Exercises Available

- **Reading comprehension**: Texts with follow-up questions
- **Listening practice**: Audio clips with comprehension questions
- **Writing exercises**: Guided compositions with AI feedback
- **Speaking practice**: Pronunciation drills and conversation prompts
- **Grammar drills**: Targeted practice for specific grammar rules

## Exercise Difficulty Levels

All exercises are categorized by CEFR levels:
- A1-A2: Beginner
- B1-B2: Intermediate
- C1-C2: Advanced

You can adjust the difficulty level in your profile settings or choose manually for each session.

## Getting the Most from Exercises

For maximum benefit:
1. **Complete all exercise types** - Don't just focus on your strongest skills
2. **Review your mistakes** - Our system saves your errors for targeted review
3. **Utilize the hint system** when needed, but try to solve independently first
4. **Take advantage of the explanation feature** after completing exercises

## Tracking Your Progress

After each exercise, you'll see:
- Your score and time spent
- Specific error patterns
- Improvement over time
- Recommendations for further practice

Aim to practice a little each day rather than cramming occasionally. Consistent practice leads to steady improvement and better long-term retention.
`,
        italian: `
# Migliorare le Tue Abilità con gli Esercizi Pratici

La nostra piattaforma offre una varietà di tipi di esercizi per aiutarti a sviluppare tutti gli aspetti delle tue competenze linguistiche italiane.

## Tipi di Esercizi Disponibili

- **Comprensione di lettura**: Testi con domande di follow-up
- **Pratica di ascolto**: Clip audio con domande di comprensione
- **Esercizi di scrittura**: Composizioni guidate con feedback AI
- **Pratica di conversazione**: Esercizi di pronuncia e spunti di conversazione
- **Esercizi di grammatica**: Pratica mirata per regole grammaticali specifiche

## Livelli di Difficoltà degli Esercizi

Tutti gli esercizi sono classificati secondo i livelli QCER:
- A1-A2: Principiante
- B1-B2: Intermedio
- C1-C2: Avanzato

Puoi regolare il livello di difficoltà nelle impostazioni del tuo profilo o scegliere manualmente per ogni sessione.

## Ottenere il Massimo dagli Esercizi

Per il massimo beneficio:
1. **Completa tutti i tipi di esercizi** - Non concentrarti solo sulle tue abilità più forti
2. **Rivedi i tuoi errori** - Il nostro sistema salva i tuoi errori per una revisione mirata
3. **Utilizza il sistema di suggerimenti** quando necessario, ma prova prima a risolvere in modo indipendente
4. **Approfitta della funzione di spiegazione** dopo aver completato gli esercizi

## Tracciare i Tuoi Progressi

Dopo ogni esercizio, vedrai:
- Il tuo punteggio e il tempo trascorso
- Modelli specifici di errore
- Miglioramento nel tempo
- Raccomandazioni per ulteriore pratica

Cerca di praticare un po' ogni giorno invece di studiare intensamente occasionalmente. La pratica costante porta a un miglioramento costante e una migliore ritenzione a lungo termine.
`
      },
      icon: <GraduationCap className="h-5 w-5" />
    },
    {
      id: 'language-tips',
      title: {
        english: 'Learning Tips',
        italian: 'Consigli di Apprendimento'
      },
      content: {
        english: `
# Expert Tips for Accelerated Italian Learning

These research-backed tips will help you make the most of your Italian studies and progress faster.

## Optimization Strategies

- **Create an immersive environment**: Change your phone language to Italian, watch Italian TV shows, listen to Italian podcasts
- **Find a language partner**: Practice conversation with native speakers through our community feature
- **Use the 80/20 principle**: Focus on high-frequency words and phrases first (our system highlights these for you)
- **Practice active recall**: Don't just review—test yourself regularly
- **Embrace mistakes**: They're valuable learning opportunities

## Daily Habits for Language Success

Incorporate these into your routine:
1. **Review flashcards** for 5-10 minutes during breakfast
2. **Listen to Italian audio** during your commute
3. **Practice speaking** (even just reading aloud) for 5 minutes daily
4. **End the day with a short writing exercise**

## Overcoming Common Challenges

- **Pronunciation difficulties**: Use our slow playback and recording features to compare your speech with native examples
- **Grammar confusion**: Focus on patterns rather than memorizing rules
- **Vocabulary retention**: Use our mnemonic system and visualization techniques
- **Speaking anxiety**: Start with our AI conversation partner before moving to real exchanges

## Measuring Progress Effectively

Look for these signs of improvement:
- Being able to understand more without translating in your head
- Noticing patterns in the language without conscious analysis
- Dreaming or thinking in Italian
- Automatically responding in Italian without preparation

Remember that language learning isn't linear—you'll experience plateaus followed by sudden breakthroughs. Keep practicing consistently even when progress feels slow.
`,
        italian: `
# Consigli Esperti per l'Apprendimento Accelerato dell'Italiano

Questi consigli supportati dalla ricerca ti aiuteranno a sfruttare al meglio i tuoi studi di italiano e a progredire più velocemente.

## Strategie di Ottimizzazione

- **Crea un ambiente immersivo**: Cambia la lingua del tuo telefono in italiano, guarda programmi TV italiani, ascolta podcast italiani
- **Trova un partner linguistico**: Pratica la conversazione con madrelingua attraverso la nostra funzione di comunità
- **Usa il principio 80/20**: Concentrati prima su parole e frasi ad alta frequenza (il nostro sistema le evidenzia per te)
- **Pratica il richiamo attivo**: Non limitarti a rivedere, mettiti alla prova regolarmente
- **Accetta gli errori**: Sono preziose opportunità di apprendimento

## Abitudini Quotidiane per il Successo Linguistico

Incorpora questi nella tua routine:
1. **Rivedi le flashcard** per 5-10 minuti durante la colazione
2. **Ascolta audio in italiano** durante il pendolarismo
3. **Pratica il parlato** (anche solo leggendo ad alta voce) per 5 minuti al giorno
4. **Concludi la giornata con un breve esercizio di scrittura**

## Superare le Sfide Comuni

- **Difficoltà di pronuncia**: Usa le nostre funzioni di riproduzione lenta e registrazione per confrontare il tuo parlato con esempi nativi
- **Confusione grammaticale**: Concentrati sui modelli piuttosto che memorizzare regole
- **Ritenzione del vocabolario**: Usa il nostro sistema mnemonico e le tecniche di visualizzazione
- **Ansia di parlare**: Inizia con il nostro partner di conversazione AI prima di passare a scambi reali

## Misurare l'Efficacia dei Progressi

Cerca questi segni di miglioramento:
- Essere in grado di capire di più senza tradurre nella tua mente
- Notare modelli nel linguaggio senza analisi conscia
- Sognare o pensare in italiano
- Rispondere automaticamente in italiano senza preparazione

Ricorda che l'apprendimento delle lingue non è lineare: sperimenterai plateau seguiti da improvvisi progressi. Continua a praticare costantemente anche quando i progressi sembrano lenti.
`
      },
      icon: <Lightbulb className="h-5 w-5" />
    }
  ];

  // Get the current content based on selected section and language
  const getCurrentContent = () => {
    const section = documentSections.find(s => s.id === selectedSection);
    if (!section) return '';
    
    return language === 'italian' ? section.content.italian : section.content.english;
  };
  
  // Filter sections based on search
  const filteredSections = searchQuery
    ? documentSections.filter(section => {
        const titleToCheck = language === 'italian' ? section.title.italian : section.title.english;
        const contentToCheck = language === 'italian' ? section.content.italian : section.content.english;
        
        return titleToCheck.toLowerCase().includes(searchQuery.toLowerCase()) ||
               contentToCheck.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : documentSections;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <BilingualText 
            english="User Documentation" 
            italian="Documentazione Utente" 
          />
        </CardTitle>
        <CardDescription>
          <BilingualText
            english="Comprehensive guides to help you get the most out of the platform"
            italian="Guide complete per aiutarti a ottenere il massimo dalla piattaforma"
          />
        </CardDescription>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder={language === 'italian' ? 'Cerca nella documentazione...' : 'Search documentation...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Section menu */}
          <div className="md:col-span-1">
            <div className="space-y-1">
              <h3 className="text-sm font-medium mb-2">
                <BilingualText english="Sections" italian="Sezioni" />
              </h3>
              
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <span className="mr-2">{section.icon}</span>
                    <BilingualText
                      english={section.title.english}
                      italian={section.title.italian}
                    />
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">
                  <BilingualText
                    english="No sections found matching your search."
                    italian="Nessuna sezione trovata corrispondente alla tua ricerca."
                  />
                </p>
              )}
            </div>
          </div>
          
          {/* Content area */}
          <div className="md:col-span-3">
            <ScrollArea className="h-[600px] rounded-md border p-4">
              {searchQuery && filteredSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    <BilingualText
                      english="No results found for your search."
                      italian="Nessun risultato trovato per la tua ricerca."
                    />
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    <BilingualText
                      english="Clear search"
                      italian="Cancella ricerca"
                    />
                  </Button>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {getCurrentContent().split('\n').map((paragraph, idx) => {
                    // Parse markdown for headings, lists, etc.
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4">{paragraph.replace('# ', '')}</h1>;
                    } else if (paragraph.startsWith('## ')) {
                      return <h2 key={idx} className="text-xl font-semibold mt-5 mb-3">{paragraph.replace('## ', '')}</h2>;
                    } else if (paragraph.startsWith('- ')) {
                      return <li key={idx} className="ml-6 mb-1">{paragraph.replace('- ', '')}</li>;
                    } else if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                      // Handle numbered lists
                      const number = paragraph.substring(0, paragraph.indexOf('.') + 1);
                      const text = paragraph.substring(paragraph.indexOf('.') + 1).trim();
                      return <div key={idx} className="flex ml-6 mb-1"><span className="mr-2">{number}</span><span>{text}</span></div>;
                    } else if (paragraph === '') {
                      return <div key={idx} className="my-2" />;
                    } else {
                      return <p key={idx} className="mb-3">{paragraph}</p>;
                    }
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDocumentation;
