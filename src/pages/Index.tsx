
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";
import WordOfTheDay from "@/components/learning/WordOfTheDay";
import { ArrowRight, CheckCircle, Book, Calendar, User, Award } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="py-6 px-6 flex justify-between items-center border-b">
        <Logo />
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Learn Italian for Your Citizenship Exam
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  The most comprehensive platform for preparing for your CILS B1 Cittadinanza exam with proven methods and personalized learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link to="/signup">Start Learning</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/app/dashboard">View Demo</Link>
                  </Button>
                </div>
                
                <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    <span>10,000+ Users</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="mr-2 h-4 w-4 text-primary" />
                    <span>93% Success Rate</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974"
                  alt="Italian language learning" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Word of the Day Section */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-md mx-auto px-6">
            <WordOfTheDay 
              word="Cittadinanza" 
              meaning="Citizenship" 
              example="La cittadinanza italiana è il mio obiettivo." 
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Master Italian with Daily Practice</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our app provides comprehensive tools to help you prepare for the CILS B1 Cittadinanza exam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<Book className="h-6 w-6 text-primary" />}
                title="Flashcards"
                description="Build your vocabulary with interactive flashcards that include audio pronunciation."
              />
              
              <FeatureCard 
                icon={<CheckCircle className="h-6 w-6 text-primary" />}
                title="Multiple Choice"
                description="Practice with questions similar to those on the actual citizenship test."
              />
              
              <FeatureCard 
                icon={<Award className="h-6 w-6 text-primary" />}
                title="Listening"
                description="Improve your comprehension with audio exercises and questions."
              />
              
              <FeatureCard 
                icon={<Calendar className="h-6 w-6 text-primary" />}
                title="Writing"
                description="Practice writing in Italian with AI-assisted feedback and corrections."
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-slate-50 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our streamlined approach helps you prepare effectively for the CILS B1 Cittadinanza exam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Daily Practice",
                  description: "Receive a new question each day to maintain consistent learning."
                },
                {
                  step: "2",
                  title: "Personalized Feedback",
                  description: "Get AI-powered feedback on your responses to improve faster."
                },
                {
                  step: "3",
                  title: "Track Progress",
                  description: "Monitor your improvement with detailed statistics and analytics."
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from people who have successfully passed their CILS B1 Cittadinanza exam using our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "This platform made the difference in my citizenship journey. The focused B1 exam preparation gave me the confidence I needed to pass easily.",
                  author: "Luisa Mendez",
                  role: "Successfully obtained Italian citizenship",
                  image: "https://i.pravatar.cc/150?img=32"
                },
                {
                  quote: "The interactive exercises and real-time feedback helped me identify my weak points and address them quickly. My speaking skills improved dramatically.",
                  author: "Tomasz Kowalski",
                  role: "Passed CILS B1 with distinction",
                  image: "https://i.pravatar.cc/150?img=12"
                },
                {
                  quote: "As someone who struggled with Italian grammar, the clear explanations and targeted practice made all the difference. I'm now confidently conversational!",
                  author: "Sarah Johnson",
                  role: "B1 exam candidate",
                  image: "https://i.pravatar.cc/150?img=26"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="pt-6">
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
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground mb-8 text-lg">
              Join thousands of students preparing for the CILS B1 Cittadinanza exam with our effective learning tools.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/signup" className="flex items-center">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
