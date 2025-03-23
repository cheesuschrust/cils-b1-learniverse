
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";
import SpeakableWord from "@/components/learning/SpeakableWord";
import { 
  BookOpen, 
  CheckCircle, 
  Headphones, 
  PenTool, 
  Calendar, 
  User, 
  Award, 
  ArrowRight,
  Star,
  Volume2,
  Languages
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="py-4 px-6 md:px-8 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <Logo />
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-gray-800 hover:text-gray-900">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-[#ce2b37] hover:bg-[#b32530] text-white shadow-sm">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-6 md:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              <div className="md:w-1/2 animate-fade-up">
                <div className="inline-block px-3 py-1 rounded-full bg-[#009246]/10 text-sm text-[#009246] font-medium mb-6 shadow-sm border border-[#009246]/20">
                  Italian Citizenship Test Prep
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-800">
                  <SpeakableWord 
                    word="Master Italian for Citizenship"
                    language="it"
                    className="block"
                  />
                  <div>
                    <span className="text-[#009246] drop-shadow-sm">Daily </span>
                    <span className="text-[#ce2b37] drop-shadow-sm">Practice </span>
                    <span className="text-gray-800">Questions</span>
                  </div>
                </h1>
                <p className="text-gray-800 mb-6 text-lg max-w-md">
                  <SpeakableWord 
                    word="Prepare for your CILS B1 citizenship language test with our daily practice exercises, flashcards, and interactive learning tools."
                    language="en"
                  />
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-[#ce2b37] hover:bg-[#b32530] text-white px-5 py-2 h-auto shadow-md transition-all hover:shadow-lg group">
                    <Link to="/signup" className="flex items-center">
                      Start Practicing
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-400 text-gray-800 px-5 py-2 h-auto hover:bg-gray-50">
                    <Link to="/login">Log In</Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium text-[#009246]">Today's Question</div>
                      <Calendar className="h-5 w-5 text-[#009246]" />
                    </div>
                    <div className="font-semibold text-xl mb-4 text-gray-800">
                      <SpeakableWord 
                        word="Multiple Choice"
                        language="it"
                      />
                    </div>
                    <div className="mb-6 text-gray-800 text-lg flex items-center justify-between">
                      <SpeakableWord 
                        word="Quale di queste città è la capitale d'Italia?"
                        language="it"
                      />
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Listen to question">
                          <Volume2 className="h-4 w-4 text-[#ce2b37]" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Translate question">
                          <Languages className="h-4 w-4 text-[#33A5EF]" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-md border border-gray-300 hover:border-[#ce2b37] hover:bg-[#ce2b37]/5 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md text-gray-800 flex justify-between items-center">
                        <SpeakableWord word="Milano" language="it" />
                        <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <Languages className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="p-3 rounded-md border border-gray-300 hover:border-[#ce2b37] hover:bg-[#ce2b37]/5 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md text-gray-800 flex justify-between items-center">
                        <SpeakableWord word="Firenze" language="it" />
                        <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <Languages className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="p-3 rounded-md border border-gray-300 bg-[#F3F9FE] border-[#009246] cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md text-gray-800 flex justify-between items-center">
                        <SpeakableWord word="Roma" language="it" />
                        <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <Languages className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="p-3 rounded-md border border-gray-300 hover:border-[#ce2b37] hover:bg-[#ce2b37]/5 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md text-gray-800 flex justify-between items-center">
                        <SpeakableWord word="Venezia" language="it" />
                        <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <Languages className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white md:py-20" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                <SpeakableWord 
                  word="Master Italian with Daily Practice"
                  language="it"
                />
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto font-medium">
                <SpeakableWord 
                  word="Our app provides a comprehensive suite of tools to help you prepare for the CILS B1 Cittadinanza exam."
                  language="en"
                />
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<BookOpen className="h-6 w-6 text-white" />}
                title="Flashcards"
                description="Build your vocabulary with interactive flashcards that include audio pronunciation."
                delay={0}
                bgColor="bg-[#009246]"
              />
              
              <FeatureCard 
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                title="Multiple Choice"
                description="Practice with questions similar to those on the actual citizenship test."
                delay={100}
                bgColor="bg-[#ffffff]"
                textColor="text-[#ce2b37]"
                iconBg="bg-[#ce2b37]"
              />
              
              <FeatureCard 
                icon={<Headphones className="h-6 w-6 text-white" />}
                title="Listening"
                description="Improve your comprehension with audio exercises and questions."
                delay={200}
                bgColor="bg-[#ce2b37]"
              />
              
              <FeatureCard 
                icon={<PenTool className="h-6 w-6 text-white" />}
                title="Writing"
                description="Practice writing in Italian with AI-assisted feedback and corrections."
                delay={300}
                bgColor="bg-[#33A5EF]"
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-6 md:py-20 bg-gradient-to-r from-[#009246]/10 via-white/80 to-[#ce2b37]/10" id="how-it-works">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                <SpeakableWord 
                  word="How It Works"
                  language="en"
                />
              </h2>
              <p className="text-gray-800 max-w-2xl mx-auto font-medium">
                <SpeakableWord 
                  word="Our streamlined approach helps you prepare effectively for the CILS B1 Cittadinanza exam."
                  language="en"
                />
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Daily Practice",
                  description: "Receive a new question each day to maintain consistent learning.",
                  icon: <Calendar className="h-6 w-6 text-white" />,
                  bgColor: "bg-[#009246]"
                },
                {
                  step: "2",
                  title: "Personalized Feedback",
                  description: "Get AI-powered feedback on your responses to improve faster.",
                  icon: <User className="h-6 w-6 text-white" />,
                  bgColor: "bg-[#ffffff]",
                  borderColor: "border-[#ce2b37]",
                  textColor: "text-[#ce2b37]"
                },
                {
                  step: "3",
                  title: "Track Progress",
                  description: "Monitor your improvement with detailed statistics and analytics.",
                  icon: <Award className="h-6 w-6 text-white" />,
                  bgColor: "bg-[#ce2b37]"
                }
              ].map((item, index) => (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all animate-fade-up transform hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`w-16 h-16 rounded-full ${item.bgColor || 'bg-[#33A5EF]'} ${item.borderColor ? `border-2 ${item.borderColor}` : ''} text-white flex items-center justify-center mx-auto mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${item.textColor || 'text-gray-800'}`}>
                    <SpeakableWord word={item.title} language="en" />
                  </h3>
                  <p className="text-gray-700 font-medium">
                    <SpeakableWord word={item.description} language="en" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 bg-white md:py-20" id="testimonials">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">What Our Users Say</h2>
              <p className="text-gray-700 max-w-2xl mx-auto font-medium">
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
                <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all animate-fade-up transform hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400" 
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 mb-6 italic font-medium">
                      <SpeakableWord word={`"${testimonial.quote}"`} language="en" />
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#009246] to-[#ce2b37] text-white flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">{testimonial.initials}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{testimonial.author}</p>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 bg-gradient-to-r from-[#009246]/20 via-white/80 to-[#ce2b37]/20 md:py-20 border-t border-b border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block animate-pulse-soft">
              <span className="inline-block px-4 py-2 rounded-full bg-[#ce2b37]/20 text-[#ce2b37] font-medium text-sm border border-[#ce2b37]/30">
                <SpeakableWord word="Limited Time Offer" language="en" />
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 animate-fade-up text-gray-800">
              <SpeakableWord word="Ready to Start Your Journey?" language="en" />
            </h2>
            <p className="text-gray-800 mb-8 animate-fade-up font-medium" style={{ animationDelay: "100ms" }}>
              <SpeakableWord word="Join thousands of students preparing for the CILS B1 Cittadinanza exam with our effective learning tools." language="en" />
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Button asChild size="lg" className="bg-[#009246] hover:bg-[#017f3c] text-white px-6 shadow-md hover:shadow-lg transition-all">
                <Link to="/signup" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#ce2b37] text-[#ce2b37] px-6 hover:bg-[#ce2b37]/5">
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
            <p className="text-gray-700 text-sm mt-6 animate-fade-up font-medium" style={{ animationDelay: "300ms" }}>
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
  bgColor?: string;
  textColor?: string;
  iconBg?: string;
}

const FeatureCard = ({ icon, title, description, delay = 0, bgColor = "bg-white", textColor = "text-gray-800", iconBg }: FeatureCardProps) => {
  return (
    <Card className={`border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer animate-fade-up transform rotate-1 hover:rotate-0 ${bgColor}`} style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="pt-6">
        <div className={`rounded-full ${iconBg || "bg-[#E7F4FD]"} p-4 w-14 h-14 flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
          <SpeakableWord word={title} language="en" />
        </h3>
        <p className={bgColor !== "bg-white" ? "text-white/90 font-medium" : "text-gray-700 font-medium"}>
          <SpeakableWord word={description} language="en" />
        </p>
      </CardContent>
    </Card>
  );
};

export default Index;
