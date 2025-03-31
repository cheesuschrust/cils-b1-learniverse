
import type { NextApiRequest, NextApiResponse } from 'next';
import { ItalianLevel } from '@/types/italian-types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, response, prompt, level } = req.body;
    
    // Validate required parameters
    if (!userId || !response || !prompt || !level) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // In a production app, we would use an AI service to evaluate the writing
    // For now, we'll generate a mock evaluation
    const evaluation = evaluateMockWriting(response, prompt, level);
    
    return res.status(200).json(evaluation);
  } catch (error) {
    console.error('Error evaluating Italian writing:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

function evaluateMockWriting(response: string, prompt: string, level: ItalianLevel): {score: number; feedback: string} {
  // This is a simplistic mock evaluation
  // In a real app, you would use a proper AI evaluation service
  
  const wordCount = response.split(/\s+/).length;
  let score = 0;
  let feedback = '';
  
  // Score based on word count - simplistic but shows the idea
  if (wordCount < 10) {
    score = 30;
    feedback = 'La risposta è troppo breve. Cerca di elaborare di più la tua risposta.';
  } else if (wordCount < 30) {
    score = 60;
    feedback = 'La risposta ha una lunghezza accettabile, ma potrebbe essere più dettagliata.';
  } else if (wordCount < 50) {
    score = 80;
    feedback = 'Buona risposta con un livello di dettaglio adeguato.';
  } else {
    score = 90;
    feedback = 'Risposta eccellente con un alto livello di dettaglio.';
  }
  
  // Add level-specific feedback
  switch(level) {
    case 'A1':
    case 'A2':
      feedback += ' Per il livello A1/A2, cerca di utilizzare frasi semplici e vocabolario di base.';
      break;
    case 'B1':
      feedback += ' Per il livello B1, cerca di utilizzare frasi più complesse e un vocabolario più ampio.';
      break;
    case 'B2':
      feedback += ' Per il livello B2, dimostra di saper utilizzare strutture grammaticali di media complessità.';
      break;
    case 'C1':
    case 'C2':
      feedback += ' Per il livello C1/C2, dimostra di saper utilizzare strutture grammaticali complesse e un vocabolario avanzato.';
      break;
  }
  
  // Add prompt-specific feedback
  if (prompt.includes('cittadinanza')) {
    feedback += ' Ricorda di includere sempre informazioni specifiche riguardanti la cittadinanza italiana quando richiesto.';
  }
  
  return { score, feedback };
}
