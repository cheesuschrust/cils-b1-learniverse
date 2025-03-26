
-- Users table to store basic user information
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  subscription TEXT NOT NULL DEFAULT 'free',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  last_active TIMESTAMP WITH TIME ZONE,
  preferred_language TEXT NOT NULL DEFAULT 'both',
  status TEXT NOT NULL DEFAULT 'active'
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system',
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  language TEXT NOT NULL DEFAULT 'en',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  font_size INTEGER,
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  animations_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  voice_speed INTEGER,
  auto_play_audio BOOLEAN NOT NULL DEFAULT TRUE,
  show_progress_metrics BOOLEAN NOT NULL DEFAULT TRUE,
  ai_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  ai_model_size TEXT,
  ai_processing_on_device BOOLEAN NOT NULL DEFAULT FALSE,
  confidence_score_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- User metrics table
CREATE TABLE IF NOT EXISTS public.user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Content table
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'both',
  file_url TEXT
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  language TEXT NOT NULL DEFAULT 'both',
  type TEXT NOT NULL DEFAULT 'multiple_choice',
  time_limit INTEGER,
  points INTEGER NOT NULL DEFAULT 1,
  content_id UUID REFERENCES public.content(id) ON DELETE SET NULL
);

-- Question sets table
CREATE TABLE IF NOT EXISTS public.question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  time_limit INTEGER,
  passing_score INTEGER NOT NULL DEFAULT 70,
  language TEXT NOT NULL DEFAULT 'both',
  instructions TEXT
);

-- Table linking questions to question sets
CREATE TABLE IF NOT EXISTS public.question_set_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID NOT NULL REFERENCES public.question_sets(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  UNIQUE(question_set_id, question_id)
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question_set_id UUID NOT NULL REFERENCES public.question_sets(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  passed BOOLEAN NOT NULL DEFAULT FALSE
);

-- Quiz answers table
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER NOT NULL DEFAULT 0
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL,
  date TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_type, date)
);

-- Daily questions table
CREATE TABLE IF NOT EXISTS public.daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL UNIQUE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_subscription ON public.users(subscription);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_content_type ON public.content(content_type);
CREATE INDEX idx_content_difficulty ON public.content(difficulty);
CREATE INDEX idx_content_language ON public.content(language);
CREATE INDEX idx_questions_type ON public.questions(type);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_language ON public.questions(language);
CREATE INDEX idx_question_sets_difficulty ON public.question_sets(difficulty);
CREATE INDEX idx_question_sets_category ON public.question_sets(category);
CREATE INDEX idx_question_sets_language ON public.question_sets(language);
CREATE INDEX idx_question_sets_created_by ON public.question_sets(created_by);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_question_set_id ON public.quiz_attempts(question_set_id);
CREATE INDEX idx_quiz_answers_quiz_attempt_id ON public.quiz_answers(quiz_attempt_id);
CREATE INDEX idx_quiz_answers_question_id ON public.quiz_answers(question_id);
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_date ON public.usage_tracking(date);

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_set_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;

-- User can read their own data
CREATE POLICY user_read_own_data ON public.users
  FOR SELECT USING (auth.uid() = id);

-- User can update their own data
CREATE POLICY user_update_own_data ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY user_read_own_preferences ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_update_own_preferences ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- User metrics policies
CREATE POLICY user_read_own_metrics ON public.user_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Content policies
CREATE POLICY content_read_published ON public.content
  FOR SELECT USING (published = TRUE);

CREATE POLICY content_read_own ON public.content
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY content_insert_own ON public.content
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY content_update_own ON public.content
  FOR UPDATE USING (auth.uid() = created_by);

-- Question policies
CREATE POLICY questions_read_all ON public.questions
  FOR SELECT USING (TRUE);

-- Question set policies
CREATE POLICY question_sets_read_public ON public.question_sets
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY question_sets_read_own ON public.question_sets
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY question_sets_insert_own ON public.question_sets
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY question_sets_update_own ON public.question_sets
  FOR UPDATE USING (auth.uid() = created_by);

-- Quiz attempt policies
CREATE POLICY quiz_attempts_read_own ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY quiz_attempts_insert_own ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY quiz_attempts_update_own ON public.quiz_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- Quiz answers policies
CREATE POLICY quiz_answers_read_own ON public.quiz_answers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE quiz_attempts.id = quiz_answers.quiz_attempt_id
    AND quiz_attempts.user_id = auth.uid()
  ));

-- Usage tracking policies
CREATE POLICY usage_tracking_read_own ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Daily questions policies
CREATE POLICY daily_questions_read_all ON public.daily_questions
  FOR SELECT USING (TRUE);

-- Create admin policies
CREATE POLICY admin_all_users ON public.users
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_user_preferences ON public.user_preferences
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_user_metrics ON public.user_metrics
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_content ON public.content
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_questions ON public.questions
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_question_sets ON public.question_sets
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_question_set_questions ON public.question_set_questions
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_quiz_attempts ON public.quiz_attempts
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_quiz_answers ON public.quiz_answers
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_usage_tracking ON public.usage_tracking
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY admin_all_daily_questions ON public.daily_questions
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Functions to automatically update user on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, subscription, is_verified, created_at, last_login, last_active, preferred_language, status)
  VALUES (NEW.id, NEW.email, 'user', 'free', NEW.email_confirmed, NOW(), NOW(), NOW(), 'both', 'active');
  
  INSERT INTO public.user_preferences (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  
  INSERT INTO public.user_metrics (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on sign-up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
