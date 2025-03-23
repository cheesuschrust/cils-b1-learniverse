
import React from "react";
import { Calendar, User, Award } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-20" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined approach helps you prepare effectively for the CILS B1 Cittadinanza exam.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepItem 
            icon={<Calendar className="h-8 w-8 text-primary" />}
            title="Daily Practice"
            description="Receive a new question each day to maintain consistent learning."
          />
          
          <StepItem 
            icon={<User className="h-8 w-8 text-primary" />}
            title="Personalized Feedback"
            description="Get AI-powered feedback on your responses to improve faster."
          />
          
          <StepItem 
            icon={<Award className="h-8 w-8 text-primary" />}
            title="Track Progress"
            description="Monitor your improvement with detailed statistics and analytics."
          />
        </div>
      </div>
    </section>
  );
};

interface StepItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepItem = ({ icon, title, description }: StepItemProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="rounded-full bg-accent/50 p-4 w-16 h-16 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default HowItWorksSection;
