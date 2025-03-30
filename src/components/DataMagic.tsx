
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export default function DataMagic() {
  const [status, setStatus] = useState<'idle' | 'initializing' | 'complete' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  
  // Run setup automatically on first load
  useEffect(() => {
    const checkAndSetupDatabase = async () => {
      if (typeof window !== 'undefined' && localStorage.getItem('datamagic_setup_complete') !== 'true') {
        await initializeDatabase();
      }
    };
    
    checkAndSetupDatabase();
    
    // Check for schema version updates
    const currentVersion = typeof window !== 'undefined' ? 
      localStorage.getItem('datamagic_version') || '0' : '0';
    if (currentVersion !== '1.0') {
      setIsVisible(true);
    }
  }, []);

  // The core database setup function
  const initializeDatabase = async () => {
    setStatus('initializing');
    
    try {
      // Execute the complete setup in one go
      const { error } = await supabase.functions.invoke('pg-execute', { 
        body: { sql_string: getFullDatabaseSetup() }
      });
      
      if (error) throw new Error(error.message);
      
      // Mark setup as complete
      if (typeof window !== 'undefined') {
        localStorage.setItem('datamagic_setup_complete', 'true');
        localStorage.setItem('datamagic_version', '1.0');
      }
      
      setStatus('complete');
      setTimeout(() => setIsVisible(false), 3000);
    } catch (error: any) {
      console.error('Database setup error:', error);
      setStatus('error');
    }
  };

  // All the SQL needed for a complete setup with best practices
  const getFullDatabaseSetup = () => {
    return `
      -- Enable necessary extensions
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";
      
      -- Timestamp update function
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID REFERENCES auth.users PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        subscription_tier TEXT DEFAULT 'free',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indices
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      
      -- User preferences
      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
        theme TEXT DEFAULT 'system',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Learning content
      CREATE TABLE IF NOT EXISTS learning_content (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        content_type TEXT NOT NULL,
        content JSONB NOT NULL,
        premium BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indices
      CREATE INDEX IF NOT EXISTS idx_learning_content_type ON learning_content(content_type);
      CREATE INDEX IF NOT EXISTS idx_learning_content_premium ON learning_content(premium);
      CREATE INDEX IF NOT EXISTS idx_learning_content_title_search ON learning_content USING GIN(title gin_trgm_ops);
      
      -- User progress
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content_id UUID REFERENCES learning_content(id) ON DELETE CASCADE,
        progress_percentage DECIMAL DEFAULT 0,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, content_id)
      );
      
      -- Create indices
      CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_progress(content_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);
      
      -- Flashcards
      CREATE TABLE IF NOT EXISTS flashcards (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        italian TEXT NOT NULL,
        english TEXT NOT NULL,
        difficulty INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indices
      CREATE INDEX IF NOT EXISTS idx_flashcards_difficulty ON flashcards(difficulty);
      CREATE INDEX IF NOT EXISTS idx_flashcards_italian_search ON flashcards USING GIN(italian gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_flashcards_english_search ON flashcards USING GIN(english gin_trgm_ops);
      
      -- Flashcard progress
      CREATE TABLE IF NOT EXISTS user_flashcard_progress (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, flashcard_id)
      );
      
      -- Create indices
      CREATE INDEX IF NOT EXISTS idx_flashcard_progress_user ON user_flashcard_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_flashcard_progress_card ON user_flashcard_progress(flashcard_id);
      CREATE INDEX IF NOT EXISTS idx_flashcard_progress_status ON user_flashcard_progress(status);
      
      -- Create update triggers
      DROP TRIGGER IF EXISTS set_users_updated_at ON users;
      CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        
      DROP TRIGGER IF EXISTS set_preferences_updated_at ON user_preferences;
      CREATE TRIGGER set_preferences_updated_at BEFORE UPDATE ON user_preferences
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        
      DROP TRIGGER IF EXISTS set_content_updated_at ON learning_content;
      CREATE TRIGGER set_content_updated_at BEFORE UPDATE ON learning_content
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        
      DROP TRIGGER IF EXISTS set_progress_updated_at ON user_progress;
      CREATE TRIGGER set_progress_updated_at BEFORE UPDATE ON user_progress
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        
      DROP TRIGGER IF EXISTS set_flashcards_updated_at ON flashcards;
      CREATE TRIGGER set_flashcards_updated_at BEFORE UPDATE ON flashcards
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        
      DROP TRIGGER IF EXISTS set_flashcard_progress_updated_at ON user_flashcard_progress;
      CREATE TRIGGER set_flashcard_progress_updated_at BEFORE UPDATE ON user_flashcard_progress
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
      
      -- Handle new user creation
      CREATE OR REPLACE FUNCTION handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.users (id, email, created_at, updated_at)
        VALUES (NEW.id, NEW.email, NEW.created_at, NEW.created_at);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
      
      -- Set up Row Level Security
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
      ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
      ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
      
      -- Create security policies
      CREATE POLICY users_select_own ON users
        FOR SELECT USING (auth.uid() = id);
        
      CREATE POLICY users_update_own ON users
        FOR UPDATE USING (auth.uid() = id);
      
      CREATE POLICY prefs_select_own ON user_preferences
        FOR SELECT USING (auth.uid() = user_id);
        
      CREATE POLICY prefs_update_own ON user_preferences
        FOR UPDATE USING (auth.uid() = user_id);
      
      CREATE POLICY progress_select_own ON user_progress
        FOR SELECT USING (auth.uid() = user_id);
        
      CREATE POLICY progress_update_own ON user_progress
        FOR UPDATE USING (auth.uid() = user_id);
      
      CREATE POLICY flash_progress_select_own ON user_flashcard_progress
        FOR SELECT USING (auth.uid() = user_id);
        
      CREATE POLICY flash_progress_update_own ON user_flashcard_progress
        FOR UPDATE USING (auth.uid() = user_id);
      
      CREATE POLICY flashcards_select_all ON flashcards
        FOR SELECT USING (true);
      
      CREATE POLICY content_select_public ON learning_content
        FOR SELECT USING (
          premium = false OR
          EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND
            (subscription_tier IN ('premium', 'instructor') OR role = 'admin')
          )
        );
        
      -- Create maintenance function
      CREATE OR REPLACE FUNCTION maintenance_vacuum_analyze()
      RETURNS void AS $$
      BEGIN
        VACUUM ANALYZE;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      -- Create function to execute SQL safely
      CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      -- Run initial maintenance
      SELECT maintenance_vacuum_analyze();
    `;
  };

  if (!isVisible && status !== 'initializing') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">Database Magic</h3>
        {status !== 'initializing' && (
          <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            ×
          </button>
        )}
      </div>
      
      {status === 'initializing' && (
        <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
          <svg className="animate-spin mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Setting up your database...
        </div>
      )}
      
      {status === 'complete' && (
        <div className="text-green-600 dark:text-green-400 mb-2">
          ✓ Database setup complete with best practices!
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-red-600 dark:text-red-400 mb-2">
          ⚠️ There was an error setting up the database.
        </div>
      )}
      
      {status !== 'initializing' && (
        <button 
          onClick={initializeDatabase}
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          {status === 'error' ? 'Retry Setup' : 'Update Database'}
        </button>
      )}
    </div>
  );
}
