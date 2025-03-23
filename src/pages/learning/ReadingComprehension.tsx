
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Languages } from 'lucide-react';
import SpeakableWord from '@/components/learning/SpeakableWord';
import BilingualFeedback from '@/components/ui/BilingualFeedback';

const ReadingComprehension = () => {
  const [showTranslation, setShowTranslation] = useState(false);
  
  const sampleText = "L'Italia è una repubblica parlamentare nell'Europa meridionale. La sua capitale è Roma.";
  const translatedText = "Italy is a parliamentary republic in Southern Europe. Its capital is Rome.";
  
  return (
    <Card className="w-full shadow-lg border-2 border-[#009246]/20">
      <CardHeader className="bg-gradient-to-r from-[#009246]/10 to-[#ce2b37]/10">
        <CardTitle className="text-gray-800 flex items-center space-x-2">
          <span>Reading Comprehension</span>
        </CardTitle>
        <CardDescription className="text-gray-700">
          Practice reading and understanding Italian texts
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Sample Text</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1 border-[#33A5EF] text-[#33A5EF]"
                onClick={() => setShowTranslation(!showTranslation)}
              >
                <Languages className="h-4 w-4" />
                <span>{showTranslation ? "Hide Translation" : "Show Translation"}</span>
              </Button>
            </div>
          </div>
          
          <SpeakableWord 
            word={sampleText}
            language="it"
            className="block mb-4 text-gray-800"
          />
          
          {showTranslation && (
            <div className="mt-2 p-3 bg-[#33A5EF]/10 rounded-md border border-[#33A5EF]/20">
              <p className="text-gray-800 italic">{translatedText}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <BilingualFeedback
            english="Try to understand the text before using the translation. Focus on recognizing familiar words first."
            italian="Cerca di capire il testo prima di usare la traduzione. Concentrati prima sul riconoscere le parole familiari."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingComprehension;
