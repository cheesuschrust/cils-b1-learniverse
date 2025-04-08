
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Book, Headphones, MessageSquare, Award } from 'lucide-react';
import DailyQuestion from '@/components/learning/DailyQuestion';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Master Italian for the CILS Exam
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive practice for all CILS B1 components: reading, writing, listening, and speaking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Learning Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/flashcards">
                  <Button size="lg" className="w-full sm:w-auto">
                    Practice Flashcards
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/practice/reading">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Reading Practice
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/10">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reading Practice</h3>
              <p className="text-muted-foreground mb-4">
                Authentic reading materials with comprehension exercises focused on B1 level content.
              </p>
              <Link to="/practice/reading">
                <Button variant="ghost" className="p-0">
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/10">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Listening Practice</h3>
              <p className="text-muted-foreground mb-4">
                Audio exercises with native speakers at the right pace for B1 learners.
              </p>
              <Link to="/practice/listening">
                <Button variant="ghost" className="p-0">
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Speaking Practice</h3>
              <p className="text-muted-foreground mb-4">
                Interactive speaking exercises with feedback to improve pronunciation and fluency.
              </p>
              <Link to="/practice/speaking">
                <Button variant="ghost" className="p-0">
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">CILS Exam Prep</h3>
              <p className="text-muted-foreground mb-4">
                Practice tests and materials specifically designed for the CILS B1 citizenship exam.
              </p>
              <Link to="/resources/exam-info">
                <Button variant="ghost" className="p-0">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Daily Question Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Daily Practice Question</h2>
          <DailyQuestion />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary/5 rounded-lg mt-12">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace the CILS B1 Exam?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of others who have successfully prepared for the Italian citizenship exam with our platform.
          </p>
          {!user ? (
            <Link to="/signup">
              <Button size="lg">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/profile">
              <Button size="lg">
                View Your Progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
