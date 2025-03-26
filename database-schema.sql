
-- This file contains the SQL schema needed for the AI content generation and document processing system

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  last_active TIMESTAMP WITH TIME ZONE,
  subscription TEXT NOT NULL DEFAULT 'free',
  preferred_language TEXT DEFAULT 'english',
  status TEXT NOT NULL DEFAULT 'active'
);

-- User metrics table to track performance
CREATE TABLE IF NOT EXISTS user_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Usage tracking table for limiting free users
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL,
  date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_type, date)
);

-- Content table for uploaded documents
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  difficulty TEXT DEFAULT 'intermediate',
  language TEXT DEFAULT 'english',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  raw_content TEXT,
  file_url TEXT
);

-- Questions table for AI-generated questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'english'
);

-- Question attempts to track user progress
CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL,
  time_spent FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT true
);

-- Individual question responses
CREATE TABLE IF NOT EXISTS question_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES question_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  time_spent FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Set up storage bucket for document uploads
-- This would typically be done through the Supabase dashboard, but here's the SQL equivalent
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-files', 'Content Files', true)
ON CONFLICT DO NOTHING;

-- Set up Row Level Security (RLS) policies

-- Users can only see their own data
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Content RLS
CREATE POLICY "Users can read published content"
  ON content
  FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own content"
  ON content
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own content"
  ON content
  FOR UPDATE
  USING (created_by = auth.uid());

-- Questions RLS
CREATE POLICY "Users can read questions"
  ON questions
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create their own questions"
  ON questions
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Usage tracking RLS
CREATE POLICY "Users can read their own usage"
  ON usage_tracking
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert/update usage for any user"
  ON usage_tracking
  FOR ALL
  USING (TRUE);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
