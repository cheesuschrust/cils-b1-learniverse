
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CallToActionSection from '@/components/landing/CallToActionSection';
import { ArrowRight, BookOpen, CheckCircle, Globe } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0a0a1a] to-[#171730]">
      <main className="flex-1">
        <section className="py-20 min-h-[80vh] flex items-center">
          <div className="container">
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl text-white">
                CILS B2 Cittadinanza
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                The most comprehensive platform for preparing for your Italian citizenship language exam with proven methods and personalized learning.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/signup">Start Your Journey</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-white p-6 rounded-lg glass">
                  <CheckCircle className="h-10 w-10 text-green-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold mb-2">Exam-Focused</h3>
                  <p className="text-gray-300">Content specifically designed for the CILS B2 citizenship exam requirements</p>
                </div>
                
                <div className="text-white p-6 rounded-lg glass">
                  <BookOpen className="h-10 w-10 text-blue-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold mb-2">Complete Practice</h3>
                  <p className="text-gray-300">Comprehensive exercises covering reading, writing, listening and speaking</p>
                </div>
                
                <div className="text-white p-6 rounded-lg glass">
                  <Globe className="h-10 w-10 text-purple-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold mb-2">Cultural Context</h3>
                  <p className="text-gray-300">Learn language in the context of Italian culture and citizenship</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Platform?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our platform has helped thousands of applicants successfully pass their Italian citizenship language exam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Personalized Learning Path",
                  description: "Adaptive system that focuses on your weak areas to ensure efficient learning"
                },
                {
                  title: "Native Speaker Audio",
                  description: "All content includes pronunciation by native Italian speakers for authentic learning"
                },
                {
                  title: "Realistic Mock Exams",
                  description: "Practice with exams designed to mimic the real CILS B2 test format and difficulty"
                },
                {
                  title: "Progress Tracking",
                  description: "Detailed analytics to see your improvement over time and focus your study efforts"
                },
                {
                  title: "Mobile Learning",
                  description: "Study anywhere with our mobile-optimized platform available on all devices"
                },
                {
                  title: "Community Support",
                  description: "Connect with other learners and get help from our community of Italian speakers"
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button asChild size="lg">
                <Link to="/app/dashboard" className="flex items-center">
                  Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <CallToActionSection />
      </main>
    </div>
  );
};

export default LandingPage;
