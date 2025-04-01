
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, MessageCircle, Calendar, ArrowRight, Globe, BookmarkCheck, Crown } from 'lucide-react';

const featuresData = [
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Daily Questions",
    description: "Get a new question every day to keep your Italian language skills fresh.",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Complete CILS B1 Coverage",
    description: "Comprehensive practice for all sections of the CILS B1 Citizenship Test.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "AI-Driven Learning",
    description: "Our AI analyzes your performance and adapts questions to your learning needs.",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Citizenship Focus",
    description: "Specialized content to prepare you for the citizenship examination requirements.",
  },
  {
    icon: <BookmarkCheck className="h-8 w-8 text-primary" />,
    title: "Progress Tracking",
    description: "Monitor your improvement across all language skills over time.",
  },
  {
    icon: <Crown className="h-8 w-8 text-primary" />,
    title: "Premium Features",
    description: "Upgrade for unlimited questions, advanced analytics, and personalized feedback.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              CILS Italian Citizenship
              <span className="text-primary block">Question of the Day</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Perfect your Italian language skills with daily questions tailored specifically for the CILS B1 Citizenship Test.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                I Already Have an Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Complete Preparation Platform</h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to succeed on your Italian citizenship language test
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Ready to start practicing?</h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  Begin your journey to Italian citizenship with our specialized language preparation platform.
                  Get your first question of the day free!
                </p>
                <div className="pt-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/signup">Start Free Practice</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4">CILS Question of the Day</h3>
              <p className="text-muted-foreground">
                The ultimate preparation tool for the Italian language citizenship test.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
                <li><Link to="/features" className="text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t">
            <p className="text-center text-muted-foreground text-sm">
              © {new Date().getFullYear()} CILS Question of the Day. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
