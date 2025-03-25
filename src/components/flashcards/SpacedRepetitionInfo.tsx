
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Brain, Award } from "lucide-react";
import { Flashcard } from '@/types/flashcard';

interface SpacedRepetitionInfoProps {
  card?: Flashcard;
  className?: string;
}

const SpacedRepetitionInfo: React.FC<SpacedRepetitionInfoProps> = ({ 
  card,
  className = ""
}) => {
  const level = card?.level || 0;
  const dueDate = card?.dueDate || new Date();
  const isMastered = card?.mastered || false;
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Spaced Repetition Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Brain className="h-4 w-4 mr-2 text-primary" />
            <span>Difficulty Level:</span>
          </div>
          <Badge variant={level > 3 ? "outline" : "default"}>
            Level {level}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            <span>Next Review:</span>
          </div>
          <span className="text-sm">
            {dueDate.toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-2 text-primary" />
            <span>Status:</span>
          </div>
          <Badge variant={isMastered ? "default" : "outline"} className={isMastered ? "bg-green-500" : ""}>
            {isMastered ? "Mastered" : "Learning"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpacedRepetitionInfo;
