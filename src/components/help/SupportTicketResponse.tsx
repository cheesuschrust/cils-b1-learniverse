
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSystemLog } from '@/hooks/use-system-log';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

const responseSchema = z.object({
  message: z.string().min(5, {
    message: 'Response must be at least 5 characters long',
  }),
});

type ResponseFormData = z.infer<typeof responseSchema>;

interface SupportTicketResponseProps {
  ticketId: string;
  onResponse: (message: string) => Promise<void>;
  onCancel: () => void;
}

const SupportTicketResponse: React.FC<SupportTicketResponseProps> = ({
  ticketId,
  onResponse,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { logEmailAction } = useSystemLog();
  const { language } = useLanguage();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      message: '',
    },
  });
  
  const onSubmit = async (data: ResponseFormData) => {
    setIsSubmitting(true);
    
    try {
      await onResponse(data.message);
      
      logEmailAction('Support ticket response', {
        ticketId,
        responseLength: data.message.length,
      });
      
      toast({
        title: language === 'italian' ? 'Risposta inviata' : 'Response sent',
        description: language === 'italian' 
          ? 'La tua risposta è stata inviata con successo' 
          : 'Your response has been sent successfully',
      });
      
      onCancel();
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: language === 'italian' ? 'Errore' : 'Error',
        description: language === 'italian'
          ? "Si è verificato un errore nell'invio della risposta"
          : 'There was an error sending your response',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <BilingualText
            english="Reply to Support Ticket"
            italian="Rispondi al Ticket di Supporto"
          />
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              {...register('message')}
              placeholder={language === 'italian' 
                ? "Scrivi la tua risposta qui..."
                : "Write your response here..."}
              rows={5}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <BilingualText
              english="Cancel"
              italian="Annulla"
            />
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <BilingualText
                english="Sending..."
                italian="Invio in corso..."
              />
            ) : (
              <BilingualText
                english="Send Response"
                italian="Invia Risposta"
              />
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SupportTicketResponse;
