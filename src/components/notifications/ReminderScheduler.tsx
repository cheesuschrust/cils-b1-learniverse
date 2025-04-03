
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
import { Clock } from 'lucide-react';
import { format, addDays, addHours, set } from 'date-fns';

interface ReminderSchedulerProps {
  children?: React.ReactNode;
}

const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({ children }) => {
  const { scheduleReminder } = useNotifications();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Study Reminder');
  const [message, setMessage] = useState('Time to practice your Italian!');
  const [date, setDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));

  const handleSchedule = async () => {
    const [hours, minutes] = time.split(':').map(Number);
    const reminderDate = set(new Date(date), { hours, minutes, seconds: 0 });
    
    // Don't allow scheduling in the past
    if (reminderDate < new Date()) {
      alert("Please select a future date and time.");
      return;
    }
    
    await scheduleReminder(title, message, reminderDate);
    setOpen(false);
    
    // Reset form
    setTitle('Study Reminder');
    setMessage('Time to practice your Italian!');
    setDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
    setTime(format(new Date(), 'HH:mm'));
  };

  const getPresetTimes = () => {
    const now = new Date();
    return [
      { label: "Tomorrow morning", date: addDays(now, 1), time: "09:00" },
      { label: "Tomorrow evening", date: addDays(now, 1), time: "19:00" },
      { label: "In 3 hours", date: now, time: format(addHours(now, 3), 'HH:mm') },
      { label: "Next weekend", date: addDays(now, 7 - now.getDay()), time: "10:00" }
    ];
  };
  
  const presetTimes = getPresetTimes();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            <span>Set Study Reminder</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a Study Reminder</DialogTitle>
          <DialogDescription>
            Set up a reminder to help maintain your study routine.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reminder Title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Reminder Message"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-2">
            <Label>Quick presets</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {presetTimes.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDate(format(preset.date, 'yyyy-MM-dd'));
                    setTime(preset.time);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSchedule}>Schedule Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderScheduler;
