
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import NewsletterSubscription from '@/components/marketing/NewsletterSubscription';
import { CheckCircle, BookOpen, Award, Users, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      title: "Comprehensive Study Materials",
      description: "Access a complete library of CILS B1 study materials, including practice tests, vocabulary lists, and grammar exercises.",
      icon: <BookOpen className="h-12 w-12 text-primary" />
    },
    {
      title: "AI-Powered Learning",
      description: "Our intelligent system adapts to your learning style and identifies areas where you need more practice.",
      icon: <Award className="h-12 w-12 text-primary" />
    },
    {
      title: "Community Support",
      description: "Connect with other learners preparing for the CILS B1 citizenship exam and share your journey.",
      icon: <Users className="h-12 w-12 text-primary" />
    }
  ];

  const testimonials = [
    {
      quote: "Thanks to CILS B1 Prep, I passed my citizenship exam on the first try! The practice exercises were incredibly similar to the actual test.",
      author: "Marco D., Rome",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "The speaking practice modules helped me overcome my anxiety about the oral portion of the exam. I'm so grateful for this platform!",
      author: "Sofia B., Milan",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "I studied with CILS B1 Prep for just 3 months and was able to pass the exam with confidence. The structured approach made all the difference.",
      author: "Alessandro T., Florence",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    }
  ];

  return (
    <>
      <Helmet>
        <title>CILS B1 Prep | Italian Citizenship Language Test Preparation</title>
        <meta name="description" content="Prepare for your Italian CILS B1 citizenship exam with our comprehensive online learning platform. Practice tests, lessons, and personalized feedback." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Master Italian for Your Citizenship Test
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Comprehensive preparation for the CILS B1 Italian language exam required for citizenship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-blue-50">
                  <Link to="/pricing">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80" 
                alt="Italian language learning" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CILS B1 Prep?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is specifically designed to help you pass the CILS B1 Italian language exam required for citizenship.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <ul className="inline-block text-left">
              {["Realistic practice exams", "Personalized study plans", "Speaking exercise with feedback", "Grammar and vocabulary builders", "Cultural knowledge preparation"].map((item, index) => (
                <li key={index} className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, effective process to prepare you for citizenship exam success
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Assessment",
                description: "Take a diagnostic test to identify your current Italian language level."
              },
              {
                step: "2",
                title: "Personalized Plan",
                description: "Receive a customized study plan based on your strengths and weaknesses."
              },
              {
                step: "3",
                title: "Practice & Learn",
                description: "Work through guided exercises, lessons, and mock tests."
              },
              {
                step: "4",
                title: "Master the Exam",
                description: "Gain confidence and skills to pass your CILS B1 citizenship exam."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-10 -right-6 text-gray-300 h-6 w-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who achieved their citizenship dreams with our help
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                  </div>
                </div>
                <p className="italic text-gray-600">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of successful applicants who have achieved their Italian citizenship dreams.
          </p>
          <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-blue-50">
            <Link to="/auth/register">Start Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <NewsletterSubscription className="max-w-3xl mx-auto" />
        </div>
      </section>
    </>
  );
};

export default HomePage;
