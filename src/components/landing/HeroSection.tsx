
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import SpeakableWord from "@/components/learning/SpeakableWord";

const HeroSection = () => {
  return (
    <section className="relative py-24 md:py-32 mt-16 overflow-hidden" id="home">
      <div className="absolute inset-0 bg-gradient-radial from-accent/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/50 text-xs font-medium text-primary backdrop-blur-sm">
              Italian Citizenship Test Prep
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              CILS B1 Cittadinanza{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-italian-green via-primary to-italian-red">
                Question of the Day
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Your daily companion for preparing for the Italian citizenship language test. Practice with flashcards, multiple choice, listening, and writing exercises.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Practicing
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent rounded-full animate-pulse-soft"></div>
            <div className="relative glass rounded-3xl shadow-glass p-8 transform rotate-3 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-muted-foreground">Today's Question</span>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-4">Multiple Choice</h3>
              <p className="mb-6">
                <SpeakableWord 
                  word="Quale di queste città è la capitale d'Italia?" 
                  language="it"
                  autoPlay={false}
                />
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer">
                  <SpeakableWord word="Milano" language="it" autoPlay={false} />
                </div>
                <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer">
                  <SpeakableWord word="Firenze" language="it" autoPlay={false} />
                </div>
                <div className="p-3 rounded-lg border border-primary bg-accent/10 transition-colors cursor-pointer">
                  <SpeakableWord word="Roma" language="it" autoPlay={false} />
                </div>
                <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer">
                  <SpeakableWord word="Venezia" language="it" autoPlay={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
