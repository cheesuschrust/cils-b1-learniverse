
import React from 'react';
import { Badge } from "@/components/ui/badge";

const AchievementBadge: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Badge variant="outline" className="bg-green-500 text-white">
      Achievement
    </Badge>
  );
};

export default AchievementBadge;
