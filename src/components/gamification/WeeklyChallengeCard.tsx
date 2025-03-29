
import React from 'react';
import { Badge } from "@/components/ui/badge";

const WeeklyChallengeCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Badge variant="outline" className="bg-green-500 text-white">
      Weekly Challenge
    </Badge>
  );
};

export default WeeklyChallengeCard;
