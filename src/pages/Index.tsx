
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="py-6 px-6 flex justify-between items-center">
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
        <section className="py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Master Italian for Your Citizenship Exam
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Prepare effectively for the CILS B2 Cittadinanza exam with our comprehensive platform designed specifically for citizenship applicants.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/app/dashboard">Explore Features</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-900 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Specifically designed for the Italian citizenship language requirement, our platform offers everything you need to succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 dark:text-blue-300 text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Exam-Focused</h3>
                <p className="text-muted-foreground">
                  Content specifically designed for the CILS B2 citizenship exam requirements.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 dark:text-green-300 text-xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Practice</h3>
                <p className="text-muted-foreground">
                  Complete exercises covering reading, writing, listening and speaking skills.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 dark:text-purple-300 text-xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cultural Context</h3>
                <p className="text-muted-foreground">
                  Learn language in the context of Italian culture and citizenship topics.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform uses a proven methodology to prepare you for the CILS B2 Cittadinanza exam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Assessment",
                  description: "Take a diagnostic test to identify your strengths and areas for improvement."
                },
                {
                  step: "2",
                  title: "Personalized Plan",
                  description: "Receive a customized study plan based on your assessment results."
                },
                {
                  step: "3",
                  title: "Practice",
                  description: "Work through targeted exercises for reading, writing, listening, and speaking."
                },
                {
                  step: "4",
                  title: "Mock Exams",
                  description: "Test your readiness with full-length practice exams in the CILS format."
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-50 dark:bg-blue-950 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of successful applicants who have passed their CILS B2 Cittadinanza exam with our platform.
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/signup" className="flex items-center">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Logo />
              <p className="text-sm text-muted-foreground mt-2">
                Helping you achieve your Italian citizenship dream.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                  <li><Link to="/testimonials" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link to="/guides" className="text-sm text-muted-foreground hover:text-foreground">Study Guides</Link></li>
                  <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
                  <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
                  <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CILS B2 Cittadinanza. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
