
// Auth Pages
export { default as Login } from './Login';
export { default as SignUp } from './Signup';
export { default as PasswordReset } from './ResetPassword';

// Main Pages
export { default as Dashboard } from './Dashboard';
export { default as Flashcards } from './Flashcards';
export { default as Lessons } from './MultipleChoice'; // Using MultipleChoice as a replacement for now
export { default as MultipleChoice } from './MultipleChoice';
export { default as SpeakingPractice } from './Speaking';
export { default as ListeningExercises } from './Listening';
export { default as WritingExercises } from './Writing';
export { default as LearningCalendar } from './Calendar/index'; // Assuming we'll create this file
export { default as UserProfile } from './UserProfile';
export { default as Settings } from './Settings';
export { default as Communities } from './Dashboard'; // Temporarily using Dashboard as a replacement
export { default as ProgressTracker } from './Dashboard'; // Temporarily using Dashboard as a replacement

// Admin Pages
export { default as AdminDashboard } from './admin/Dashboard';
export { default as UserManagement } from './admin/UserManagement';
export { default as ContentUploader } from './admin/ContentUploader';
export { default as FileUploader } from './admin/FileUploader';
export { default as AdminSettings } from './admin/EmailSettings'; // Using EmailSettings as a replacement
export { default as ContentAnalysis } from './admin/ContentAnalysis';
