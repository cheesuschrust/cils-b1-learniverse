
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpeakableWord from './SpeakableWord';
import { CalendarDays } from 'lucide-react';

interface WordOfTheDayProps {
  word: string;
  meaning: string;
  example: string;
  className?: string;
}

const WordOfTheDay: React.FC<WordOfTheDayProps> = ({ 
  word = "Ciao", 
  meaning = "Hello, Hi", 
  example = "Ciao, come stai?", 
  className = "" 
}) => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('it-IT', options);
  
  return (
    <Card className={`${className} backdrop-blur-sm border-accent/20`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Parola del Giorno</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <SpeakableWord 
              word={word} 
              language="it" 
              className="text-xl font-medium"
              autoPlay={false}
            />
          </div>
          <p className="text-muted-foreground">{meaning}</p>
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm italic">
              <SpeakableWord 
                word={example} 
                language="it"
                className="inline"
              />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordOfTheDay;
