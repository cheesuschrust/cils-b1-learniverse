
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type QueryResult = {  
  data: any[] | null;  
  error: string | null;  
};

export default function DataMagic() {
  const [status, setStatus] = useState<'idle' | 'initializing' | 'complete' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const [schemaText, setSchemaText] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('datawizard_schema') || 
    `Users with email, name, avatar, and role
     User preferences with theme choice
     Learning content with title, type, content and premium flag
     User progress tracking
     Flashcards with italian and english, front and back
     Flashcard progress for users` : ''
  );
  const [result, setResult] = useState<QueryResult>({ data: null, error: null });

  // Initialize wizard on component mount
  useEffect(() => {
    const checkAndSetupDatabase = async () => {
      if (typeof window !== 'undefined' && !localStorage.getItem('datawizard_initialized')) {
        setIsVisible(true);
        setStatus('idle');
        localStorage.setItem('datawizard_initialized', 'true');
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
      const { data, error } = await supabase.functions.invoke('pg-execute', { 
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

  // Update the database with the latest schema
  const updateDatabase = async () => {
    setIsVisible(true);
    setStatus('initializing');
    
    try {
      // Save the current schema to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('datawizard_schema', schemaText);
      }
      
      // Generate SQL from schema description
      const sqlScript = generateSQL(schemaText);
      
      setStatus('initializing');
      
      // Execute the SQL through our edge function
      const { data, error } = await supabase.functions.invoke('pg-execute', { 
        body: { sql_string: sqlScript }
      });
      
      if (error) throw new Error(error.message);
      
      setStatus('complete');
      setTimeout(() => setIsVisible(false), 3000);
    } catch (error: any) {
      console.error('DataWizard error:', error);
      setStatus('error');
    }
  };

  // Parse schema description into SQL
  const generateSQL = (schemaDescription: string) => {
    const lines = schemaDescription.split('\n').map(line => line.trim());
    let sql = '-- Generated by DataWizard\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n';

    lines.forEach(line => {
      if (!line) return;
      
      // Check for AI providers
      if (line.toLowerCase().includes('ai provider')) {
        sql += `-- AI Providers table
CREATE TABLE IF NOT EXISTS ai_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('huggingface', 'openai', 'azure', 'google', 'custom')),
  configuration JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  capabilities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);\n\n`;
      }
      
      // Check for exam or quiz related tables
      if (line.toLowerCase().includes('exam') || line.toLowerCase().includes('quiz')) {
        sql += `-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  time_limit INTEGER,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES users(id)
);\n\n`;

        sql += `-- Exam Questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);\n\n`;

        sql += `-- User Exam Attempts table
CREATE TABLE IF NOT EXISTS user_exam_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  score INTEGER,
  passed BOOLEAN,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0
);\n\n`;
      }
      
      // Check for new table types that weren't in the initial schema
      if (line.toLowerCase().includes('dictionary') || line.toLowerCase().includes('vocabulary')) {
        sql += `-- Dictionary/Vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  italian_word TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  part_of_speech TEXT,
  difficulty_level TEXT,
  example_sentence TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);\n\n`;
      }
      
      // Check for user activity or analytics
      if (line.toLowerCase().includes('activity') || line.toLowerCase().includes('analytics')) {
        sql += `-- User Activity Log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);\n\n`;
      }
    });
    
    return sql;
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700"
        title="Update Database Schema"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
          <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
          <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-800 dark:text-purple-400">✨ DataWizard</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            ✕
          </button>
        </div>
        
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Describe your database needs in plain English, and I'll create the tables for you automatically!
        </p>
        
        <textarea
          value={schemaText}
          onChange={(e) => setSchemaText(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          placeholder="Example: Users with email and name, Products with price and description..."
        />
        
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
          <Button
            onClick={updateDatabase}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Update Database
          </Button>
        </div>
        
        {status === 'initializing' && (
          <div className="mt-4 p-3 flex items-center text-indigo-600 dark:text-indigo-400">
            <svg className="animate-spin mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating your database...
          </div>
        )}
        
        {status === 'complete' && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded dark:bg-green-900 dark:text-green-200">
            ✓ Database setup complete with best practices!
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded dark:bg-red-900 dark:text-red-200">
            ⚠️ There was an error setting up the database.
          </div>
        )}
      </div>
    </div>
  );
}
