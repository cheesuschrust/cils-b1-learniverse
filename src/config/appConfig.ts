
/**
 * Application Configuration
 * 
 * This file serves as the central configuration for application-specific settings.
 * Update this file to customize the application for different use cases.
 */

export const appConfig = {
  /**
   * Core application information
   */
  app: {
    name: "ItalianMaster",
    description: "Complete Italian language learning platform with CILS B1 alignment",
    version: "1.0.0",
    company: "Language Learning Solutions",
    email: "support@italianmaster.com",
    website: "https://italianmaster.com",
    copyright: `© ${new Date().getFullYear()} Language Learning Solutions`,
  },

  /**
   * Application features
   */
  features: {
    citizenshipPrep: true,
    gamification: true,
    aiAssistant: true,
    premium: {
      enabled: true,
      freeTrial: true,
      trialDays: 14,
    },
  },

  /**
   * Application branding
   */
  branding: {
    colors: {
      primary: "#8B5CF6", // Purple
      secondary: "#0EA5E9", // Blue
      accent: "#F97316", // Orange
      success: "#22c55e", // Green
      warning: "#f59e0b", // Amber
      error: "#ef4444", // Red
      info: "#0ea5e9", // Sky blue
    },
    logo: {
      main: "/assets/logo.svg",
      small: "/assets/logo-small.svg",
      alt: "ItalianMaster Logo",
    },
    favicon: "/favicon.ico",
  },

  /**
   * Learning levels
   */
  levels: [
    {
      id: "beginner",
      name: "Beginner",
      description: "I know a few words or phrases but cannot form complete sentences.",
      cils: "Pre-A1",
    },
    {
      id: "elementary",
      name: "Elementary (A1)",
      description: "I can use simple phrases and express immediate needs.",
      cils: "A1",
    },
    {
      id: "pre-intermediate",
      name: "Pre-Intermediate (A2)",
      description: "I can communicate in simple tasks and describe aspects of my background.",
      cils: "A2",
    },
    {
      id: "intermediate",
      name: "Intermediate (B1)",
      description: "I can handle most situations while traveling and describe experiences and events.",
      cils: "B1",
    },
    {
      id: "upper-intermediate",
      name: "Upper-Intermediate (B2)",
      description: "I can interact with native speakers fluently and express myself on a wide range of topics.",
      cils: "B2",
    },
    {
      id: "advanced",
      name: "Advanced (C1/C2)",
      description: "I can express myself fluently and precisely, even in complex situations.",
      cils: "C1/C2",
    },
  ],

  /**
   * SEO and metadata
   */
  seo: {
    defaultTitle: "ItalianMaster - Italian Language Learning for CILS Success",
    titleTemplate: "%s | ItalianMaster",
    defaultDescription:
      "Learn Italian effectively with ItalianMaster. Prepare for the CILS B1 exam with our comprehensive learning platform.",
    keywords: [
      "italian learning",
      "cils b1",
      "italian citizenship",
      "learn italian online",
      "italian language course",
    ],
    socialImage: "/assets/social-card.png",
    twitterUsername: "@italianmaster",
  },

  /**
   * Legal information
   */
  legal: {
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    cookiePolicy: "/cookies",
  },

  /**
   * Contact information
   */
  contact: {
    email: "support@italianmaster.com",
    phone: "+1 (555) 123-4567",
    address: "123 Language Lane, Learning City, LC 12345",
    socialMedia: {
      twitter: "https://twitter.com/italianmaster",
      facebook: "https://facebook.com/italianmaster",
      instagram: "https://instagram.com/italianmaster",
      youtube: "https://youtube.com/italianmaster",
    },
  },

  /**
   * Marketing content
   */
  marketing: {
    tagline: "Master Italian. Achieve CILS Success.",
    mainCTA: "Start Learning Now",
    secondaryCTA: "Try Free Demo",
    testimonials: [
      {
        name: "Marco Rossi",
        title: "CILS B1 Certificate Holder",
        quote: "Thanks to ItalianMaster, I passed my CILS B1 exam with flying colors!",
        image: "/assets/testimonials/marco.jpg",
      },
      {
        name: "Sofia Bianchi",
        title: "Italian Language Learner",
        quote: "The platform's citizenship-focused content made all the difference in my studies.",
        image: "/assets/testimonials/sofia.jpg",
      },
      {
        name: "Luca Verdi",
        title: "Italian Teacher",
        quote: "I recommend ItalianMaster to all my students preparing for CILS exams.",
        image: "/assets/testimonials/luca.jpg",
      },
    ],
    features: [
      {
        title: "AI-Powered Learning",
        description: "Personalized learning paths adapted to your specific needs.",
        icon: "brain",
      },
      {
        title: "CILS Exam Preparation",
        description: "Comprehensive content aligned with official CILS B1 requirements.",
        icon: "file-badge",
      },
      {
        title: "Citizenship Focus",
        description: "Special content for those seeking Italian citizenship.",
        icon: "landmark",
      },
      {
        title: "Interactive Exercises",
        description: "Practice all language skills with engaging activities.",
        icon: "pen-tool",
      },
    ],
  }
};

/**
 * Type definitions for app configuration
 */
export type AppConfig = typeof appConfig;

export default appConfig;
