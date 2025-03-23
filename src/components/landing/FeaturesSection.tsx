
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, CheckSquare, Headphones, Pen } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary/50" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">Master Italian with Daily Practice</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our app provides a comprehensive suite of tools to help you prepare for the CILS B1 Cittadinanza exam.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Book className="h-6 w-6 text-primary" />}
            title="Flashcards"
            description="Build your vocabulary with interactive flashcards that include audio pronunciation."
            delay={0}
          />
          
          <FeatureCard 
            icon={<CheckSquare className="h-6 w-6 text-primary" />}
            title="Multiple Choice"
            description="Practice with questions similar to those on the actual citizenship test."
            delay={100}
          />
          
          <FeatureCard 
            icon={<Headphones className="h-6 w-6 text-primary" />}
            title="Listening"
            description="Improve your comprehension with audio exercises and questions."
            delay={200}
          />
          
          <FeatureCard 
            icon={<Pen className="h-6 w-6 text-primary" />}
            title="Writing"
            description="Practice writing in Italian with AI-assisted feedback and corrections."
            delay={300}
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="pt-6">
        <div className="rounded-full bg-accent/50 p-3 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
