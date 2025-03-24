
// This is a simplified mock version of the AIService

export const generateText = async (
  prompt: string, 
  options: any = {}
): Promise<string> => {
  // Mock implementation
  return `Generated text for: ${prompt}`;
};

export const classifyText = async (
  text: string
): Promise<{ label: string; score: number }[]> => {
  // Mock implementation
  return [
    { label: "multiple-choice", score: 0.8 },
    { label: "flashcards", score: 0.3 },
  ];
};

export const generateQuestions = async (
  content: string,
  contentType: string,
  count: number = 5,
  difficulty: string = "Intermediate"
): Promise<any[]> => {
  // Mock implementation
  return Array(count).fill(null).map((_, i) => ({
    id: `q-${i}`,
    question: `Sample question ${i+1} about ${content.substring(0, 20)}...`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswerIndex: 0,
    difficulty,
    type: contentType
  }));
};

export const initialize = async (config: any): Promise<boolean> => {
  // Mock implementation
  return true;
};

export const testConnection = async (): Promise<{ success: boolean, message: string }> => {
  // Mock implementation
  return { success: true, message: "AI service connection successful" };
};

export const processText = async (
  text: string, 
  processingType: string
): Promise<any> => {
  // Mock implementation
  return {
    text,
    processingType,
    confidence: Math.random() * 100
  };
};

export const processImage = async (
  imageUrl: string, 
  prompt: string
): Promise<any> => {
  // Mock implementation
  return {
    imageUrl,
    prompt,
    confidence: Math.random() * 100
  };
};

// Add the missing functions needed by AITrainingUtils.ts
export const addTrainingExamples = (
  contentType: string,
  examples: any[]
): number => {
  // Mock implementation
  console.log(`Added ${examples.length} training examples for ${contentType}`);
  return examples.length;
};

export const getConfidenceScore = (contentType: string): number => {
  // Mock implementation
  const scores: Record<string, number> = {
    'multiple-choice': 85,
    'flashcards': 80,
    'writing': 75,
    'speaking': 70,
    'listening': 90
  };
  
  return scores[contentType] || 60;
};

// Add speech recognition capabilities
export const recognizeSpeech = async (
  audioBlob: Blob,
  language: 'it' | 'en' = 'it'
): Promise<{ 
  text: string; 
  confidence: number; 
  matches?: { 
    text: string; 
    score: number; 
  }[] 
}> => {
  // Mock implementation
  // In a real implementation, this would send the audioBlob to a speech recognition service
  console.log(`Recognizing speech in ${language}`);
  
  // Wait for 1-2 seconds to simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const mockResponses: Record<string, string[]> = {
    it: [
      "Buongiorno, come stai oggi?",
      "Mi piace studiare l'italiano",
      "Vorrei visitare Roma l'anno prossimo",
      "La pizza è il mio cibo preferito",
      "Parlo italiano abbastanza bene"
    ],
    en: [
      "Good morning, how are you today?",
      "I enjoy studying Italian",
      "I would like to visit Rome next year",
      "Pizza is my favorite food",
      "I speak Italian quite well"
    ]
  };
  
  const response = mockResponses[language][Math.floor(Math.random() * 5)];
  
  return {
    text: response,
    confidence: 70 + Math.random() * 30,
    matches: [
      { text: response, score: 0.9 },
      { text: response.split(' ').slice(1).join(' '), score: 0.7 },
      { text: response.split(' ').slice(0, -1).join(' '), score: 0.6 }
    ]
  };
};

// Evaluate speech against reference text
export const evaluateSpeech = async (
  spokenText: string,
  referenceText: string,
  language: 'it' | 'en' = 'it'
): Promise<{
  score: number;
  feedback: string;
  errors: { word: string; suggestion: string; position: number }[];
}> => {
  // Mock implementation
  console.log(`Evaluating speech in ${language}: "${spokenText}" against "${referenceText}"`);
  
  // Simple mock evaluation
  const similarityScore = Math.random() * 40 + 60; // 60-100
  
  // Generate random errors
  const words = spokenText.split(' ');
  const referenceWords = referenceText.split(' ');
  
  const errors = [];
  if (words.length > 2) {
    // Add 1-3 random errors
    const errorCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < errorCount && i < words.length; i++) {
      const position = Math.floor(Math.random() * words.length);
      const correspondingWord = position < referenceWords.length ? referenceWords[position] : "";
      
      errors.push({
        word: words[position],
        suggestion: correspondingWord || "proper pronunciation",
        position
      });
    }
  }
  
  let feedback;
  if (similarityScore > 90) {
    feedback = language === 'it' 
      ? "Eccellente! La tua pronuncia è molto chiara."
      : "Excellent! Your pronunciation is very clear.";
  } else if (similarityScore > 75) {
    feedback = language === 'it'
      ? "Buono. La tua pronuncia è comprensibile, ma ci sono alcune aree da migliorare."
      : "Good. Your pronunciation is understandable, but there are some areas to improve.";
  } else {
    feedback = language === 'it'
      ? "Continua a praticare. Ci sono diversi errori di pronuncia."
      : "Keep practicing. There are several pronunciation errors.";
  }
  
  return {
    score: similarityScore,
    feedback,
    errors
  };
};

// Generate speech exercises
export const generateSpeechExercises = async (
  level: 'beginner' | 'intermediate' | 'advanced',
  count: number = 5,
  language: 'it' | 'en' = 'it'
): Promise<{
  id: string;
  text: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}[]> => {
  // Mock implementation
  console.log(`Generating ${count} ${level} speech exercises in ${language}`);
  
  const exercises: Record<string, Record<string, { text: string; translation: string }[]>> = {
    it: {
      beginner: [
        { text: "Buongiorno, come stai?", translation: "Good morning, how are you?" },
        { text: "Mi chiamo Marco. E tu?", translation: "My name is Marco. And you?" },
        { text: "Vorrei un caffè, per favore.", translation: "I would like a coffee, please." },
        { text: "Che bella giornata oggi!", translation: "What a beautiful day today!" },
        { text: "Dove si trova la stazione?", translation: "Where is the train station?" },
        { text: "Quanto costa questo libro?", translation: "How much does this book cost?" },
        { text: "Mi piace molto l'Italia.", translation: "I really like Italy." },
        { text: "Grazie mille per il tuo aiuto.", translation: "Thank you very much for your help." }
      ],
      intermediate: [
        { text: "Sto studiando l'italiano da tre anni.", translation: "I've been studying Italian for three years." },
        { text: "Vorrei prenotare un tavolo per due persone.", translation: "I would like to book a table for two people." },
        { text: "Qual è il piatto tipico di questa regione?", translation: "What is the typical dish of this region?" },
        { text: "Mi potresti consigliare un buon vino?", translation: "Could you recommend a good wine?" },
        { text: "Domani devo alzarmi presto per andare al lavoro.", translation: "Tomorrow I have to get up early to go to work." },
        { text: "Non capisco perché hai detto questo.", translation: "I don't understand why you said this." },
        { text: "Potrei avere il conto, per favore?", translation: "Could I have the bill, please?" }
      ],
      advanced: [
        { text: "Se avessi saputo che saresti venuto, avrei preparato qualcosa di speciale.", translation: "If I had known you were coming, I would have prepared something special." },
        { text: "Nonostante le difficoltà, siamo riusciti a completare il progetto in tempo.", translation: "Despite the difficulties, we managed to complete the project on time." },
        { text: "È fondamentale che tutti i cittadini rispettino le leggi e contribuiscano al bene comune.", translation: "It is essential that all citizens respect the laws and contribute to the common good." },
        { text: "La politica economica del governo mira a ridurre l'inflazione e aumentare l'occupazione.", translation: "The government's economic policy aims to reduce inflation and increase employment." },
        { text: "La sostenibilità ambientale dovrebbe essere una priorità per le aziende moderne.", translation: "Environmental sustainability should be a priority for modern companies." }
      ]
    },
    en: {
      beginner: [
        { text: "Good morning, how are you?", translation: "Buongiorno, come stai?" },
        { text: "My name is Marco. And you?", translation: "Mi chiamo Marco. E tu?" },
        { text: "I would like a coffee, please.", translation: "Vorrei un caffè, per favore." },
        { text: "What a beautiful day today!", translation: "Che bella giornata oggi!" },
        { text: "Where is the train station?", translation: "Dove si trova la stazione?" },
        { text: "How much does this book cost?", translation: "Quanto costa questo libro?" },
        { text: "I really like Italy.", translation: "Mi piace molto l'Italia." },
        { text: "Thank you very much for your help.", translation: "Grazie mille per il tuo aiuto." }
      ],
      intermediate: [
        { text: "I've been studying Italian for three years.", translation: "Sto studiando l'italiano da tre anni." },
        { text: "I would like to book a table for two people.", translation: "Vorrei prenotare un tavolo per due persone." },
        { text: "What is the typical dish of this region?", translation: "Qual è il piatto tipico di questa regione?" },
        { text: "Could you recommend a good wine?", translation: "Mi potresti consigliare un buon vino?" },
        { text: "Tomorrow I have to get up early to go to work.", translation: "Domani devo alzarmi presto per andare al lavoro." },
        { text: "I don't understand why you said this.", translation: "Non capisco perché hai detto questo." },
        { text: "Could I have the bill, please?", translation: "Potrei avere il conto, per favore?" }
      ],
      advanced: [
        { text: "If I had known you were coming, I would have prepared something special.", translation: "Se avessi saputo che saresti venuto, avrei preparato qualcosa di speciale." },
        { text: "Despite the difficulties, we managed to complete the project on time.", translation: "Nonostante le difficoltà, siamo riusciti a completare il progetto in tempo." },
        { text: "It is essential that all citizens respect the laws and contribute to the common good.", translation: "È fondamentale che tutti i cittadini rispettino le leggi e contribuiscano al bene comune." },
        { text: "The government's economic policy aims to reduce inflation and increase employment.", translation: "La politica economica del governo mira a ridurre l'inflazione e aumentare l'occupazione." },
        { text: "Environmental sustainability should be a priority for modern companies.", translation: "La sostenibilità ambientale dovrebbe essere una priorità per le aziende moderne." }
      ]
    }
  };
  
  // Select random exercises from the appropriate list
  const selectedExercises = exercises[language][level];
  const result = [];
  
  // Randomly select the requested number of exercises
  for (let i = 0; i < count; i++) {
    if (selectedExercises.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedExercises.length);
      const exercise = selectedExercises[randomIndex];
      
      result.push({
        id: `speech-exercise-${i}`,
        text: exercise.text,
        translation: exercise.translation,
        difficulty: level
      });
      
      // Remove the selected exercise to avoid duplicates
      selectedExercises.splice(randomIndex, 1);
    }
  }
  
  return result;
};

export const isCacheEnabled = true;
