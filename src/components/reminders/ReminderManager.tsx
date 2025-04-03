
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, BellRing, Calendar as CalendarIcon2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { TimePickerDemo } from '@/components/ui/time-picker-demo';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

interface ReminderManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReminderManager: React.FC<ReminderManagerProps> = ({
  open,
  onOpenChange
}) => {
  const [date, setDate] = useState<Date>();
  const [reminderType, setReminderType] = useState("daily");
  const [reminderName, setReminderName] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "wednesday", "friday"]);
  const [repeating, setRepeating] = useState(true);
  const { toast } = useToast();
  
  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];
  
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const handleSetReminder = () => {
    // Logic to set reminder based on type
    let successMessage = "";
    
    if (reminderType === "daily") {
      successMessage = `Daily reminder "${reminderName}" set for ${selectedTime}`;
    } else if (reminderType === "recurring") {
      const daysText = selectedDays.length > 0 
        ? selectedDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ") 
        : "No days";
      successMessage = `Recurring reminder "${reminderName}" set for ${selectedTime} on ${daysText}`;
    } else if (reminderType === "one-time") {
      if (!date) {
        toast({
          title: "Date required",
          description: "Please select a date for your one-time reminder",
          variant: "destructive"
        });
        return;
      }
      successMessage = `One-time reminder "${reminderName}" set for ${format(date, "PPP")} at ${selectedTime}`;
    }
    
    toast({
      title: "Reminder Set",
      description: successMessage,
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Set Reminder
          </DialogTitle>
          <DialogDescription>
            Create reminders for your Italian study sessions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-name">Reminder Name</Label>
            <Input 
              id="reminder-name"
              placeholder="Italian study session"
              value={reminderName}
              onChange={(e) => setReminderName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Reminder Type</Label>
            <Select 
              value={reminderType}
              onValueChange={setReminderType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {reminderType === "one-time" && (
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
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          {reminderType === "recurring" && (
            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Button
                    key={day.value}
                    variant={selectedDays.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day.value)}
                    className={!selectedDays.includes(day.value) ? "text-muted-foreground" : ""}
                  >
                    {selectedDays.includes(day.value) && <Check className="mr-1 h-4 w-4" />}
                    {day.label.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Time</Label>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          {reminderType !== "one-time" && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="repeat">Repeating</Label>
                <p className="text-sm text-muted-foreground">
                  Repeat this reminder automatically
                </p>
              </div>
              <Switch
                id="repeat"
                checked={repeating}
                onCheckedChange={setRepeating}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSetReminder}>Set Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderManager;
