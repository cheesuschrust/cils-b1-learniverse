
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DailyQuestionComponent from '@/components/daily/DailyQuestionComponent';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, Headphones, Edit, MessageSquare, Award, 
  Clock, GraduationCap, Users, Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>CILS Italian Citizenship - Question of the Day</title>
      </Helmet>
      
      <section className="mb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">CILS Italian Citizenship Exam Preparation</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Prepare for your Italian citizenship test with daily questions and comprehensive learning resources tailored to CILS B1 requirements.
          </p>
        </div>
        
        <DailyQuestionComponent userId={user?.id} />
      </section>
      
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Learning Areas</h2>
          <Button variant="outline" asChild>
            <Link to="/learning-paths">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Vocabulary & Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Build essential Italian vocabulary and reading comprehension skills required for the CILS B1 test.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">B1 Level</Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/flashcards">Start Learning</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Headphones className="h-5 w-5 mr-2" />
                Listening & Speaking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Improve your Italian listening comprehension and speaking abilities with interactive exercises.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">B1 Level</Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/listening">Start Learning</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Grammar & Writing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Master Italian grammar rules and develop writing skills with guided practice and feedback.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">B1 Level</Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/writing">Start Learning</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Citizenship Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about Italian culture, history, and civic knowledge essential for citizenship.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">CILS B1</Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/citizenship">Start Learning</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Why Choose Our Platform?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI-Powered Learning</h3>
            <p className="text-sm text-muted-foreground">
              Our platform uses advanced AI to generate personalized questions and exercises tailored to the CILS B1 citizenship requirements.
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Daily Practice</h3>
            <p className="text-sm text-muted-foreground">
              Consistent daily practice with our Question of the Day feature ensures steady progress and retention of material.
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">CILS B1 Alignment</h3>
            <p className="text-sm text-muted-foreground">
              All content is specifically designed to align with the CILS B1 certification requirements for Italian citizenship.
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Community Learning</h3>
            <p className="text-sm text-muted-foreground">
              Join a community of Italian language learners preparing for the citizenship exam, share resources and tips.
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Pronunciation Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Record your speaking exercises and receive instant AI-powered feedback on your Italian pronunciation.
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Pass Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              Our comprehensive curriculum and practice materials are designed to maximize your chances of passing the CILS B1 citizenship exam.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-10 px-6 bg-muted/50 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Citizenship Journey Today</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          Access daily questions, comprehensive learning materials, and AI-powered practice tools to help you prepare for your Italian citizenship test.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/register">Sign Up Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/premium">View Premium Plans</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
