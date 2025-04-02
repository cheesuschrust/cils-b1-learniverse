
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Check, Book, BrainCircuit, Languages, Award } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b py-4">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="CILS B2 Prep" className="h-8 w-auto" />
            <span className="font-bold text-xl">CILS B2 Prep</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Master the CILS B2 Italian Citizenship Test
              </h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive preparation with practice questions, mock exams, and AI-powered feedback to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to={isAuthenticated ? "/dashboard" : "/auth/signup"}>
                    Start Preparing Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1529693662653-9d480530a697?q=80&w=2831&auto=format&fit=crop"
                alt="Italian Citizenship Test Preparation" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16" id="features">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Preparation Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need to prepare for and pass the CILS B2 Italian Citizenship Test.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reading Module</h3>
              <p className="text-muted-foreground">
                Practice with authentic reading materials at the B2 level with comprehension questions.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Languages className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Writing Module</h3>
              <p className="text-muted-foreground">
                Improve your written Italian with guided exercises and personalized feedback.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Listening Module</h3>
              <p className="text-muted-foreground">
                Enhance your comprehension with diverse audio materials and interactive exercises.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Speaking Module</h3>
              <p className="text-muted-foreground">
                Practice speaking with AI-powered conversation simulations and pronunciation feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that suits your preparation needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">€0<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic practice questions</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Limited flashcards</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic reading exercises</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/signup">Sign up for free</Link>
              </Button>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-primary shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-4 text-xs rounded-bl-lg">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-4">€9.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited practice questions</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Full flashcard library</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced exercises in all modules</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Full mock tests</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>AI-powered feedback</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/auth/signup">Get Premium</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from users who've successfully passed their CILS B2 exam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">MB</span>
                </div>
                <div>
                  <h4 className="font-bold">Marco Bianchi</h4>
                  <p className="text-sm text-muted-foreground">Passed CILS B2 in Milan</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The practice questions were almost identical to what I saw on the actual exam. I felt completely prepared!"
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">LR</span>
                </div>
                <div>
                  <h4 className="font-bold">Laura Romano</h4>
                  <p className="text-sm text-muted-foreground">Passed CILS B2 in Rome</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The listening exercises were incredibly helpful. I struggled with this section initially, but after a month of practice, I passed with ease."
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">AF</span>
                </div>
                <div>
                  <h4 className="font-bold">Alex Ferrero</h4>
                  <p className="text-sm text-muted-foreground">Passed CILS B2 in Florence</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The speaking module with AI feedback transformed my confidence. I went from nervous to fluent in just weeks of practice."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your CILS B2 Exam?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful test-takers who prepared with our comprehensive platform.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth/signup">
              Get Started For Free
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="CILS B2 Prep" className="h-8 w-auto" />
                <span className="font-bold text-xl">CILS B2 Prep</span>
              </Link>
              <p className="mt-4 text-muted-foreground max-w-xs">
                The comprehensive platform for Italian Citizenship Test preparation.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><Link to="/auth/login" className="text-muted-foreground hover:text-foreground">Login</Link></li>
                  <li><Link to="/auth/signup" className="text-muted-foreground hover:text-foreground">Sign up</Link></li>
                  <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Study guides</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                  <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t">
            <p className="text-center text-muted-foreground">
              © {new Date().getFullYear()} CILS B2 Prep. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
