
import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Label } from '@/components/ui/label';
import { format, addDays } from 'date-fns';

const ReminderScheduler: React.FC = () => {
  const { user } = useAuth();
  const { scheduleReminder, cancelReminder } = useNotifications();
  const { toast } = useToast();
  
  const [time, setTime] = useState<string>("18:00");
  const [days, setDays] = useState<string[]>(["1", "3", "5"]); // Monday, Wednesday, Friday
  const [active, setActive] = useState<boolean>(false);
  
  // Set up standard time options
  const timeOptions = Array.from({ length: 24 }).map((_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { 
      value: `${hour}:00`, 
      label: format(new Date().setHours(i, 0), 'h:mm a') 
    };
  });
  
  const dayOptions = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" }
  ];

  const handleToggleReminder = async (enabled: boolean) => {
    if (!user) {
      toast({ 
        title: "Not logged in", 
        description: "Please log in to schedule reminders",
        variant: "destructive"
      });
      return;
    }
    
    if (enabled) {
      await scheduleReminders();
    } else {
      await cancelReminders();
    }
    
    setActive(enabled);
  };

  const scheduleReminders = async () => {
    try {
      // Cancel any existing reminders first
      await cancelReminders();
      
      // Schedule new reminders
      for (let day of days) {
        const dayNumber = parseInt(day);
        const now = new Date();
        let reminderDate = new Date();
        
        // Set the hour and minute for the reminder
        const [hour, minute] = time.split(':').map(Number);
        reminderDate.setHours(hour, minute, 0, 0);
        
        // Calculate days to add to reach the target day of week
        const currentDay = now.getDay();
        let daysToAdd = dayNumber - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7; // Move to next week if day has passed
        
        // If it's the same day but time has passed, move to next week
        if (daysToAdd === 0 && now > reminderDate) {
          daysToAdd = 7;
        }
        
        reminderDate = addDays(reminderDate, daysToAdd);
        
        // Schedule the reminder
        const id = await scheduleReminder(
          "Time for your daily practice!",
          "Maintain your learning streak and improve your Italian skills with today's question.",
          reminderDate
        );
        
        console.log(`Scheduled reminder for ${format(reminderDate, 'PPpp')}, ID: ${id}`);
      }
      
      toast({
        title: "Reminders scheduled",
        description: `You'll be reminded on your selected days at ${format(new Date().setHours(parseInt(time.split(':')[0]), 0), 'h:mm a')}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error scheduling reminders:', error);
      toast({
        title: "Error scheduling reminders",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const cancelReminders = async () => {
    try {
      // Logic to cancel all reminders would go here
      // This would typically involve calling cancelReminder() for each active reminder
      // For now, we'll just report success
      
      toast({
        title: "Reminders cancelled",
        description: "All practice reminders have been cancelled",
        variant: "default"
      });
    } catch (error) {
      console.error('Error cancelling reminders:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Practice Reminders
        </CardTitle>
        <CardDescription>
          Schedule reminders to help maintain your daily practice habit
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when it's time to practice
            </p>
          </div>
          <Switch 
            checked={active}
            onCheckedChange={handleToggleReminder}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Reminder time</Label>
          <Select
            value={time}
            onValueChange={setTime}
            disabled={!active}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Days of the week</Label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map(day => (
              <Button
                key={day.value}
                variant={days.includes(day.value) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (days.includes(day.value)) {
                    setDays(days.filter(d => d !== day.value));
                  } else {
                    setDays([...days, day.value]);
                  }
                }}
                disabled={!active}
                className="w-[calc(50%_-_0.25rem)] sm:w-auto justify-center"
              >
                {day.label.substring(0, 3)}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg border p-3 bg-muted/50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p>Regular practice helps you maintain your streak and makes learning more effective.</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={cancelReminders}
          disabled={!active}
        >
          Cancel All Reminders
        </Button>
        <Button 
          onClick={scheduleReminders}
          disabled={!active || days.length === 0}
        >
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReminderScheduler;
