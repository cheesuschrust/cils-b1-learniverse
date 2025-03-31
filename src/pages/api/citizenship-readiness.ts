
import type { NextApiRequest, NextApiResponse } from 'next';
import { ItalianTestSection } from '@/types/italian-types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }
    
    // In a production app, we would fetch this data from a database
    // For now, we'll generate mock readiness data
    const readinessData = generateMockReadinessData(userId.toString());
    
    return res.status(200).json(readinessData);
  } catch (error) {
    console.error('Error fetching citizenship readiness:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

function generateMockReadinessData(userId: string) {
  // Generate some random scores for each section
  const sectionScores: Record<ItalianTestSection, number> = {
    listening: Math.floor(Math.random() * 51) + 40, // 40-90%
    reading: Math.floor(Math.random() * 51) + 40,
    writing: Math.floor(Math.random() * 51) + 40,
    speaking: Math.floor(Math.random() * 51) + 40,
    grammar: Math.floor(Math.random() * 51) + 40,
    vocabulary: Math.floor(Math.random() * 51) + 40,
    culture: Math.floor(Math.random() * 51) + 40
  };
  
  // Calculate overall readiness as the average of all scores
  const overallReadiness = Object.values(sectionScores).reduce(
    (sum, score) => sum + score, 0
  ) / 7; // 7 sections
  
  return {
    userId,
    overallReadiness,
    sectionScores,
    lastUpdated: new Date().toISOString()
  };
}
