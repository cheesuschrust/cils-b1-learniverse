
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSystemLog } from '@/hooks/use-system-log';

// Form validation schema
const formSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100),
  category: z.enum(['general', 'technical', 'billing', 'feedback', 'other'], {
    required_error: 'Please select a category',
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const SupportForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logEmailAction } = useSystemLog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      category: 'general',
      message: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to your backend
      // But for now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log the support ticket creation
      logEmailAction('Support ticket created', 
        `User ${user?.id} created a support ticket: ${data.subject} (${data.category}, ${data.priority})`
      );
      
      toast({
        title: 'Support ticket submitted',
        description: 'We will get back to you as soon as possible.',
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast({
        title: 'Failed to submit',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription>
          Fill out this form to get help from our support team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              {...register('subject')} 
              placeholder="Briefly describe your issue"
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                defaultValue={watch('category')} 
                onValueChange={value => {
                  // React Hook Form doesn't handle Select components natively
                  const event = { target: { name: 'category', value } };
                  register('category').onChange(event as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Question</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                defaultValue={watch('priority')} 
                onValueChange={value => {
                  const event = { target: { name: 'priority', value } };
                  register('priority').onChange(event as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-destructive">{errors.priority.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              {...register('message')} 
              placeholder="Describe your issue in detail"
              rows={6}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <CardFooter className="px-0 pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportForm;
