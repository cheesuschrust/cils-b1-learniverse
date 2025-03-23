
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-20" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from students who have successfully prepared for their citizenship test.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            content="Thanks to this app, I passed my CILS B1 exam on the first try. The daily questions really helped me stay consistent with my practice."
            name="Marco S."
            location="Milan, Italy"
            initials="MS"
          />
          
          <TestimonialCard 
            content="The listening exercises were incredibly helpful. I feel much more confident in my ability to understand spoken Italian now."
            name="Anna L."
            location="Rome, Italy"
            initials="AL"
          />
          
          <TestimonialCard 
            content="The AI feedback on my writing exercises helped me identify and correct mistakes I didn't even know I was making. Highly recommended!"
            name="John B."
            location="Florence, Italy"
            initials="JB"
          />
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  content: string;
  name: string;
  location: string;
  initials: string;
}

const TestimonialCard = ({ content, name, location, initials }: TestimonialCardProps) => {
  return (
    <Card className="backdrop-blur-sm border border-accent/20">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
        <p className="mb-4 italic">"{content}"</p>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center">
            <span className="font-medium text-sm">{initials}</span>
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsSection;
