
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format, addDays, addHours, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ReminderFormValues {
  title: string;
  message: string;
  date: Date | null;
  time: string;
  type: 'once' | 'daily' | 'weekly';
}

interface ReminderManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReminderManager: React.FC<ReminderManagerProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<'list' | 'create'>('list');
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { scheduleReminder, cancelReminder } = useNotifications();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<ReminderFormValues>({
    defaultValues: {
      title: '',
      message: '',
      date: new Date(),
      time: format(new Date(new Date().getTime() + 60 * 60 * 1000), 'HH:mm'), // Default to one hour from now
      type: 'once',
    },
  });
  
  // Handle creating a new reminder
  const onSubmit = async (values: ReminderFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to set reminders.",
        variant: "destructive",
      });
      return;
    }
    
    if (!values.date) {
      form.setError('date', { message: 'Please select a date' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Parse the time string
      const timeParts = values.time.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      // Set the time on the selected date
      const reminderDate = new Date(values.date);
      reminderDate.setHours(hours, minutes, 0, 0);
      
      // Check if the date is valid and in the future
      if (!isValid(reminderDate) || reminderDate <= new Date()) {
        toast({
          title: "Invalid Time",
          description: "Please select a future date and time.",
          variant: "destructive",
        });
        return;
      }
      
      // Schedule the reminder
      const reminderId = await scheduleReminder(
        values.title,
        values.message,
        reminderDate
      );
      
      if (reminderId) {
        // Add to local state for display
        setReminders(prev => [
          ...prev,
          {
            id: reminderId,
            title: values.title,
            message: values.message,
            scheduledFor: reminderDate,
            type: values.type,
          }
        ]);
        
        toast({
          title: "Reminder Set",
          description: `You'll be reminded on ${format(reminderDate, 'PPP')} at ${format(reminderDate, 'p')}`,
        });
        
        // Reset form and go back to list
        form.reset();
        setStep('list');
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle canceling a reminder
  const handleCancelReminder = async (id: string) => {
    try {
      await cancelReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Reminder Cancelled",
        description: "The reminder has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling reminder:", error);
      toast({
        title: "Error",
        description: "Failed to cancel reminder. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Generate quick reminder options
  const quickOptions = [
    {
      label: "Study today",
      date: new Date(),
      time: format(addHours(new Date(), 3), 'HH:mm'),
    },
    {
      label: "Study tomorrow",
      date: addDays(new Date(), 1),
      time: "09:00",
    },
    {
      label: "Weekend review",
      date: addDays(new Date(), 
        new Date().getDay() === 6 ? 1 : (new Date().getDay() === 0 ? 6 : 6 - new Date().getDay())
      ),
      time: "10:00",
    }
  ];
  
  // Handle quick option selection
  const handleQuickOption = (option: typeof quickOptions[0]) => {
    form.setValue('title', `Time to study Italian!`);
    form.setValue('message', `Your scheduled Italian study session is starting soon. Keep your streak going!`);
    form.setValue('date', option.date);
    form.setValue('time', option.time);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'list' ? 'Manage Reminders' : 'Create Reminder'}
          </DialogTitle>
          <DialogDescription>
            {step === 'list' 
              ? 'Set study reminders to help maintain your practice streak.'
              : 'Schedule a new reminder to help with your study habits.'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'list' ? (
          <>
            <div className="space-y-4">
              {reminders.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="mt-2 text-muted-foreground">No reminders set</p>
                  <p className="text-sm text-muted-foreground">Create reminders to help maintain your study streak</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {reminders.map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className="flex justify-between items-start p-3 border rounded-md"
                    >
                      <div>
                        <h4 className="font-medium">{reminder.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{reminder.message}</p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>
                            {format(new Date(reminder.scheduledFor), 'PPP')} at {format(new Date(reminder.scheduledFor), 'p')}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleCancelReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                className="w-full"
                onClick={() => setStep('create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Reminder
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                {quickOptions.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="text-xs h-auto py-2"
                    onClick={() => handleQuickOption(option)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{
                      required: 'Title is required',
                      maxLength: {
                        value: 50,
                        message: 'Title must be less than 50 characters',
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Study Italian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Time for your daily Italian practice!"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repeat</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="once">Once</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Premium users can set recurring reminders
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('list')}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Setting..." : "Set Reminder"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReminderManager;
