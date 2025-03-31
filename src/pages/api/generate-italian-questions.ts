import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { QuestionGenerationParams, AIGeneratedQuestion, ItalianLevel, ItalianTestSection } from '@/types/italian-types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      userId,
      italianLevel,
      testSection,
      isCitizenshipFocused,
      topics = [],
      count = 5
    } = req.body as QuestionGenerationParams & { userId: string };

    // Validate required parameters
    if (!userId || !italianLevel || !testSection) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // In a production app, we would call an AI service to generate questions
    // For now, we'll generate mock questions based on the Italian citizenship test
    const mockQuestions = generateMockItalianQuestions(
      italianLevel,
      testSection,
      isCitizenshipFocused,
      topics,
      count
    );

    // Return the generated questions
    return res.status(200).json({ questions: mockQuestions });
  } catch (error) {
    console.error('Error generating Italian questions:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

function generateMockItalianQuestions(
  level: ItalianLevel,
  section: ItalianTestSection,
  isCitizenshipFocused: boolean,
  topics: string[],
  count: number
): AIGeneratedQuestion[] {
  const questions: AIGeneratedQuestion[] = [];

  // Generate different types of questions based on the section
  for (let i = 0; i < count; i++) {
    switch (section) {
      case 'grammar':
        questions.push(createGrammarQuestion(level, isCitizenshipFocused));
        break;
      case 'vocabulary':
        questions.push(createVocabularyQuestion(level, isCitizenshipFocused));
        break;
      case 'culture':
        questions.push(createCultureQuestion(level, isCitizenshipFocused));
        break;
      case 'listening':
        questions.push(createListeningQuestion(level, isCitizenshipFocused));
        break;
      case 'reading':
        questions.push(createReadingQuestion(level, isCitizenshipFocused));
        break;
      case 'writing':
        questions.push(createWritingQuestion(level, isCitizenshipFocused));
        break;
      case 'speaking':
        questions.push(createSpeakingQuestion(level, isCitizenshipFocused));
        break;
      default:
        questions.push(createVocabularyQuestion(level, isCitizenshipFocused));
    }
  }

  return questions;
}

function createGrammarQuestion(level: ItalianLevel, isCitizenshipFocused: boolean): AIGeneratedQuestion {
  const questions = [
    {
      text: "Qual è la forma corretta del passato prossimo di 'andare'?",
      options: ["Ho andato", "Sono andato", "Ho ito", "Sono ito"],
      correctAnswer: "Sono andato",
      explanation: "Il verbo 'andare' usa l'ausiliare 'essere' nel passato prossimo, non 'avere'.",
      citizenship: false
    },
    {
      text: "Quale di queste frasi usa correttamente il congiuntivo?",
      options: [
        "Penso che lui è arrivato.",
        "Penso che lui ha arrivato.",
        "Penso che lui sia arrivato.",
        "Penso che lui arriva."
      ],
      correctAnswer: "Penso che lui sia arrivato.",
      explanation: "Dopo 'penso che' si usa il congiuntivo (sia arrivato), non l'indicativo.",
      citizenship: false
    },
    {
      text: "Quale forma è corretta quando si presenta una richiesta formale?",
      options: [
        "Dammi il modulo per la cittadinanza.",
        "Mi dia il modulo per la cittadinanza, per favore.",
        "Voglio il modulo per la cittadinanza.",
        "Mi dà il modulo per la cittadinanza."
      ],
      correctAnswer: "Mi dia il modulo per la cittadinanza, per favore.",
      explanation: "Per una richiesta formale si usa il congiuntivo presente e 'per favore'.",
      citizenship: true
    }
  ];

  const filteredQuestions = isCitizenshipFocused 
    ? questions.filter(q => q.citizenship)
    : questions;

  const selectedQuestion = filteredQuestions.length > 0
    ? filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
    : questions[0];

  return {
    id: uuidv4(),
    text: selectedQuestion.text,
    options: selectedQuestion.options,
    correctAnswer: selectedQuestion.correctAnswer,
    explanation: selectedQuestion.explanation,
    type: 'grammar',
    difficulty: level,
    isCitizenshipRelevant: selectedQuestion.citizenship
  };
}

function createVocabularyQuestion(level: ItalianLevel, isCitizenshipFocused: boolean): AIGeneratedQuestion {
  const questions = [
    {
      text: "Cosa significa la parola 'sindaco'?",
      options: ["Mayor", "Senator", "Judge", "Minister"],
      correctAnswer: "Mayor",
      explanation: "Il sindaco è il capo dell'amministrazione comunale.",
      citizenship: true
    },
    {
      text: "Quale di queste parole significa 'ricevuta fiscale'?",
      options: ["Tax invoice", "Receipt", "Bill", "Financial document"],
      correctAnswer: "Receipt",
      explanation: "La ricevuta fiscale è un documento che attesta un pagamento effettuato.",
      citizenship: false
    },
    {
      text: "Cosa significa la sigla 'INPS'?",
      options: [
        "Istituto Nazionale Poste e Servizi",
        "Istituto Nazionale Previdenza Sociale",
        "Istituto Nazionale Pubblica Sicurezza",
        "Istituto Nazionale Patrimonio Storico"
      ],
      correctAnswer: "Istituto Nazionale Previdenza Sociale",
      explanation: "L'INPS è l'ente nazionale che gestisce le pensioni e i contributi sociali in Italia.",
      citizenship: true
    }
  ];

  const filteredQuestions = isCitizenshipFocused 
    ? questions.filter(q => q.citizenship)
    : questions;

  const selectedQuestion = filteredQuestions.length > 0
    ? filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
    : questions[0];

  return {
    id: uuidv4(),
    text: selectedQuestion.text,
    options: selectedQuestion.options,
    correctAnswer: selectedQuestion.correctAnswer,
    explanation: selectedQuestion.explanation,
    type: 'vocabulary',
    difficulty: level,
    isCitizenshipRelevant: selectedQuestion.citizenship
  };
}

function createCultureQuestion(level: ItalianLevel, isCitizenshipFocused: boolean): AIGeneratedQuestion {
  const questions = [
    {
      text: "Quale data segna la nascita della Repubblica Italiana?",
      options: ["25 aprile 1945", "2 giugno 1946", "17 marzo 1861", "1 gennaio 1948"],
      correctAnswer: "2 giugno 1946",
      explanation: "Il 2 giugno 1946 si tenne il referendum con cui gli italiani scelsero la Repubblica invece della monarchia.",
      citizenship: true
    },
    {
      text: "Chi è l'attuale Presidente della Repubblica Italiana (2023)?",
      options: ["Mario Draghi", "Giuseppe Conte", "Sergio Mattarella", "Giorgio Napolitano"],
      correctAnswer: "Sergio Mattarella",
      explanation: "Sergio Mattarella è il 12° Presidente della Repubblica Italiana, rieletto il 29 gennaio 2022.",
      citizenship: true
    },
    {
      text: "Quale tra questi è un monumento simbolo di Roma?",
      options: ["Torre di Pisa", "Colosseo", "Duomo di Milano", "Basilica di San Marco"],
      correctAnswer: "Colosseo",
      explanation: "Il Colosseo, o Anfiteatro Flavio, è il più grande anfiteatro romano e simbolo di Roma.",
      citizenship: false
    }
  ];

  const filteredQuestions = isCitizenshipFocused 
    ? questions.filter(q => q.citizenship)
    : questions;

  const selectedQuestion = filteredQuestions.length > 0
    ? filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
    : questions[0];

  return {
    id: uuidv4(),
    text: selectedQuestion.text,
    options: selectedQuestion.options,
    correctAnswer: selectedQuestion.correctAnswer,
    explanation: selectedQuestion.explanation,
    type: 'culture',
    difficulty: level,
    isCitizenshipRelevant: selectedQuestion.citizenship
  };
}

function createListeningQuestion(level: ItalianLevel, isCitizenshipFocused: boolean): AIGeneratedQuestion {
  // In a real app, this would link to an audio file
  return {
    id: uuidv4(),
    text: "Ascolteresti un audio e poi risponderesti a questa domanda: Quale servizio viene descritto nell'annuncio?",
    options: [
      "Servizio anagrafe", 
      "Servizio immigrazione", 
      "Servizio sanitario", 
      "Servizio scuola"
    ],
    correctAnswer: "Servizio immigrazione",
    explanation: "L'annuncio descrive gli orari e la posizione dell'ufficio immigrazione del comune.",
    type: 'listening',
    difficulty: level,
    isCitizenshipRelevant: isCitizenshipFocused
  };
}

function createReadingQuestion(level: ItalianLevel, isCitizenshipFocused: boolean): AIGeneratedQuestion {
  // This would typically include a passage to read
  return {
    id: uuidv4(),
    text: "Leggi il seguente testo: 'Per richiedere la cittadinanza italiana è necessario presentare domanda presso la Prefettura della provincia di residenza. I documenti richiesti includono il certificato di nascita, il certificato penale e la prova di residenza legale.' \n\nQuale ufficio è responsabile per le domande di cittadinanza?",
    options: [
      "Comune", 
      "Questura", 
      "Prefettura", 
      "Ambasciata"
    ],
    correctAnswer: "Prefettura",
    explanation: "Come indicato nel testo, le domande di cittadinanza vanno presentate presso la Prefettura della provincia di residenza.",
    type: 'reading',
    difficulty: level,
    isCitizenshipRelevant: true
  };
}

function createWritingQuestion(level: ItalianLevel, isCitizenshipFocused: boolean): AIGeneratedQuestion {
  // Writing questions would typically not have options but for this example we'll provide a prompt
  return {
    id: uuidv4(),
    text: "Quale di queste frasi è scritta correttamente?",
    options: [
      "Io ho richieduto la cittadinanza italiana l'anno scorso.", 
      "Io ho richiesto la cittadinanza italiana l'anno scorso.", 
      "Io avevo richiesto la cittadinanza italiana l'anno scorso.", 
      "Io richiedevo la cittadinanza italiana l'anno scorso."
    ],
    correctAnswer: "Io ho richiesto la cittadinanza italiana l'anno scorso.",
    explanation: "La forma corretta del passato prossimo del verbo 'richiedere' è 'ho richiesto'.",
    type: 'writing',
    difficulty: level,
    isCitizenshipRelevant: true
  };
}

function createSpeakingQuestion(level: ItalianLevel, isCitizenshipFocused: boolean): AIGeneratedQuestion {
  // Speaking questions would typically require recording, but we'll use a text prompt
  return {
    id: uuidv4(),
    text: "Come risponderesti a questa domanda in un colloquio: 'Perché vuole ottenere la cittadinanza italiana?'",
    options: [
      "Voglio la cittadinanza perché è facile.", 
      "Desidero diventare cittadino italiano perché amo la cultura e la lingua italiana.", 
      "Dammi la cittadinanza subito.", 
      "Non lo so perché voglio la cittadinanza."
    ],
    correctAnswer: "Desidero diventare cittadino italiano perché amo la cultura e la lingua italiana.",
    explanation: "Questa risposta è formale, rispettosa e mostra una motivazione positiva.",
    type: 'speaking',
    difficulty: level,
    isCitizenshipRelevant: true
  };
}

function getDifficultyForLevel(level: ItalianLevel): number {
  switch (level) {
    case 'A1': return 1;
    case 'A2': return 2;
    case 'B1': return 3;
    case 'B2': return 4;
    case 'C1': return 5;
    case 'C2': return 6;
    default: return 3; // Default to B1 level
  }
}
