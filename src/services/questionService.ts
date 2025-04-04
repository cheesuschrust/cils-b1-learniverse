
import { useToast } from "@/hooks/use-toast";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
  explanation?: string;
}

// Simulate API fetch with a promise
export const getDailyQuestion = async (): Promise<Question> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock question
  return {
    id: "q1",
    text: "Quale di queste città è la capitale d'Italia?",
    options: ["Milano", "Roma", "Firenze", "Napoli"],
    correctAnswer: "Roma",
    category: "Geografia",
    difficulty: "Facile",
    explanation: "Roma è la capitale d'Italia dal 1871."
  };
};

// Function to get a random daily question
export const getRandomQuestion = (): Question => {
  const questions = [
    {
      id: "q2",
      text: "Quale documento è necessario per richiedere la cittadinanza italiana?",
      options: ["Passaporto", "Certificato di nascita", "Certificato di matrimonio", "Tutti i precedenti"],
      correctAnswer: "Tutti i precedenti",
      category: "Cittadinanza",
      difficulty: "Intermedio"
    },
    {
      id: "q3",
      text: "Quale articolo della Costituzione Italiana garantisce l'uguaglianza di tutti i cittadini?",
      options: ["Articolo 1", "Articolo 2", "Articolo 3", "Articolo 4"],
      correctAnswer: "Articolo 3",
      category: "Costituzione",
      difficulty: "Intermedio"
    },
    {
      id: "q4",
      text: "Come si dice 'to eat' in italiano?",
      options: ["Bere", "Mangiare", "Dormire", "Parlare"],
      correctAnswer: "Mangiare",
      category: "Vocabolario",
      difficulty: "Facile"
    }
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
};
