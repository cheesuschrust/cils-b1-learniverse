
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export default function DatabaseOptimizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('');

  // Check if the database has already been optimized on component mount
  useEffect(() => {
    const hasBeenOptimized = typeof window !== 'undefined' && localStorage.getItem('database_optimized') === 'true';
    if (hasBeenOptimized) {
      // Auto-hide if already optimized
      setIsRunning(false);
    }
  }, []);

  const optimizeDatabase = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setMessage('Optimizing your database with best practices...');
    setStep('Starting optimization');
    
    try {
      // Apply best practices SQL
      setStep('Creating indices');
      const { error: indexError } = await supabase.functions.invoke('pg-execute', { 
        body: { sql_string: `  
          -- Add text search extension  
          CREATE EXTENSION IF NOT EXISTS "pg_trgm";  
          
          -- Create indices for common lookups  
          CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);  
          CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);  
          CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);  
          
          -- Create indices for user progress  
          CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);  
          CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_progress(content_id);  
          CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);  
          
          -- Create indices for flashcards  
          CREATE INDEX IF NOT EXISTS idx_flashcards_difficulty ON flashcards(difficulty);  
          CREATE INDEX IF NOT EXISTS idx_flashcard_progress_user ON user_flashcard_progress(user_id);  
          CREATE INDEX IF NOT EXISTS idx_flashcard_progress_card ON user_flashcard_progress(flashcard_id);  
          CREATE INDEX IF NOT EXISTS idx_flashcard_progress_status ON user_flashcard_progress(status);  
          
          -- Text search for flashcards  
          CREATE INDEX IF NOT EXISTS idx_flashcards_italian_search ON flashcards USING GIN(italian gin_trgm_ops);  
          CREATE INDEX IF NOT EXISTS idx_flashcards_english_search ON flashcards USING GIN(english gin_trgm_ops);  
        ` }
      });
      
      if (indexError) throw new Error(`Index creation failed: ${indexError.message}`);
      
      // Add auto timestamp updates  
      setStep('Setting up timestamp triggers');
      const { error: triggerError } = await supabase.functions.invoke('pg-execute', { 
        body: { sql_string: `  
          -- Function to update timestamps automatically  
          CREATE OR REPLACE FUNCTION update_updated_at_column()  
          RETURNS TRIGGER AS $$  
          BEGIN  
              NEW.updated_at = NOW();  
              RETURN NEW;  
          END;  
          $$ language 'plpgsql';  
          
          -- Timestamp triggers for all tables  
          DROP TRIGGER IF EXISTS set_updated_at ON users;  
          CREATE TRIGGER set_updated_at  
          BEFORE UPDATE ON users  
          FOR EACH ROW  
          EXECUTE PROCEDURE update_updated_at_column();  
          
          DROP TRIGGER IF EXISTS set_updated_at ON user_preferences;  
          CREATE TRIGGER set_updated_at  
          BEFORE UPDATE ON user_preferences  
          FOR EACH ROW  
          EXECUTE PROCEDURE update_updated_at_column();  
          
          DROP TRIGGER IF EXISTS set_updated_at ON learning_content;  
          CREATE TRIGGER set_updated_at  
          BEFORE UPDATE ON learning_content  
          FOR EACH ROW  
          EXECUTE PROCEDURE update_updated_at_column();  
          
          DROP TRIGGER IF EXISTS set_updated_at ON user_progress;  
          CREATE TRIGGER set_updated_at  
          BEFORE UPDATE ON user_progress  
          FOR EACH ROW  
          EXECUTE PROCEDURE update_updated_at_column();  
          
          DROP TRIGGER IF EXISTS set_updated_at ON flashcards;  
          CREATE TRIGGER set_updated_at  
          BEFORE UPDATE ON flashcards  
          FOR EACH ROW  
          EXECUTE PROCEDURE update_updated_at_column();  
          
          DROP TRIGGER IF EXISTS set_updated_at ON user_flashcard_progress;  
          CREATE TRIGGER set_updated_at  
          BEFORE UPDATE ON user_flashcard_progress  
          FOR EACH ROW  
          EXECUTE PROCEDURE update_updated_at_column();  
        ` }
      });
      
      if (triggerError) throw new Error(`Trigger creation failed: ${triggerError.message}`);
      
      // Setup Row Level Security  
      setStep('Setting up security policies');
      const { error: rlsError } = await supabase.functions.invoke('pg-execute', { 
        body: { sql_string: `  
          -- Setup row level security  
          ALTER TABLE users ENABLE ROW LEVEL SECURITY;  
          ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;  
          ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;  
          ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;  
          ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;  
          ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;  
          
          -- Users can view/update their own data  
          DROP POLICY IF EXISTS users_select_own ON users;
          CREATE POLICY users_select_own ON users FOR SELECT   
            USING (auth.uid() = id);  
            
          DROP POLICY IF EXISTS users_update_own ON users;
          CREATE POLICY users_update_own ON users FOR UPDATE   
            USING (auth.uid() = id);  
          
          -- Preferences  
          DROP POLICY IF EXISTS prefs_select_own ON user_preferences;
          CREATE POLICY prefs_select_own ON user_preferences FOR SELECT   
            USING (auth.uid() = user_id);  
            
          DROP POLICY IF EXISTS prefs_update_own ON user_preferences;
          CREATE POLICY prefs_update_own ON user_preferences FOR UPDATE   
            USING (auth.uid() = user_id);  
          
          -- Progress  
          DROP POLICY IF EXISTS progress_select_own ON user_progress;
          CREATE POLICY progress_select_own ON user_progress FOR SELECT   
            USING (auth.uid() = user_id);  
            
          DROP POLICY IF EXISTS progress_update_own ON user_progress;
          CREATE POLICY progress_update_own ON user_progress FOR UPDATE   
            USING (auth.uid() = user_id);  
          
          -- Flashcard progress  
          DROP POLICY IF EXISTS flash_progress_select_own ON user_flashcard_progress;
          CREATE POLICY flash_progress_select_own ON user_flashcard_progress FOR SELECT   
            USING (auth.uid() = user_id);  
            
          DROP POLICY IF EXISTS flash_progress_update_own ON user_flashcard_progress;
          CREATE POLICY flash_progress_update_own ON user_flashcard_progress FOR UPDATE   
            USING (auth.uid() = user_id);  
          
          -- Everyone can view flashcards  
          DROP POLICY IF EXISTS flashcards_select_all ON flashcards;
          CREATE POLICY flashcards_select_all ON flashcards FOR SELECT   
            USING (true);  
          
          -- Premium content policies  
          DROP POLICY IF EXISTS content_select_public ON learning_content;
          CREATE POLICY content_select_public ON learning_content FOR SELECT   
            USING (  
              premium = false OR   
              EXISTS (  
                SELECT 1 FROM users   
                WHERE id = auth.uid() AND   
                (subscription_tier IN ('premium', 'instructor') OR role = 'admin')  
              )  
            );  
        ` }
      });
      
      if (rlsError) throw new Error(`Security setup failed: ${rlsError.message}`);
      
      // Add maintenance functions  
      setStep('Setting up maintenance routines');
      const { error: maintenanceError } = await supabase.functions.invoke('pg-execute', { 
        body: { sql_string: `  
          -- Database maintenance functions  
          CREATE OR REPLACE FUNCTION public.maintenance_vacuum_analyze()  
          RETURNS void AS $$  
          BEGIN  
            -- Vacuum and analyze all tables  
            VACUUM ANALYZE;  
          END;  
          $$ LANGUAGE plpgsql SECURITY DEFINER;  
          
          -- Create database statistics table to track performance  
          CREATE TABLE IF NOT EXISTS database_stats (  
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,  
            maintenance_type TEXT NOT NULL,  
            executed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),  
            execution_time_ms INTEGER,  
            details JSONB DEFAULT '{}'::JSONB  
          );  
        ` }
      });
      
      if (maintenanceError) throw new Error(`Maintenance setup failed: ${maintenanceError.message}`);
      
      // Run initial vacuum  
      setStep('Running initial optimization');
      await supabase.functions.invoke('pg-execute', {
        body: { sql_string: 'SELECT maintenance_vacuum_analyze();' }
      });
      
      setStep('');
      setMessage('✨ Database successfully enhanced with best practices! Your app now has optimized indices, security policies, and maintenance routines.');
      
      // Mark as completed in localStorage  
      if (typeof window !== 'undefined') {
        localStorage.setItem('database_optimized', 'true');
      }
      
      setTimeout(() => {
        setIsRunning(false);
      }, 5000);
      
    } catch (error: any) {
      console.error('Optimization error:', error);
      setMessage(`Error during optimization: ${error.message}`);
      setStep('');
      setIsRunning(false);
    }
  };

  const isOptimized = typeof window !== 'undefined' && localStorage.getItem('database_optimized') === 'true';

  // Show the component only if not previously optimized  
  if (isOptimized && !isRunning) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isRunning ? 'flex' : 'hidden'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-400 mb-4">🔧 Database Optimizer</h2>
        
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          This tool will enhance your database with best practices including:
        </p>
        
        <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
          <li>Optimized indices for better performance</li>
          <li>Automatic timestamp updates</li>
          <li>Row-level security policies</li>
          <li>Self-maintenance routines</li>
        </ul>
        
        {step && (
          <div className="mb-4 flex items-center text-indigo-600 dark:text-indigo-400">
            <svg className="animate-spin mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {step}
          </div>
        )}
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
            {message}
          </div>
        )}
        
        {!isRunning && (
          <button
            onClick={optimizeDatabase}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Enhance Database
          </button>
        )}
      </div>
    </div>
  );
}
