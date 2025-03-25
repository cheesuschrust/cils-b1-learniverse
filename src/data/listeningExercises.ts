
// Listening exercises data for the Italian language learning app

interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  translation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: {
    id: string;
    question: string;
    options?: string[];
    correctAnswer: string;
  }[];
  type: 'comprehension' | 'dictation' | 'fill-in-the-blank';
  language: 'italian' | 'english';
  duration: number; // in seconds
}

// Mock audio URLs - in a real app, these would be actual URLs to audio files
const AUDIO_BASE_URL = "https://example.com/audio/";

export const listeningExercises: ListeningExercise[] = [
  // Beginner Comprehension Exercises
  {
    id: "beginner-comp-1",
    title: "At the Café",
    audioUrl: `${AUDIO_BASE_URL}cafe.mp3`,
    transcript: "Buongiorno, vorrei un cappuccino e un cornetto, per favore. Quanto costa?",
    translation: "Good morning, I would like a cappuccino and a croissant, please. How much is it?",
    difficulty: "beginner",
    type: "comprehension",
    language: "italian",
    duration: 5,
    questions: [
      {
        id: "q1-beginner-comp-1",
        question: "What does the person order?",
        options: [
          "An espresso and a sandwich",
          "A cappuccino and a croissant",
          "A latte and a pastry",
          "A tea and a croissant"
        ],
        correctAnswer: "A cappuccino and a croissant"
      },
      {
        id: "q2-beginner-comp-1",
        question: "What does the person ask after ordering?",
        options: [
          "Where is the bathroom",
          "If they have any specials",
          "How much it costs",
          "For the time"
        ],
        correctAnswer: "How much it costs"
      }
    ]
  },
  {
    id: "beginner-comp-2",
    title: "Introducing Yourself",
    audioUrl: `${AUDIO_BASE_URL}introduction.mp3`,
    transcript: "Ciao! Mi chiamo Marco. Sono italiano, di Roma. E tu, come ti chiami? Di dove sei?",
    translation: "Hi! My name is Marco. I'm Italian, from Rome. And you, what's your name? Where are you from?",
    difficulty: "beginner",
    type: "comprehension",
    language: "italian",
    duration: 8,
    questions: [
      {
        id: "q1-beginner-comp-2",
        question: "What is the speaker's name?",
        options: [
          "Mario",
          "Marco",
          "Matteo",
          "Michele"
        ],
        correctAnswer: "Marco"
      },
      {
        id: "q2-beginner-comp-2",
        question: "Where is the speaker from?",
        options: [
          "Milan",
          "Naples",
          "Rome",
          "Florence"
        ],
        correctAnswer: "Rome"
      },
      {
        id: "q3-beginner-comp-2",
        question: "What does the speaker ask at the end?",
        options: [
          "Your age and profession",
          "Your name and where you're from",
          "If you speak Italian",
          "If you've been to Italy"
        ],
        correctAnswer: "Your name and where you're from"
      }
    ]
  },
  
  // Intermediate Comprehension Exercises
  {
    id: "intermediate-comp-1",
    title: "Planning a Trip",
    audioUrl: `${AUDIO_BASE_URL}planning-trip.mp3`,
    transcript: "Pensavo di visitare l'Italia quest'estate. Vorrei vedere Roma, Firenze e Venezia. Quanto tempo mi consigli di passare in ogni città? E qual è il modo migliore per spostarsi tra le città?",
    translation: "I was thinking of visiting Italy this summer. I would like to see Rome, Florence, and Venice. How much time do you recommend spending in each city? And what's the best way to travel between cities?",
    difficulty: "intermediate",
    type: "comprehension",
    language: "italian",
    duration: 15,
    questions: [
      {
        id: "q1-intermediate-comp-1",
        question: "When does the speaker want to visit Italy?",
        options: [
          "This spring",
          "This summer",
          "This fall",
          "This winter"
        ],
        correctAnswer: "This summer"
      },
      {
        id: "q2-intermediate-comp-1",
        question: "Which cities does the speaker want to visit?",
        options: [
          "Rome, Milan, and Naples",
          "Rome, Florence, and Venice",
          "Milan, Venice, and Florence",
          "Naples, Rome, and Sicily"
        ],
        correctAnswer: "Rome, Florence, and Venice"
      },
      {
        id: "q3-intermediate-comp-1",
        question: "What information is the speaker asking for?",
        options: [
          "Hotel recommendations and restaurant tips",
          "Time allocation and transportation options",
          "Weather information and proper attire",
          "Tourist attractions and opening hours"
        ],
        correctAnswer: "Time allocation and transportation options"
      }
    ]
  },
  {
    id: "intermediate-comp-2",
    title: "At the Restaurant",
    audioUrl: `${AUDIO_BASE_URL}restaurant.mp3`,
    transcript: "Buonasera, avete un tavolo per due persone? Vorremmo cenare adesso. Potrebbe consigliarci qualche specialità della casa? Io preferisco piatti di pesce, mentre mia moglie è vegetariana. Avete opzioni vegetariane?",
    translation: "Good evening, do you have a table for two? We would like to have dinner now. Could you recommend some house specialties? I prefer fish dishes, while my wife is vegetarian. Do you have vegetarian options?",
    difficulty: "intermediate",
    type: "comprehension",
    language: "italian",
    duration: 20,
    questions: [
      {
        id: "q1-intermediate-comp-2",
        question: "How many people need a table?",
        options: [
          "One",
          "Two",
          "Three",
          "Four"
        ],
        correctAnswer: "Two"
      },
      {
        id: "q2-intermediate-comp-2",
        question: "What does the speaker ask for recommendations on?",
        options: [
          "Wine options",
          "Dessert options",
          "House specialties",
          "Daily menu"
        ],
        correctAnswer: "House specialties"
      },
      {
        id: "q3-intermediate-comp-2",
        question: "What dietary requirement does the speaker mention?",
        options: [
          "Gluten-free",
          "Vegetarian",
          "Vegan",
          "Lactose-free"
        ],
        correctAnswer: "Vegetarian"
      },
      {
        id: "q4-intermediate-comp-2",
        question: "Who is vegetarian?",
        options: [
          "The speaker",
          "The speaker's wife",
          "Both of them",
          "Neither of them"
        ],
        correctAnswer: "The speaker's wife"
      }
    ]
  },
  
  // Advanced Comprehension Exercises
  {
    id: "advanced-comp-1",
    title: "Climate Change Discussion",
    audioUrl: `${AUDIO_BASE_URL}climate-change.mp3`,
    transcript: "Il cambiamento climatico rappresenta una delle sfide più urgenti del nostro tempo. Secondo gli scienziati, le temperature medie globali continuano ad aumentare a causa delle emissioni di gas serra. È necessario adottare misure più rigorose per ridurre queste emissioni e promuovere fonti di energia rinnovabile. Tuttavia, ciò richiede un impegno congiunto da parte di governi, aziende e cittadini di tutto il mondo.",
    translation: "Climate change represents one of the most urgent challenges of our time. According to scientists, global average temperatures continue to rise due to greenhouse gas emissions. More stringent measures need to be adopted to reduce these emissions and promote renewable energy sources. However, this requires a joint commitment from governments, businesses, and citizens around the world.",
    difficulty: "advanced",
    type: "comprehension",
    language: "italian",
    duration: 25,
    questions: [
      {
        id: "q1-advanced-comp-1",
        question: "According to the audio, what is causing the increase in global average temperatures?",
        options: [
          "Solar activity",
          "Greenhouse gas emissions",
          "Natural climate cycles",
          "Deforestation"
        ],
        correctAnswer: "Greenhouse gas emissions"
      },
      {
        id: "q2-advanced-comp-1",
        question: "What does the speaker suggest is necessary to address climate change?",
        options: [
          "Individual action only",
          "Government regulation only",
          "Corporate responsibility only",
          "A joint commitment from governments, businesses, and citizens"
        ],
        correctAnswer: "A joint commitment from governments, businesses, and citizens"
      },
      {
        id: "q3-advanced-comp-1",
        question: "What should be promoted according to the speaker?",
        options: [
          "Nuclear energy",
          "Fossil fuels",
          "Renewable energy sources",
          "Coal power plants"
        ],
        correctAnswer: "Renewable energy sources"
      },
      {
        id: "q4-advanced-comp-1",
        question: "How does the speaker characterize climate change?",
        options: [
          "A minor issue",
          "One of the most urgent challenges of our time",
          "A problem for future generations",
          "A natural phenomenon"
        ],
        correctAnswer: "One of the most urgent challenges of our time"
      }
    ]
  },
  
  // Beginner Dictation Exercises
  {
    id: "beginner-dict-1",
    title: "Basic Greetings",
    audioUrl: `${AUDIO_BASE_URL}basic-greetings.mp3`,
    transcript: "Buongiorno. Come stai? Io sto bene, grazie. Arrivederci.",
    translation: "Good morning. How are you? I'm well, thank you. Goodbye.",
    difficulty: "beginner",
    type: "dictation",
    language: "italian",
    duration: 6,
    questions: []
  },
  {
    id: "beginner-dict-2",
    title: "At the Hotel",
    audioUrl: `${AUDIO_BASE_URL}hotel.mp3`,
    transcript: "Buonasera. Ho una prenotazione a nome Rossi. Una camera doppia per tre notti, per favore.",
    translation: "Good evening. I have a reservation under the name Rossi. A double room for three nights, please.",
    difficulty: "beginner",
    type: "dictation",
    language: "italian",
    duration: 8,
    questions: []
  },
  
  // Intermediate Dictation Exercises
  {
    id: "intermediate-dict-1",
    title: "Weather Forecast",
    audioUrl: `${AUDIO_BASE_URL}weather.mp3`,
    transcript: "Le previsioni meteo per domani: al nord ci sarà pioggia per tutta la giornata, al centro nubi sparse con possibili schiarite nel pomeriggio, mentre al sud il tempo sarà soleggiato con temperature fino a 28 gradi.",
    translation: "Weather forecast for tomorrow: in the north there will be rain throughout the day, in the center scattered clouds with possible clearing in the afternoon, while in the south the weather will be sunny with temperatures up to 28 degrees.",
    difficulty: "intermediate",
    type: "dictation",
    language: "italian",
    duration: 15,
    questions: []
  },
  {
    id: "intermediate-dict-2",
    title: "Making Plans",
    audioUrl: `${AUDIO_BASE_URL}making-plans.mp3`,
    transcript: "Cosa facciamo questo fine settimana? Potremmo andare al cinema venerdì sera, e sabato fare una gita al lago. Domenica possiamo riposare o invitare amici per una cena a casa. Tu che preferisci?",
    translation: "What shall we do this weekend? We could go to the cinema on Friday evening, and on Saturday take a trip to the lake. On Sunday we can rest or invite friends over for dinner at home. What do you prefer?",
    difficulty: "intermediate",
    type: "dictation",
    language: "italian",
    duration: 17,
    questions: []
  },
  
  // Advanced Dictation Exercises
  {
    id: "advanced-dict-1",
    title: "Italian Culture",
    audioUrl: `${AUDIO_BASE_URL}italian-culture.mp3`,
    transcript: "La cultura italiana è famosa in tutto il mondo per la sua ricca storia, arte, cucina e tradizioni. L'Italia ha dato i natali a numerosi artisti, scrittori e inventori che hanno influenzato profondamente la civiltà occidentale. Dal Rinascimento alle moderne tendenze del design, l'influenza italiana si fa sentire in molteplici ambiti culturali.",
    translation: "Italian culture is famous worldwide for its rich history, art, cuisine, and traditions. Italy has given birth to numerous artists, writers, and inventors who have profoundly influenced Western civilization. From the Renaissance to modern design trends, Italian influence is felt in multiple cultural fields.",
    difficulty: "advanced",
    type: "dictation",
    language: "italian",
    duration: 22,
    questions: []
  },
  {
    id: "advanced-dict-2",
    title: "Environmental Issues",
    audioUrl: `${AUDIO_BASE_URL}environmental-issues.mp3`,
    transcript: "L'inquinamento ambientale rappresenta una minaccia significativa per gli ecosistemi e la biodiversità. La contaminazione dell'aria, dell'acqua e del suolo ha conseguenze dirette sulla salute umana e sulla sopravvivenza di numerose specie animali e vegetali. È fondamentale adottare politiche sostenibili e promuovere una maggiore consapevolezza riguardo alle problematiche ambientali.",
    translation: "Environmental pollution represents a significant threat to ecosystems and biodiversity. Contamination of air, water, and soil has direct consequences on human health and the survival of numerous animal and plant species. It is essential to adopt sustainable policies and promote greater awareness regarding environmental issues.",
    difficulty: "advanced",
    type: "dictation",
    language: "italian",
    duration: 25,
    questions: []
  }
];

export default listeningExercises;
