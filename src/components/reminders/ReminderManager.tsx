
import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ReminderManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReminderManager: React.FC<ReminderManagerProps> = ({
  open,
  onOpenChange
}) => {
  const { scheduleReminder } = useNotifications();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('Study Reminder');
  const [message, setMessage] = useState('Time to practice Italian!');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('12:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        title: 'Missing information',
        description: 'Please select both date and time for your reminder',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Parse the time
      const [hours, minutes] = time.split(':').map(Number);
      
      // Create a new date object with the same date but with the time set
      const reminderDate = new Date(date);
      reminderDate.setHours(hours, minutes, 0, 0);
      
      // Check if the date is in the past
      if (reminderDate < new Date()) {
        toast({
          title: 'Invalid date',
          description: 'The reminder date cannot be in the past',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Schedule the reminder
      const reminderId = await scheduleReminder(title, message, reminderDate);
      
      if (reminderId) {
        toast({
          title: 'Reminder scheduled',
          description: `Your reminder is set for ${format(reminderDate, 'PPp')}`,
        });
        
        // Reset form and close dialog
        setTitle('Study Reminder');
        setMessage('Time to practice Italian!');
        setDate(new Date());
        setTime('12:00');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule the reminder. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time options for every 15 minutes
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule a Reminder</DialogTitle>
            <DialogDescription>
              Create a reminder to help you stay consistent with your studies.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Reminder title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Reminder message"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time || <span>Select time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="p-2 max-h-[300px] overflow-y-auto">
                      {generateTimeOptions().map((timeOption) => (
                        <Button
                          key={timeOption}
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => {
                            setTime(timeOption);
                          }}
                        >
                          {timeOption}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Reminder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderManager;
