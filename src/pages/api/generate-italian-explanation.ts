
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
    const { userId, italianText, level } = req.body;
    
    // Validate required parameters
    if (!userId || !italianText || !level) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // In a production app, we would use an AI service to generate explanations
    // For now, we'll generate a mock explanation
    const explanation = generateMockExplanation(italianText, level);
    
    return res.status(200).json({ explanation });
  } catch (error) {
    console.error('Error generating Italian explanation:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

function generateMockExplanation(text: string, level: ItalianLevel): string {
  // Generate different explanations based on level
  const textSample = text.substring(0, 30);
  
  switch(level) {
    case 'A1':
    case 'A2':
      return `Spiegazione semplice: "${textSample}..." è una frase che utilizza vocaboli e strutture grammaticali di base. La frase contiene parole comuni e una struttura semplice. È importante ricordare che in italiano l'ordine delle parole è spesso soggetto-verbo-oggetto.`;
      
    case 'B1':
    case 'B2':
      return `Spiegazione intermedia: "${textSample}..." è una frase che utilizza costruzioni grammaticali di livello intermedio. Possiamo vedere l'uso del congiuntivo/condizionale e alcune espressioni idiomatiche. È importante notare la concordanza tra soggetto e verbo, e l'uso appropriato delle preposizioni.`;
      
    case 'C1':
    case 'C2':
      return `Spiegazione avanzata: "${textSample}..." è una costruzione linguistica complessa che utilizza strutture sintattiche elaborate. La frase dimostra l'uso di forme verbali avanzate, sfumature lessicali precise e una struttura argomentativa articolata. Si noti l'uso del modo congiuntivo in combinazione con il periodo ipotetico e l'impiego di connettori logici sofisticati.`;
      
    default:
      return `Spiegazione: "${textSample}..." è una frase in italiano standard. Contiene strutture grammaticali comuni e un vocabolario di uso quotidiano.`;
  }
}
