
import type { NextApiRequest, NextApiResponse } from 'next';
import { ItalianTestSection } from '@/types/italian-types';

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
    
    // In a production app, we would save this to a database
    // For now, we'll just log it and return success
    console.log('Practice session saved:', {
      userId,
      sessionType,
      score,
      questionsAnswered,
      questionsCorrect,
      duration,
      isCitizenshipFocused,
      timestamp: new Date().toISOString()
    });
    
    return res.status(200).json({ 
      message: 'Practice session saved successfully',
      sessionId: `mock-session-${Date.now()}`
    });
  } catch (error) {
    console.error('Error saving practice session:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

function isValidSessionType(type: string): type is ItalianTestSection {
  return ['listening', 'reading', 'writing', 'speaking', 'grammar', 'vocabulary', 'culture'].includes(type);
}
