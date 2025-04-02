
import type { NextApiRequest, NextApiResponse } from 'next';
import { ItalianTestSection } from '@/types/italian-types';
import { supabase } from '@/lib/supabase-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      userId,
      sessionType,
      score,
      questionsAnswered,
      questionsCorrect,
      duration,
      isCitizenshipFocused
    } = req.body;
    
    // Validate required parameters
    if (!userId || !sessionType) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Validate session type
    if (!isValidSessionType(sessionType)) {
      return res.status(400).json({ message: 'Invalid session type' });
    }
    
    // Save session to database
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        content_type: sessionType,
        score: score || 0,
        answers: {
          total: questionsAnswered || 0,
          correct: questionsCorrect || 0,
          citizenship_focused: !!isCitizenshipFocused
        },
        time_spent: duration || 0,
        completed: true,
        last_activity: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error saving practice session:', error);
      throw error;
    }
    
    // Update user gamification data if available
    try {
      await updateUserGamificationData(userId, sessionType, score, questionsCorrect);
    } catch (gamificationError) {
      console.error('Error updating gamification data:', gamificationError);
      // Continue execution even if gamification update fails
    }
    
    return res.status(200).json({ 
      message: 'Practice session saved successfully',
      sessionId: data?.[0]?.id || `mock-session-${Date.now()}`
    });
  } catch (error) {
    console.error('Error saving practice session:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

function isValidSessionType(type: string): type is ItalianTestSection {
  return ['listening', 'reading', 'writing', 'speaking', 'grammar', 'vocabulary', 'culture', 'citizenship'].includes(type);
}

async function updateUserGamificationData(
  userId: string, 
  sessionType: string,
  score: number,
  questionsCorrect: number
): Promise<void> {
  // Get current user gamification data
  const { data: gamificationData, error: fetchError } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (fetchError && fetchError.code !== 'PGSQL_EMPTY_RESULT') {
    throw fetchError;
  }
  
  // Calculate XP to award based on performance
  const xpToAward = Math.round((score / 100) * 20) + (questionsCorrect || 0);
  
  if (gamificationData) {
    // Update existing gamification record
    const { error: updateError } = await supabase
      .from('user_gamification')
      .update({
        xp: (gamificationData.xp || 0) + xpToAward,
        weekly_xp: (gamificationData.weekly_xp || 0) + xpToAward,
        lifetime_xp: (gamificationData.lifetime_xp || 0) + xpToAward,
        total_correct_answers: (gamificationData.total_correct_answers || 0) + (questionsCorrect || 0),
        last_activity_date: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
  } else {
    // Create new gamification record if one doesn't exist
    const { error: insertError } = await supabase
      .from('user_gamification')
      .insert({
        user_id: userId,
        xp: xpToAward,
        weekly_xp: xpToAward,
        lifetime_xp: xpToAward,
        total_correct_answers: questionsCorrect || 0,
        last_activity_date: new Date().toISOString()
      });
    
    if (insertError) throw insertError;
  }
}
