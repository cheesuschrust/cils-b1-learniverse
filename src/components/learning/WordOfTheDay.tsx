
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpeakableWord from './SpeakableWord';
import { CalendarDays, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <SpeakableWord 
              word={word} 
              language="it" 
              className="text-xl font-medium"
              autoPlay={false}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2 h-6">
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Word of the day is updated daily</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">{meaning}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-xs"
              onClick={() => window.open(`https://context.reverso.net/translation/italian-english/${encodeURIComponent(word)}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
              More
            </Button>
          </div>
          
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm italic">
              <SpeakableWord 
                word={example} 
                language="it"
                className="inline"
                autoPlay={false}
              />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordOfTheDay;
