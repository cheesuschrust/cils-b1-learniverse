
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface NewsletterSubscriptionProps {
  compact?: boolean;
  darkMode?: boolean;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ 
  compact = false,
  darkMode = false 
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would connect to a newsletter API
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscription successful!",
        description: "You'll start receiving our Italian learning tips soon.",
      });
      
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "There was a problem subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (compact) {
    return (
      <form onSubmit={handleSubscribe} className="flex max-w-sm">
        <Input
          type="email"
          placeholder="Enter your email"
          className={`rounded-r-none ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email for newsletter subscription"
        />
        <Button 
          type="submit" 
          className="rounded-l-none" 
          size="icon"
          disabled={loading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    );
  }
  
  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>
        Get Italian Citizenship Tips
      </h3>
      <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Subscribe to our newsletter for CILS preparation tips, language learning resources, and citizenship information.
      </p>
      
      <form onSubmit={handleSubscribe} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          className={darkMode ? 'bg-gray-700 border-gray-600' : ''}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="mr-2 h-4 w-4" />
              Subscribe Now
            </span>
          )}
        </Button>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
