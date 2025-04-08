import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Layers, Users, Award, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

const UserGuidePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  
  const sections = [
    { 
      id: 'getting-started', 
      label: 'Getting Started', 
      labelItalian: 'Iniziare',
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      id: 'lessons', 
      label: 'Lessons', 
      labelItalian: 'Lezioni',
      icon: <Layers className="h-4 w-4" />
    },
    { 
      id: 'practice', 
      label: 'Practice', 
      labelItalian: 'Esercitazioni',
      icon: <Users className="h-4 w-4" />
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      labelItalian: 'Traguardi',
      icon: <Award className="h-4 w-4" />
    },
    { 
      id: 'subscription', 
      label: 'Subscription', 
      labelItalian: 'Abbonamento',
      icon: <CreditCard className="h-4 w-4" />
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      labelItalian: 'Impostazioni',
      icon: <Settings className="h-4 w-4" />
    },
    { 
      id: 'support', 
      label: 'Support', 
      labelItalian: 'Supporto',
      icon: <HelpCircle className="h-4 w-4" />
    }
  ];
  
  const tabContentMap: Record<string, { 
    title: string, 
    titleItalian: string, 
    content: string, 
    contentItalian: string 
  }> = {
    'getting-started': {
      title: 'Getting Started with Italian Learning',
      titleItalian: 'Iniziare con l\'Apprendimento dell\'Italiano',
      content: `
        <h3 class="text-lg font-semibold mb-3">Welcome to Italian Learning!</h3>
        <p class="mb-4">This guide will help you get started with our platform and make the most out of your language learning journey.</p>
        
        <h4 class="text-md font-semibold mb-2">Creating Your Account</h4>
        <p class="mb-4">To begin, create an account by clicking on the "Sign Up" button in the top right corner. You can register using your email address or through Google.</p>
        
        <h4 class="text-md font-semibold mb-2">Setting Up Your Profile</h4>
        <p class="mb-4">After signing up, take a moment to set up your profile. Add your language learning goals, current proficiency level, and areas of interest to personalize your experience.</p>
        
        <h4 class="text-md font-semibold mb-2">Taking the Placement Test</h4>
        <p class="mb-4">We recommend taking our placement test to determine your current level of Italian. This will help us customize your learning path. Find the test in the "Assessment" section of your dashboard.</p>
        
        <h4 class="text-md font-semibold mb-2">Exploring the Dashboard</h4>
        <p class="mb-4">Your dashboard is the central hub for your learning journey. Here you'll find your daily goals, lesson recommendations, progress statistics, and quick access to all platform features.</p>
        
        <h4 class="text-md font-semibold mb-2">Setting Daily Goals</h4>
        <p class="mb-4">Consistency is key to language learning. Set realistic daily goals in the "Goals" section of your profile. We recommend at least 15-20 minutes of practice every day.</p>
      `,
      contentItalian: `
        <h3 class="text-lg font-semibold mb-3">Benvenuto nell'Apprendimento dell'Italiano!</h3>
        <p class="mb-4">Questa guida ti aiuterà a iniziare con la nostra piattaforma e a sfruttare al meglio il tuo percorso di apprendimento linguistico.</p>
        
        <h4 class="text-md font-semibold mb-2">Creazione del tuo Account</h4>
        <p class="mb-4">Per iniziare, crea un account cliccando sul pulsante "Registrati" nell'angolo in alto a destra. Puoi registrarti utilizzando il tuo indirizzo email o tramite Google.</p>
        
        <h4 class="text-md font-semibold mb-2">Configurazione del tuo Profilo</h4>
        <p class="mb-4">Dopo la registrazione, dedica un momento alla configurazione del tuo profilo. Aggiungi i tuoi obiettivi di apprendimento linguistico, il tuo livello di competenza attuale e le aree di interesse per personalizzare la tua esperienza.</p>
        
        <h4 class="text-md font-semibold mb-2">Svolgimento del Test di Livello</h4>
        <p class="mb-4">Ti consigliamo di svolgere il nostro test di livello per determinare il tuo attuale livello di italiano. Questo ci aiuterà a personalizzare il tuo percorso di apprendimento. Trova il test nella sezione "Valutazione" della tua dashboard.</p>
        
        <h4 class="text-md font-semibold mb-2">Esplorazione della Dashboard</h4>
        <p class="mb-4">La tua dashboard è il centro nevralgico del tuo percorso di apprendimento. Qui troverai i tuoi obiettivi giornalieri, le raccomandazioni di lezioni, le statistiche di progresso e l'accesso rapido a tutte le funzionalità della piattaforma.</p>
        
        <h4 class="text-md font-semibold mb-2">Impostazione degli Obiettivi Giornalieri</h4>
        <p class="mb-4">La costanza è la chiave per l'apprendimento linguistico. Imposta obiettivi giornalieri realistici nella sezione "Obiettivi" del tuo profilo. Ti consigliamo almeno 15-20 minuti di pratica ogni giorno.</p>
      `
    },
    'lessons': {
      title: 'Lessons and Curriculum',
      titleItalian: 'Lezioni e Curriculum',
      content: `
        <h3 class="text-lg font-semibold mb-3">Understanding Our Lesson Structure</h3>
        <p class="mb-4">Our Italian curriculum is designed to progressively build your language skills from beginner to advanced levels.</p>
        
        <h4 class="text-md font-semibold mb-2">Lesson Categories</h4>
        <p class="mb-4">Lessons are organized into several categories:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Grammar: These lessons focus on Italian grammatical structures and rules.</li>
          <li>Vocabulary: Build your Italian vocabulary with themed word sets.</li>
          <li>Conversation: Practice real-life dialogues and expressions.</li>
          <li>Culture: Learn about Italian history, traditions, and cultural nuances.</li>
          <li>Pronunciation: Perfect your Italian accent with audio guides.</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Lesson Progression</h4>
        <p class="mb-4">Each lesson builds upon previous ones, gradually introducing new concepts while reinforcing what you've already learned. It's recommended to complete lessons in the suggested order.</p>
        
        <h4 class="text-md font-semibold mb-2">Interacting with Lesson Content</h4>
        <p class="mb-4">Our interactive lessons include:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Audio clips for pronunciation practice</li>
          <li>Example sentences and dialogues</li>
          <li>Interactive exercises</li>
          <li>Cultural notes and tips</li>
          <li>Progress quizzes</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Saving and Revisiting Lessons</h4>
        <p class="mb-4">You can bookmark any lesson for quick access later. Simply click the bookmark icon in the top right corner of any lesson page. Find your saved lessons in the "Bookmarks" section of your profile.</p>
      `,
      contentItalian: `
        <h3 class="text-lg font-semibold mb-3">Comprendere la Struttura delle Nostre Lezioni</h3>
        <p class="mb-4">Il nostro curriculum di italiano è progettato per sviluppare progressivamente le tue competenze linguistiche dal livello principiante a quello avanzato.</p>
        
        <h4 class="text-md font-semibold mb-2">Categorie di Lezioni</h4>
        <p class="mb-4">Le lezioni sono organizzate in diverse categorie:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Grammatica: Queste lezioni si concentrano sulle strutture grammaticali e le regole dell'italiano.</li>
          <li>Vocabolario: Costruisci il tuo vocabolario italiano con set di parole tematici.</li>
          <li>Conversazione: Pratica dialoghi ed espressioni della vita reale.</li>
          <li>Cultura: Impara la storia italiana, le tradizioni e le sfumature culturali.</li>
          <li>Pronuncia: Perfeziona il tuo accento italiano con guide audio.</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Progressione delle Lezioni</h4>
        <p class="mb-4">Ogni lezione si basa sulle precedenti, introducendo gradualmente nuovi concetti mentre rafforza ciò che hai già imparato. Si consiglia di completare le lezioni nell'ordine suggerito.</p>
        
        <h4 class="text-md font-semibold mb-2">Interazione con i Contenuti delle Lezioni</h4>
        <p class="mb-4">Le nostre lezioni interattive includono:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Clip audio per esercitarsi sulla pronuncia</li>
          <li>Frasi ed esempi di dialogo</li>
          <li>Esercizi interattivi</li>
          <li>Note culturali e suggerimenti</li>
          <li>Quiz di progresso</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Salvare e Rivedere le Lezioni</h4>
        <p class="mb-4">Puoi aggiungere ai preferiti qualsiasi lezione per un accesso rapido in seguito. Basta cliccare sull'icona del segnalibro nell'angolo in alto a destra di qualsiasi pagina della lezione. Trova le tue lezioni salvate nella sezione "Preferiti" del tuo profilo.</p>
      `
    },
    // Other section contents...
    'practice': {
      title: 'Practice and Exercises',
      titleItalian: 'Pratica ed Esercizi',
      content: `
        <h3 class="text-lg font-semibold mb-3">Mastering Italian Through Practice</h3>
        <p class="mb-4">Regular practice is essential for language learning. Our platform offers various exercise types to reinforce your skills.</p>
        
        <h4 class="text-md font-semibold mb-2">Flashcards</h4>
        <p class="mb-4">Our flashcard system uses spaced repetition to help you memorize vocabulary efficiently. Cards you find challenging will appear more frequently, optimizing your learning time.</p>
        
        <h4 class="text-md font-semibold mb-2">Reading Exercises</h4>
        <p class="mb-4">Improve your reading comprehension with texts ranging from beginner to advanced levels. Each reading is followed by comprehension questions to test your understanding.</p>
        
        <h4 class="text-md font-semibold mb-2">Listening Practice</h4>
        <p class="mb-4">Train your ear with authentic Italian audio clips at various speeds. Our listening exercises include dialogues, announcements, news excerpts, and more.</p>
        
        <h4 class="text-md font-semibold mb-2">Writing Tasks</h4>
        <p class="mb-4">Develop your writing skills through guided composition exercises. Submit your writing for AI-based feedback or community review.</p>
        
        <h4 class="text-md font-semibold mb-2">Speaking Practice</h4>
        <p class="mb-4">Use our voice recognition tools to practice pronunciation and speaking. Record yourself and compare with native speaker examples.</p>
        
        <h4 class="text-md font-semibold mb-2">Grammar Drills</h4>
        <p class="mb-4">Reinforce grammatical concepts through targeted exercises focusing on specific rules and exceptions.</p>
      `,
      contentItalian: `
        <h3 class="text-lg font-semibold mb-3">Padroneggiare l'Italiano Attraverso la Pratica</h3>
        <p class="mb-4">La pratica regolare è essenziale per l'apprendimento delle lingue. La nostra piattaforma offre vari tipi di esercizi per rafforzare le tue competenze.</p>
        
        <h4 class="text-md font-semibold mb-2">Flashcard</h4>
        <p class="mb-4">Il nostro sistema di flashcard utilizza la ripetizione spaziata per aiutarti a memorizzare il vocabolario in modo efficiente. Le carte che trovi difficili appariranno più frequentemente, ottimizzando il tuo tempo di apprendimento.</p>
        
        <h4 class="text-md font-semibold mb-2">Esercizi di Lettura</h4>
        <p class="mb-4">Migliora la tua comprensione della lettura con testi che vanno dal livello principiante a quello avanzato. Ogni lettura è seguita da domande di comprensione per verificare la tua comprensione.</p>
        
        <h4 class="text-md font-semibold mb-2">Pratica di Ascolto</h4>
        <p class="mb-4">Allena il tuo orecchio con clip audio in italiano autentico a varie velocità. I nostri esercizi di ascolto includono dialoghi, annunci, estratti di notizie e altro ancora.</p>
        
        <h4 class="text-md font-semibold mb-2">Compiti di Scrittura</h4>
        <p class="mb-4">Sviluppa le tue capacità di scrittura attraverso esercizi di composizione guidata. Invia i tuoi scritti per un feedback basato sull'intelligenza artificiale o per una revisione della comunità.</p>
        
        <h4 class="text-md font-semibold mb-2">Pratica di Conversazione</h4>
        <p class="mb-4">Utilizza i nostri strumenti di riconoscimento vocale per esercitarti nella pronuncia e nella conversazione. Registrati e confrontati con esempi di madrelingua.</p>
        
        <h4 class="text-md font-semibold mb-2">Esercizi di Grammatica</h4>
        <p class="mb-4">Rinforza i concetti grammaticali attraverso esercizi mirati che si concentrano su regole specifiche ed eccezioni.</p>
      `
    },
    'achievements': {
      title: 'Achievements and Progress Tracking',
      titleItalian: 'Traguardi e Monitoraggio dei Progressi',
      content: `
        <h3 class="text-lg font-semibold mb-3">Track Your Learning Journey</h3>
        <p class="mb-4">Our achievement system helps you stay motivated while monitoring your progress.</p>
        
        <h4 class="text-md font-semibold mb-2">Achievement Badges</h4>
        <p class="mb-4">Earn badges by completing specific challenges and milestones in your learning journey. Badges are grouped into categories like:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Lesson Completion: Finishing lessons and course sections</li>
          <li>Study Streak: Maintaining consecutive days of practice</li>
          <li>Vocabulary Mastery: Learning specific numbers of words</li>
          <li>Grammar Champion: Successfully completing grammar exercises</li>
          <li>Community Contributor: Engaging with the learning community</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Progress Statistics</h4>
        <p class="mb-4">On your profile dashboard, you'll find detailed statistics about your learning journey, including:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Total study time</li>
          <li>Words learned</li>
          <li>Lesson completion percentage</li>
          <li>Accuracy rates</li>
          <li>Daily streak counter</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Skill Assessment</h4>
        <p class="mb-4">Regular skill assessments help you understand your improvement in different language areas (reading, writing, listening, speaking). Take these assessments to identify your strengths and areas for improvement.</p>
        
        <h4 class="text-md font-semibold mb-2">Learning Path</h4>
        <p class="mb-4">Your customized learning path visualizes your journey from beginner to advanced levels, showing completed milestones and upcoming challenges.</p>
      `,
      contentItalian: `
        <h3 class="text-lg font-semibold mb-3">Traccia il Tuo Percorso di Apprendimento</h3>
        <p class="mb-4">Il nostro sistema di traguardi ti aiuta a rimanere motivato mentre monitori i tuoi progressi.</p>
        
        <h4 class="text-md font-semibold mb-2">Badge di Traguardi</h4>
        <p class="mb-4">Guadagna badge completando sfide specifiche e traguardi nel tuo percorso di apprendimento. I badge sono raggruppati in categorie come:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Completamento Lezioni: Terminare lezioni e sezioni del corso</li>
          <li>Serie di Studio: Mantenere giorni consecutivi di pratica</li>
          <li>Padronanza del Vocabolario: Imparare un numero specifico di parole</li>
          <li>Campione di Grammatica: Completare con successo esercizi di grammatica</li>
          <li>Contributore della Comunità: Interagire con la comunità di apprendimento</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Statistiche di Progresso</h4>
        <p class="mb-4">Nella dashboard del tuo profilo, troverai statistiche dettagliate sul tuo percorso di apprendimento, tra cui:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Tempo totale di studio</li>
          <li>Parole imparate</li>
          <li>Percentuale di completamento delle lezioni</li>
          <li>Tassi di precisione</li>
          <li>Contatore di serie giornaliere</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Valutazione delle Competenze</h4>
        <p class="mb-4">Valutazioni regolari delle competenze ti aiutano a comprendere il tuo miglioramento in diverse aree linguistiche (lettura, scrittura, ascolto, conversazione). Fai queste valutazioni per identificare i tuoi punti di forza e le aree di miglioramento.</p>
        
        <h4 class="text-md font-semibold mb-2">Percorso di Apprendimento</h4>
        <p class="mb-4">Il tuo percorso di apprendimento personalizzato visualizza il tuo viaggio dal livello principiante a quello avanzato, mostrando i traguardi completati e le sfide future.</p>
      `
    },
    // Add more sections...
    'subscription': {
      title: 'Subscription and Premium Features',
      titleItalian: 'Abbonamento e Funzionalità Premium',
      content: `
        <h3 class="text-lg font-semibold mb-3">Enhance Your Learning Experience</h3>
        <p class="mb-4">While our platform offers valuable free content, a premium subscription unlocks the full potential of your language learning journey.</p>
        
        <h4 class="text-md font-semibold mb-2">Subscription Plans</h4>
        <p class="mb-4">We offer several subscription options:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Monthly: Renewed every month, ideal for short-term commitment</li>
          <li>Annual: Our best value option, billed once yearly with significant savings</li>
          <li>Lifetime: One-time payment for permanent premium access</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Premium Features</h4>
        <p class="mb-4">With a premium subscription, you'll unlock:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Unlimited access to all lessons and content</li>
          <li>Advanced grammar exercises and specialized vocabulary sets</li>
          <li>Personalized learning path and AI-tailored recommendations</li>
          <li>Speaking practice with pronunciation feedback</li>
          <li>Writing assessments with detailed corrections</li>
          <li>Offline mode for learning without internet</li>
          <li>Ad-free experience</li>
          <li>Priority customer support</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Managing Your Subscription</h4>
        <p class="mb-4">You can manage your subscription settings, including payment methods, renewal options, and cancellations, in the "Subscription" section of your account settings.</p>
        
        <h4 class="text-md font-semibold mb-2">Free vs. Premium</h4>
        <p class="mb-4">Free users can access basic lessons, limited daily exercises, and fundamental tools. Premium users enjoy unlimited access, advanced features, and personalized learning experiences.</p>
      `,
      contentItalian: `
        <h3 class="text-lg font-semibold mb-3">Migliora la Tua Esperienza di Apprendimento</h3>
        <p class="mb-4">Mentre la nostra piattaforma offre preziosi contenuti gratuiti, un abbonamento premium sblocca il pieno potenziale del tuo percorso di apprendimento linguistico.</p>
        
        <h4 class="text-md font-semibold mb-2">Piani di Abbonamento</h4>
        <p class="mb-4">Offriamo diverse opzioni di abbonamento:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Mensile: Rinnovato ogni mese, ideale per impegni a breve termine</li>
          <li>Annuale: La nostra opzione di miglior valore, fatturata una volta all'anno con notevoli risparmi</li>
          <li>A vita: Pagamento una tantum per accesso premium permanente</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Funzionalità Premium</h4>
        <p class="mb-4">Con un abbonamento premium, sbloccherai:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Accesso illimitato a tutte le lezioni e contenuti</li>
          <li>Esercizi grammaticali avanzati e set di vocabolario specializzati</li>
          <li>Percorso di apprendimento personalizzato e raccomandazioni su misura basate sull'IA</li>
          <li>Pratica di conversazione con feedback sulla pronuncia</li>
          <li>Valutazioni di scrittura con correzioni dettagliate</li>
          <li>Modalità offline per l'apprendimento senza internet</li>
          <li>Esperienza senza pubblicità</li>
          <li>Supporto clienti prioritario</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Gestione del Tuo Abbonamento</h4>
        <p class="mb-4">Puoi gestire le impostazioni del tuo abbonamento, inclusi i metodi di pagamento, le opzioni di rinnovo e le cancellazioni, nella sezione "Abbonamento" delle impostazioni del tuo account.</p>
        
        <h4 class="text-md font-semibold mb-2">Gratuito vs. Premium</h4>
        <p class="mb-4">Gli utenti gratuiti possono accedere a lezioni di base, esercizi giornalieri limitati e strumenti fondamentali. Gli utenti premium godono di accesso illimitato, funzionalità avanzate ed esperienze di apprendimento personalizzate.</p>
      `
    },
    'settings': {
      title: 'Account Settings and Preferences',
      titleItalian: 'Impostazioni Account e Preferenze',
      content: `
        <h3 class="text-lg font-semibold mb-3">Personalizing Your Experience</h3>
        <p class="mb-4">Our platform allows you to customize various settings to enhance your learning experience.</p>
        
        <h4 class="text-md font-semibold mb-2">Profile Settings</h4>
        <p class="mb-4">Manage your personal information including:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Name and display name</li>
          <li>Profile picture</li>
          <li>Email address</li>
          <li>Password</li>
          <li>Linked social accounts</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Learning Preferences</h4>
        <p class="mb-4">Customize your learning experience by adjusting:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Difficulty level of exercises</li>
          <li>Daily study goals</li>
          <li>Focus areas (grammar, vocabulary, conversation, etc.)</li>
          <li>Interests and topics</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Notification Settings</h4>
        <p class="mb-4">Control how and when you receive notifications:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Study reminders</li>
          <li>Achievement alerts</li>
          <li>New content notifications</li>
          <li>Email preferences</li>
          <li>Mobile push notifications (if using our mobile app)</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Display and Accessibility</h4>
        <p class="mb-4">Adjust display settings for better accessibility:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Dark/Light theme</li>
          <li>Text size</li>
          <li>Audio playback speed</li>
          <li>Subtitle preferences</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Privacy and Data</h4>
        <p class="mb-4">Manage your privacy settings and data:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Study data visibility</li>
          <li>Profile visibility</li>
          <li>Download your learning data</li>
          <li>Delete account</li>
        </ul>
      `,
      contentItalian: `
        <h3 class="text-lg font-semibold mb-3">Personalizzare la Tua Esperienza</h3>
        <p class="mb-4">La nostra piattaforma ti permette di personalizzare varie impostazioni per migliorare la tua esperienza di apprendimento.</p>
        
        <h4 class="text-md font-semibold mb-2">Impostazioni del Profilo</h4>
        <p class="mb-4">Gestisci le tue informazioni personali tra cui:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Nome e nome visualizzato</li>
          <li>Immagine del profilo</li>
          <li>Indirizzo email</li>
          <li>Password</li>
          <li>Account social collegati</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Preferenze di Apprendimento</h4>
        <p class="mb-4">Personalizza la tua esperienza di apprendimento regolando:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Livello di difficoltà degli esercizi</li>
          <li>Obiettivi di studio giornalieri</li>
          <li>Aree di interesse (grammatica, vocabolario, conversazione, ecc.)</li>
          <li>Interessi e argomenti</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Impostazioni di Notifica</h4>
        <p class="mb-4">Controlla come e quando ricevi le notifiche:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Promemoria di studio</li>
          <li>Avvisi di traguardi</li>
          <li>Notifiche di nuovi contenuti</li>
          <li>Preferenze email</li>
          <li>Notifiche push per dispositivi mobili (se utilizzi la nostra app mobile)</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Display e Accessibilità</h4>
        <p class="mb-4">Regola le impostazioni di visualizzazione per una migliore accessibilità:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Tema Scuro/Chiaro</li>
          <li>Dimensione del testo</li>
          <li>Velocità di riproduzione audio</li>
          <li>Preferenze sottotitoli</li>
        </ul>
        
        <h4 class="text-md font-semibold mb-2">Privacy e Dati</h4>
        <p class="mb-4">Gestisci le tue impostazioni di privacy e dati:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>Visibilità dei dati di studio</li>
          <li>Visibilità del profilo</li>
          <li>Scarica i tuoi dati di apprendimento</li>
          <li>Elimina account</li>
        </ul>
      `
    },
    'support': {
      title: 'Getting Support',
      titleItalian: 'Ottenere Supporto',
      content: `
        <h3 class="text-lg font-semibold mb-3">Getting Help When You Need It</h3>
        <p class="mb-4">We offer multiple support channels to assist you with any questions or issues you may encounter.</p>
        
        <h4 class="text-md font-semibold mb-2">Help Center</h4>
        <p class="mb-4">Our comprehensive Help Center contains articles, guides, and FAQs on all aspects of the platform. This should be your first stop for general questions and learning how to use specific features.</p>
        
        <h4 class="text-md font-semibold mb-2">Support Tickets</h4>
        <p class="mb-4">For personalized assistance, you can submit a support ticket. Our team typically responds within 24 hours (faster for premium users). To submit a ticket:</p>
        <ol class="list-decimal pl-5 mb-4">
          <li>Go to the Support section</li>
          <li>Click "Submit a Ticket"</li>
          <li>Select a category for your issue</li>
          <li>Provide a detailed description</li>
          <li>Submit the form</li>
        </ol>
        
        <h4 class="text-md font-semibold mb-2">Live Chat</h4>
        <p class="mb-4">Premium users have access to our live chat support during business hours. This is the fastest way to get help with urgent issues.</p>
        
        <h4 class="text-md font-semibold mb-2">Community Forums</h4>
        <p class="mb-4">Connect with other learners in our community forums. This is a great place to share experiences, get learning tips, and find answers to common questions.</p>
        
        <h4 class="text-md font-semibold mb-2">Email Support</h4>
        <p class="mb-4">You can also reach our support team directly at support@italianlearning.app for general inquiries.</p>
        
        <h4 class="text-md font-semibold mb-2">Feedback and Suggestions</h4>
        <p class="mb-4">We value your input! Use the feedback form in the Support section to share your suggestions for improving our platform.</p>
      `,
      contentItalian: `
        <h3 class="text-lg font-semibold mb-3">Ottenere Aiuto Quando Ne Hai Bisogno</h3>
        <p class="mb-4">Offriamo molteplici canali di supporto per assisterti con qualsiasi domanda o problema che potresti incontrare.</p>
        
        <h4 class="text-md font-semibold mb-2">Centro Assistenza</h4>
        <p class="mb-4">Il nostro Centro Assistenza completo contiene articoli, guide e FAQ su tutti gli aspetti della piattaforma. Questo dovrebbe essere il tuo primo punto di riferimento per domande generali e per imparare a utilizzare funzionalità specifiche.</p>
        
        <h4 class="text-md font-semibold mb-2">Ticket di Supporto</h4>
        <p class="mb-4">Per un'assistenza personalizzata, puoi inviare un ticket di supporto. Il nostro team in genere risponde entro 24 ore (più velocemente per gli utenti premium). Per inviare un ticket:</p>
        <ol class="list-decimal pl-5 mb-4">
          <li>Vai alla sezione Supporto</li>
          <li>Clicca su "Invia un Ticket"</li>
          <li>Seleziona una categoria per il tuo problema</li>
          <li>Fornisci una descrizione dettagliata</li>
          <li>Invia il modulo</li>
        </ol>
        
        <h4 class="text-md font-semibold mb-2">Chat dal Vivo</h4>
        <p class="mb-4">Gli utenti premium hanno accesso al nostro supporto via chat dal vivo durante l'orario lavorativo. Questo è il modo più veloce per ottenere aiuto con problemi urgenti.</p>
        
        <h4 class="text-md font-semibold mb-2">Forum della Comunità</h4>
        <p class="mb-4">Connettiti con altri studenti nei nostri forum comunitari. Questo è un ottimo posto per condividere esperienze, ottenere suggerimenti per l'apprendimento e trovare risposte a domande comuni.</p>
        
        <h4 class="text-md font-semibold mb-2">Supporto Email</h4>
        <p class="mb-4">Puoi anche contattare il nostro team di supporto direttamente all'indirizzo support@italianlearning.app per richieste generali.</p>
        
        <h4 class="text-md font-semibold mb-2">Feedback e Suggerimenti</h4>
        <p class="mb-4">Apprezziamo il tuo contributo! Utilizza il modulo di feedback nella sezione Supporto per condividere i tuoi suggerimenti per migliorare la nostra piattaforma.</p>
      `
    }
  };
  
  const filterContent = (content: string, query: string) => {
    if (!query) return content;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return content.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <BilingualText
              english="User Guide"
              italian="Guida Utente"
            />
          </CardTitle>
          <div className="relative mt-4">
            <Input
              placeholder={language === 'italian' ? "Cerca nella guida..." : "Search the guide..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="getting-started">
            <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-nowrap">
              {sections.map((section) => (
