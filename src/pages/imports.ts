
// Import all pages to be used in the app  
import Home from './Home';  
import Dashboard from './Dashboard';  
import Login from './Login';  
import Signup from './Signup';  
import Profile from './Profile';  
import Flashcards from './Flashcards';  
import MultipleChoice from './MultipleChoice';  
import Writing from './Writing';  
import ListeningPage from './Listening'; // Changed from Listening to ListeningPage  
import Speaking from './Speaking';  
import Settings from './Settings';  
import Support from './Support';  
import Achievements from './Achievements';  
import NotFound from './NotFound';  
import Analytics from './Analytics';  
import VocabularyLists from './VocabularyLists';  
import Progress from './progress'; // Fix the casing to match the actual file name
import EmailVerification from './EmailVerification';  
import ResetPassword from './ResetPassword';  
import AIAssistant from './AIAssistant';  

// Admin pages  
import AdminDashboard from './admin/AdminDashboard';  
import UserManagement from './admin/UserManagement';  
import ContentUploader from './admin/ContentUploader';  
import ContentAnalysis from './admin/ContentAnalysis';  
import AIManagement from './admin/AIManagement';  
import SystemLogs from './admin/SystemLogs';  
import SystemTests from './admin/SystemTests';  
import SystemSettings from './admin/SystemSettings';  
import AISetupWizard from './admin/AISetupWizard';  
import EmailSettings from './admin/EmailSettings';  
import AppStoreListing from './admin/AppStoreListing';  
import SEOManager from './admin/SEOManager';  

// Export all pages  
export {  
  Home,  
  Dashboard,  
  Login,  
  Signup,  
  Profile,  
  Flashcards,  
  MultipleChoice,  
  Writing,  
  ListeningPage as Listening, // Export as Listening  
  Speaking,  
  Settings,  
  Support,  
  Achievements,  
  NotFound,  
  Analytics,  
  VocabularyLists,  
  Progress,  
  EmailVerification,  
  ResetPassword,  
  AIAssistant,  
  // Admin pages  
  AdminDashboard,  
  UserManagement,  
  ContentUploader,  
  ContentAnalysis,  
  AIManagement,  
  SystemLogs,  
  SystemTests,  
  SystemSettings,  
  AISetupWizard,  
  EmailSettings,  
  AppStoreListing,  
  SEOManager  
};  
