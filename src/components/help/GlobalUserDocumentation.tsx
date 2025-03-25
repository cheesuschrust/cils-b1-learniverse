
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Book, 
  BookOpen, 
  Search, 
  Star, 
  HelpCircle, 
  Video, 
  FileText, 
  ChevronRight, 
  ArrowRight,
  Download,
  ExternalLink,
  Calendar,
  MessageCircle,
  Check,
  Play
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const GlobalUserDocumentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('getting-started');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isPremium = user?.subscription === 'premium';
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search results",
      description: `Found ${Math.floor(Math.random() * 5) + 1} results for "${searchQuery}"`,
    });
  };
  
  const downloadGuide = (guideName: string) => {
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Downloadable content is only available to premium subscribers.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Download started",
      description: `Your guide "${guideName}" is being downloaded.`,
    });
  };
  
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <Helmet>
        <title>User Documentation | Italian Learning Platform</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Documentation</h1>
          <form onSubmit={handleSearch} className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle>Welcome to Your Learning Journey</CardTitle>
            <CardDescription>
              This comprehensive guide will help you make the most of our Italian learning platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm text-muted-foreground">
                Our documentation covers everything from getting started to advanced features. 
                If you're new to the platform, we recommend starting with the 'Getting Started' section.
              </p>
              <Button className="sm:flex-shrink-0" onClick={() => setActiveTab('getting-started')}>
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Browse by category</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button 
                    className={`flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${activeTab === 'getting-started' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setActiveTab('getting-started')}
                  >
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Getting Started</span>
                  </button>
                  <Separator />
                  
                  <button 
                    className={`flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${activeTab === 'flashcards' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setActiveTab('flashcards')}
                  >
                    <FileText className="h-5 w-5 text-orange-500" />
                    <span>Flashcards</span>
                  </button>
                  <Separator />
                  
                  <button 
                    className={`flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${activeTab === 'quizzes' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setActiveTab('quizzes')}
                  >
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    <span>Quizzes & Exercises</span>
                  </button>
                  <Separator />
                  
                  <button 
                    className={`flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${activeTab === 'premium' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setActiveTab('premium')}
                  >
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Premium Features</span>
                  </button>
                  <Separator />
                  
                  <button 
                    className={`flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${activeTab === 'faq' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setActiveTab('faq')}
                  >
                    <Book className="h-5 w-5 text-green-500" />
                    <span>FAQ</span>
                  </button>
                  <Separator />
                  
                  <button 
                    className={`flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${activeTab === 'video-tutorials' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setActiveTab('video-tutorials')}
                  >
                    <Video className="h-5 w-5 text-red-500" />
                    <span>Video Tutorials</span>
                  </button>
                  <Separator />
                  
                  <button 
                    className={`flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${activeTab === 'calendar' ? 'bg-muted font-medium' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                  >
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <span>Learning Calendar</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>
                  Our support team is here to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/app/support-center')}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Visit Support Center
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/app/support')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {activeTab === 'getting-started' && 'Getting Started Guide'}
                  {activeTab === 'flashcards' && 'Flashcards System Guide'}
                  {activeTab === 'quizzes' && 'Quizzes & Exercises Guide'}
                  {activeTab === 'premium' && 'Premium Features Guide'}
                  {activeTab === 'faq' && 'Frequently Asked Questions'}
                  {activeTab === 'video-tutorials' && 'Video Tutorials'}
                  {activeTab === 'calendar' && 'Learning Calendar Guide'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'getting-started' && 'Learn the basics of our platform'}
                  {activeTab === 'flashcards' && 'Master the spaced repetition system'}
                  {activeTab === 'quizzes' && 'Understand how quizzes and exercises work'}
                  {activeTab === 'premium' && 'Get the most from your premium subscription'}
                  {activeTab === 'faq' && 'Common questions and answers'}
                  {activeTab === 'video-tutorials' && 'Watch and learn with our visual guides'}
                  {activeTab === 'calendar' && 'Organize your learning schedule effectively'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  
                  {activeTab === 'premiumFeatures' && (
                    <p>For additional information about premium features, please visit our {"premium features"} page.</p>
                  )}
                  
                  {activeTab === 'getting-started' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-medium mb-2">Welcome to Your Italian Learning Journey</h3>
                        <p className="text-muted-foreground">
                          Our platform is designed to make learning Italian enjoyable, effective, and personalized to your needs.
                          This guide will help you navigate the key features and get the most out of your learning experience.
                        </p>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Setting Up Your Profile</h3>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
                          <li>Navigate to the <strong>Profile</strong> section from the main menu</li>
                          <li>Set your learning goals and preferred study times</li>
                          <li>Take the placement test to determine your current level</li>
                          <li>Customize your notification preferences to stay on track</li>
                        </ol>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => navigate('/app/profile')}>
                            Go to Profile <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Your Daily Learning Routine</h3>
                        <p className="text-muted-foreground mb-3">
                          We recommend following this daily routine for optimal progress:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Review flashcards</strong> (5-10 minutes)</li>
                          <li><strong>Practice with exercises</strong> (10-15 minutes)</li>
                          <li><strong>Learn new content</strong> (15-20 minutes)</li>
                          <li><strong>Speaking practice</strong> (5-10 minutes)</li>
                        </ul>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => navigate('/app/dashboard')}>
                            View Dashboard <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Free vs. Premium Features</h3>
                        <p className="text-muted-foreground mb-3">
                          Free users have access to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                          <li>1 question per day</li>
                          <li>Basic flashcard sets</li>
                          <li>Limited progress tracking</li>
                        </ul>
                        
                        <p className="text-muted-foreground mb-3 mt-4">
                          Premium users enjoy:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                          <li>Unlimited questions and exercises</li>
                          <li>Ad-free experience</li>
                          <li>Advanced progress analytics</li>
                          <li>Downloadable learning materials</li>
                          <li>Priority support</li>
                        </ul>
                        
                        <div className="mt-4">
                          <Button variant="default" size="sm" onClick={() => navigate('/subscription')}>
                            Upgrade to Premium <Star className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                      
                      <section className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Download Complete Getting Started Guide</h3>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => downloadGuide("Getting Started Guide")}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF Guide {!isPremium && "(Premium Feature)"}
                        </Button>
                      </section>
                    </div>
                  )}
                  
                  {activeTab === 'flashcards' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-medium mb-2">Understanding Spaced Repetition</h3>
                        <p className="text-muted-foreground">
                          Our flashcard system uses spaced repetition to optimize your memory retention.
                          Cards appear more frequently when you're still learning them and less frequently
                          as you master them, ensuring efficient long-term retention.
                        </p>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Managing Your Flashcard Sets</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Creating custom sets</strong> - Group cards by theme, difficulty, or learning goal</li>
                          <li><strong>Importing vocabulary</strong> - Add new cards from CSV, text files, or other sources</li>
                          <li><strong>Organizing by tags</strong> - Use tags to categorize and find cards easily</li>
                          <li><strong>Sharing with others</strong> - Exchange sets with friends or the community</li>
                        </ul>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => navigate('/app/flashcards')}>
                            Go to Flashcards <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Study Modes</h3>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Review Mode</strong> - Practice cards due for review based on your performance</li>
                          <li><strong>Learn Mode</strong> - Focus on new cards you haven't mastered yet</li>
                          <li><strong>Test Mode</strong> - Challenge yourself with a timed test of random cards</li>
                          <li><strong>Pronunciation Practice</strong> - Improve your accent with audio feedback</li>
                        </ol>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Advanced Features</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Audio pronunciation</strong> - Hear native pronunciation of each word</li>
                          <li><strong>Example sentences</strong> - See words used in context</li>
                          <li><strong>Difficulty adjustment</strong> - System adapts to your learning pace</li>
                          <li><strong>Progress statistics</strong> - Track mastery across all your vocabulary</li>
                        </ul>
                      </section>
                      
                      <section className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Download Complete Flashcard Guide</h3>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => downloadGuide("Flashcard System Guide")}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF Guide {!isPremium && "(Premium Feature)"}
                        </Button>
                      </section>
                    </div>
                  )}
                  
                  {activeTab === 'quizzes' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-medium mb-2">Types of Exercises</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Multiple Choice</strong> - Test your knowledge with quiz questions</li>
                          <li><strong>Writing Exercises</strong> - Practice constructing proper Italian sentences</li>
                          <li><strong>Speaking Practice</strong> - Improve your pronunciation and fluency</li>
                          <li><strong>Listening Exercises</strong> - Train your ear to understand native speakers</li>
                        </ul>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Daily Question Limit</h3>
                        <p className="text-muted-foreground mb-3">
                          Free users receive one question per day. This limit resets at midnight in your local time zone.
                          Premium users have unlimited access to all questions and exercises.
                        </p>
                        <div className="bg-primary/10 p-3 rounded-md border border-primary/20">
                          <p className="text-sm font-medium">Current Status:</p>
                          <p className="text-sm text-muted-foreground">
                            {isPremium 
                              ? "You have unlimited access to all questions (Premium user)" 
                              : "You have 1 question remaining today (Free user)"}
                          </p>
                        </div>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
                        <p className="text-muted-foreground mb-3">
                          Your performance in quizzes and exercises is tracked to show your progress over time:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Accuracy rate</strong> - Percentage of correct answers</li>
                          <li><strong>Completion rate</strong> - Exercises finished vs. started</li>
                          <li><strong>Strength by category</strong> - Your performance across different topics</li>
                          <li><strong>Time trends</strong> - How your scores improve over time</li>
                        </ul>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => navigate('/app/progress')}>
                            View Progress <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Creating Custom Quizzes</h3>
                        <p className="text-muted-foreground mb-3">
                          Premium users can create custom quizzes:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
                          <li>Navigate to the Multiple Choice section</li>
                          <li>Click on "Create Custom Quiz"</li>
                          <li>Select categories, difficulty level, and number of questions</li>
                          <li>Save your quiz for future use or share with others</li>
                        </ol>
                      </section>
                      
                      <section className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Download Complete Exercises Guide</h3>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => downloadGuide("Quizzes & Exercises Guide")}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF Guide {!isPremium && "(Premium Feature)"}
                        </Button>
                      </section>
                    </div>
                  )}
                  
                  {activeTab === 'premium' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-medium mb-2">Premium Subscription Benefits</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Unlimited questions and exercises</strong> - No daily limits</li>
                          <li><strong>Ad-free experience</strong> - Learn without distractions</li>
                          <li><strong>Advanced analytics</strong> - Get detailed insights into your progress</li>
                          <li><strong>Downloadable content</strong> - Access materials offline</li>
                          <li><strong>Priority support</strong> - Get faster responses to your questions</li>
                          <li><strong>Custom content creation</strong> - Create and save personalized exercises</li>
                        </ul>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Subscription Plans</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">Monthly Premium</h4>
                            <p className="text-2xl font-bold mt-2">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Unlimited questions</li>
                              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Ad-free experience</li>
                              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 7-day free trial</li>
                            </ul>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-primary bg-primary/5">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">Annual Premium</h4>
                              <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">SAVE 15%</span>
                            </div>
                            <p className="text-2xl font-bold mt-2">$99.99<span className="text-sm font-normal text-muted-foreground">/year</span></p>
                            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Unlimited questions</li>
                              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Ad-free experience</li>
                              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> 14-day free trial</li>
                              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> Priority support</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full" onClick={() => navigate('/subscription')}>
                            View Subscription Options <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Educational & Institutional Plans</h3>
                        <p className="text-muted-foreground mb-3">
                          For schools, universities, and language centers, we offer special multi-user licensing:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Group licenses</strong> - For classes or student groups</li>
                          <li><strong>Campus licenses</strong> - For entire educational institutions</li>
                          <li><strong>Teacher tools</strong> - Monitor student progress and assign homework</li>
                          <li><strong>Custom content</strong> - Create materials specific to your curriculum</li>
                        </ul>
                        <div className="mt-4">
                          <Button variant="outline" className="w-full" asChild>
                            <a href="mailto:education@italianlearning.example.com">
                              Contact for Educational Pricing <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </section>
                      
                      <section className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Download Premium Features Guide</h3>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => downloadGuide("Premium Features Guide")}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF Guide {!isPremium && "(Premium Feature)"}
                        </Button>
                      </section>
                    </div>
                  )}
                  
                  {activeTab === 'faq' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                        
                        <div className="space-y-5">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">How many questions can I answer per day?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Free users can answer one question per day. Premium subscribers have unlimited access to all questions.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">How do I create custom flashcard sets?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Navigate to the Flashcards section, click "Create New Set," then add cards manually or import them from a file.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">Can I use the platform offline?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Premium users can download materials for offline use. Some features require an internet connection.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">How do I cancel my subscription?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Go to Settings {">"} Subscription {">"} Manage Subscription, then select "Cancel Subscription." Your access will continue until the end of your current billing period.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">What is spaced repetition?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Spaced repetition is a learning technique that optimizes memorization by showing cards at increasing intervals as you master them. This is more efficient than reviewing all cards every session.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">How do I track my progress?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Go to the Progress Tracker section to see detailed analytics about your learning journey, including accuracy rates, time spent, and mastery level across different categories.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">Can I share my flashcard sets with others?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Yes, you can make your sets public by toggling "Public" in the set settings. You can also share a direct link with specific users.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">Is there a mobile app?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Our platform is fully responsive and works on all devices. A dedicated mobile app is currently in development and will be released soon.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">Do you offer refunds?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              We offer a 30-day money-back guarantee for all new premium subscriptions. Contact support to request a refund.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium">How do I get help if I have a problem?</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Visit the Support Center for instant help, or contact our support team through the "Contact Support" button in the help section. Premium users receive priority support.
                            </p>
                          </div>
                        </div>
                      </section>
                      
                      <section className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Have another question?</h3>
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => navigate('/app/support')}
                        >
                          Contact Support <MessageCircle className="ml-2 h-4 w-4" />
                        </Button>
                      </section>
                    </div>
                  )}
                  
                  {activeTab === 'video-tutorials' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-medium mb-4">Video Tutorials Library</h3>
                        <p className="text-muted-foreground mb-6">
                          Learn visually with our comprehensive video guides. Click on any video to watch.
                        </p>
                        
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="border rounded-lg overflow-hidden">
                            <div className="aspect-video bg-muted relative flex items-center justify-center">
                              <Video className="h-12 w-12 text-muted-foreground/50" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button variant="ghost" size="icon" className="rounded-full bg-background/80 h-12 w-12">
                                  <Play className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium">Getting Started Tutorial</h4>
                              <p className="text-xs text-muted-foreground mt-1">5:32 • Beginner • Updated 2 weeks ago</p>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg overflow-hidden">
                            <div className="aspect-video bg-muted relative flex items-center justify-center">
                              <Video className="h-12 w-12 text-muted-foreground/50" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button variant="ghost" size="icon" className="rounded-full bg-background/80 h-12 w-12">
                                  <Play className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium">Mastering Flashcards</h4>
                              <p className="text-xs text-muted-foreground mt-1">8:45 • Intermediate • Updated 1 month ago</p>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg overflow-hidden">
                            <div className="aspect-video bg-muted relative flex items-center justify-center">
                              <Video className="h-12 w-12 text-muted-foreground/50" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button variant="ghost" size="icon" className="rounded-full bg-background/80 h-12 w-12">
                                  <Play className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium">Speaking Practice Tips</h4>
                              <p className="text-xs text-muted-foreground mt-1">7:20 • All Levels • Updated 3 weeks ago</p>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg overflow-hidden">
                            <div className="aspect-video bg-muted relative flex items-center justify-center">
                              <Video className="h-12 w-12 text-muted-foreground/50" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button variant="ghost" size="icon" className="rounded-full bg-background/80 h-12 w-12">
                                  <Play className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium">Premium Features Overview</h4>
                              <p className="text-xs text-muted-foreground mt-1">6:10 • All Levels • Updated 1 week ago</p>
                            </div>
                          </div>
                          
                          {isPremium && (
                            <>
                              <div className="border rounded-lg overflow-hidden">
                                <div className="aspect-video bg-muted relative flex items-center justify-center">
                                  <Video className="h-12 w-12 text-muted-foreground/50" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Button variant="ghost" size="icon" className="rounded-full bg-background/80 h-12 w-12">
                                      <Play className="h-6 w-6" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium">Advanced Grammar Techniques</h4>
                                  <p className="text-xs text-muted-foreground mt-1">10:15 • Advanced • Updated 3 days ago</p>
                                </div>
                              </div>
                              
                              <div className="border rounded-lg overflow-hidden">
                                <div className="aspect-video bg-muted relative flex items-center justify-center">
                                  <Video className="h-12 w-12 text-muted-foreground/50" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Button variant="ghost" size="icon" className="rounded-full bg-background/80 h-12 w-12">
                                      <Play className="h-6 w-6" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium">Cultural Context in Language</h4>
                                  <p className="text-xs text-muted-foreground mt-1">12:40 • All Levels • Updated 5 days ago</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {!isPremium && (
                          <div className="mt-8 border border-primary/20 rounded-lg p-5 bg-primary/5">
                            <h4 className="font-medium text-center">Unlock 15+ Additional Video Tutorials</h4>
                            <p className="text-sm text-muted-foreground text-center mt-2 mb-4">
                              Premium members get access to our complete video library including advanced techniques, 
                              cultural insights, and specialized content.
                            </p>
                            <Button 
                              className="w-full"
                              onClick={() => navigate('/subscription')}
                            >
                              Upgrade to Premium <Star className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        <section className="mt-6">
                          <h3 className="text-lg font-medium mb-4">Download Video Tutorial Guide</h3>
                          <Button 
                            variant="outline" 
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => downloadGuide("Video Tutorials Guide")}
                          >
                            <Download className="h-4 w-4" />
                            Download PDF Guide {!isPremium && "(Premium Feature)"}
                          </Button>
                        </section>
                      </section>
                    </div>
                  )}
                  
                  {activeTab === 'calendar' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-medium mb-2">Learning Calendar Overview</h3>
                        <p className="text-muted-foreground">
                          The Learning Calendar helps you organize your study sessions, track your daily progress,
                          and maintain consistency in your language learning journey.
                        </p>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Setting Up Your Learning Schedule</h3>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
                          <li>Navigate to the <strong>Calendar</strong> section from the main menu</li>
                          <li>Select your preferred study days and times</li>
                          <li>Set daily learning goals (vocabulary words, time spent, etc.)</li>
                          <li>Enable reminders to stay consistent with your practice</li>
                        </ol>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" onClick={() => navigate('/app/calendar')}>
                            Go to Calendar <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Tracking Your Progress</h3>
                        <p className="text-muted-foreground mb-3">
                          The calendar visually displays your learning consistency:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Daily streaks</strong> - See how many consecutive days you've practiced</li>
                          <li><strong>Heat map</strong> - Visual representation of your activity intensity</li>
                          <li><strong>Goal completion</strong> - Track which days you met your learning targets</li>
                          <li><strong>Time analytics</strong> - See when you're most active and productive</li>
                        </ul>
                      </section>
                      
                      <Separator />
                      
                      <section>
                        <h3 className="text-lg font-medium mb-2">Premium Calendar Features</h3>
                        <p className="text-muted-foreground mb-3">
                          Premium users enjoy enhanced calendar functionality:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                          <li><strong>Custom learning paths</strong> - Create sequential study plans</li>
                          <li><strong>Detailed analytics</strong> - Get insights into optimal study times and patterns</li>
                          <li><strong>Calendar sync</strong> - Integrate with Google Calendar, Apple Calendar, etc.</li>
                          <li><strong>Advanced reminders</strong> - Smart notifications based on your habits</li>
                        </ul>
                        
                        {!isPremium && (
                          <div className="mt-4">
                            <Button variant="default" size="sm" onClick={() => navigate('/subscription')}>
                              Upgrade to Premium <Star className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </section>
                      
                      <section className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Download Calendar Guide</h3>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => downloadGuide("Learning Calendar Guide")}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF Guide {!isPremium && "(Premium Feature)"}
                        </Button>
                      </section>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalUserDocumentation;
