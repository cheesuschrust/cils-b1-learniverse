
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

interface NewsletterSubscriptionProps {
  className?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Insert into the newsletter_subscriptions table
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email, status: 'pending', source: 'website' }]);
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: 'Already Subscribed',
            description: 'This email is already on our newsletter list.',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Subscription Successful',
          description: 'Thank you for subscribing to our newsletter!',
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        variant: 'destructive',
        title: 'Subscription Failed',
        description: 'There was a problem subscribing you. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="newsletter-subscription" className={`w-full max-w-md mx-auto ${className}`}>
      <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
      <p className="text-muted-foreground mb-4">
        Subscribe to our newsletter to get the latest updates on our Italian language learning resources.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sm:flex-1"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-2">
        By subscribing, you agree to our <Link to="/privacy">Privacy Policy</Link>. 
        You can unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSubscription;
