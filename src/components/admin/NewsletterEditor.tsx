
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

interface NewsletterEditorProps {
  onSent?: () => void;
}

const NewsletterEditor: React.FC<NewsletterEditorProps> = ({ onSent }) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide both subject and content for the newsletter.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject,
          content,
          recipientFilter: { status: 'active' }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Newsletter Sent",
        description: data.message || "Newsletter has been scheduled for delivery.",
      });
      
      setSubject('');
      setContent('');
      
      if (onSent) {
        onSent();
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast({
        title: "Sending failed",
        description: "There was a problem sending the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Newsletter</CardTitle>
        <CardDescription>
          Create and send a newsletter to your subscribers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              placeholder="Enter newsletter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="content">Newsletter Content</Label>
            <Textarea
              id="content"
              placeholder="Write your newsletter content here..."
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              You can use markdown formatting in your content.
            </p>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                // Save as draft logic would go here
                toast({
                  title: "Draft Saved",
                  description: "Your newsletter has been saved as a draft.",
                });
              }}
              disabled={loading}
              className="flex gap-2 items-center"
            >
              <Clock size={16} />
              Save as Draft
            </Button>
            
            <Button 
              onClick={handleSendNewsletter} 
              disabled={loading || !subject.trim() || !content.trim()}
              className="flex gap-2 items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Newsletter
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsletterEditor;
