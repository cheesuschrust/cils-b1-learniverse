
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MessageSquare, X, Check } from 'lucide-react';

interface FeedbackWidgetProps {
  onSubmit: (feedback: { type: string; message: string }) => void;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('suggestion');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    onSubmit({ type, message });
    setIsSubmitted(true);
    
    // Reset the form after a short delay
    setTimeout(() => {
      setMessage('');
      setType('suggestion');
      setIsSubmitted(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Send Feedback</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <RadioGroup defaultValue="suggestion" value={type} onValueChange={setType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="suggestion" id="suggestion" />
                      <Label htmlFor="suggestion">Suggestion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="issue" id="issue" />
                      <Label htmlFor="issue">Issue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="praise" id="praise" />
                      <Label htmlFor="praise">Praise</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback-message">Your Message</Label>
                  <Textarea 
                    id="feedback-message" 
                    placeholder="Share your thoughts with us..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!message.trim()}>
                  Submit Feedback
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="py-6">
              <div className="text-center space-y-2">
                <div className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Thank you for your feedback!</h3>
                <p className="text-sm text-muted-foreground">
                  We appreciate your input and will use it to improve the platform.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg"
          aria-label="Open feedback form"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default FeedbackWidget;
