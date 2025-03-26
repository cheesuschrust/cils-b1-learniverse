
export const analyticsData = {
  users: {
    total: 5428,
    active: 2875,
    newToday: 42,
    growth: 8.2,
    premium: 1345,
    free: 4083,
    retentionRate: 76,
    averageSessionTime: 28,
    lastMonthActive: [
      { date: '2023-01-01', users: 2450 },
      { date: '2023-01-02', users: 2490 },
      { date: '2023-01-03', users: 2650 },
      { date: '2023-01-04', users: 2700 },
      { date: '2023-01-05', users: 2710 },
      { date: '2023-01-06', users: 2690 },
      { date: '2023-01-07', users: 2800 },
      { date: '2023-01-08', users: 2820 },
      { date: '2023-01-09', users: 2750 },
      { date: '2023-01-10', users: 2790 },
      { date: '2023-01-11', users: 2840 },
      { date: '2023-01-12', users: 2875 }
    ],
    byPlan: [
      { name: 'Free', value: 4083 },
      { name: 'Basic', value: 782 },
      { name: 'Premium', value: 563 }
    ],
    byCountry: [
      { name: 'United States', value: 1856 },
      { name: 'Italy', value: 1245 },
      { name: 'United Kingdom', value: 734 },
      { name: 'Germany', value: 489 },
      { name: 'France', value: 456 },
      { name: 'Other', value: 648 }
    ]
  },
  content: {
    totalLessons: 345,
    completedLessons: 187594,
    flashcards: 4256,
    averageScore: 82.5,
    popularCategories: [
      { name: 'Vocabulary', value: 42 },
      { name: 'Grammar', value: 28 },
      { name: 'Conversation', value: 16 },
      { name: 'Reading', value: 14 }
    ],
    topPerformingContent: [
      { name: 'Basic Italian Greetings', completions: 3856, rating: 4.8 },
      { name: 'Present Tense Verbs', completions: 3245, rating: 4.7 },
      { name: 'Food and Dining Vocabulary', completions: 2987, rating: 4.9 },
      { name: 'Travel Phrases', completions: 2876, rating: 4.6 },
      { name: 'Numbers 1-100', completions: 2754, rating: 4.5 }
    ]
  },
  aiUsage: {
    totalProcessed: 127543,
    speechRecognition: 34567,
    textGeneration: 56789,
    translation: 23487,
    flashcardGeneration: 12700,
    accuracy: {
      overall: 92.5,
      speechRecognition: 89.4,
      textGeneration: 94.7,
      translation: 96.2,
      flashcardGeneration: 91.8
    },
    byDay: [
      { day: 'Monday', requests: 18456 },
      { day: 'Tuesday', requests: 21345 },
      { day: 'Wednesday', requests: 22567 },
      { day: 'Thursday', requests: 19876 },
      { day: 'Friday', requests: 17654 },
      { day: 'Saturday', requests: 15678 },
      { day: 'Sunday', requests: 12567 }
    ]
  },
  revenue: {
    totalMRR: 14876,
    growth: 12.4,
    conversionRate: 6.8,
    averageRevenue: 24.56,
    bySubscription: [
      { plan: 'Monthly Basic', count: 452, revenue: 4520 },
      { plan: 'Monthly Premium', count: 234, revenue: 3510 },
      { plan: 'Annual Basic', count: 178, revenue: 3204 },
      { plan: 'Annual Premium', count: 124, revenue: 3472 },
      { plan: 'Lifetime', count: 34, revenue: 170 }
    ],
    byMonth: [
      { month: 'Jan', revenue: 10245 },
      { month: 'Feb', revenue: 10876 },
      { month: 'Mar', revenue: 11567 },
      { month: 'Apr', revenue: 12345 },
      { month: 'May', revenue: 12987 },
      { month: 'Jun', revenue: 13456 },
      { month: 'Jul', revenue: 13987 },
      { month: 'Aug', revenue: 14567 },
      { month: 'Sep', revenue: 14876 }
    ]
  }
};
