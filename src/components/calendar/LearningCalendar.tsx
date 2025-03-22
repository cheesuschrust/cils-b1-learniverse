
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ArrowRightIcon, CheckIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Mock data for calendar activities
const mockActivities = [
  { date: new Date(2023, 2, 10), completed: true, type: "quiz", score: 85 },
  { date: new Date(2023, 2, 12), completed: true, type: "flashcards", score: 90 },
  { date: new Date(2023, 2, 15), completed: false, type: "listening", score: 0 },
  { date: new Date(2023, 2, 18), completed: true, type: "writing", score: 75 },
  { date: new Date(2023, 2, 20), completed: false, type: "speaking", score: 0 },
  { date: new Date(2023, 2, 25), completed: true, type: "multipleChoice", score: 95 },
  { date: new Date(), completed: false, type: "quiz", score: 0 },
];

// Function to get date classes based on activity
const getDateClass = (date: Date, activities: any[]) => {
  const activity = activities.find(a => 
    a.date.getDate() === date.getDate() && 
    a.date.getMonth() === date.getMonth() && 
    a.date.getFullYear() === date.getFullYear()
  );
  
  if (!activity) return "";
  
  return activity.completed 
    ? "bg-green-100 text-green-800 font-bold" 
    : "bg-amber-100 text-amber-800 font-bold";
};

interface LearningCalendarProps {
  onClose?: () => void;
}

const LearningCalendar: React.FC<LearningCalendarProps> = ({ onClose }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setDate(date);
    
    const activity = mockActivities.find(a => 
      a.date.getDate() === date.getDate() && 
      a.date.getMonth() === date.getMonth() && 
      a.date.getFullYear() === date.getFullYear()
    );
    
    setSelectedActivity(activity);
  };
  
  const handleActivityStart = () => {
    if (!selectedActivity) return;
    
    // Navigate to the appropriate exercise type
    switch(selectedActivity.type) {
      case "flashcards":
        navigate("/flashcards");
        break;
      case "listening":
        navigate("/listening");
        break;
      case "writing":
        navigate("/writing");
        break;
      case "speaking":
        navigate("/speaking");
        break;
      case "multipleChoice":
        navigate("/multiple-choice");
        break;
      case "quiz":
      default:
        navigate("/multiple-choice");
        break;
    }
    
    if (onClose) onClose();
  };
  
  // Set today's activity for the current date if not selected
  React.useEffect(() => {
    if (!selectedActivity && date) {
      const activity = mockActivities.find(a => 
        a.date.getDate() === date.getDate() && 
        a.date.getMonth() === date.getMonth() && 
        a.date.getFullYear() === date.getFullYear()
      );
      
      setSelectedActivity(activity);
    }
  }, [date, selectedActivity]);
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Learning Calendar
        </CardTitle>
        <CardDescription>
          Track your progress and plan your learning schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="border rounded-md pointer-events-auto"
              modifiers={{
                completed: mockActivities.filter(a => a.completed).map(a => a.date),
                pending: mockActivities.filter(a => !a.completed).map(a => a.date),
              }}
              modifiersClassNames={{
                completed: "bg-green-100 text-green-800 font-bold",
                pending: "bg-amber-100 text-amber-800 font-bold",
              }}
            />
          </div>
          <div className="md:col-span-2">
            <div className="h-full border rounded-md p-4">
              <h3 className="font-medium text-lg mb-3">
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </h3>
              
              {selectedActivity ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedActivity.completed ? "success" : "outline"}>
                      {selectedActivity.completed ? "Completed" : "Pending"}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)}
                    </Badge>
                  </div>
                  
                  {selectedActivity.completed ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Score</p>
                      <div className="text-2xl font-bold">{selectedActivity.score}%</div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You have not completed this activity yet.
                    </p>
                  )}
                  
                  <Button 
                    onClick={handleActivityStart} 
                    className="w-full mt-4"
                  >
                    {selectedActivity.completed ? "Review Activity" : "Start Activity"}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-6">
                  <p className="text-sm text-muted-foreground text-center">
                    No activities scheduled for this date.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-100 mr-2 border border-green-300"></div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-amber-100 mr-2 border border-amber-300"></div>
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-200 mr-2 border border-gray-300"></div>
              <span className="text-sm">No Activity</span>
            </div>
          </div>
        </div>
      </CardContent>
      {onClose && (
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LearningCalendar;
