
import { TranslationPair } from '@/types/language';

export interface RouteLabel extends TranslationPair {
  path: string;
  admin?: boolean;
  requiresAuth?: boolean;
  beta?: boolean;
}

export const navigationLabels: RouteLabel[] = [
  { path: '/', english: 'Home', italian: 'Home' },
  { path: '/about', english: 'About', italian: 'Chi Siamo' },
  { path: '/login', english: 'Login', italian: 'Accedi' },
  { path: '/signup', english: 'Sign Up', italian: 'Registrati' },
  { path: '/forgot-password', english: 'Forgot Password', italian: 'Password Dimenticata' },
  { path: '/dashboard', english: 'Dashboard', italian: 'Dashboard', requiresAuth: true },
  { path: '/profile', english: 'Profile', italian: 'Profilo', requiresAuth: true },
  { path: '/progress', english: 'Progress', italian: 'Progressi', requiresAuth: true },
  { path: '/settings', english: 'Settings', italian: 'Impostazioni', requiresAuth: true },
  { path: '/support-center', english: 'Support Center', italian: 'Centro Supporto' },
  { path: '/subscription', english: 'Subscription', italian: 'Abbonamento' },
  { path: '/subscription/manage', english: 'Manage Subscription', italian: 'Gestisci Abbonamento', requiresAuth: true },
  { path: '/flashcards', english: 'Flashcards', italian: 'Flashcard' },
  { path: '/practice/reading', english: 'Reading Practice', italian: 'Pratica di Lettura' },
  { path: '/practice/listening', english: 'Listening Practice', italian: 'Pratica di Ascolto' },
  { path: '/practice/writing', english: 'Writing Practice', italian: 'Pratica di Scrittura' },
  { path: '/practice/speaking', english: 'Speaking Practice', italian: 'Pratica di Conversazione' },
  
  // Legal pages
  { path: '/privacy', english: 'Privacy Policy', italian: 'Informativa sulla Privacy' },
  { path: '/terms', english: 'Terms of Service', italian: 'Termini di Servizio' },
  { path: '/eula', english: 'End User License Agreement', italian: 'Accordo di Licenza per l\'Utente Finale' },
  { path: '/gdpr', english: 'GDPR Compliance', italian: 'Conformità GDPR' },
  { path: '/cookies', english: 'Cookie Policy', italian: 'Politica dei Cookie' },
  
  // Admin routes
  { path: '/admin', english: 'Admin Dashboard', italian: 'Dashboard Admin', admin: true },
  { path: '/admin/users', english: 'User Management', italian: 'Gestione Utenti', admin: true },
  { path: '/admin/content', english: 'Content Manager', italian: 'Gestione Contenuti', admin: true },
  { path: '/admin/ai-management', english: 'AI Management', italian: 'Gestione AI', admin: true },
  { path: '/admin/subscriptions', english: 'Subscription Manager', italian: 'Gestione Abbonamenti', admin: true },
  { path: '/admin/system-health', english: 'System Health', italian: 'Stato del Sistema', admin: true },
];

export const getRouteLabel = (path: string, language: 'english' | 'italian' | 'both' = 'english'): string => {
  const route = navigationLabels.find(r => r.path === path);
  
  if (!route) return path;
  
  if (language === 'both') {
    return `${route.english} / ${route.italian}`;
  }
  
  return route[language];
};
