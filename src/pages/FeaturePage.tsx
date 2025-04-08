
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, Lightbulb, BookText, Trophy, FileText, Headphones, 
  MessageCircle, Brain, BarChart3, Calendar, Check, Mic
} from 'lucide-react';

const FeaturePage = () => {
  return (
    <>
      <Helmet>
        <title>Features | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Explore all the features of our comprehensive CILS B1 Italian citizenship test preparation platform." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold">
              Features That Make Learning Italian Effective
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform is specifically designed for the CILS B1 citizenship exam with features that optimize your learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>CILS B1 Focus</CardTitle>
                <CardDescription>Content specifically designed for citizenship requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Official exam format practice tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Citizenship-related vocabulary and themes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Updated materials reflecting current exam standards</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Generated Practice</CardTitle>
                <CardDescription>Personalized learning powered by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Custom practice questions based on your weak areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Intelligent spaced repetition system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Adaptive difficulty progression</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <BookText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Comprehensive Flashcards</CardTitle>
                <CardDescription>Build your vocabulary efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Thousands of Italian words and phrases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Categorized by exam topics and difficulty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Create and share your own custom decks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 4 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Listening Practice</CardTitle>
                <CardDescription>Improve your Italian comprehension skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Native speaker recordings at various speeds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Authentic conversation scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Dictation exercises to improve comprehension</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 5 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Speaking Exercises</CardTitle>
                <CardDescription>Practice your pronunciation and conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Pronunciation feedback and guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Conversation simulation for exam scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Record and review your speaking sessions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 6 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Writing Practice</CardTitle>
                <CardDescription>Develop your written Italian skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Guided writing exercises with templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Detailed feedback on grammar and style</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Practice for exam-specific writing tasks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 7 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Monitor your improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Detailed analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Track performance across all skill areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Set goals and receive progress reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 8 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Study Planner</CardTitle>
                <CardDescription>Organize your exam preparation efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Customizable study schedules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exam countdown and milestone tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Daily reminders and study suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Feature 9 */}
            <Card>
              <CardHeader>
                <div className="bg-primary/10 p-3 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community Support</CardTitle>
                <CardDescription>Learn and practice with others</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Discussion forums for exam strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Connect with language partners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Share resources and success stories</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start your CILS B1 citizenship test preparation today with our comprehensive learning platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturePage;
