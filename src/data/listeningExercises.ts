
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
  feedbackLanguage?: "english" | "italian" | "both";
}

// Function to extract text content from various file types
export const extractContentFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  
  // Text files
  if (fileType.startsWith("text/") || 
      fileType === "application/rtf" || 
      file.name.endsWith(".txt") || 
      file.name.endsWith(".md")) {
    return await file.text();
  }
  
  // PDF files - in a real app, would use PDF.js or similar
  if (fileType === "application/pdf" || file.name.endsWith(".pdf")) {
    return "PDF content extraction would occur here with an actual PDF processing library";
  }
  
  // Audio files - in a real app, would use a speech-to-text service
  if (fileType.startsWith("audio/")) {
    return "Audio transcription would occur here with a speech recognition service. In a production environment, this would connect to a service like Web Speech API, Azure Speech Services, or Google Cloud Speech-to-Text.";
  }
  
  // Word documents - in a real app, would use a docx parser
  if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword" ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".doc")) {
    return "Word document content extraction would occur here";
  }
  
  // Image files - in a real app, would use OCR
  if (fileType.startsWith("image/")) {
    return "Image text extraction via OCR would occur here";
  }
  
  // Unknown type
  return "Content extraction for this file type is not supported";
};

// Generate questions based on text content
export const generateQuestions = (content: string, count: number = 4): ListeningQuestion[] => {
  // This is a simplified version - in a real app, this would use NLP or an AI service
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const questions: ListeningQuestion[] = [];
  
  // Generate questions based on the content
  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    const sentence = sentences[i].trim();
    const words = sentence.split(' ').filter(w => w.length > 3);
    
    if (words.length < 3) continue;
    
    // Key word for the question
    const keyWord = words[Math.floor(Math.random() * words.length)];
    
    // Create a question about the sentence
    const question = `What is mentioned about "${keyWord}" in the content?`;
    
    // Generate options with one correct answer
    const correctAnswer = `It's described in relation to "${sentence.substring(0, 50)}..."`;
    const incorrectOptions = [
      "It's not mentioned in this context",
      `It's described as unimportant`,
      `It's only mentioned in passing`
    ];
    
    // Shuffle options
    const options = [correctAnswer, ...incorrectOptions]
      .sort(() => Math.random() - 0.5);
    
    questions.push({
      id: i + 1,
      question,
      options,
      correctAnswer
    });
  }
  
  return questions;
};

// Function to generate bilingual feedback for student responses
export const generateBilingualFeedback = (
  accuracy: number, 
  language: "english" | "italian" | "both" = "both",
  detailed: boolean = false
): { english: string, italian: string } => {
  // Define feedback templates for different accuracy levels
  const feedbackTemplates = {
    high: {
      english: detailed 
        ? "Excellent work! Your answer demonstrates a strong understanding of the content. Your comprehension is very good, and you've correctly identified the main points."
        : "Excellent work! Your comprehension is very good.",
      italian: detailed
        ? "Ottimo lavoro! La tua risposta dimostra una forte comprensione del contenuto. La tua comprensione è molto buona e hai identificato correttamente i punti principali."
        : "Ottimo lavoro! La tua comprensione è molto buona."
    },
    medium: {
      english: detailed
        ? "Good effort! You've understood most of the content, but there are a few details that could be improved. Try to focus on the specific context next time."
        : "Good effort! You've understood most of the content.",
      italian: detailed
        ? "Buon impegno! Hai compreso la maggior parte del contenuto, ma ci sono alcuni dettagli che potrebbero essere migliorati. Prova a concentrarti sul contesto specifico la prossima volta."
        : "Buon impegno! Hai compreso la maggior parte del contenuto."
    },
    low: {
      english: detailed
        ? "Keep practicing! You're making progress, but this answer shows some misunderstanding of the content. Try listening to the audio again and focus on key words and phrases."
        : "Keep practicing! You're making progress.",
      italian: detailed
        ? "Continua a esercitarti! Stai facendo progressi, ma questa risposta mostra alcune incomprensioni del contenuto. Prova ad ascoltare nuovamente l'audio e concentrati sulle parole e frasi chiave."
        : "Continua a esercitarti! Stai facendo progressi."
    }
  };
  
  // Determine feedback level based on accuracy
  let feedbackLevel;
  if (accuracy >= 0.8) {
    feedbackLevel = 'high';
  } else if (accuracy >= 0.5) {
    feedbackLevel = 'medium';
  } else {
    feedbackLevel = 'low';
  }
  
  // Get appropriate feedback
  const feedback = feedbackTemplates[feedbackLevel];
  
  // Return feedback in requested language(s)
  if (language === "english") {
    return { english: feedback.english, italian: "" };
  } else if (language === "italian") {
    return { english: "", italian: feedback.italian };
  } else {
    return feedback;
  }
};

// Function to add a new listening exercise
export const addListeningExercise = (
  title: string, 
  audioUrl: string, 
  transcript: string,
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  feedbackLanguage: "english" | "italian" | "both" = "both",
  customQuestions?: ListeningQuestion[]
): ListeningExercise => {
  const newId = Math.max(...listeningExercises.map(ex => ex.id), 0) + 1;
  
  // Generate questions if not provided
  const questions = customQuestions || generateQuestions(transcript);
  
  const newExercise: ListeningExercise = {
    id: newId,
    title,
    audioUrl,
    transcript,
    difficulty,
    type: "multiple-choice",
    questions,
    feedbackLanguage
  };
  
  // Add to the array
  listeningExercises.push(newExercise);
  
  return newExercise;
};

// Current listening exercises
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
