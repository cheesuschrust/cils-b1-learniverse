
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface DashboardHeaderProps {
  userName: string;
  onViewCalendar: () => void;
  onStartLesson: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName, 
  onViewCalendar, 
  onStartLesson 
}) => {
  return (
    <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-center mb-8 animate-fade-in">
      <div className="max-w-full">
        <h1 className="text-3xl font-bold tracking-tight truncate">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and continue your Italian learning journey
        </p>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewCalendar}
          className="w-full sm:w-auto"
        >
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
        <Button 
          size="sm" 
          onClick={onStartLesson}
          className="w-full sm:w-auto"
        >
          <Zap className="mr-2 h-4 w-4" />
          Start Today's Lesson
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
