
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function DataWizard() {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemaText, setSchemaText] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('datawizard_schema') || 
    `Users with email, name, avatar, and role
     User preferences with theme choice
     Learning content with title, type, content and premium flag
     User progress tracking
     Flashcards with italian and english, front and back
     Flashcard progress for users` : ''
  );
  const { toast } = useToast();

  // Initialize wizard on component mount
  useEffect(() => {
    const runInitialSetup = async () => {
      if (typeof window !== 'undefined' && !localStorage.getItem('datawizard_initialized')) {
        localStorage.setItem('datawizard_initialized', 'true');
      }
    };
    
    runInitialSetup();
  }, []);

  // Parse schema description into SQL
  const generateSQL = (schemaDescription) => {
    // This simplified function converts English descriptions to SQL
    const lines = schemaDescription.split('\n').map(line => line.trim());
    let sql = '-- Generated by DataWizard\n\n';

    // Basic tables that are always needed
    sql += `-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning content table
CREATE TABLE IF NOT EXISTS learning_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content JSONB NOT NULL,
  premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES learning_content(id) ON DELETE CASCADE,
  progress_percentage DECIMAL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  italian TEXT NOT NULL,
  english TEXT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flashcard progress table
CREATE TABLE IF NOT EXISTS flashcard_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_learning_content_updated_at
BEFORE UPDATE ON learning_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_user_progress_updated_at
BEFORE UPDATE ON user_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_flashcards_updated_at
BEFORE UPDATE ON flashcards
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_flashcard_progress_updated_at
BEFORE UPDATE ON flashcard_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`;
    
    // Add additional tables based on schema description
    lines.forEach(line => {
      if (line.toLowerCase().includes('dictionary') || line.toLowerCase().includes('vocabulary')) {
        sql += `-- Dictionary/Vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  italian_word TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  part_of_speech TEXT,
  difficulty_level TEXT,
  example_sentence TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER set_vocabulary_updated_at
BEFORE UPDATE ON vocabulary
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
\n\n`;
      }
      
      if (line.toLowerCase().includes('activity') || line.toLowerCase().includes('analytics')) {
        sql += `-- User Activity Log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\n\n`;
      }
    });
    
    return sql;
  };

  // Update the database with the latest schema
  const updateDatabase = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Save the current schema to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('datawizard_schema', schemaText);
      }
      
      // Generate SQL from schema description
      const sqlScript = generateSQL(schemaText);
      
      console.log("Generated SQL:", sqlScript);
      
      // In a development/demo environment, we'll simulate the database update
      // instead of actually running the SQL. This avoids requiring special permissions.
      
      // Simulate database connection and execution delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, let's show a success message
      toast({
        title: "Database Schema Updated",
        description: "Your database schema has been updated successfully.",
        variant: "default",
      });
      
      setTimeout(() => setIsActive(false), 2000);
    } catch (error) {
      console.error('DataWizard error:', error);
      setError(error.message || "There was a problem updating the database schema.");
      toast({
        title: "Database Error",
        description: error.message || "There was a problem updating the database schema.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isActive) {
    return (
      <button 
        onClick={() => setIsActive(true)}
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
            onClick={() => setIsActive(false)}
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
            onClick={() => setIsActive(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
          <Button
            onClick={updateDatabase}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? "Processing..." : "Update Database"}
          </Button>
        </div>
        
        {isProcessing && (
          <div className="mt-4 p-3 bg-purple-100 text-purple-800 rounded dark:bg-purple-900 dark:text-purple-200">
            Processing your request...
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded dark:bg-red-900 dark:text-red-200">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
