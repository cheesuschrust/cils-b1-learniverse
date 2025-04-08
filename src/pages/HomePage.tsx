
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIAssistant from '@/components/ai/AIAssistant';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { BookOpen, MessageSquare, Lightbulb, Sparkles, Book, Mic, Brain, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAIEnabled } = useAIUtils();

  return (
    <>
      <Helmet>
        <title>Learn Italian - AI-Powered Language Learning</title>
      </Helmet>

      <div className="container py-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Master Italian with AI-Powered Learning
              </h1>
              <p className="text-xl text-muted-foreground">
                Learn Italian faster and more effectively with personalized lessons and AI-powered feedback.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/dashboard">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/subscription">Explore Plans</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/italian-learning-hero.jpg" 
                alt="Italian Learning" 
                className="rounded-lg shadow-lg object-cover w-full"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          </div>
        </section>

        {/* Featured AI Assistant */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Your Personal Italian Tutor</h2>
            <p className="text-muted-foreground mt-2">
              Ask questions, practice conversations, and get instant feedback from our AI tutor
            </p>
          </div>
          <AIAssistant />
        </section>

        {/* Learning Paths */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Personalized Learning Paths</h2>
            <p className="text-muted-foreground mt-2">
              Choose your learning path based on your goals and level
            </p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General Italian</TabsTrigger>
              <TabsTrigger value="business">Business Italian</TabsTrigger>
              <TabsTrigger value="travel">Travel & Tourism</TabsTrigger>
              <TabsTrigger value="citizenship">Italian Citizenship</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <LearningFeatureCard 
                  icon={<BookOpen className="h-6 w-6 text-primary" />}
                  title="Grammar & Vocabulary"
                  description="Build a strong foundation with essential grammar rules and vocabulary."
                  link="/practice/grammar"
                />
                <LearningFeatureCard 
                  icon={<MessageSquare className="h-6 w-6 text-primary" />}
                  title="Conversation Practice"
                  description="Practice real conversations with our AI language partner."
                  link="/practice/speaking"
                  hasAI
                />
                <LearningFeatureCard 
                  icon={<Brain className="h-6 w-6 text-primary" />}
                  title="Comprehension"
                  description="Develop your listening and reading comprehension skills."
                  link="/practice/listening"
                />
                <LearningFeatureCard 
                  icon={<Sparkles className="h-6 w-6 text-primary" />}
                  title="Cultural Insights"
                  description="Learn about Italian culture, customs, and traditions."
                  link="/practice/culture"
                  hasAI
                />
              </div>
            </TabsContent>
            <TabsContent value="business" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <LearningFeatureCard 
                  icon={<Book className="h-6 w-6 text-primary" />}
                  title="Business Vocabulary"
                  description="Learn specialized vocabulary for professional environments."
                  link="/practice/business"
                />
                <LearningFeatureCard 
                  icon={<Mic className="h-6 w-6 text-primary" />}
                  title="Meeting Simulations"
                  description="Practice business meetings and negotiations in Italian."
                  link="/practice/business-speaking"
                  hasAI
                />
                <LearningFeatureCard 
                  icon={<MessageSquare className="h-6 w-6 text-primary" />}
                  title="Email Writing"
                  description="Learn to write professional emails and correspondence."
                  link="/practice/business-writing"
                />
                <LearningFeatureCard 
                  icon={<Lightbulb className="h-6 w-6 text-primary" />}
                  title="Case Studies"
                  description="Analyze real business scenarios in Italian contexts."
                  link="/practice/business-cases"
                  hasAI
                />
              </div>
            </TabsContent>
            <TabsContent value="travel" className="mt-6">
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">Travel & Tourism content is coming soon!</p>
              </div>
            </TabsContent>
            <TabsContent value="citizenship" className="mt-6">
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">Italian Citizenship exam preparation content is coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* AI-Powered Features */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">AI-Powered Learning Features</h2>
            <p className="text-muted-foreground mt-2">
              Our advanced AI technologies enhance your language learning experience
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AIFeatureCard 
              title="Personalized Feedback"
              description="Get instant feedback on your pronunciation, grammar, and vocabulary usage."
              isAvailable={isAIEnabled}
            />
            <AIFeatureCard 
              title="Adaptive Learning"
              description="Our AI adapts to your learning pace and focuses on areas where you need more practice."
              isAvailable={isAIEnabled}
            />
            <AIFeatureCard 
              title="Voice Recognition"
              description="Practice speaking Italian and get real-time pronunciation feedback."
              isAvailable={isAIEnabled}
            />
            <AIFeatureCard 
              title="Natural Conversations"
              description="Have realistic conversations with our AI language partner to improve fluency."
              isAvailable={isAIEnabled}
            />
            <AIFeatureCard 
              title="Translation Assistance"
              description="Translate phrases and understand the nuances of Italian language."
              isAvailable={isAIEnabled}
            />
            <AIFeatureCard 
              title="Cultural Context"
              description="Learn Italian in cultural context with AI-powered explanations."
              isAvailable={isAIEnabled}
            />
          </div>
        </section>
      </div>
    </>
  );
};

interface LearningFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  hasAI?: boolean;
}

const LearningFeatureCard: React.FC<LearningFeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  link,
  hasAI = false
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {icon}
          {hasAI && (
            <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
              AI Powered
            </div>
          )}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="gap-1 w-full">
          <Link to={link}>
            Explore <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface AIFeatureCardProps {
  title: string;
  description: string;
  isAvailable: boolean;
}

const AIFeatureCard: React.FC<AIFeatureCardProps> = ({ 
  title, 
  description, 
  isAvailable
}) => {
  return (
    <Card className={isAvailable ? 'border-primary/30' : 'opacity-75'}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          {isAvailable ? (
            <div className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-xs font-medium">
              Available
            </div>
          ) : (
            <div className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-md text-xs font-medium">
              Coming Soon
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default HomePage;
