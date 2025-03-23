
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";
import { BookOpen, CheckCircle, Headphones, PenTool, Calendar, User, Award } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-gray-100">
        <Logo />
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-[#33A5EF] hover:bg-[#2b8fd2] text-white">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/2">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-sm text-gray-600 mb-6">
                  Italian Citizenship Test Prep
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  CILS B1 Cittadinanza
                  <div className="text-[#26B887]">Question <span className="text-[#33A5EF]">of the</span> <span className="text-[#FF6978]">Day</span></div>
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Your daily companion for preparing for the Italian citizenship
                  language test. Practice with flashcards, multiple choice, listening,
                  and writing exercises.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-[#33A5EF] hover:bg-[#2b8fd2] text-white px-8 py-6 h-auto">
                    <Link to="/signup">Start Practicing</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-200 px-8 py-6 h-auto">
                    <Link to="/login">Log In</Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Today's Question</div>
                    <Calendar className="h-5 w-5 text-[#33A5EF]" />
                  </div>
                  <div className="font-semibold text-xl mb-4">Multiple Choice</div>
                  <div className="mb-6 text-gray-700">
                    Quale di queste città è la capitale d'Italia?
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-md border border-gray-200 hover:border-[#33A5EF] cursor-pointer">
                      Milano
                    </div>
                    <div className="p-3 rounded-md border border-gray-200 hover:border-[#33A5EF] cursor-pointer">
                      Firenze
                    </div>
                    <div className="p-3 rounded-md border border-gray-200 bg-[#F3F9FE] border-[#33A5EF] cursor-pointer">
                      Roma
                    </div>
                    <div className="p-3 rounded-md border border-gray-200 hover:border-[#33A5EF] cursor-pointer">
                      Venezia
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
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
              />
              
              <FeatureCard 
                icon={<CheckCircle className="h-6 w-6 text-[#33A5EF]" />}
                title="Multiple Choice"
                description="Practice with questions similar to those on the actual citizenship test."
              />
              
              <FeatureCard 
                icon={<Headphones className="h-6 w-6 text-[#33A5EF]" />}
                title="Listening"
                description="Improve your comprehension with audio exercises and questions."
              />
              
              <FeatureCard 
                icon={<PenTool className="h-6 w-6 text-[#33A5EF]" />}
                title="Writing"
                description="Practice writing in Italian with AI-assisted feedback and corrections."
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
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
                <div key={index} className="text-center">
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
        <section className="py-16 px-6 bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
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
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className="w-5 h-5 text-yellow-400" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
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
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of students preparing for the CILS B1 Cittadinanza exam with our effective learning tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-[#33A5EF] hover:bg-[#2b8fd2] text-white px-8">
                <Link to="/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-200 px-8">
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="border-0 shadow-sm">
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
