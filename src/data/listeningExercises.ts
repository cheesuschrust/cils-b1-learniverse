
export interface ListeningQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ListeningExercise {
  id: number;
  title: string;
  audioUrl: string;
  transcript: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "multiple-choice" | "transcript";
  questions: ListeningQuestion[];
}

export const listeningExercises: ListeningExercise[] = [
  {
    id: 1,
    title: "Notizie del Giorno",
    audioUrl: "https://static.openaudio.ai/2023/06/sample-audio-in-italian.mp3",
    transcript:
      "Benvenuti alle notizie del giorno. Oggi a Roma, il Presidente della Repubblica ha incontrato i rappresentanti delle regioni per discutere delle nuove misure economiche. Il governo ha annunciato un nuovo piano per il sostegno alle piccole imprese. Secondo il Ministro dell'Economia, questo piano aiuterà migliaia di aziende in difficoltà. In altre notizie, la squadra nazionale di calcio si prepara per la prossima partita di qualificazione al campionato europeo.",
    difficulty: "Intermediate",
    type: "multiple-choice",
    questions: [
      {
        id: 1,
        question: "Dove si è svolto l'incontro menzionato nel notiziario?",
        options: ["Milano", "Roma", "Napoli", "Firenze"],
        correctAnswer: "Roma",
      },
      {
        id: 2,
        question: "Chi ha incontrato i rappresentanti delle regioni?",
        options: [
          "Il Primo Ministro",
          "Il Ministro dell'Economia",
          "Il Presidente della Repubblica",
          "Il Ministro degli Esteri",
        ],
        correctAnswer: "Il Presidente della Repubblica",
      },
      {
        id: 3,
        question: "Qual è lo scopo del nuovo piano annunciato dal governo?",
        options: [
          "Sostegno alle piccole imprese",
          "Miglioramento delle infrastrutture",
          "Riforma del sistema educativo",
          "Aumento delle pensioni",
        ],
        correctAnswer: "Sostegno alle piccole imprese",
      },
    ],
  },
  {
    id: 2,
    title: "Conversazione al Ristorante",
    audioUrl: "https://static.openaudio.ai/2024/03/italian-restaurant-conversation.mp3",
    transcript:
      "Cameriere: Buonasera signori, benvenuti al Ristorante Bella Italia. Avete prenotato?\nCliente: Buonasera, sì, ho prenotato un tavolo per due a nome di Rossi.\nCameriere: Perfetto, signor Rossi. Vi accompagno subito al vostro tavolo. Ecco i menu, vi lascio qualche minuto per decidere.\nCliente: Grazie. Cosa mi consiglia come primo piatto?\nCameriere: Il nostro chef oggi consiglia le tagliatelle ai funghi porcini, sono fresche e molto buone.\nCliente: Ottimo, prenderò quelle. E come secondo?\nCameriere: L'ossobuco alla milanese è una nostra specialità.\nCliente: Perfetto, allora per me tagliatelle e ossobuco. E da bere una bottiglia di vino rosso della casa.\nCameriere: Ottima scelta. Torno subito con il vostro ordine.",
    difficulty: "Beginner",
    type: "multiple-choice",
    questions: [
      {
        id: 1,
        question: "Dove si svolge questa conversazione?",
        options: ["In un bar", "In un ristorante", "In un hotel", "In un negozio"],
        correctAnswer: "In un ristorante",
      },
      {
        id: 2,
        question: "Quale primo piatto consiglia il cameriere?",
        options: ["Spaghetti alla carbonara", "Risotto allo zafferano", "Tagliatelle ai funghi porcini", "Lasagne alla bolognese"],
        correctAnswer: "Tagliatelle ai funghi porcini",
      },
      {
        id: 3,
        question: "Cosa ordina il cliente come secondo piatto?",
        options: ["Bistecca alla fiorentina", "Ossobuco alla milanese", "Pesce del giorno", "Pollo arrosto"],
        correctAnswer: "Ossobuco alla milanese",
      },
      {
        id: 4,
        question: "Il cliente ha prenotato un tavolo?",
        options: ["Sì", "No", "Non è chiaro dal dialogo", "Ha provato ma non c'era disponibilità"],
        correctAnswer: "Sì",
      }
    ],
  }
];
