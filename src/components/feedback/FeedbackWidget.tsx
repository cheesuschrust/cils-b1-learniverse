
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MessageSquare, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';

interface FeedbackWidgetProps {
  onSubmit?: (feedback: { type: string; message: string }) => void;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string>('suggestion');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { generateText } = useAI();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Reset the form when opened
    if (!isOpen) {
      setFeedbackType('suggestion');
      setFeedbackMessage('');
      setIsSubmitted(false);
    }
  };

  const handleSubmit = async () => {
    if (!feedbackMessage.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Store feedback for AI training data
      const aiResponse = await generateText(`User feedback: ${feedbackMessage}`);
      console.log('AI acknowledged feedback:', aiResponse);
      
      // If onSubmit prop is provided, call it
      if (onSubmit) {
        await onSubmit({
          type: feedbackType,
          message: feedbackMessage
        });
      }
      
      // Show success toast
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! It helps us improve.",
      });
      
      // Mark as submitted
      setIsSubmitted(true);
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error Submitting Feedback",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating action button */}
      <Button
        onClick={handleToggle}
        size="icon"
        className={`h-12 w-12 rounded-full shadow-lg ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
      </Button>
      
      {/* Feedback card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 w-80"
          >
            <Card className="shadow-lg border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {isSubmitted ? 'Thanks for your feedback!' : 'Share your feedback'}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {isSubmitted ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    <ThumbsUp className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-muted-foreground">
                      We appreciate your input and will use it to improve the app.
                    </p>
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={feedbackType}
                      onValueChange={setFeedbackType}
                      className="space-y-2 mb-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suggestion" id="suggestion" />
                        <Label htmlFor="suggestion">Suggestion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bug" id="bug" />
                        <Label htmlFor="bug">Bug Report</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="praise" id="praise" />
                        <Label htmlFor="praise">Praise</Label>
                      </div>
                    </RadioGroup>
                    
                    <Textarea
                      placeholder="Tell us what you think..."
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </>
                )}
              </CardContent>
              
              {!isSubmitted && (
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleToggle}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!feedbackMessage.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackWidget;
