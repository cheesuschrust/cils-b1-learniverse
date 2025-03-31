
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, italianText } = req.body;
    
    // Validate required parameters
    if (!userId || !italianText) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // In a production app, we would use a translation service
    // For now, we'll generate a mock translation
    const englishText = generateMockTranslation(italianText);
    
    return res.status(200).json({ englishText });
  } catch (error) {
    console.error('Error translating Italian text:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

function generateMockTranslation(italianText: string): string {
  // This is a very simplistic mock translation
  // In a real app, you would use a proper translation service
  
  const commonWords: Record<string, string> = {
    'ciao': 'hello',
    'buongiorno': 'good morning',
    'buonasera': 'good evening',
    'grazie': 'thank you',
    'per favore': 'please',
    'scusa': 'excuse me',
    'sì': 'yes',
    'no': 'no',
    'cittadinanza': 'citizenship',
    'italia': 'Italy',
    'italiano': 'Italian',
    'esame': 'exam',
    'passaporto': 'passport',
    'permesso di soggiorno': 'residence permit',
    'comune': 'city hall',
    'prefettura': 'prefecture',
    'questura': 'police headquarters',
    'domanda': 'application',
    'modulo': 'form'
  };
  
  let translatedText = italianText;
  
  Object.entries(commonWords).forEach(([italian, english]) => {
    // Case-insensitive replacement
    const regex = new RegExp(italian, 'gi');
    translatedText = translatedText.replace(regex, english);
  });
  
  return `[Translation] ${translatedText}\n\n(This is a simple mock translation. In a real application, we would use a professional translation service.)`;
}
