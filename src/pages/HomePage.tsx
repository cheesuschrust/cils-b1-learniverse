
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Book, Award, BarChart, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';

const HomePage: React.FC = () => {
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
      title: "Interactive Flashcards",
      description: "Master Italian vocabulary with our effective flashcard system"
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Expert-Created Content",
      description: "All materials created by Italian language experts with deep knowledge of CILS examination standards"
    }
  ];

  return (
    <>
      <Helmet>
        <title>CILS Italian Citizenship Test Preparation | Pass Your B1 Exam</title>
        <meta name="description" content="Prepare for your Italian Citizenship CILS B1 language exam with our comprehensive learning platform. Daily practice, personalized feedback, and expert content." />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
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

      {/* Features Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete CILS B1 Preparation Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to master Italian for your citizenship exam
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Interactive Flashcards</h3>
              <p className="text-gray-600 mb-4">
                Master Italian vocabulary with our intelligent flashcard system that adapts to your learning pace.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to={isAuthenticated ? "/flashcards" : "/auth/register"}>
                  Try Flashcards
                </Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Listening Practice</h3>
              <p className="text-gray-600 mb-4">
                Improve your Italian listening comprehension with authentic audio exercises and assessments.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to={isAuthenticated ? "/practice/listening" : "/auth/register"}>
                  Practice Listening
                </Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Speaking Exercises</h3>
              <p className="text-gray-600 mb-4">
                Develop your Italian speaking skills with guided practice sessions and pronunciation feedback.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to={isAuthenticated ? "/practice/speaking" : "/auth/register"}>
                  Improve Speaking
                </Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Mock Exams</h3>
              <p className="text-gray-600 mb-4">
                Test your readiness with complete CILS B1 practice exams that simulate the real test experience.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to={isAuthenticated ? "/mock-exam" : "/auth/register"}>
                  Take Practice Exam
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
