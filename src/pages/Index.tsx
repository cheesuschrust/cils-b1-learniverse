
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";
import { 
  BookOpen, 
  CheckCircle, 
  Headphones, 
  PenTool, 
  Calendar, 
  User, 
  Award, 
  ArrowRight,
  Star
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="py-4 px-6 md:px-8 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <Logo />
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-[#33A5EF] hover:bg-[#2b8fd2] text-white shadow-sm">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-6 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              <div className="md:w-1/2 animate-fade-up">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-sm text-blue-600 font-medium mb-6 shadow-sm">
                  Italian Citizenship Test Prep
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Master Italian for Citizenship
                  <div className="text-[#26B887]">Daily <span className="text-[#33A5EF]">Practice</span> <span className="text-[#FF6978]">Questions</span></div>
                </h1>
                <p className="text-gray-600 mb-6 text-lg max-w-md">
                  Prepare for your CILS B1 citizenship language test with our daily practice exercises, flashcards, and interactive learning tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-[#33A5EF] hover:bg-[#2b8fd2] text-white px-6 py-2 h-auto shadow-md transition-all hover:shadow-lg group">
                    <Link to="/signup" className="flex items-center">
                      Start Practicing
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-200 px-6 py-2 h-auto hover:bg-gray-50">
                    <Link to="/login">Log In</Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium text-[#33A5EF]">Today's Question</div>
                      <Calendar className="h-5 w-5 text-[#33A5EF]" />
                    </div>
                    <div className="font-semibold text-xl mb-4">Multiple Choice</div>
                    <div className="mb-6 text-gray-700 text-lg">
                      Quale di queste città è la capitale d'Italia?
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-md border border-gray-200 hover:border-[#33A5EF] hover:bg-blue-50/30 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md">
                        Milano
                      </div>
                      <div className="p-3 rounded-md border border-gray-200 hover:border-[#33A5EF] hover:bg-blue-50/30 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md">
                        Firenze
                      </div>
                      <div className="p-3 rounded-md border border-gray-200 bg-[#F3F9FE] border-[#33A5EF] cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md">
                        Roma
                      </div>
                      <div className="p-3 rounded-md border border-gray-200 hover:border-[#33A5EF] hover:bg-blue-50/30 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md">
                        Venezia
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">Master Italian with Daily Practice</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our app provides a comprehensive suite of tools to help you prepare for the CILS B1 Cittadinanza exam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<BookOpen className="h-6 w-6 text-[#33A5EF]" />}
                title="Flashcards"
                description="Build your vocabulary with interactive flashcards that include audio pronunciation."
                delay={0}
              />
              
              <FeatureCard 
                icon={<CheckCircle className="h-6 w-6 text-[#33A5EF]" />}
                title="Multiple Choice"
                description="Practice with questions similar to those on the actual citizenship test."
                delay={100}
              />
              
              <FeatureCard 
                icon={<Headphones className="h-6 w-6 text-[#33A5EF]" />}
                title="Listening"
                description="Improve your comprehension with audio exercises and questions."
                delay={200}
              />
              
              <FeatureCard 
                icon={<PenTool className="h-6 w-6 text-[#33A5EF]" />}
                title="Writing"
                description="Practice writing in Italian with AI-assisted feedback and corrections."
                delay={300}
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-6 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our streamlined approach helps you prepare effectively for the CILS B1 Cittadinanza exam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Daily Practice",
                  description: "Receive a new question each day to maintain consistent learning.",
                  icon: <Calendar className="h-6 w-6 text-[#33A5EF]" />
                },
                {
                  step: "2",
                  title: "Personalized Feedback",
                  description: "Get AI-powered feedback on your responses to improve faster.",
                  icon: <User className="h-6 w-6 text-[#33A5EF]" />
                },
                {
                  step: "3",
                  title: "Track Progress",
                  description: "Monitor your improvement with detailed statistics and analytics.",
                  icon: <Award className="h-6 w-6 text-[#33A5EF]" />
                }
              ].map((item, index) => (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all animate-fade-up transform hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-16 h-16 rounded-full bg-[#E7F4FD] text-[#33A5EF] flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 bg-white md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from students who have successfully prepared for their citizenship test.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Thanks to this app, I passed my CILS B1 exam on the first try. The daily questions really helped me stay consistent with my practice.",
                  author: "Marco S.",
                  location: "Milan, Italy",
                  initials: "MS"
                },
                {
                  quote: "The listening exercises were incredibly helpful. I feel much more confident in my ability to understand spoken Italian now.",
                  author: "Anna L.",
                  location: "Rome, Italy",
                  initials: "AL"
                },
                {
                  quote: "The AI feedback on my writing exercises helped me identify and correct mistakes I didn't even know I was making. Highly recommended!",
                  author: "John B.",
                  location: "Florence, Italy",
                  initials: "JB"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all animate-fade-up transform hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400" 
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#E7F4FD] text-[#33A5EF] flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">{testimonial.initials}</span>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 bg-[#f7f9fc] md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 animate-pulse-soft">
              <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 animate-fade-up">Ready to Start Your Journey?</h2>
            <p className="text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Join thousands of students preparing for the CILS B1 Cittadinanza exam with our effective learning tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Button asChild size="lg" className="bg-[#33A5EF] hover:bg-[#2b8fd2] text-white px-6 shadow-md hover:shadow-lg transition-all">
                <Link to="/signup" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-200 px-6 hover:bg-gray-50">
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
            <p className="text-gray-500 text-sm mt-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
              No credit card required. Cancel anytime.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer animate-fade-up transform rotate-1 hover:rotate-0" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="pt-6">
        <div className="rounded-full bg-[#E7F4FD] p-4 w-14 h-14 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
