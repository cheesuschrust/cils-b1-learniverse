
import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, addMinutes, addHours, addDays, setHours, setMinutes } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ReminderSchedulerProps {
  children?: React.ReactNode;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
}

const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({
  children,
  buttonVariant = 'outline',
  buttonSize = 'default',
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState<Date>(addDays(new Date(), 1));
  const [time, setTime] = useState('09:00');
  const [presetOption, setPresetOption] = useState('');
  const { scheduleReminder } = useNotifications();
  const { toast } = useToast();

  const handlePresetChange = (value: string) => {
    setPresetOption(value);
    const now = new Date();
    
    switch (value) {
      case 'fifteen_minutes':
        setDate(addMinutes(now, 15));
        setTime(format(addMinutes(now, 15), 'HH:mm'));
        break;
      case 'one_hour':
        setDate(addHours(now, 1));
        setTime(format(addHours(now, 1), 'HH:mm'));
        break;
      case 'tomorrow_morning':
        const tomorrow = addDays(now, 1);
        setDate(tomorrow);
        setTime('09:00');
        break;
      case 'tomorrow_evening':
        const tomorrowEvening = addDays(now, 1);
        setDate(tomorrowEvening);
        setTime('19:00');
        break;
      case 'weekend':
        // Calculate next Saturday
        const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
        setDate(addDays(now, daysUntilSaturday));
        setTime('10:00');
        break;
      default:
        break;
    }
  };

  const handleSchedule = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter both a title and message for your reminder.',
        variant: 'destructive'
      });
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDateTime = setMinutes(setHours(date, hours), minutes);

    if (scheduledDateTime <= new Date()) {
      toast({
        title: 'Invalid time',
        description: 'Please select a future date and time.',
        variant: 'destructive'
      });
      return;
    }

    const id = await scheduleReminder(title, message, scheduledDateTime);
    
    if (id) {
      toast({
        title: 'Reminder scheduled',
        description: `Your reminder has been scheduled for ${format(scheduledDateTime, 'PPP')} at ${format(scheduledDateTime, 'p')}.`,
        variant: 'default'
      });
      setOpen(false);
      
      // Reset form
      setTitle('');
      setMessage('');
      setDate(addDays(new Date(), 1));
      setTime('09:00');
      setPresetOption('');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to schedule reminder. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={buttonVariant} size={buttonSize}>
            <Clock className="mr-2 h-4 w-4" />
            Schedule Reminder
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a reminder</DialogTitle>
          <DialogDescription>
            Set up a reminder to help you stay on track with your language learning goals.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="preset" className="text-right">
              Preset
            </Label>
            <Select value={presetOption} onValueChange={handlePresetChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Choose a preset time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fifteen_minutes">In 15 minutes</SelectItem>
                <SelectItem value="one_hour">In 1 hour</SelectItem>
                <SelectItem value="tomorrow_morning">Tomorrow morning</SelectItem>
                <SelectItem value="tomorrow_evening">Tomorrow evening</SelectItem>
                <SelectItem value="weekend">Weekend</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input 
              id="title" 
              className="col-span-3" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reminder title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Input 
              id="message" 
              className="col-span-3" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Reminder message"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input 
              id="time" 
              type="time" 
              className="col-span-3"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>Schedule Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderScheduler;
