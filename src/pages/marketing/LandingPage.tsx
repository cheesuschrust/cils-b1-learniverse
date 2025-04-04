
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, Book, Award, BarChart, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const benefits = [
    {
      icon: <Book className="h-10 w-10 text-primary" />,
      title: "Comprehensive CILS B1 Preparation",
      description: "Complete study material designed specifically for the Italian Citizenship CILS B1 exam requirements"
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Personalized Learning Path",
      description: "Adaptive learning system that focuses on your weak areas to improve faster"
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Daily Practice Questions",
      description: "Regular practice with real exam-style questions to build confidence and consistency"
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Expert-Created Content",
      description: "All materials created by Italian language experts with deep knowledge of CILS examination standards"
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community Support",
      description: "Join a community of other citizenship applicants to share experiences and practice together"
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Guaranteed Results",
      description: "Our proven methodology has helped thousands pass their citizenship exams successfully"
    }
  ];

  const testimonials = [
    {
      name: "Marco B.",
      location: "Milano",
      text: "I was struggling with the language requirements for my citizenship application. After 3 months using this platform, I passed the CILS B1 exam with flying colors!",
      rating: 5
    },
    {
      name: "Sofia L.",
      location: "Roma",
      text: "The daily questions feature kept me consistent with my studies. The adaptive learning system identified my weak areas in grammar and helped me improve quickly.",
      rating: 5
    },
    {
      name: "David T.",
      location: "Firenze",
      text: "As someone who was starting from zero with Italian, I was amazed at how quickly I progressed. The structured approach and clear explanations make all the difference.",
      rating: 4
    }
  ];

  return (
    <>
      <Helmet>
        <title>CILS Italian Citizenship Test Preparation | Pass Your B1 Exam</title>
        <meta name="description" content="Prepare for your Italian Citizenship CILS B1 language exam with our comprehensive learning platform. Daily practice, personalized feedback, and expert content." />
        <meta name="keywords" content="CILS exam, Italian citizenship, B1 Italian test, language preparation, Italian citizenship test" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Master Italian for Your <span className="text-primary">Citizenship Exam</span>
              </h1>
              <p className="text-xl mb-8 text-gray-700">
                The most effective platform to prepare for your CILS B1 Italian language citizenship test with personalized learning, daily practice, and expert guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Button size="lg" asChild>
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link to="/auth/register">Get Started Free</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/auth/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required to start</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1527956041665-d7a1b380c460?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80" 
                alt="Italian language learning" 
                className="w-full h-auto rounded-xl shadow-lg" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed the most effective system to help you prepare for and pass the CILS B1 Italian language citizenship test.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful applicants who have achieved their Italian citizenship dreams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="mt-auto">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Italian Citizenship Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of successful applicants who have mastered Italian and achieved their citizenship goals.
          </p>
          {isAuthenticated ? (
            <Button size="lg" variant="secondary" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth/register">Start Learning Today</Link>
            </Button>
          )}
        </div>
      </section>
    </>
  );
};

export default LandingPage;
