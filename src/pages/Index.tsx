
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Book,
  CheckSquare,
  Headphones,
  Pen,
  User,
  Calendar,
  Award,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SpeakableWord from "@/components/learning/SpeakableWord";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
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
                  />
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer">
                    <SpeakableWord word="Milano" language="it" />
                  </div>
                  <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer">
                    <SpeakableWord word="Firenze" language="it" />
                  </div>
                  <div className="p-3 rounded-lg border border-primary bg-accent/10 transition-colors cursor-pointer">
                    <SpeakableWord word="Roma" language="it" />
                  </div>
                  <div className="p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/10 transition-colors cursor-pointer">
                    <SpeakableWord word="Venezia" language="it" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl font-bold mb-4">Master Italian with Daily Practice</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our app provides a comprehensive suite of tools to help you prepare for the CILS B1 Cittadinanza exam.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow animate-fade-up">
              <CardContent className="pt-6">
                <div className="rounded-full bg-accent/50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Flashcards</h3>
                <p className="text-muted-foreground">
                  Build your vocabulary with interactive flashcards that include audio pronunciation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow animate-fade-up" style={{ animationDelay: "100ms" }}>
              <CardContent className="pt-6">
                <div className="rounded-full bg-accent/50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Multiple Choice</h3>
                <p className="text-muted-foreground">
                  Practice with questions similar to those on the actual citizenship test.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow animate-fade-up" style={{ animationDelay: "200ms" }}>
              <CardContent className="pt-6">
                <div className="rounded-full bg-accent/50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Listening</h3>
                <p className="text-muted-foreground">
                  Improve your comprehension with audio exercises and questions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow animate-fade-up" style={{ animationDelay: "300ms" }}>
              <CardContent className="pt-6">
                <div className="rounded-full bg-accent/50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Pen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Writing</h3>
                <p className="text-muted-foreground">
                  Practice writing in Italian with AI-assisted feedback and corrections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined approach helps you prepare effectively for the CILS B1 Cittadinanza exam.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-accent/50 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Daily Practice</h3>
              <p className="text-muted-foreground">
                Receive a new question each day to maintain consistent learning.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-accent/50 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Personalized Feedback</h3>
              <p className="text-muted-foreground">
                Get AI-powered feedback on your responses to improve faster.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-accent/50 p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement with detailed statistics and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-accent/30 to-secondary/50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students preparing for the CILS B1 Cittadinanza exam with our effective learning tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from students who have successfully prepared for their citizenship test.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="backdrop-blur-sm border border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic">
                  "Thanks to this app, I passed my CILS B1 exam on the first try. The daily questions really helped me stay consistent with my practice."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center">
                    <span className="font-medium text-sm">MS</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">Marco S.</p>
                    <p className="text-xs text-muted-foreground">Milan, Italy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic">
                  "The listening exercises were incredibly helpful. I feel much more confident in my ability to understand spoken Italian now."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center">
                    <span className="font-medium text-sm">AL</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">Anna L.</p>
                    <p className="text-xs text-muted-foreground">Rome, Italy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic">
                  "The AI feedback on my writing exercises helped me identify and correct mistakes I didn't even know I was making. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center">
                    <span className="font-medium text-sm">JB</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">John B.</p>
                    <p className="text-xs text-muted-foreground">Florence, Italy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
