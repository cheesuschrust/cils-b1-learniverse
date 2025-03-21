
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
  // You can add more exercises here
];
