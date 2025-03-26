
-- Required tables for the analytics dashboard

-- User goals table for tracking progress towards learning targets
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL,  -- 'questions_answered', 'mastery_score', 'study_days'
  target_value INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Streak history table to track longest streaks
CREATE TABLE IF NOT EXISTS user_streak_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_length INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Set up RLS policies
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streak_history ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own goals
CREATE POLICY "Users can manage their own goals"
  ON user_goals
  USING (user_id = auth.uid());

-- Users can read their streak history
CREATE POLICY "Users can view their streak history"
  ON user_streak_history
  USING (user_id = auth.uid());

-- Function to update user streak when activity is recorded
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_activity TIMESTAMP WITH TIME ZONE;
  current_streak INTEGER;
BEGIN
  -- Get last activity date
  SELECT updated_at INTO last_activity
  FROM user_metrics
  WHERE user_id = NEW.user_id;
  
  -- Get current streak
  SELECT streak INTO current_streak
  FROM user_metrics
  WHERE user_id = NEW.user_id;
  
  IF last_activity IS NULL THEN
    -- First activity, start streak at 1
    UPDATE user_metrics
    SET streak = 1,
        updated_at = NEW.created_at
    WHERE user_id = NEW.user_id;
  ELSE
    -- Check if this activity is on a new day
    IF date_trunc('day', NEW.created_at) > date_trunc('day', last_activity) THEN
      -- Check if the activity is consecutive (yesterday or today)
      IF date_trunc('day', NEW.created_at) = date_trunc('day', last_activity + interval '1 day')
         OR date_trunc('day', NEW.created_at) = date_trunc('day', CURRENT_TIMESTAMP) THEN
        -- Increment streak
        UPDATE user_metrics
        SET streak = streak + 1,
            updated_at = NEW.created_at
        WHERE user_id = NEW.user_id;
      ELSE
        -- Break in streak, record history if significant
        IF current_streak >= 3 THEN
          INSERT INTO user_streak_history (
            user_id, 
            streak_length, 
            start_date, 
            end_date
          )
          VALUES (
            NEW.user_id,
            current_streak,
            last_activity - ((current_streak - 1) * interval '1 day'),
            last_activity
          );
        END IF;
        
        -- Reset streak
        UPDATE user_metrics
        SET streak = 1,
            updated_at = NEW.created_at
        WHERE user_id = NEW.user_id;
      END IF;
    ELSE
      -- Same day, just update the timestamp
      UPDATE user_metrics
      SET updated_at = NEW.created_at
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on question_attempts to update streaks
CREATE TRIGGER update_streak_on_activity
AFTER INSERT ON question_attempts
FOR EACH ROW
EXECUTE FUNCTION update_user_streak();
