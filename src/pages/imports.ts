// Public pages
export { default as Login } from './Login';
export { default as SignUp } from './Signup';
export { default as PasswordReset } from './ResetPassword';
export { default as NotFound } from './NotFound';

// Main app pages
export { default as Dashboard } from './Dashboard';
export { default as Flashcards } from './Flashcards';
export { default as Lessons } from './MultipleChoice'; // Temporary redirect to MultipleChoice
export { default as SpeakingPractice } from './Speaking';
export { default as ListeningExercises } from './Listening';
export { default as WritingExercises } from './Writing';
export { default as LearningCalendar } from './UserProfile'; // Temporary redirect to UserProfile
export { default as UserProfile } from './UserProfile';
export { default as Settings } from './Settings';
export { default as Communities } from './NotFound'; // Temporary redirect to NotFound
export { default as ProgressTracker } from './Dashboard'; // Temporary redirect to Dashboard

// Admin pages
export { default as AdminDashboard } from './admin/Dashboard';
export { default as UserManagement } from './admin/UserManagement';
export { default as ContentUploader } from './admin/ContentUploader';
export { default as ContentAnalysis } from './admin/ContentAnalysis';
export { default as FileUploader } from './admin/FileUploader';
export { default as AdminSettings } from './admin/Dashboard'; // Temporary redirect to Dashboard

// New pages
export { default as Support } from './Support';
export { default as SystemLogs } from './admin/SystemLogs';
export { default as SupportTickets } from './admin/SupportTickets';
