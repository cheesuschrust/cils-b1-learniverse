
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, MessageSquare, X, Send, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FeedbackWidgetProps {
  contentId?: string;
  contentType?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onFeedbackSubmit?: (feedback: {
    rating: 'positive' | 'negative' | 'neutral';
    comment: string;
    contentId?: string;
    contentType?: string;
  }) => void;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  contentId,
  contentType,
  position = 'bottom-right',
  onFeedbackSubmit
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };
  
  // Handle toggle
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
    if (isSubmitted) {
      setRating('neutral');
      setComment('');
      setIsSubmitted(false);
    }
  };
  
  // Handle rating change
  const handleRatingChange = (newRating: 'positive' | 'negative' | 'neutral') => {
    setRating(newRating);
  };
  
  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  
  // Handle submit
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (onFeedbackSubmit) {
        onFeedbackSubmit({
          rating,
          comment,
          contentId,
          contentType
        });
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! It helps improve our AI."
      });
      
      // Close after a delay
      setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }, 800);
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {isExpanded ? (
        <Card className="w-80 shadow-lg">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Provide Feedback</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={toggleExpanded}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {isSubmitted ? (
              <div className="flex flex-col items-center py-4">
                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-center">
                  Thank you for your feedback!<br />It helps improve our AI content.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center space-x-4 mb-3">
                  <Button
                    variant={rating === 'positive' ? "default" : "outline"}
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleRatingChange('positive')}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>Helpful</span>
                  </Button>
                  
                  <Button
                    variant={rating === 'negative' ? "default" : "outline"}
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleRatingChange('negative')}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span>Not Helpful</span>
                  </Button>
                </div>
                
                <Textarea
                  placeholder="Your feedback helps improve our AI... (optional)"
                  value={comment}
                  onChange={handleCommentChange}
                  rows={3}
                  className="resize-none mb-3"
                />
                
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-1"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-1" />
                        <span>Submit</span>
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full shadow-md flex items-center space-x-1"
          onClick={toggleExpanded}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>Feedback</span>
        </Button>
      )}
    </div>
  );
};

export default FeedbackWidget;
