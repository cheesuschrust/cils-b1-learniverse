
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Award, BookOpen } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[#0a0a1a] to-[#171730]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=2069')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 mix-blend-multiply"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-300 ring-1 ring-inset ring-blue-500/20 mb-4">
              <span>CILS B2 Cittadinanza Exam Preparation</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Master Italian for your Citizenship Journey
            </h1>
            
            <p className="mt-6 text-lg text-gray-300">
              Prepare for the CILS B2 Cittadinanza exam with our comprehensive platform. Interactive lessons, practice tests, and personalized feedback to help you succeed.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white/20 hover:bg-white/10">
                <Link to="/app/demo" className="flex items-center">
                  Try Demo <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-8 text-sm text-gray-300">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-400" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-blue-400" />
                <span>93% Success Rate</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-400" />
                <span>5,000+ Exercises</span>
              </div>
            </div>
          </div>
          
          <div className="relative lg:pl-8">
            <div className="relative mx-auto rounded-xl overflow-hidden shadow-2xl glass">
              <img 
                src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974"
                alt="Italian language learning app screenshot" 
                className="w-full object-cover rounded-xl opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="mb-2 flex -space-x-2">
                  {[1, 2, 3, 4, 5].map(index => (
                    <img 
                      key={index}
                      src={`https://i.pravatar.cc/40?img=${index}`}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                  ))}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-xs text-white">
                    +99
                  </span>
                </div>
                <p className="text-sm font-medium text-white">
                  Join thousands of students preparing for their citizenship exam
                </p>
              </div>
            </div>
            
            {/* Floating feature cards */}
            <div className="absolute -top-6 -right-8 glass rounded-lg p-4 shadow-lg border border-white/10 w-60 hidden md:block">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-green-500 p-2">
                  <span className="text-white font-bold text-xs">4.9</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">User Rating</p>
                  <div className="flex">
                    {Array(5).fill(null).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -left-4 glass rounded-lg p-4 shadow-lg border border-white/10 w-60 hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 rounded-full p-2">
                  <span className="text-white text-xl">🎓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Citizenship Ready</p>
                  <p className="text-xs text-gray-300">CILS B2 certified materials</p>
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
