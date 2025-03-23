
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
  highlight?: boolean;
}

const testimonials: Testimonial[] = [
  {
    quote: "This platform made the difference in my citizenship journey. The focused B2 exam preparation gave me the confidence I needed to pass easily.",
    author: "Luisa Mendez",
    role: "Successfully obtained Italian citizenship",
    image: "https://i.pravatar.cc/150?img=32",
    highlight: true
  },
  {
    quote: "The interactive exercises and real-time feedback helped me identify my weak points and address them quickly. My speaking skills improved dramatically.",
    author: "Tomasz Kowalski",
    role: "Passed CILS B2 with distinction",
    image: "https://i.pravatar.cc/150?img=12"
  },
  {
    quote: "As someone who struggled with Italian grammar, the clear explanations and targeted practice made all the difference. I'm now confidently conversational!",
    author: "Sarah Johnson",
    role: "B2 exam candidate",
    image: "https://i.pravatar.cc/150?img=26"
  },
  {
    quote: "The mock exams were incredibly realistic and prepared me perfectly for the actual test. The listening exercises were particularly helpful.",
    author: "Ahmed Hassan",
    role: "New Italian citizen",
    image: "https://i.pravatar.cc/150?img=15"
  },
  {
    quote: "I tried several language apps before finding this one. The citizenship-specific focus and cultural context makes learning relevant and engaging.",
    author: "Maria Fernandez",
    role: "Language enthusiast",
    image: "https://i.pravatar.cc/150?img=20"
  },
  {
    quote: "The platform's spaced repetition system helped me retain vocabulary much better than traditional methods. Highly recommend for serious learners.",
    author: "John Smith",
    role: "Business professional",
    image: "https://i.pravatar.cc/150?img=53"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from people who have successfully passed their CILS B2 Cittadinanza exam using our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`h-full ${
                testimonial.highlight 
                  ? "border-blue-500 dark:border-blue-400 shadow-md" 
                  : ""
              }`}
            >
              <CardContent className="pt-6">
                <QuoteIcon className="h-8 w-8 text-blue-500 opacity-70 mb-4" />
                
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950 px-6 py-2 text-sm font-medium text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            <span className="text-2xl mr-2">🌟</span>
            <span>Join our community of 10,000+ successful language learners</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
